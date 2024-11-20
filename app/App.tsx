import tamaguiConfig from "@/tamagui.config";
import { FC, PropsWithChildren, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "@expo-google-fonts/darker-grotesque";
import { darkerGrotesqueFonts } from "@/constants/fonts";
import { PortalProvider, TamaguiProvider, Text, View } from "tamagui";

import "react-native-reanimated";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "@/services/db-service";
import migrations from "@/drizzle/migrations";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const App: FC<PropsWithChildren> = ({ children }) => {
  const { success, error: migrationsError } = useMigrations(db, migrations);
  const [loaded, error] = useFonts(darkerGrotesqueFonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (migrationsError) {
    return (
      <View flex={1}>
        <Text>Migration error: {migrationsError.message}</Text>
      </View>
    );
  }

  if (!loaded && !success) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <PortalProvider shouldAddRootHost>{children}</PortalProvider>
    </TamaguiProvider>
  );
};

export default App;
