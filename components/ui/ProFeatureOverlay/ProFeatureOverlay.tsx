import { BlurView } from "expo-blur";
import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Text, View, YStack, ViewProps } from "tamagui";
import { Lock } from "@tamagui/lucide-icons";
import ThemedText from "../Text/ThemedText";

interface ProFeatureOverlayProps extends ViewProps {
  isPro?: boolean;
  children?: ReactNode;
}

export const ProFeatureOverlay: FC<ProFeatureOverlayProps> = ({
  children,
  isPro = false,
  ...viewProps
}) => {
  return (
    <View {...viewProps} flex={1}>
      <View flex={1} opacity={isPro ? 1 : 0.5}>
        {children}
      </View>
      {!isPro && (
        <BlurView intensity={15} style={[StyleSheet.absoluteFill]}>
          <YStack flex={1} gap="$4" p="$4" alignItems="center" mt="$12">
            <Lock size={32} color="$primary" />
            <ThemedText fontSize="$6" fw={600} textAlign="center">
              Nur in der Pro Version
            </ThemedText>
            <Text textAlign="center" fontSize="$3" opacity={0.8}>
              Upgrade auf Pro um dieses Feature zu nutzen.
            </Text>
          </YStack>
        </BlurView>
      )}
    </View>
  );
};
