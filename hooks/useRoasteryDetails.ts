import { roasteryTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";

export const useRoasteryDetails = () => {
  const { db } = useDatabase();
  const { id } = useLocalSearchParams();

  const { data } = useLiveQuery(
    db
      .select()
      .from(roasteryTable)
      .where(eq(roasteryTable.id, Number(id))),
    [roasteryTable.id],
  );

  return data?.[0];
};
