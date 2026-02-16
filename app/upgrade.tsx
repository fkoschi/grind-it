import { FC, useState } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Spinner, Text, View, XStack, YStack, styled } from "tamagui";
import { Sparkles, MessageCircle, Crown } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { ClearIcon, ThemedText } from "@/components/ui";
import { usePurchase } from "@/provider/PurchaseProvider";

const FeatureCard = styled(XStack, {
  backgroundColor: "white",
  width: "100%",
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderRadius: "$8",
  p: "$4",
  gap: "$3",
  alignItems: "center",
});

const UpgradePage: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { purchasePro, restorePurchases, currentOffering, isLoading } = usePurchase();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const price = currentOffering?.lifetime?.product.priceString;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const success = await purchasePro();
      if (success) {
        router.back();
      }
    } catch {
      Alert.alert(t("upgrade.error.title"), t("upgrade.error.message"));
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        Alert.alert(t("upgrade.restore.success.title"), t("upgrade.restore.success.message"));
        router.back();
      } else {
        Alert.alert(t("upgrade.restore.empty.title"), t("upgrade.restore.empty.message"));
      }
    } catch {
      Alert.alert(t("upgrade.error.title"), t("upgrade.error.message"));
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <View bgC="$screenBackground" flex={1}>
      <Pressable style={{ position: "relative", top: 32, left: 32 }} onPress={() => router.back()}>
        <ClearIcon size={24} fill="#000" />
      </Pressable>
      <View alignItems="center" pb="$4" pt="$10">
        <View pb="$4">
          <Crown size={24} color="$primary" />
        </View>
        <Text fontSize={32} fontFamily="$sodabery">
          {t("upgrade.title")}
        </Text>
        <ThemedText fw={400} mt="$1">
          {t("upgrade.subtitle")}
        </ThemedText>
      </View>

      <YStack flex={1} p="$4" gap="$3" mt="$2">
        <FeatureCard>
          <View bgC="$primary" borderRadius="$4" p="$2">
            <Sparkles size={20} color="$white" />
          </View>
          <YStack flex={1}>
            <ThemedText fw={600} fontSize="$4">
              {t("upgrade.feature.aroma.title")}
            </ThemedText>
            <ThemedText fw={400} fontSize="$2" opacity={0.7}>
              {t("upgrade.feature.aroma.description")}
            </ThemedText>
          </YStack>
        </FeatureCard>

        <FeatureCard>
          <View bgC="$primary" borderRadius="$4" p="$2">
            <MessageCircle size={20} color="$white" />
          </View>
          <YStack flex={1}>
            <ThemedText fw={600} fontSize="$4">
              {t("upgrade.feature.chat.title")}
            </ThemedText>
            <ThemedText fw={400} fontSize="$2" opacity={0.7}>
              {t("upgrade.feature.chat.description")}
            </ThemedText>
          </YStack>
        </FeatureCard>
      </YStack>

      <YStack px="$4" py="$4" pb={insets.bottom + 16} gap="$2">
        <Button
          size="$5"
          bgC="$primary"
          color="$white"
          fontWeight="600"
          onPress={handlePurchase}
          disabled={isPurchasing || isLoading || !currentOffering}
          opacity={isPurchasing || isLoading ? 0.7 : 1}
          borderRadius="$8"
        >
          {isPurchasing ? (
            <Spinner color="$white" />
          ) : price ? (
            t("upgrade.purchaseButton", { price })
          ) : (
            t("upgrade.purchaseButtonLoading")
          )}
        </Button>

        <ThemedText fw={300} fontSize={12} textAlign="center" opacity={0.5} mt="$1">
          {t("upgrade.oneTimePurchase")}
        </ThemedText>

        <Button
          size="$3"
          chromeless
          onPress={handleRestore}
          disabled={isRestoring || isLoading}
          opacity={isRestoring ? 0.5 : 0.6}
        >
          {isRestoring ? <Spinner size="small" /> : t("upgrade.restoreButton")}
        </Button>
      </YStack>
    </View>
  );
};
export default UpgradePage;
