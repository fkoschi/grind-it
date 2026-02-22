import { config } from "@tamagui/config/v3";
import { createFont, createTamagui, createTokens } from "tamagui";
import { createAnimations } from "@tamagui/animations-moti";

export const tokens = createTokens({
  ...config.tokens,
  color: {
    primary: "#E89E3F",
    primaryHover: "#E89E3F",
    secondary: "#664F3F",
    secondaryHover: "#664F3F",
    screenBackground: "#F7F7F7",
    copyText: "#838179",
    primaryGreen: "#7AA996",
    white: "#fff",
    favorite: "#CD5B5B",
    error: "#CD5B5B",
    gray1: "#D9D9D9",
    gray2: "#838179",
    gray3: "#CCCCCC",
    gray4: "#E5E5E5",
    gray5: "#181818",
    accentTerracotta: "#D4876C",
    accentSage: "#8BAA91",
    accentAmber: "#D4A647",
    accentMauve: "#B08EA2",
  },
});

export const animationsReanimated = createAnimations({
  "75ms": {
    type: "timing",
    duration: 75,
  },
  "100ms": {
    type: "timing",
    duration: 100,
  },
  "200ms": {
    type: "timing",
    duration: 200,
  },
  superBouncy: {
    damping: 5,
    mass: 0.7,
    stiffness: 200,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  quicker: {
    damping: 20,
    mass: 0.7,
    stiffness: 250,
  },
  quickest: {
    damping: 5,
    mass: 0.2,
    stiffness: 300,
  },
});

export const tamaguiConfig = createTamagui({
  ...config,
  tokens,
  fonts: {
    ...config.fonts,
    sodabery: createFont({
      family: "TBJSodabery-Light",
      size: {
        "1": 12,
        "2": 14,
        "3": 16,
        "4": 18,
        "5": 20,
        "6": 24,
        "7": 28,
        "8": 32,
        "9": 48,
        "10": 64,
        true: 16,
      },
      lineHeight: {
        "1": 16,
        "2": 18,
        "3": 20,
        "4": 22,
        "5": 24,
        "6": 28,
        "7": 32,
        "8": 36,
        "9": 52,
        "10": 68,
      },
      weight: {
        "1": "300",
      },
      letterSpacing: {
        "1": 0,
        "2": 0,
        "9": -1,
        "10": -2,
      },
      face: {
        300: { normal: "TBJSodabery-Light" },
      },
    }),
  },
  animations: animationsReanimated,
  shorthands: {
    c: "color",
    bgC: "backgroundColor",
    mt: "marginTop",
    mr: "marginRight",
    ml: "marginLeft",
    mb: "marginBottom",
    mx: "marginHorizontal",
    my: "marginHorizontal",
    py: "paddingHorizontal",
    px: "paddingVertical",
    p: "padding",
    pl: "paddingLeft",
    pr: "paddingRight",
    pt: "paddingTop",
    pb: "paddingBottom",
  } as const,
});

export default tamaguiConfig;

export type AppConf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConf {}
}
