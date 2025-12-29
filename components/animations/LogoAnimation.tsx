import React, { useRef, useEffect } from "react";
import { View, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";

interface LogoAnimationProps {
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  style?: ViewStyle;
  onAnimationFinish?: () => void;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 200,
  autoPlay = true,
  loop = false,
  speed = 1,
  style,
  onAnimationFinish,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay]);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <LottieView
        ref={animationRef}
        source={require("@/assets/animations/coffee-bean-logo.json")}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={{
          width: size,
          height: size,
        }}
        onAnimationFinish={onAnimationFinish}
        resizeMode="contain"
      />
    </View>
  );
};

LogoAnimation.displayName = "LogoAnimation";

export default LogoAnimation;
