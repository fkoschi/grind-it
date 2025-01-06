import ThemedText from "@/components/ui/ThemedText";
import { FC } from "react";
import { getFontSize, View } from "tamagui";
import { Image } from "expo-image";
import Badge from "@/components/ui/Badge/Badge";
import { useBeanStore } from "@/store/bean-store";
import { Taste } from "@/types";

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
        style={{ flex: 1, maxHeight: 100, height: 100 }}
        contentFit="contain"
      />
    </View>
  </View>
);

interface Props {
  tasteData: Array<Taste>;
}
const AddBeanFormTaste: FC<Props> = ({ tasteData }) => {
  const removeBeanTaste = useBeanStore((state) => state.removeBeanTaste);

  if (!tasteData.length) {
    return <NoData />;
  }

  return (
    <View flex={1}>
      <ThemedText fw={400} fontSize={16}>
        Gespeicherte Auswahl:
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
export default AddBeanFormTaste;
