import App from "./App";
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <App>
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="roasteries/edit"
          options={{
            title: "Röstereien",
            headerBackTitle: "Zurück",
          }}
        />
        <Stack.Screen
          name="taste/edit"
          options={{
            title: "Geschmack",
            headerBackTitle: "Zurück",
          }}
        />
      </Stack>
    </App>
  );
}
