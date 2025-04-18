import { FC, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import HeartIcon from "../Icons/Heart";
import LottieView from "lottie-react-native";
import { View } from "tamagui";

interface Props {
  isFavorite: boolean;
  onPress: () => void;
}

// TODO: move to design tokens
const FILLED_COLOR = "#CD5B5B";

const FavoriteButton: FC<Props> = ({ isFavorite, onPress }) => {
  const animationRef = useRef<LottieView>(null);
  const [prevIsFavorite, setPrevIsFavorite] = useState(isFavorite);

  useEffect(() => {
    if (isFavorite && !prevIsFavorite) {
      animationRef.current?.play();

      setTimeout(() => {
        animationRef.current?.reset();
      }, 1300);
    }

    setPrevIsFavorite(isFavorite);
  }, [isFavorite, prevIsFavorite]);

  return (
    <View>
      <Pressable style={styles.buttonContainer} onPress={onPress}>
        <HeartIcon
          size={12}
          fill={isFavorite ? FILLED_COLOR : "transparent"}
          strokeColor={isFavorite ? FILLED_COLOR : "#5a5a5a"}
        />
      </Pressable>
      {isFavorite && (
        <LottieView
          style={styles.lottieContainer}
          ref={animationRef}
          autoPlay={false}
          source={require("@/assets/animations/love.json")}
        />
      )}
    </View>
  );
};
export default FavoriteButton;

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    zIndex: 1,
    right: 24,
    top: 24,
  },
  lottieContainer: {
    position: "absolute",
    zIndex: 0,
    right: 10,
    top: 10,
    width: 40,
    height: 40,
  },
});
