import { FC } from "react";
import { getFontSize, Text, View } from "tamagui";
import { Image } from "expo-image";
import { Badge, ThemedText } from "@/components/ui";
import { useBeanStore } from "@/store/bean-store";
import { Taste } from "@/types";
import { useTranslation } from "react-i18next";

const NoData = () => {
  const { t } = useTranslation();

  return (
    <View flex={1}>
      <ThemedText
        fw={500}
        mt={"$2"}
        color={"$primary"}
        fontSize={getFontSize("$8")}
        lineHeight={getFontSize("$8")}
      >
        {t("common.currentSelection")}
      </ThemedText>
      <Text mt="$2" color={"$copyText"}>
        {t("common.currentSelectionHint")}
      </Text>
      <View flex={1} justifyContent="center">
        <Image
          source={require("@/assets/images/latte-art.png")}
          style={{ flex: 1, maxHeight: 100, height: 100 }}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

interface AddBeanTasteFrameSelectionProps {
  tasteData: Taste[];
}
const AddBeanTasteFrameSelection: FC<AddBeanTasteFrameSelectionProps> = ({ tasteData }) => {
  const { t } = useTranslation();
  const removeBeanTaste = useBeanStore((state) => state.removeBeanTaste);

  if (!tasteData.length) {
    return <NoData />;
  }

  return (
    <View flex={1}>
      <ThemedText
        fw={500}
        mt={"$2"}
        color={"$primary"}
        fontSize={getFontSize("$8")}
        lineHeight={getFontSize("$8")}
      >
        {t("common.currentSelection")}
      </ThemedText>
      <View flex={1} flexDirection="row" gap="$2" pt="$3" flexWrap="wrap" mb="$4">
        {tasteData.map((taste: Taste, index: number) => (
          <Badge
            key={`bean-badge-${taste}-${index}`}
            title={taste.flavor}
            onPress={() => removeBeanTaste(taste)}
            withButton
          />
        ))}
      </View>
    </View>
  );
};
export default AddBeanTasteFrameSelection;
