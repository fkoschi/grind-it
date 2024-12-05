import tamaguiConfig from "@/tamagui.config";
import { FC, PropsWithChildren, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "@expo-google-fonts/darker-grotesque";
import { darkerGrotesqueFonts } from "@/constants/fonts";
import { PortalProvider, TamaguiProvider, Text, View } from "tamagui";

import "react-native-reanimated";
import { DatabaseProvider } from "@/provider/DatabaseProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const App: FC<PropsWithChildren> = ({ children }) => {
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
      <DatabaseProvider>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </DatabaseProvider>
    </TamaguiProvider>
  );
};

export default App;
