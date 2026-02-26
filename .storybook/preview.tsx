import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";
import { useFonts } from "@expo-google-fonts/darker-grotesque";
import { darkerGrotesqueFonts } from "../constants/fonts";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story: any) => {
      const [loaded] = useFonts({
        ...darkerGrotesqueFonts,
        "TBJSodabery-Light": require("../assets/fonts/TBJSodabery-Light.otf"),
      });

      if (!loaded) {
        return null;
      }

      return (
        <TamaguiProvider config={config} defaultTheme="light">
          <Story />
        </TamaguiProvider>
      );
    },
  ],
};

export default preview;
