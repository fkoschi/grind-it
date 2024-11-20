import { Filter } from "@/types";
import { FC, useState } from "react";
import { View, Text, ScrollView } from "tamagui";
import FilterChip from "./ui/FilterChip/FilterChip";

interface Props {
  isVisible?: boolean;
  filters: Array<Filter>;
}
const SearchFilter: FC<Props> = ({
  filters: initialFilters,
  isVisible = false,
}) => {
  const [filterData, setFilterData] = useState(initialFilters);

  const handlePress = (id: number) => {
    const updatedFilters = filterData.map((filter) => {
      if (filter.taste.id === id) {
        return {
          ...filter,
          active: !filter.active,
        };
      }
      return filter;
    });
    setFilterData(updatedFilters);
  };

  return (
    <View
      flex={0}
      mb="$2"
      mx="$2"
      animation="slow"
      enterStyle={{
        opacity: 0,
      }}
    >
      <ScrollView horizontal>
        <View flex={1} flexDirection="row" gap="$1">
          {filterData.map(({ taste: { id, name }, active }, index) => (
            <FilterChip
              key={`Filter-Chip-${index}`}
              id={id}
              name={name}
              active={active}
              onPress={handlePress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default SearchFilter;
