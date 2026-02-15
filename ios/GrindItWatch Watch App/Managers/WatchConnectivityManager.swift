import Foundation
import Combine
import WatchConnectivity

class WatchConnectivityManager: NSObject, ObservableObject, WCSessionDelegate {
    static let shared = WatchConnectivityManager()

    @Published var lastSyncDate: Date?

    private override init() {
        super.init()

        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }

        // Reactivate session when app returns from background
        NotificationCenter.default.addObserver(
            forName: NSNotification.Name("NSApplicationWillEnterForegroundNotification"),
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.reactivateSessionIfNeeded()
        }
    }

    private func reactivateSessionIfNeeded() {
        guard let session = WCSession.default as WCSession?,
              WCSession.isSupported() else { return }

        if session.activationState != .activated {
            print("Reactivating WatchConnectivity session...")
            session.activate()
        }
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            print("WatchConnectivity activation failed: \(error.localizedDescription)")
        } else {
            print("WatchConnectivity activated with state: \(activationState.rawValue)")
        }
    }

    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any]) {
        print("Received user info from iPhone")

        guard let beansData = userInfo["beans"] as? Data else {
            print("⚠️ No beans data found in userInfo - ignoring corrupt transfer")
            return
        }

        do {
            let decoder = JSONDecoder()
            let beans = try decoder.decode([Bean].self, from: beansData)

            // Validate that we have at least some beans
            guard !beans.isEmpty else {
                print("⚠️ Received empty beans array - skipping database update")
                return
            }

            // Update database
            try SQLiteManager.shared.clearBeans()
            try SQLiteManager.shared.insertBeans(beans)

            let syncDate = Date()

            DispatchQueue.main.async {
                self.lastSyncDate = syncDate
                // Store timestamp in UserDefaults for persistence
                UserDefaults.standard.set(syncDate, forKey: "lastBeanSync")
                NotificationCenter.default.post(name: .beansDidUpdate, object: nil)
            }

            print("✓ Successfully synced \(beans.count) beans")
        } catch let DecodingError.dataCorrupted(context) {
            print("⚠️ Corrupt JSON data received: \(context.debugDescription)")
            // Keep existing cached data, don't crash
        } catch let DecodingError.keyNotFound(key, context) {
            print("⚠️ Missing key '\(key.stringValue)' in JSON: \(context.debugDescription)")
        } catch let DecodingError.typeMismatch(type, context) {
            print("⚠️ Type mismatch for \(type) in JSON: \(context.debugDescription)")
        } catch {
            print("⚠️ Failed to decode or save beans: \(error.localizedDescription)")
        }
    }
}

extension Notification.Name {
    static let beansDidUpdate = Notification.Name("beansDidUpdate")
}
