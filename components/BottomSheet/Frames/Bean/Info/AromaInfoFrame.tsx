import { FC } from "react";
import { ScrollView, Text, View, YStack, Button } from "tamagui";
import { useTranslation } from "react-i18next";

const aromaKeys = [
  "fruity",
  "floral",
  "sweet",
  "nutty",
  "spices",
  "roasted",
  "green",
  "sour",
  "other",
] as const;

interface AromaInfoFrameProps {
  onClose: () => void;
}

const AromaInfoFrame: FC<AromaInfoFrameProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <View flex={1} backgroundColor="$screenBackground">
      <View padding="$4" paddingBottom="$2">
        <Text fontSize="$6" fontWeight="bold" color="$copyText">
          {t("aroma.info.title")}
        </Text>
        <Text fontSize="$3" color="$gray400" marginTop="$2">
          {t("aroma.info.subtitle")}
        </Text>
      </View>

      <ScrollView
        flex={1}
        padding="$4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: "$4" }}
      >
        <YStack gap="$4">
          {aromaKeys.map((key, index) => (
            <View
              key={index}
              padding="$4"
              backgroundColor="$white"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <Text fontSize="$5" fontWeight="bold" color="$primary" marginBottom="$2">
                {t(`aroma.${key}.name`)}
              </Text>
              <Text fontSize="$3" color="$copyText" lineHeight="$2" marginBottom="$3">
                {t(`aroma.${key}.description`)}
              </Text>
              <View backgroundColor="$gray100" padding="$3" borderRadius="$3">
                <Text fontSize="$2" fontWeight="600" color="$gray500" marginBottom="$1">
                  {t("aroma.info.examples")}
                </Text>
                <Text fontSize="$3" color="$gray600" lineHeight="$1">
                  {t(`aroma.${key}.examples`)}
                </Text>
              </View>
            </View>
          ))}
        </YStack>
      </ScrollView>

      <View padding="$6" backgroundColor="$white">
        <Button
          size="$4"
          backgroundColor="$primary"
          color="white"
          onPress={onClose}
          pressStyle={{ backgroundColor: "$primaryHover" }}
        >
          {t("common.close")}
        </Button>
      </View>
    </View>
  );
};

export default AromaInfoFrame;
