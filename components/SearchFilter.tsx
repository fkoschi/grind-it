import { Filter } from "@/types";
import { FC, useState } from "react";
import { View, Text, ScrollView } from "tamagui";
import FilterChip from "./ui/FilterChip/FilterChip";

interface Props {
  filters: Array<Filter>;
}
const SearchFilter: FC<Props> = ({ filters: initialFilters }) => {
  const [filterData, setFilterData] = useState(initialFilters);

  return (
    <View flex={0} mb="$2">
      <ScrollView horizontal>
        {filterData.map(({ taste: { name }, active }, index) => (
          <FilterChip
            key={`Filter-Chip-${index}`}
            name={name}
            active={active}
          />
        ))}
      </ScrollView>
    </View>
  );
};
export default SearchFilter;
