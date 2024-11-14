import tamaguiConfig from "@/tamagui.config";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { darkerGrotesqueFonts } from "@/constants/fonts";
import { useFonts } from "@expo-google-fonts/darker-grotesque";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(darkerGrotesqueFonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ headerShown: false }} />
        <Stack.Screen
          name="(edit)/degree"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
    </TamaguiProvider>
  );
}
