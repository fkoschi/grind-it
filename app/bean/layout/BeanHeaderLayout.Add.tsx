import { ThemedText } from "@/components/ui";
import { useIsBottomSheetActive } from "@/hooks/useIsBottomSheetActive";
import { useKeyboardIsVisible } from "@/hooks/useKeyboardIsVisible";
import { useEffect } from "react";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { View } from "tamagui";

export const BeanHeaderLayoutAdd = () => {
  const fontSize = useSharedValue(32);
  const isKeyboardVisible = useKeyboardIsVisible();
  const isBottomSheetActive = useIsBottomSheetActive();

  useEffect(() => {
    if (isKeyboardVisible && !isBottomSheetActive) {
      fontSize.value = withSpring(24, { damping: 20, stiffness: 90 });
    } else {
      fontSize.value = withSpring(32, { damping: 20, stiffness: 90 });
    }
  }, [isKeyboardVisible, fontSize, isBottomSheetActive]);

  return (
    <View
      flex={1}
      position="absolute"
      bottom={24}
      alignItems="center"
      width="100%"
    >
      <Animated.Text
        style={{ fontSize, fontFamily: "TBJSodabery-LightOriginal" }}
      >
        Neue Bohne
      </Animated.Text>
      <ThemedText fw={400} mt="$1">
        Erstellen Sie eine neue Bohne.
      </ThemedText>
    </View>
  );
};
