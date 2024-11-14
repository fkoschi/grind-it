import { FC } from "react";
import { Pressable } from "react-native";
import { Image } from "expo-image";

interface Props {
  isFavorite: boolean;
}
const FavoriteButton: FC<Props> = ({ isFavorite }) => {
  const imageSource = isFavorite
    ? require("./img/heart-filled.png")
    : require("./img/heart-outlined.png");

  return (
    <Pressable style={{ position: "absolute", right: 24, top: 24 }}>
      <Image source={imageSource} style={{ width: 16, height: 16 }} />
    </Pressable>
  );
};
export default FavoriteButton;
