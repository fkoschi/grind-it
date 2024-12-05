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
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { beanTable, roasteryTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const HomePage: FC = () => {
  const { db } = useDatabase();
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);
  const [search, setSearch] = useState<string>("");
  const [beansData, setBeansData] = useState<Array<CoffeeBean>>();

  const { data: liveData } = useLiveQuery(
    db
      .selectDistinct({
        id: beanTable.id,
        name: beanTable.name,
        roastery: roasteryTable.name,
        degreeOfGrinding: beanTable.degreeOfGrinding,
        isFavorite: beanTable.isFavorit,
      })
      .from(beanTable)
      .innerJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
  );

  useEffect(() => {
    setBeansData(liveData);
  }, [liveData]);

  const fetchDataBySearch = () => {
    const data = selectBeansBySearch(db).all({ search: `%${search}%` });
    setBeansData(data);
  };

  const fetchDataBySearchAndFilter = () => {
    const data = selectBeansBySearchAndFilter(db, beanTasteFilter).all({
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
