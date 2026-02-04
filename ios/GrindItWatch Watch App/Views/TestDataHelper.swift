import Foundation

class TestDataHelper {
    static func loadSampleBeans() {
        let sampleBeans = [
            Bean(
                id: 1,
                name: "Ethiopian Yirgacheffe",
                roasteryName: "Local Roastery",
                degreeOfGrinding: 3.5,
                singleShotDosis: 18.0,
                doubleShotDosis: 36.0,
                arabicaAmount: 100,
                robustaAmount: 0,
                aromaFruity: nil, aromaFloral: nil, aromaSweet: nil,
                aromaNutty: nil, aromaSpices: nil, aromaRoasted: nil,
                aromaGreen: nil, aromaSour: nil, aromaOther: nil
            ),
            Bean(
                id: 2,
                name: "Colombian Supremo",
                roasteryName: "Mountain Coffee Co",
                degreeOfGrinding: 4.0,
                singleShotDosis: 17.5,
                doubleShotDosis: 35.0,
                arabicaAmount: 100,
                robustaAmount: 0,
                aromaFruity: nil, aromaFloral: nil, aromaSweet: nil,
                aromaNutty: nil, aromaSpices: nil, aromaRoasted: nil,
                aromaGreen: nil, aromaSour: nil, aromaOther: nil
            )
        ]

        do {
            try SQLiteManager.shared.clearBeans()
            try SQLiteManager.shared.insertBeans(sampleBeans)
            NotificationCenter.default.post(name: .beansDidUpdate, object: nil)
            print("Sample beans loaded successfully")
        } catch {
            print("Failed to load sample beans: \(error)")
        }
    }
}
