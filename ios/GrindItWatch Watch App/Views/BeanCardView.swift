import SwiftUI

struct BeanCardView: View {
    let bean: Bean

    var body: some View {
        HStack(spacing: 8) {
            // Coffee cup image (matching iPhone design)
            Image("coffee-cup")
                .resizable()
                .scaledToFit()
                .frame(width: 40, height: 40)

            VStack(alignment: .leading, spacing: 4) {
                // Roastery name
                if let roastery = bean.roasteryName {
                    Text(roastery)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.grindItPrimary)
                }

                // Bean name - using custom font, black color
                Text(bean.name)
                    .font(.custom("TBJSodabery-LightOriginal", size: 16))
                    .lineLimit(2)
                    .foregroundColor(.black)

                // Grind settings
                if hasGrindSettings {
                    HStack(spacing: 6) {
                        // Grind degree
                        if let degree = bean.degreeOfGrinding {
                            VStack(alignment: .leading, spacing: 1) {
                                Text("Mahlgrad")
                                    .font(.system(size: 7))
                                    .foregroundColor(.grindItCopyText)
                                Text(String(format: "%.1f", degree))
                                    .font(.custom("TBJSodabery-LightOriginal", size: 12))
                                    .foregroundColor(.grindItPrimary)
                            }
                        }

                        // Single shot
                        if let single = bean.singleShotDosis {
                            VStack(alignment: .leading, spacing: 1) {
                                Text("Single")
                                    .font(.system(size: 7))
                                    .foregroundColor(.grindItCopyText)
                                Text(String(format: "%.1fg", single))
                                    .font(.custom("TBJSodabery-LightOriginal", size: 11))
                                    .foregroundColor(.grindItPrimary)
                            }
                        }

                        // Double shot
                        if let double = bean.doubleShotDosis {
                            VStack(alignment: .leading, spacing: 1) {
                                Text("Double")
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
