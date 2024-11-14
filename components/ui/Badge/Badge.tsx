import { FC } from "react";
import { View } from "tamagui";
import ThemedText from "../ThemedText";

interface Props {
  title: string;
}
const Badge: FC<Props> = ({ title }) => {
  return (
    <View
      p="$0"
      py="$3"
      px="$1"
      bgC="$primary"
      alignSelf="flex-start"
      alignItems="center"
      borderRadius="$4"
    >
      <ThemedText fw={500} fontSize="$5" lineHeight={16} color="white">
        {title}
      </ThemedText>
    </View>
  );
};
export default Badge;
