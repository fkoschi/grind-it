import { FC } from "react";
import { getFontSize, styled, View } from "tamagui";
import ThemedText from "../ThemedText";
import { Pressable } from "react-native";
import HeartIcon from "../Icons/Heart";
import { tokens } from "@tamagui/config/v3";

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
  variant?: "text" | "icon";
  onPress?: (id: number) => void;
}
const FilterChip: FC<Props> = ({
  id,
  name,
  variant = "text",
  onPress,
  active,
}) => {
  const handlePress = () => {
    onPress?.(id);
  };

  const FilterChipText = () => (
    <ThemedText
      fw={600}
      fontSize={getFontSize("$4")}
      lineHeight={getFontSize("$4")}
      style={{ color: active ? "white" : "black" }}
    >
      {name}
    </ThemedText>
  );

  const FilterChipIcon = () => <HeartIcon size={12} fill="#CD5B5B" />;

  const renderContent = () => {
    if (variant === "text") {
      return <FilterChipText />;
    } else if (variant === "icon") {
      return <FilterChipIcon />;
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <StyledFilterChip active={active}>{renderContent()}</StyledFilterChip>
    </Pressable>
  );
};
export default FilterChip;
