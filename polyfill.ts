import { Platform } from "react-native";
// @ts-ignore - no type definitions available
import structuredClone from "@ungap/structured-clone";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      // @ts-ignore - React Native internal module
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
