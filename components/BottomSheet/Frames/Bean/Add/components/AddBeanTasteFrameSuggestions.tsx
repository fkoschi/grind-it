import { FC } from "react";
import { ThemedText, FilterChip } from "@/components/ui";
import { Taste } from "@/types";
import { View } from "tamagui";

interface AddBeanTasteFrameSuggestionsProps {
  tasteData: Taste[];
  onPress: (taste: Taste) => void;
}
const AddBeanTasteFrameSuggestions: FC<AddBeanTasteFrameSuggestionsProps> = ({
  tasteData,
  onPress,
}) => {
  const noData = tasteData?.length === 0;

  if (noData) {
    return null;
  }

  return (
    <View flex={1}>
      <ThemedText fw={500} fontSize="$6" lineHeight="$2">
        Vorschläge:
      </ThemedText>
      <View mt="$2" flex={1} flexDirection="row" gap="$2" flexWrap="wrap">
        {tasteData.map((taste: Taste) => (
          <FilterChip
            key={taste.id}
            id={taste.id}
            name={taste.flavor}
            onPress={() => onPress(taste)}
          />
        ))}
      </View>
    </View>
  );
};
export default AddBeanTasteFrameSuggestions;
