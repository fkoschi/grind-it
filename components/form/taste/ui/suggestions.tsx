import FilterChip from "@/components/ui/FilterChip/FilterChip";
import ThemedText from "@/components/ui/ThemedText";
import { FC } from "react";
import { View } from "tamagui";

type Flavor = {
  id: number;
  flavor: string;
};

interface Props {
  data: Array<Flavor>;
  onPress: (id: number) => void;
}
const AddBeanFormSuggestions: FC<Props> = ({ data, onPress }) => {
  if (!data.length) {
    return null;
  }

  return (
    <View flex={1}>
      <ThemedText fw={500} fontSize="$6" lineHeight="$2">
        Vorschläge:
      </ThemedText>
      <View mt="$2" flex={1} flexDirection="row" gap="$2" flexWrap="wrap">
        {data.map((taste: Flavor) => (
          <FilterChip
            key={taste.id}
            id={taste.id}
            name={taste.flavor}
            onPress={() => onPress(taste.id)}
          />
        ))}
      </View>
    </View>
  );
};
export default AddBeanFormSuggestions;
