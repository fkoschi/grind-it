import { beanTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export const useBeansData = () => {
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();

  const { data: beanData } = useLiveQuery(
    db
      .select()
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId))),
  );

  return useMemo(() => beanData?.[0], [beanData]);
};
