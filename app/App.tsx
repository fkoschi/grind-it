import '../reanimatedConfig';

import tamaguiConfig from "@/tamagui.config";
import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useFonts } from "@expo-google-fonts/darker-grotesque";
import { darkerGrotesqueFonts } from "@/constants/fonts";
import { View } from "react-native";
import { PortalProvider, TamaguiProvider } from "tamagui";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DatabaseProvider } from "@/provider/DatabaseProvider";

import "react-native-reanimated";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

const App: FC<PropsWithChildren> = ({ children }) => {
  const [appIsReady, setAppReady] = useState<boolean>(false);
  const [loaded, error] = useFonts(darkerGrotesqueFonts);

  useEffect(() => {
    if (loaded || error) {
      setAppReady(true);
    }
  }, [loaded, error]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GestureHandlerRootView>
        <TamaguiProvider config={tamaguiConfig}>
          <DatabaseProvider>
            <PortalProvider shouldAddRootHost>{children}</PortalProvider>
          </DatabaseProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </View>
  );
};

export default App;
