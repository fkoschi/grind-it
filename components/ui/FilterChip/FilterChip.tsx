import { FC } from "react";
import { View } from "tamagui";
import ThemedText from "../ThemedText";
import { Pressable } from "react-native";

interface Props {
  name: string;
  active?: boolean;
  onPress?: () => void;
}
const FilterChip: FC<Props> = ({ name, onPress, active }) => {
  return (
    <Pressable onPress={onPress}>
      <View
        flex={0}
        height={32}
        justifyContent="center"
        alignItems="center"
        bgC="white"
        alignSelf="flex-start"
        py="$3"
        borderRadius="$6"
        borderColor="$primary"
        borderWidth={1}
      >
        <ThemedText fw={600} fontSize="$5" lineHeight="$2">
          {name}
        </ThemedText>
      </View>
    </Pressable>
  );
};
export default FilterChip;
