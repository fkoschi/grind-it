import App from "./App";
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
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
    </App>
  );
}
