import { FC, useEffect, useState } from "react";
import { View } from "tamagui";
import TabBar from "@/components/navigation/TabBar";
import DashboardCards from "@/components/pages/Dashboard/DasboardCards";
import DashboardHeader from "@/components/pages/Dashboard/DashboardHeader";
import { CoffeeBean } from "@/types";
import { useBeanStore } from "@/store/bean-store";
import {
  selectBeansBySearch,
  selectBeansBySearchAndFilter,
} from "@/db/queries";

const HomePage: FC = () => {
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);
  const [search, setSearch] = useState<string>("");
  const [beansData, setBeansData] = useState<Array<CoffeeBean>>();

  const fetchDataBySearch = () => {
    const data = selectBeansBySearch.all({ search: `%${search}%` });
    setBeansData(data);
  };

  const fetchDataBySearchAndFilter = () => {
    const data = selectBeansBySearchAndFilter(beanTasteFilter).all({
      search: `%${search}%`,
    });
    setBeansData(data);
  };

  useEffect(() => {
    if (beanTasteFilter?.length > 0) {
      fetchDataBySearchAndFilter();
    } else {
      fetchDataBySearch();
    }
  }, [search, beanTasteFilter]);

  const handleChangeText = (search: string) => setSearch(search);
  const activeFilter = search.length > 0 || beanTasteFilter.length > 0;

  return (
    <View flex={1} bgC="$screenBackground">
      <DashboardHeader onChangeText={handleChangeText} />
      <DashboardCards beansData={beansData} isFilterActive={activeFilter} />
      <TabBar />
    </View>
  );
};

export default HomePage;
