import { FC } from "react";
import { getFontSize, Text, View } from "tamagui";
import { Image } from "expo-image";
import { Badge, ThemedText } from "@/components/ui";
import { useBeanStore } from "@/store/bean-store";
import { Taste } from "@/types";

const NoData = () => (
  <View flex={1}>
    <ThemedText
      fw={500}
      mt={"$2"}
      color={"$primary"}
      fontSize={getFontSize("$8")}
      lineHeight={getFontSize("$8")}
    >
      Aktuelle Auswahl:
    </ThemedText>
    <Text mt="$2" color={"$copyText"}>
      Über das Eingabefeld können Sie neue Einträge erstellen.
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

interface AddBeanTasteFrameSelectionProps {
  tasteData: Taste[];
}
const AddBeanTasteFrameSelection: FC<AddBeanTasteFrameSelectionProps> = ({
  tasteData,
}) => {
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
        Aktuelle Auswahl:
      </ThemedText>
      <View
        flex={1}
        flexDirection="row"
        gap="$2"
        pt="$3"
        flexWrap="wrap"
        mb="$4"
      >
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
