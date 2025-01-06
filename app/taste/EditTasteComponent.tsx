import { FC, useMemo } from "react";
import { beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import EditTastePage from "./EditTastePage";

const EditTasteComponent: FC = () => {
  const { db } = useDatabase();
  const { data } = useLiveQuery(
    db.select().from(beanTasteTable)
  );

  const beanTasteData = useMemo(() => data, [data]);
  return <EditTastePage data={beanTasteData} />;
};

export default EditTasteComponent;
