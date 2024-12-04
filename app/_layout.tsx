import App from "./App";
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
          name="edit/roasteries"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
      </Stack>
    </App>
  );
}
