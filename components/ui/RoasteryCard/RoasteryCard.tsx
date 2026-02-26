import { FC, ReactNode } from "react";
import { Pressable } from "react-native";
import { XStack, YStack, View, styled } from "tamagui";
import { Store, Star } from "@tamagui/lucide-icons";
import ThemedText from "../Text/ThemedText";
import RoasteryLogo from "../RoasteryLogo/RoasteryLogo";

interface RootProps {
  onPress: () => void;
  children: ReactNode;
}

const StyledCard = styled(XStack, {
  backgroundColor: "white",
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderRadius: "$8",
  p: "$4",
  alignItems: "center",
  gap: "$4",
  overflow: "hidden",
});

const RoasteryCardRoot: FC<RootProps> = ({ onPress, children }) => (
  <Pressable onPress={onPress}>
    <StyledCard>{children}</StyledCard>
  </Pressable>
);

const IconCircle = styled(View, {
  width: 48,
  height: 48,
  borderRadius: 24,
  position: "absolute",
});

const RoasteryCardIcon: FC = () => (
  <View width={48} height={48} alignItems="center" justifyContent="center">
    <IconCircle backgroundColor="$accentTerracotta" opacity={0.15} />
    <Store size={24} color="$accentTerracotta" />
  </View>
);

interface InfoProps {
  name: string;
  address?: string | null;
}

const RoasteryCardInfo: FC<InfoProps> = ({ name, address }) => (
  <YStack flex={1}>
    <ThemedText fw={700} fontSize={16} numberOfLines={1}>
      {name}
    </ThemedText>
    {!!address && (
      <ThemedText fw={400} fontSize={12} color="$copyText" numberOfLines={1}>
        {address}
      </ThemedText>
    )}
  </YStack>
);

interface RatingProps {
  rating?: number | null;
}

const RoasteryCardRating: FC<RatingProps> = ({ rating }) => {
  if (!rating || rating <= 0) return null;

  return (
    <XStack gap="$1">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} color="#E89E3F" fill="#E89E3F" />
      ))}
    </XStack>
  );
};

interface BgProps {
  websiteUrl?: string | null;
}

const RoasteryCardBg: FC<BgProps> = ({ websiteUrl }) => {
  if (!websiteUrl) return null;

  return (
    <View position="absolute" right={-10} bottom={-10} opacity={0.12}>
      <RoasteryLogo websiteUrl={websiteUrl} size={80} greyscale />
    </View>
  );
};

export const RoasteryCard = {
  Root: RoasteryCardRoot,
  Icon: RoasteryCardIcon,
  Info: RoasteryCardInfo,
  Rating: RoasteryCardRating,
  Bg: RoasteryCardBg,
};
