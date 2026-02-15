import Foundation

// MARK: - Shared Data Models

struct Bean: Codable, Identifiable {
    let id: Int
    let name: String
    let roasteryName: String?
    let degreeOfGrinding: Double?
    let singleShotDosis: Double?
    let doubleShotDosis: Double?
    let arabicaAmount: Int?
    let robustaAmount: Int?

    // Optional aroma profile (0-100 scale)
    let aromaFruity: Int?
    let aromaFloral: Int?
    let aromaSweet: Int?
    let aromaNutty: Int?
    let aromaSpices: Int?
    let aromaRoasted: Int?
    let aromaGreen: Int?
    let aromaSour: Int?
    let aromaOther: Int?

    // Computed property for display
    var roasteryDisplayName: String {
        roasteryName ?? "Unknown Roastery"
    }
}

struct Roastery: Codable, Identifiable {
    let id: Int
    let name: String
}

// MARK: - JSON Keys Mapping

extension Bean {
    enum CodingKeys: String, CodingKey {
        case id, name
        case roasteryName = "roastery_name"
        case degreeOfGrinding = "degree_of_grinding"
        case singleShotDosis = "single_shot_dosis"
        case doubleShotDosis = "double_shot_dosis"
        case arabicaAmount = "arabica_amount"
        case robustaAmount = "robusta_amount"
        case aromaFruity = "aroma_fruity"
        case aromaFloral = "aroma_floral"
        case aromaSweet = "aroma_sweet"
        case aromaNutty = "aroma_nutty"
        case aromaSpices = "aroma_spices"
        case aromaRoasted = "aroma_roasted"
        case aromaGreen = "aroma_green"
        case aromaSour = "aroma_sour"
        case aromaOther = "aroma_other"
    }
}
