import { BlurView } from "expo-blur";
import { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { Text, View, YStack } from "tamagui";
import { Lock } from "@tamagui/lucide-icons";
import ThemedText from "../Text/ThemedText";

interface ProFeatureOverlayProps extends PropsWithChildren {
  isPro?: boolean;
}

export const ProFeatureOverlay: FC<ProFeatureOverlayProps> = ({
  children,
  isPro = false,
}) => {
  return (
    <View position="relative">
      <View opacity={isPro ? 1 : 0.5}>{children}</View>
      {!isPro && (
        <BlurView intensity={15} style={StyleSheet.absoluteFill}>
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            gap="$4"
            p="$4"
          >
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
