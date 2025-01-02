import { FC } from "react";
import { Pressable } from "react-native";
import HeartIcon from "../Icons/Heart";

interface Props {
  isFavorite: boolean;
  onPress: () => void;
}
const FavoriteButton: FC<Props> = ({ isFavorite, onPress }) => {
  return (
    <Pressable
      style={{ position: "absolute", right: 24, top: 24 }}
      onPress={onPress}
    >
      <HeartIcon
        size={12}
        fill={isFavorite ? "#CD5B5B" : "transparent"}
        strokeColor={isFavorite ? "#CD5B5B" : "#5a5a5a"}
      />
    </Pressable>
  );
};
export default FavoriteButton;
