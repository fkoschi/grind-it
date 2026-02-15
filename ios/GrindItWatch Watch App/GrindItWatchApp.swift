//
//  GrindItWatchApp.swift
//  GrindItWatch Watch App
//
//  Created by Felix on 02.02.26.
//

import SwiftUI
import WatchKit

@main
struct GrindItWatch_Watch_AppApp: App {
    // Initialize WatchConnectivity on launch so the session
    // is active and ready to receive data from the iPhone app
    @WKApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

class AppDelegate: NSObject, WKApplicationDelegate {
    func applicationDidFinishLaunching() {
        // Access the shared instance to activate the WCSession
        _ = WatchConnectivityManager.shared
    }
}
