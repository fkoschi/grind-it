import SwiftUI

struct BeanCardView: View {
    let bean: Bean

    var body: some View {
        HStack(spacing: 4) {
            // Coffee cup image — overflows left edge, clipped by the card background
            Image("coffee-cup")
                .resizable()
                .scaledToFit()
                .frame(width: 60, height: 60)
                .padding(.leading, -24)

            VStack(alignment: .leading, spacing: 1) {
                // Roastery name
                if let roastery = bean.roasteryName {
                    Text(roastery)
                        .font(.system(size: 9, weight: .medium))
                        .foregroundColor(.grindItPrimary)
                }

                // Bean name
                Text(bean.name)
                    .font(.custom("TBJSodabery-LightOriginal", size: 15))
                    .lineLimit(2)
                    .foregroundColor(.black)

                // Grind settings — spread across the full width
                if hasGrindSettings {
                    HStack {
                        // Grind degree
                        if let degree = bean.degreeOfGrinding {
                            VStack(alignment: .leading, spacing: 1) {
                                Text(String(localized: "grindSetting"))
                                    .font(.system(size: 7))
                                    .foregroundColor(.grindItCopyText)
                                Text(String(format: "%.1f", degree))
                                    .font(.custom("TBJSodabery-LightOriginal", size: 12))
                                    .foregroundColor(.grindItPrimary)
                            }
                        }

                        Spacer()

                        // Single shot
                        if let single = bean.singleShotDosis {
                            VStack(alignment: .leading, spacing: 1) {
                                Text(String(localized: "single"))
                                    .font(.system(size: 7))
                                    .foregroundColor(.grindItCopyText)
                                Text(String(format: "%.1fg", single))
                                    .font(.custom("TBJSodabery-LightOriginal", size: 11))
                                    .foregroundColor(.grindItPrimary)
                            }
                        }

                        Spacer()

                        // Double shot
                        if let double = bean.doubleShotDosis {
                            VStack(alignment: .leading, spacing: 1) {
                                Text(String(localized: "double"))
                                    .font(.system(size: 7))
                                    .foregroundColor(.grindItCopyText)
                                Text(String(format: "%.1fg", double))
                                    .font(.custom("TBJSodabery-LightOriginal", size: 11))
                                    .foregroundColor(.grindItPrimary)
                            }
                        }
                    }
                    .padding(.top, 2)
                }
            }
        }
        .padding(.vertical, 4)
        .padding(.trailing, 8)
    }

    private var hasGrindSettings: Bool {
        bean.degreeOfGrinding != nil ||
        bean.singleShotDosis != nil ||
        bean.doubleShotDosis != nil
    }
}

#Preview {
    List {
        BeanCardView(bean: Bean(
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
        ))
    }
}
