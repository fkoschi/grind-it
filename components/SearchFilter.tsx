import { Taste } from "@/types";
import { FC, useEffect, useState } from "react";
import { View, Text, ScrollView } from "tamagui";
import FilterChip from "./ui/FilterChip/FilterChip";
import { beanTasteTable } from "@/db/schema";
import { useBeanStore } from "@/store/bean-store";

interface Props {
  filters: Array<typeof beanTasteTable.$inferSelect>;
}
const SearchFilter: FC<Props> = ({ filters }) => {
  const [filterData, setFilterData] = useState<Array<Taste>>();

  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);
  const addBeanTasteFilter = useBeanStore((store) => store.addBeanTasteFilter);
  const removeBeanTasteFilter = useBeanStore(
    (store) => store.removeBeanTasteFilter
  );

  useEffect(() => {
    if (filters) {
      setFilterData(filters);
    }
  }, [filters]);

  const isFilterActive = (id: number) => beanTasteFilter.includes(id);

  const handlePress = (id: number) => {
    if (isFilterActive(id)) {
      removeBeanTasteFilter(id);
    } else {
      addBeanTasteFilter(id);
    }
  };

  return (
    <View
      height={40}
      mb="$2"
      mx="$2"
      alignContent="center"
      animation="slow"
      enterStyle={{
        opacity: 0,
      }}
    >
      <ScrollView horizontal>
        <View flex={1} alignItems="center" flexDirection="row" gap="$1">
          <FilterChip
            key="Filter-Chip-Favorite"
            id={0}
            name="Favorite"
            variant="icon"
            onPress={() => handlePress(0)}
            active={isFilterActive(0)}
          />
          {filterData?.map(({ id, flavor }, index) => (
            <FilterChip
              key={`Filter-Chip-${index}`}
              id={id}
              name={flavor}
              active={isFilterActive(id)}
              onPress={handlePress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default SearchFilter;
