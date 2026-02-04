import Foundation
import WatchConnectivity
import React

@objc(WatchConnectivityBridge)
class WatchConnectivityBridge: NSObject {
  private var session: WCSession?
  private let sessionDelegate = WatchSessionDelegate()

  override init() {
    super.init()
    if WCSession.isSupported() {
      self.session = WCSession.default
      self.session?.delegate = self.sessionDelegate
    }
  }

  @objc
  func activateSession(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    guard let session = self.session else {
      resolve(false)
      return
    }
    session.activate()
    resolve(true)
  }

  @objc
  func sendBeans(_ beansJSON: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let session = self.session else {
      reject("NO_SESSION", "WatchConnectivity session not available", nil)
      return
    }

    guard let data = beansJSON.data(using: .utf8) else {
      reject("INVALID_JSON", "Invalid JSON data", nil)
      return
    }

    session.transferUserInfo(["beans": data])
    resolve(nil)
  }

  @objc
  func isReachable(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(self.session?.isReachable ?? false)
  }

  @objc
  func isPaired(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(self.session?.isPaired ?? false)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

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
