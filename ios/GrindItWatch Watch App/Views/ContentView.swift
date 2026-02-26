//
//  ContentView.swift
//  GrindItWatch Watch App
//
//  Created by Felix on 01.02.26.
//

import SwiftUI

struct ContentView: View {
    @State private var beans: [Bean] = []
    @State private var isLoading = true
    @State private var lastSyncTime: Date?

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    ProgressView(String(localized: "loadingBeans"))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.grindItBackground)
                } else if beans.isEmpty {
                    VStack(spacing: 12) {
                        Image("no-data")
                            .resizable()
                            .scaledToFit()
                            .frame(height: 80)
                            .padding(.bottom, 4)

                        Text(String(localized: "noBeansSynced"))
                            .font(.custom("TBJSodabery-LightOriginal", size: 16))
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)

                        Text(String(localized: "addBeansOnIphone"))
                            .font(.system(size: 10))
                            .foregroundColor(.grindItCopyText)
                            .multilineTextAlignment(.center)

                        Text(String(localized: "proRequired"))
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.grindItPrimary)
                            .multilineTextAlignment(.center)
                            .padding(.top, 4)
                    }
                    .padding()
                } else {
                    List {
                        // Last synced timestamp header
                        if let lastSync = lastSyncTime {
                            Text(String(localized: "lastSynced \(timeAgoString(from: lastSync))"))
                                .font(.system(size: 10))
                                .foregroundColor(.white.opacity(0.8))
                                .frame(maxWidth: .infinity, alignment: .center)
                                .listRowBackground(Color.clear)
                                .listRowInsets(EdgeInsets(top: 4, leading: 0, bottom: 4, trailing: 0))
                        }

                        ForEach(beans) { bean in
                            NavigationLink(destination: BeanDetailView(bean: bean)) {
                                BeanCardView(bean: bean)
                            }
                            .listRowInsets(EdgeInsets(top: 4, leading: 4, bottom: 4, trailing: 4))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .listRowBackground(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color.white)
                                    .padding(.horizontal, 4)
                            )
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(Color.grindItPrimary)
                    .refreshable {
                        await refreshBeans()
                    }
                }
            }
            .navigationTitle(String(localized: "grindIt"))
            .toolbarBackground(Color.grindItPrimary, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        .onAppear(perform: loadBeans)
        .onReceive(NotificationCenter.default.publisher(for: .beansDidUpdate)) { _ in
            loadBeans()
        }
    }

    private func loadBeans() {
        isLoading = true
        loadLastSyncTime()

        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let fetchedBeans = try SQLiteManager.shared.fetchAllBeans()
                DispatchQueue.main.async {
                    self.beans = fetchedBeans
                    self.isLoading = false
                }
            } catch {
                print("Failed to load beans: \(error)")
                DispatchQueue.main.async {
                    self.beans = []
                    self.isLoading = false
                }
            }
        }
    }

    private func refreshBeans() async {
        // Reload from local database (no network request)
        loadLastSyncTime()

        do {
            let fetchedBeans = try SQLiteManager.shared.fetchAllBeans()
            self.beans = fetchedBeans
        } catch {
            print("Failed to refresh beans: \(error)")
        }
    }

    private func loadLastSyncTime() {
        lastSyncTime = UserDefaults.standard.object(forKey: "lastBeanSync") as? Date
    }

    private func timeAgoString(from date: Date) -> String {
        let seconds = Int(Date().timeIntervalSince(date))

        if seconds < 60 {
            return String(localized: "justNow")
        } else if seconds < 3600 {
            let minutes = seconds / 60
            return String(localized: "minutesAgo \(minutes)")
        } else if seconds < 86400 {
            let hours = seconds / 3600
            return String(localized: "hoursAgo \(hours)")
        } else {
            let days = seconds / 86400
            return String(localized: "daysAgo \(days)")
        }
    }
}

#Preview {
    ContentView()
}
