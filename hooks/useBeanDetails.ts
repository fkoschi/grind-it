import { beanTable, roasteryTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";

export const useBeanDetails = () => {
  const { db } = useDatabase();
  const { id } = useLocalSearchParams();

  const { data } = useLiveQuery(
    db
      .select({
        roastery: roasteryTable.name,
        beanName: beanTable.name,
        robustaAmount: beanTable.robustaAmount,
        arabicaAmount: beanTable.arabicaAmount,
        degreeOfGrinding: beanTable.degreeOfGrinding,
      })
      .from(beanTable)
      .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
      .where(eq(beanTable.id, Number(id))),
    [beanTable.id],
  );

  return data?.[0];
};
