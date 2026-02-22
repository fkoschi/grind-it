import { FC, PropsWithChildren, ReactNode } from "react";
import { Pressable } from "react-native";
import { XStack, YStack, View, styled, ColorTokens } from "tamagui";
import ThemedText from "../Text/ThemedText";

interface RootProps {
  onPress: () => void;
  disabled?: boolean;
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

const SettingsCardRoot: FC<RootProps> = ({ onPress, disabled, children }) => (
  <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
    <StyledCard>{children}</StyledCard>
  </Pressable>
);

const IconCircle = styled(View, {
  width: 48,
  height: 48,
  borderRadius: 24,
  position: "absolute",
});

interface IconProps {
  color: ColorTokens;
  children: ReactNode;
}

const SettingsCardIcon: FC<IconProps> = ({ color, children }) => (
  <View width={48} height={48} alignItems="center" justifyContent="center">
    <IconCircle backgroundColor={color} opacity={0.15} />
    {children}
  </View>
);

interface ContentProps {
  title: string;
  subtitle: string;
}

const SettingsCardContent: FC<ContentProps> = ({ title, subtitle }) => (
  <YStack flex={1}>
    <ThemedText fw={700} fontSize={18}>
      {title}
    </ThemedText>
    <ThemedText fw={400} fontSize={14} color="$copyText">
      {subtitle}
    </ThemedText>
  </YStack>
);

const SettingsCardBg: FC<PropsWithChildren> = ({ children }) => (
  <View position="absolute" right={-10} bottom={-10} opacity={0.12}>
    {children}
  </View>
);

export const SettingsCard = {
  Root: SettingsCardRoot,
  Icon: SettingsCardIcon,
  Content: SettingsCardContent,
  Bg: SettingsCardBg,
};
