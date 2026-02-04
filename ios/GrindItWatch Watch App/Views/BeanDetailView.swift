import SwiftUI

struct BeanDetailView: View {
    let bean: Bean

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Bean Name
                VStack(alignment: .leading, spacing: 4) {
                    if let roastery = bean.roasteryName {
                        Text(roastery)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.grindItPrimary)
                    }
                    Text(bean.name)
                        .font(.custom("TBJSodabery-LightOriginal", size: 20))
                        .foregroundColor(.black)
                }

                Divider()

                // Roast Composition
                if bean.arabicaAmount != nil || bean.robustaAmount != nil {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Composition")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.grindItCopyText)

                        if let arabica = bean.arabicaAmount {
                            DetailRow(label: "Arabica", value: "\(arabica)%")
                        }

                        if let robusta = bean.robustaAmount {
                            DetailRow(label: "Robusta", value: "\(robusta)%")
                        }
                    }

                    Divider()
                }

                // Grind Settings
                VStack(alignment: .leading, spacing: 8) {
                    Text("Grind Settings")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.grindItCopyText)

                    if let degree = bean.degreeOfGrinding {
                        DetailRow(label: "Mahlgrad", value: String(format: "%.1f", degree))
                    } else {
                        Text("Not set")
                            .font(.system(size: 10))
                            .foregroundColor(.grindItCopyText)
                    }

                    if let single = bean.singleShotDosis {
                        DetailRow(label: "Single Shot", value: String(format: "%.1fg", single))
                    }

                    if let double = bean.doubleShotDosis {
                        DetailRow(label: "Double Shot", value: String(format: "%.1fg", double))
                    }
                }
            }
            .padding()
        }
        .background(Color.grindItBackground)
        .navigationTitle("Details")
    }
}

struct DetailRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 10))
                .foregroundColor(.grindItCopyText)
            Spacer()
            Text(value)
                .font(.custom("TBJSodabery-LightOriginal", size: 14))
                .foregroundColor(.grindItPrimary)
        }
    }
}

#Preview {
    NavigationStack {
        BeanDetailView(bean: Bean(
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
