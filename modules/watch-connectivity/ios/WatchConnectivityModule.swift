import ExpoModulesCore
import WatchConnectivity

private class WatchSessionDelegate: NSObject, WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            print("WatchConnectivity activation failed: \(error.localizedDescription)")
        } else {
            print("WatchConnectivity activated with state: \(activationState.rawValue)")
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {
        print("WatchConnectivity session became inactive")
    }

    func sessionDidDeactivate(_ session: WCSession) {
        print("WatchConnectivity session deactivated")
        session.activate()
    }
}

public class WatchConnectivityModule: Module {
    private var session: WCSession?
    private let sessionDelegate = WatchSessionDelegate()

    public func definition() -> ModuleDefinition {
        Name("WatchConnectivity")

        OnCreate {
            if WCSession.isSupported() {
                self.session = WCSession.default
                self.session?.delegate = self.sessionDelegate
            }
        }

        Function("activateSession") { () -> Bool in
            guard let session = self.session else { return false }
            session.activate()
            return true
        }

        AsyncFunction("sendBeans") { (beansJSON: String) in
            guard let session = self.session else {
                throw NSError(domain: "WatchConnectivity", code: 1,
                             userInfo: [NSLocalizedDescriptionKey: "Session not available"])
            }

            guard let data = beansJSON.data(using: .utf8) else {
                throw NSError(domain: "WatchConnectivity", code: 2,
                             userInfo: [NSLocalizedDescriptionKey: "Invalid JSON data"])
            }

            // Use transferUserInfo for guaranteed background delivery
            session.transferUserInfo(["beans": data])
        }

        Function("isReachable") { () -> Bool in
            return self.session?.isReachable ?? false
        }

        Function("isPaired") { () -> Bool in
            return self.session?.isPaired ?? false
        }
    }
}
