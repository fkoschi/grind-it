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
import { beanTable } from "@/db/schema";

import NoData from "@/components/NoData/NoData";

const HomePageComponent: FC = () => {
  const { db } = useDatabase();
  const [search, setSearch] = useState<string>("");
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);

  const { data } = useLiveQuery(
    queryBeansBySearchAndFilter(db, beanTasteFilter, search),
    [beanTasteFilter, search],
  );

  const { data: allBeans } = useLiveQuery(
    db.select({ id: beanTable.id }).from(beanTable),
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

  return <DashboardCards beansData={data} />;
};

export default HomePageComponent;
