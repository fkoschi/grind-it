import { View, YStack, Text } from "tamagui";
import { SpiderChart, ProFeatureOverlay } from "@/components/ui";
import { CoffeeBean } from "@/types";
import { Info } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native";
import { MOCK_AROMA_DATA } from "@/constants/mockAromaData";
import { useIsProUser } from "@/hooks/useIsProUser";
import { useTranslation } from "react-i18next";

interface DetailsPageDetailsTabProps {
  beansData: CoffeeBean;
  onInfoPress: () => void;
}

export const DetailsPageDetailsTab = ({ beansData, onInfoPress }: DetailsPageDetailsTabProps) => {
  const { t } = useTranslation();
  const isPro = useIsProUser();
  const hasAromaData =
    beansData.aromaFruity != null ||
    beansData.aromaFloral != null ||
    beansData.aromaSweet != null ||
    beansData.aromaNutty != null ||
    beansData.aromaSpices != null ||
    beansData.aromaRoasted != null ||
    beansData.aromaGreen != null ||
    beansData.aromaSour != null ||
    beansData.aromaOther != null;

  const aromaData = [
    { label: t("aroma.fruity.label"), value: beansData.aromaFruity ?? 0 },
    { label: t("aroma.floral.label"), value: beansData.aromaFloral ?? 0 },
    { label: t("aroma.sweet.label"), value: beansData.aromaSweet ?? 0 },
    { label: t("aroma.nutty.label"), value: beansData.aromaNutty ?? 0 },
    { label: t("aroma.spices.label"), value: beansData.aromaSpices ?? 0 },
    { label: t("aroma.roasted.label"), value: beansData.aromaRoasted ?? 0 },
    { label: t("aroma.green.label"), value: beansData.aromaGreen ?? 0 },
    { label: t("aroma.sour.label"), value: beansData.aromaSour ?? 0 },
    { label: t("aroma.other.label"), value: beansData.aromaOther ?? 0 },
  ];

  const displayData = !isPro ? MOCK_AROMA_DATA : aromaData;
  const shouldShowChart = !isPro || hasAromaData;

  const handleInfoPress = () => onInfoPress();

  return (
    <ProFeatureOverlay isPro={isPro}>
      <View flex={1}>
        <TouchableOpacity
          onPress={handleInfoPress}
          style={{
            position: "absolute",
            zIndex: 9999,
            right: 0,
            padding: 8,
            borderRadius: 8,
          }}
          activeOpacity={0.7}
        >
          <Info size={20} color="#333" />
        </TouchableOpacity>

        <View flex={1} mt="$10">
          {shouldShowChart ? (
            <SpiderChart data={displayData} />
          ) : (
            <YStack alignItems="center" gap="$3" px="$6">
              <Text fontSize="$6" fontWeight="600" color="$primary">
                {t("details.aroma.noProfile.title")}
              </Text>
              <Text fontSize="$4" color="$gray400" textAlign="center" lineHeight="$2">
                {t("details.aroma.noProfile.subtitle")}
              </Text>
            </YStack>
          )}
        </View>
      </View>
    </ProFeatureOverlay>
  );
};
