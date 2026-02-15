//
//  Color+GrindIt.swift
//  GrindItWatch Watch App
//
//  Created by Felix on 01.02.26.
//

import SwiftUI

extension Color {
    static let grindItPrimary = Color(hex: "#E89E3F")
    static let grindItSecondary = Color(hex: "#664F3F")
    static let grindItBackground = Color(hex: "#F7F7F7")
    static let grindItCopyText = Color(hex: "#838179")
    static let grindItPrimaryGreen = Color(hex: "#7AA996")
    static let grindItFavorite = Color(hex: "#CD5B5B")
    static let grindItGray1 = Color(hex: "#D9D9D9")
    static let grindItGray2 = Color(hex: "#838179")

    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
