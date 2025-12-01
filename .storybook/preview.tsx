import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect } from "react";

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
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
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
