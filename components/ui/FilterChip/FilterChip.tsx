import { FC } from "react";
import { styled, View } from "tamagui";
import ThemedText from "../ThemedText";
import { Pressable } from "react-native";

const StyledFilterChip = styled(View, {
  flex: 0,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "flex-start",
  py: "$3",
  borderRadius: "$6",
  borderColor: "$primary",
  bgC: "$white",
  borderWidth: 1,
  variants: {
    active: {
      ":boolean": (active: boolean) => {
        if (active) {
          return {
            backgroundColor: "$primary",
          };
        }
      },
    },
  } as const,
});

interface Props {
  id: number;
  name: string;
  active?: boolean;
  onPress?: (id: number) => void;
}
const FilterChip: FC<Props> = ({ id, name, onPress, active }) => {
  
  const handlePress = () => {
    onPress?.(id);
  };

  return (
    <Pressable onPress={handlePress}>
      <StyledFilterChip active={active}>
        <ThemedText
          fw={600}
          fontSize="$5"
          lineHeight="$2"
          style={{ color: active ? "white" : "black" }}
        >
          {name}
        </ThemedText>
      </StyledFilterChip>
    </Pressable>
  );
};
export default FilterChip;
