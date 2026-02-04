import Foundation
import SQLite

class SQLiteManager {
    static let shared = SQLiteManager()

    private var db: Connection?

    // Table and columns
    private let beansTable = Table("beans")
    private let id = Expression<Int64>("id")
    private let name = Expression<String>("name")
    private let roasteryName = Expression<String?>("roastery_name")
    private let degreeOfGrinding = Expression<Double?>("degree_of_grinding")
    private let singleShotDosis = Expression<Double?>("single_shot_dosis")
    private let doubleShotDosis = Expression<Double?>("double_shot_dosis")
    private let arabicaAmount = Expression<Int64?>("arabica_amount")
    private let robustaAmount = Expression<Int64?>("robusta_amount")

    private init() {
        do {
            let path = try FileManager.default
                .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
                .appendingPathComponent("grind_it_watch.sqlite3")

            db = try Connection(path.path)
            createTable()
        } catch {
            print("Database initialization failed: \(error)")
        }
    }

    private func createTable() {
        guard let db = db else { return }

        do {
            try db.run(beansTable.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(name)
                table.column(roasteryName)
                table.column(degreeOfGrinding)
                table.column(singleShotDosis)
                table.column(doubleShotDosis)
                table.column(arabicaAmount)
                table.column(robustaAmount)
            })
        } catch {
            print("Table creation failed: \(error)")
        }
    }

    // MARK: - CRUD Operations

    func insertBeans(_ beans: [Bean]) throws {
        guard let db = db else { throw DatabaseError.connectionFailed }

        try db.transaction {
            for bean in beans {
                let insert = beansTable.insert(
                    id <- Int64(bean.id),
                    name <- bean.name,
                    roasteryName <- bean.roasteryName,
                    degreeOfGrinding <- bean.degreeOfGrinding,
                    singleShotDosis <- bean.singleShotDosis,
                    doubleShotDosis <- bean.doubleShotDosis,
                    arabicaAmount <- bean.arabicaAmount.map { Int64($0) },
                    robustaAmount <- bean.robustaAmount.map { Int64($0) }
                )
                try db.run(insert)
            }
        }
    }

    func clearBeans() throws {
        guard let db = db else { throw DatabaseError.connectionFailed }
        try db.run(beansTable.delete())
    }

    func fetchAllBeans() throws -> [Bean] {
        guard let db = db else { throw DatabaseError.connectionFailed }

        var beans: [Bean] = []
        for row in try db.prepare(beansTable) {
            let bean = Bean(
                id: Int(row[id]),
                name: row[name],
                roasteryName: row[roasteryName],
                degreeOfGrinding: row[degreeOfGrinding],
                singleShotDosis: row[singleShotDosis],
                doubleShotDosis: row[doubleShotDosis],
                arabicaAmount: row[arabicaAmount].map { Int($0) },
                robustaAmount: row[robustaAmount].map { Int($0) },
                aromaFruity: nil, aromaFloral: nil, aromaSweet: nil,
                aromaNutty: nil, aromaSpices: nil, aromaRoasted: nil,
                aromaGreen: nil, aromaSour: nil, aromaOther: nil
            )
            beans.append(bean)
        }
        return beans
    }
}

enum DatabaseError: Error {
    case connectionFailed
    case insertFailed
    case queryFailed
}
