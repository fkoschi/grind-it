import { FC, ReactElement } from "react";
import { Dimensions } from "react-native";
import { Button, ButtonProps, View } from "tamagui";

interface Props extends ButtonProps {
  onPress: () => void;
  icon: ReactElement;
}
const ActionButton: FC<Props> = ({ onPress, icon, ...props }) => {
  const { width } = Dimensions.get("window");
  const left = width / 2 - 52 / 2;

  return (
    <View position="absolute" bottom={52} left={left} zIndex={99999}>
      <Button circular width={52} height={52} onPress={onPress} {...props}>
        {icon}
      </Button>
    </View>
  );
};
export default ActionButton;
