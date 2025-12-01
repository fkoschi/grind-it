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
        id: beanTable.id,
        name: beanTable.name,
        roastery: roasteryTable.name,
        robustaAmount: beanTable.robustaAmount,
        arabicaAmount: beanTable.arabicaAmount,
        singleShotDosis: beanTable.singleShotDosis,
        doubleShotDosis: beanTable.doubleShotDosis,
        degreeOfGrinding: beanTable.degreeOfGrinding,
      })
      .from(beanTable)
      .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
      .where(eq(beanTable.id, Number(id))),
    [beanTable.id]
  );

  return data?.[0];
};
