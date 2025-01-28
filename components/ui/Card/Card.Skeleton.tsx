import { FC } from "react";

import Animated, {
  useAnimatedStyle,
  Easing,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { styled, View, YStack } from "tamagui";

const StyledCardSkeletonView = styled(YStack, {
  flex: 1,
  flexDirection: "row",
  backgroundColor: "white",
  width: "100%",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  elevation: 4,
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderRadius: "$8",
  p: "$4",
  mb: "$3",
});

const CardSkeleton: FC = () => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withDelay(
            150,
            withTiming(0.3, { duration: 800, easing: Easing.ease }),
          ),
          withTiming(1, { duration: 500, easing: Easing.ease }),
        ),
        -1,
        true,
      ),
    };
  });
  return (
    <StyledCardSkeletonView>
      <View style={{ flex: 0, justifyContent: "center" }}>
        <Animated.View
          style={[
            animatedStyle,
            {
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: "#4D4A45",
              marginLeft: -24,
            },
          ]}
        />
      </View>
      <YStack ml="$6" justifyContent="center" flex={1}>
        <Animated.View
          style={[
            animatedStyle,
            {
              height: 8,
              backgroundColor: "#4D4A45",
              width: 60,
            },
          ]}
        />
        <Animated.View
          style={[
            animatedStyle,
            {
              height: 24,
              marginTop: 8,
              backgroundColor: "#4D4A45",
              width: 120,
            },
          ]}
        />
        <Animated.View
          style={[
            animatedStyle,
            {
              height: 8,
              backgroundColor: "#4D4A45",
              width: 60,
              marginTop: 12,
            },
          ]}
        />
        <Animated.View
          style={[
            animatedStyle,
            {
              height: 24,
              marginTop: 8,
              backgroundColor: "#4D4A45",
              width: 40,
            },
          ]}
        />
      </YStack>
    </StyledCardSkeletonView>
  );
};
export default CardSkeleton;
