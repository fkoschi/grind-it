import { FC, useEffect, useMemo, useState } from "react";
import { View } from "tamagui";
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
import DashboardEmpty from "@/components/Dashboard/DashboardEmpty";

const HomePage: FC = () => {
  const { db } = useDatabase();
  const beanTasteFilter = useBeanStore((store) => store.tasteFilter);
  const [search, setSearch] = useState<string>("");
  const [beansData, setBeansData] = useState<Array<CoffeeBean>>();

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

  useEffect(() => {
    setBeansData(initialData);
  }, [initialData]);

  const handleChangeText = (search: string) => {
    const data = selectBeansBySearchAndFilter(db, beanTasteFilter).all({
      search: `%${search}%`,
    });

    setBeansData(data);
    setSearch(search);
  };

  const hasActiveFilter = beanTasteFilter?.length > 0 || search.length > 0;
  const hasNoBeanData =
    beansData?.length === 0 && initialData?.length === 0 && !hasActiveFilter;

  return (
    <View flex={1} bgC="$screenBackground">
      <DashboardHeader onChangeText={handleChangeText} />
      {hasNoBeanData ? (
        <DashboardEmpty />
      ) : (
        <DashboardCards beansData={beansData} />
      )}
      <TabBar />
    </View>
  );
};

export default HomePage;
