import FilterChip from "@/components/ui/FilterChip/FilterChip";
import ThemedText from "@/components/ui/ThemedText";
import { Taste } from "@/types";
import { FC } from "react";
import { View } from "tamagui";

interface Props {
  tasteData: Array<Taste>;
  onPress: (taste: Taste) => void;
}
const AddBeanFormSuggestions: FC<Props> = ({ tasteData, onPress }) => {
  if (!tasteData?.length) {
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
export default AddBeanFormSuggestions;
