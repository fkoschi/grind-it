import { BlurView } from "expo-blur";
import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Text, View, YStack, ViewProps } from "tamagui";
import { Lock } from "@tamagui/lucide-icons";
import ThemedText from "../Text/ThemedText";
import { useTranslation } from "react-i18next";

interface ProFeatureOverlayProps extends ViewProps {
  isPro?: boolean;
  children?: ReactNode;
}

export const ProFeatureOverlay: FC<ProFeatureOverlayProps> = ({
  children,
  isPro = false,
  ...viewProps
}) => {
  const { t } = useTranslation();
  return (
    <View {...viewProps} flex={1}>
      <View flex={1} opacity={isPro ? 1 : 0.5}>
        {children}
      </View>
      {!isPro && (
        <BlurView intensity={40} tint="light" style={[StyleSheet.absoluteFill]}>
          <YStack flex={1} gap="$4" p="$4" alignItems="center" justifyContent="center">
            <Lock size={32} color="$primary" />
            <ThemedText fontSize="$6" fw={600} textAlign="center">
              {t("pro.title")}
            </ThemedText>
            <Text textAlign="center" fontSize="$3" opacity={0.8}>
              {t("pro.subtitle")}
            </Text>
          </YStack>
        </BlurView>
      )}
    </View>
  );
};
