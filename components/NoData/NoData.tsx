import { FC, useEffect } from "react";
import { YStack, Text } from "tamagui";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";

interface NoDataProps {
  variant: 1 | 2 | 3;
  headline: string;
  copy?: string;
}
const NoData: FC<NoDataProps> = ({ variant, headline, copy }) => {
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(10, { duration: 500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [translateY]);

  const getImagePath = () => {
    switch (variant) {
      case 1:
        return require("@/assets/images/no-data.png");
      case 2:
        return require("@/assets/images/no-data-1.png");
      case 3:
        return require("@/assets/images/no-data-2.png");
      default:
        return require("@/assets/images/no-data.png");
    }
  };

  return (
    <YStack flex={1} alignItems="center">
      <Image
        source={getImagePath()}
        contentFit="contain"
        style={{ flex: 0, height: 400, width: "50%" }}
      />
      <Text fontSize="$8" fontFamily="TBJSodabery-LightOriginal">
        {headline}
      </Text>
      {copy && (
        <Text fontSize="$6" fontFamily="DarkerGrotesque_400Regular">
          {copy}
        </Text>
      )}

      <Animated.Image
        source={require("@/assets/icons/arrow-down.png")}
        style={[
          { flex: 0, height: 24, width: 24, marginTop: 16 },
          animatedStyle,
        ]}
      />
    </YStack>
  );
};
export default NoData;
