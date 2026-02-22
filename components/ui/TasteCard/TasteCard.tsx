import { FC, ReactNode } from "react";
import { Pressable } from "react-native";
import { XStack, View, styled } from "tamagui";
import { Droplets } from "@tamagui/lucide-icons";
import ThemedText from "../Text/ThemedText";
import ClearIcon from "../Icons/Clear";

interface RootProps {
  children: ReactNode;
}

const StyledCard = styled(XStack, {
  backgroundColor: "white",
  borderRadius: "$6",
  py: "$2.5",
  px: "$3",
  alignItems: "center",
  gap: "$3",
});

const TasteCardRoot: FC<RootProps> = ({ children }) => <StyledCard>{children}</StyledCard>;

const IconCircle = styled(View, {
  width: 32,
  height: 32,
  borderRadius: 16,
  position: "absolute",
});

const TasteCardIcon: FC = () => (
  <View width={32} height={32} alignItems="center" justifyContent="center">
    <IconCircle backgroundColor="$accentSage" opacity={0.15} />
    <Droplets size={16} color="$accentSage" />
  </View>
);

interface LabelProps {
  name: string;
}

const TasteCardLabel: FC<LabelProps> = ({ name }) => (
  <ThemedText fw={600} fontSize={15} flex={1} numberOfLines={1}>
    {name}
  </ThemedText>
);

interface DeleteProps {
  onPress: () => void;
}

const TasteCardDelete: FC<DeleteProps> = ({ onPress }) => (
  <Pressable onPress={onPress} hitSlop={8}>
    <View
      width={28}
      height={28}
      borderRadius={14}
      backgroundColor="$accentSage"
      opacity={0.15}
      position="absolute"
    />
    <View width={28} height={28} alignItems="center" justifyContent="center">
      <ClearIcon fill="#8BAA91" size={14} />
    </View>
  </Pressable>
);

export const TasteCard = {
  Root: TasteCardRoot,
  Icon: TasteCardIcon,
  Label: TasteCardLabel,
  Delete: TasteCardDelete,
};
