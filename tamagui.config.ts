import { config } from "@tamagui/config/v3";
import { createFont, createTamagui, createTokens } from "tamagui";
import { createAnimations } from "@tamagui/animations-moti";

const tokens = createTokens({
  ...config.tokens,
  color: {
    primary: "#E89E3F",
    primaryHover: "#E89E3F",
    secondary: "#664F3F",
    secondaryHover: "#664F3F",
    screenBackground: "#F7F7F7",
    primaryGreen: "#7AA996",
    white: "#fff",
    favorite: "#CD5B5B",
    error: '#CD5B5B',
  },
});

/**
 * Somehow this does not work!!!
 */
const darkerGrotesqueFont = createFont({
  family: "DarkerGrotesque_400Regular",
  size: {
    1: 12,
    2: 24,
    3: 32,
  },
  lineHeight: {
    1: 14,
    2: 26,
    3: 36,
  },
  weight: {
    3: "300",
    4: "400",
    5: "500",
  },
  face: {
    300: { normal: "DarkerGrotesque_300Light" },
    400: { normal: "DarkerGrotesque_400Regular" },
    500: { normal: "DarkerGrotesque_500Medium" },
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
  interface TamaguiCustomConfig extends AppConf {}
}
