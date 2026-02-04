import { beanTable, roasteryTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export const useAllBeansForSync = () => {
  const { db } = useDatabase();

  // Fetch all beans
  const { data: beans } = useLiveQuery(db.select().from(beanTable));

  // Fetch all roasteries
  const { data: roasteries } = useLiveQuery(db.select().from(roasteryTable));

  return { beans: beans || [], roasteries: roasteries || [] };
};
