import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "tamagui";
import TabBar from "@/components/navigation/TabBar";
import DashboardCards from "@/components/Dashboard/DasboardCards";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { CoffeeBean } from "@/types";
import { useBeanStore } from "@/store/bean-store";
import { selectBeansBySearchAndFilter } from "@/db/queries";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { beanTable, roasteryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import NoData from "@/components/NoData";

const HomePageComponent: FC = () => {
  const { db } = useDatabase();
  const [search, setSearch] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);

  const { data: initialData } = useLiveQuery(
    db
      .selectDistinct({
        id: beanTable.id,
        name: beanTable.name,
        roastery: roasteryTable.name,
        degreeOfGrinding: beanTable.degreeOfGrinding,
        isFavorite: beanTable.isFavorit,
      })
      .from(beanTable)
      .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
  );

  const [beansData, setBeansData] = useState<Array<CoffeeBean> | undefined>();

  const updateBeansData = useCallback(
    (searchText?: string) => {
      setIsLoadingData(true);
      const beansData = selectBeansBySearchAndFilter(db, beanTasteFilter).all({
        search: `%${searchText}%`,
      });
      setBeansData(beansData);
      setIsLoadingData(false);
    },
    [beanTasteFilter]
  );

  const handleChangeText = (searchText: string) => {
    updateBeansData(searchText);
    setSearch(searchText);
  };

  useEffect(() => {
    updateBeansData(search);
  }, [beanTasteFilter]);

  useEffect(() => {
    setBeansData(initialData);
  }, [initialData]);

  const hasActiveFilter = beanTasteFilter?.length > 0 || search.length > 0;

  return (
    <View flex={1} bgC="$screenBackground">
      <DashboardHeader onChangeText={handleChangeText} />
      <HomePage
        data={beansData}
        isLoading={isLoadingData}
        isFiltered={hasActiveFilter}
      />
      <TabBar />
    </View>
  );
};

interface HomePageProps {
  isFiltered: boolean;
  isLoading?: boolean;
  data?: CoffeeBean[];
}
const HomePage: FC<HomePageProps> = ({ isLoading, isFiltered, data }) => {
  const isEmpty = useMemo(() => data?.length === 0, [data]);

  if (isEmpty && !isFiltered && !isLoading) {
    return (
      <NoData
        variant={1}
        headline="Keine Bohnen gefunden"
        copy="Erstelle deine erste Bohne."
      />
    );
  }

  return <DashboardCards beansData={data} />;
};

export default HomePageComponent;
