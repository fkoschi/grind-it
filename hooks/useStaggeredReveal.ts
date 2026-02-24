import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";

interface UseStaggeredRevealOptions {
  itemCount: number;
  delayMs?: number;
  durationMs?: number;
  translateY?: number;
}

export const useStaggeredReveal = ({
  itemCount,
  delayMs = 70,
  durationMs = 260,
  translateY = 12,
}: UseStaggeredRevealOptions) => {
  const valuesRef = useRef<Animated.Value[]>([]);
  const hasAnimated = useRef(false);

  if (valuesRef.current.length !== itemCount) {
    valuesRef.current = Array.from(
      { length: itemCount },
      () => new Animated.Value(hasAnimated.current ? 1 : 0),
    );
  }

  useEffect(() => {
    if (hasAnimated.current || itemCount === 0) return;
    hasAnimated.current = true;
    Animated.stagger(
      delayMs,
      valuesRef.current.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: durationMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [itemCount, delayMs, durationMs]);

  const getAnimatedStyle = useMemo(
    () => (index: number) => ({
      opacity: valuesRef.current[index],
      transform: [
        {
          translateY: valuesRef.current[index].interpolate({
            inputRange: [0, 1],
            outputRange: [translateY, 0],
          }),
        },
      ],
    }),
    [translateY],
  );

  return { getAnimatedStyle };
};
