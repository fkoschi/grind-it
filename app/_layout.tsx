import App from "./App";
import React from "react";
import { Stack } from "expo-router";
import StorybookUI from "../.storybook";
import { ToastViewport } from "@/components/ui/Toast";

export default function RootLayout() {
  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
    return (
      <App>
        <StorybookUI />
        <ToastViewport />
      </App>
    );
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
      </Stack>
      <ToastViewport />
    </App>
  );
}
