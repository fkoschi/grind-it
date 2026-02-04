import { NativeModules } from "react-native";

// Type definitions for the native module
type WatchConnectivityModule = {
  activateSession(): Promise<boolean>;
  sendBeans(beansJSON: string): Promise<void>;
  isReachable(): Promise<boolean>;
  isPaired(): Promise<boolean>;
};

// Load the native module using standard React Native bridge
const { WatchConnectivityBridge } = NativeModules;

if (!WatchConnectivityBridge) {
  console.warn(
    "WatchConnectivityBridge native module not found. Make sure the native code is linked.",
  );
}

const WatchConnectivity: WatchConnectivityModule = WatchConnectivityBridge || {
  activateSession: async () => false,
  sendBeans: async () => {},
  isReachable: async () => false,
  isPaired: async () => false,
};

export async function activateSession(): Promise<boolean> {
  return await WatchConnectivity.activateSession();
}

export async function sendBeans(beansJSON: string): Promise<void> {
  return await WatchConnectivity.sendBeans(beansJSON);
}

export async function isReachable(): Promise<boolean> {
  return await WatchConnectivity.isReachable();
}

export async function isPaired(): Promise<boolean> {
  return await WatchConnectivity.isPaired();
}
