import "@/polyfill";
import App from "./App";
import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import StorybookUI from "../.storybook";
import { ToastViewport } from "@/components/ui/Toast";
import { LogoAnimation } from "@/components";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showLogoAnimation, setShowLogoAnimation] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  const hasShownAnimationRef = useRef(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.hideAsync();
      setAppIsReady(true);
    }
    prepare();
  }, []);

  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
    return (
      <App>
        <StorybookUI />
        <ToastViewport />
      </App>
    );
  }

  if (!appIsReady || (showLogoAnimation && !hasShownAnimationRef.current)) {
    if (!hasShownAnimationRef.current) {
      return (
        <App>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F7F7F7",
            }}
          >
            <LogoAnimation
              size={250}
              autoPlay={true}
              loop={false}
              onAnimationFinish={() => {
                hasShownAnimationRef.current = true;
                setShowLogoAnimation(false);
              }}
            />
          </View>
        </App>
      );
    }
  }

  return (
    <App>
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: "none",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            animation: "none",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="roasteries/EditRoasteryPage"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="taste/EditTasteComponent"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
      <ToastViewport />
    </App>
  );
}
