import { config } from "@tamagui/config/v3";
import { createFont, createTamagui, createTokens } from "tamagui";

const tokens = createTokens({
  ...config.tokens,
  color: {
    primary: "#E89E3F",
    secondary: "#664F3F",
    primaryGreen: "#7AA996",
    white: "#fff",
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

export const tamaguiConfig = createTamagui({
  ...config,
  tokens,
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
  } as const,
});

export default tamaguiConfig;

export type AppConf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConf {}
}
