import ThemedText from "@/components/ui/ThemedText";
import { FC } from "react";
import { getFontSize, View } from "tamagui";
import { Image } from "expo-image";
import Badge from "@/components/ui/Badge/Badge";
import { useBeanStore } from "@/store/bean-store";

const NoData = () => (
  <View flex={1}>
    <ThemedText
      fw={500}
      fontSize={getFontSize("$7")}
      lineHeight={getFontSize("$7")}
    >
      Geschmack wählen:
    </ThemedText>
    <View flex={1} justifyContent="center">
      <Image
        source={require("@/assets/images/latte-art.png")}
        style={{ flex: 1, maxHeight: 100 }}
        contentFit="contain"
      />
    </View>
  </View>
);

interface Props {
  data: Array<string>;
  suggestionData?: Array<{ id: number; flavor: string }>;
  onSuggestionPress: (id: number) => void;
}
const AddBeanFormTaste: FC<Props> = ({
  data,
  suggestionData,
  onSuggestionPress,
}) => {
  const removeBeanTaste = useBeanStore((state) => state.removeBeanTaste);

  if (!data.length && !suggestionData?.length) {
    return <NoData />;
  }

  return (
    <View flex={1} flexDirection="row" gap="$2" pt="$3" flexWrap="wrap" mb="$4">
      {suggestionData?.map(({ id, flavor }) => (
        <Badge
          key={`bean-badge-${id}`}
          title={flavor}
          onPress={() => onSuggestionPress(id)}
          withButton
        />
      ))}
      {data.map((taste: string, index: number) => (
        <Badge
          key={`bean-badge-${taste}-${index}`}
          title={taste}
          onPress={() => removeBeanTaste(taste)}
          withButton
        />
      ))}
    </View>
  );
};
export default AddBeanFormTaste;
