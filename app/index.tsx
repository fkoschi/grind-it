import React, { FC, useState } from "react";
import { View } from "tamagui";
import TabBar from "@/components/Navigation/TabBar";
import DashboardCards from "@/components/Dashboard/DasboardCards";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { CoffeeBean } from "@/types";
import { useBeanStore } from "@/store/bean-store";
import { queryBeansBySearchAndFilter } from "@/db/queries";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import NoData from "@/components/NoData/NoData";

import { useBeanData } from "@/provider/BeanDataProvider";

const HomePageComponent: FC = () => {
  const { db } = useDatabase();
  const [search, setSearch] = useState<string>("");
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);
  const { allBeans } = useBeanData();

  const { data } = useLiveQuery(
    queryBeansBySearchAndFilter(db, beanTasteFilter, search),
    [beanTasteFilter, search]
  );

  const handleChangeText = (searchText: string) => {
    setSearch(searchText);
  };

  return (
    <View flex={1} bgC="$screenBackground">
      <View flex={1} pb="$12">
        <DashboardHeader onChangeText={handleChangeText} />
        <HomePage
          data={data}
          search={search}
          filter={beanTasteFilter}
          hasBeans={!!allBeans?.length}
        />
      </View>
      <TabBar />
    </View>
  );
};

interface HomePageProps {
  data?: CoffeeBean[];
  search: string;
  filter: number[];
  hasBeans: boolean;
}
const HomePage: FC<HomePageProps> = ({ data, search, filter, hasBeans }) => {
  if (!hasBeans) {
    return (
      <NoData
        variant={1}
        headline="Keine Bohnen gefunden"
        copy="Erstelle deine erste Bohne."
      />
    );
  }

  // If we have beans but data is empty with no filters, we're loading
  if (hasBeans && data?.length === 0 && !search && filter.length === 0) {
    return null;
  }

  return <DashboardCards beansData={data} />;
};

export default HomePageComponent;
