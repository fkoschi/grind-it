import { View, YStack, Text } from "tamagui";
import { SpiderChart, ProFeatureOverlay } from "@/components/ui";
import { CoffeeBean } from "@/types";
import { Info } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native";
import { MOCK_AROMA_DATA } from "@/constants/mockAromaData";
import { useIsProUser } from "@/hooks/useIsProUser";

interface DetailsPageDetailsTabProps {
  beansData: CoffeeBean;
  onInfoPress: () => void;
}

export const DetailsPageDetailsTab = ({
  beansData,
  onInfoPress,
}: DetailsPageDetailsTabProps) => {
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
    { label: "fruchtig", value: beansData.aromaFruity ?? 0 },
    { label: "blumig", value: beansData.aromaFloral ?? 0 },
    { label: "süß", value: beansData.aromaSweet ?? 0 },
    { label: "nussig", value: beansData.aromaNutty ?? 0 },
    { label: "gewürze", value: beansData.aromaSpices ?? 0 },
    { label: "röstig", value: beansData.aromaRoasted ?? 0 },
    { label: "grün", value: beansData.aromaGreen ?? 0 },
    { label: "sauer", value: beansData.aromaSour ?? 0 },
    { label: "andere", value: beansData.aromaOther ?? 0 },
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

        <View flex={1}>
          {shouldShowChart ? (
            <SpiderChart data={displayData} />
          ) : (
            <YStack alignItems="center" gap="$3" px="$6" maxWidth={400}>
              <Text fontSize="$6" fontWeight="600" color="$primary">
                Noch kein Aroma-Profil
              </Text>
              <Text
                fontSize="$4"
                color="$gray400"
                textAlign="center"
                lineHeight="$2"
              >
                Nutze den Button unten, um ein Aroma-Profil für diese Bohne zu
                erstellen.
              </Text>
            </YStack>
          )}
        </View>
      </View>
    </ProFeatureOverlay>
  );
};
