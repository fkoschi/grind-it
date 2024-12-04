import { FC } from "react";
import { getFontSize, View } from "tamagui";
import ThemedText from "../ThemedText";
import { Pressable } from "react-native";
import ClearIcon from "../Icons/Clear";

interface Props {
  title: string;
  withButton?: boolean;
  onPress?: () => void;
}
const Badge: FC<Props> = ({ title, withButton = false, onPress }) => {
  return (
    <View
      p="$0"
      py="$3"
      px="$2"
      bgC="$primary"
      justifyContent="center"
      alignItems="center"
      borderRadius="$6"
      flexDirection="row"
    >
      <ThemedText
        fw={500}
        fontSize={getFontSize("$5")}
        lineHeight={getFontSize("$5")}
        color="white"
      >
        {title}
      </ThemedText>
      {withButton && (
        <Pressable
          onPress={onPress}
          style={{
            flex: 0,
            marginLeft: 8,
          }}
        >
          <ClearIcon fill="white" size={16} />
        </Pressable>
      )}
    </View>
  );
};
export default Badge;
