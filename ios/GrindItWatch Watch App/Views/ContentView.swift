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
                    ProgressView("Loading beans...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.grindItBackground)
                } else if beans.isEmpty {
                    VStack(spacing: 12) {
                        // Use the same image as iPhone app
                        Image("no-data")
                            .resizable()
                            .scaledToFit()
                            .frame(height: 80)
                            .padding(.bottom, 4)

                        Text("No beans synced yet")
                            .font(.custom("TBJSodabery-LightOriginal", size: 16))
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)

                        Text("Add beans on your iPhone")
                            .font(.system(size: 10))
                            .foregroundColor(.grindItCopyText)
                            .multilineTextAlignment(.center)

                        // Debug: Load test data
                        Button("Load Test Data") {
                            TestDataHelper.loadSampleBeans()
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.grindItPrimary)
                        .padding(.top, 4)
                    }
                    .padding()
                } else {
                    List {
                        // Last synced timestamp header
                        if let lastSync = lastSyncTime {
                            Section {
                                Text("Last synced: \(timeAgoString(from: lastSync))")
                                    .font(.system(size: 10))
                                    .foregroundColor(.grindItCopyText)
                                    .frame(maxWidth: .infinity, alignment: .center)
                            }
                            .listRowBackground(Color.clear)
                            .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 4, trailing: 0))
                        }

                        ForEach(beans) { bean in
                            NavigationLink(destination: BeanDetailView(bean: bean)) {
                                BeanCardView(bean: bean)
                            }
                            .listRowBackground(Color.white)
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(Color.grindItBackground)
                    .refreshable {
                        await refreshBeans()
                    }
                }
            }
            .navigationTitle("Coffee Beans")
            .toolbarBackground(Color.grindItBackground, for: .navigationBar)
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
            return "just now"
        } else if seconds < 3600 {
            let minutes = seconds / 60
            return "\(minutes) min\(minutes == 1 ? "" : "s") ago"
        } else if seconds < 86400 {
            let hours = seconds / 3600
            return "\(hours) hour\(hours == 1 ? "" : "s") ago"
        } else {
            let days = seconds / 86400
            return "\(days) day\(days == 1 ? "" : "s") ago"
        }
    }
}

#Preview {
    ContentView()
}
