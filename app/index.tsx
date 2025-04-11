import React, { FC, useCallback, useEffect, useState } from "react";
import { View } from "tamagui";
import TabBar from "@/components/Navigation/TabBar";
import DashboardCards from "@/components/Dashboard/DasboardCards";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { CoffeeBean } from "@/types";
import { useBeanStore } from "@/store/bean-store";
import { selectBeansBySearchAndFilter } from "@/db/queries";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { beanTable, roasteryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import NoData from "@/components/NoData/NoData";

const HomePageComponent: FC = () => {
  const { db } = useDatabase();
  const [search, setSearch] = useState<string>("");
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);

  const { data } = useLiveQuery(
    db
      .selectDistinct({
        id: beanTable.id,
        name: beanTable.name,
        roastery: roasteryTable.name,
        degreeOfGrinding: beanTable.degreeOfGrinding,
        isFavorite: beanTable.isFavorit,
      })
      .from(beanTable)
      .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id)),
  );

  const handleChangeText = (searchText: string) => {
    setSearch(searchText);
  };

  return (
    <View flex={1} bgC="$screenBackground" pb="$12">
      <DashboardHeader onChangeText={handleChangeText} />
      <HomePage data={data} search={search} filter={beanTasteFilter} />
      <TabBar />
    </View>
  );
};

interface HomePageProps {
  data?: CoffeeBean[];
  search: string;
  filter: number[];
}
const HomePage: FC<HomePageProps> = ({ data: initialData, search, filter }) => {
  const { db } = useDatabase();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [beansData, setBeansData] = useState<CoffeeBean[] | undefined>(
    initialData,
  );

  const updateBeansData = useCallback(() => {
    const updatedBeansData = selectBeansBySearchAndFilter(db, filter).all({
      search: `%${search}%`,
    });
    setBeansData(updatedBeansData);
  }, [db, filter, search]);

  useEffect(() => {
    updateBeansData();
  }, [initialData, updateBeansData]);

  useEffect(() => {
    setIsLoading(true);
    const debounceTimer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [search, filter]);

  const isEmpty = beansData?.length === 0;
  const isFiltered = search?.length > 0 || filter?.length > 0;

  if (isEmpty && !isFiltered) {
    return (
      <NoData
        variant={1}
        headline="Keine Bohnen gefunden"
        copy="Erstelle deine erste Bohne."
      />
    );
  }

  return <DashboardCards beansData={beansData} loading={isLoading} />;
};

export default HomePageComponent;
