import { FC, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";
import React from "react";
import { useBeanDetails } from "@/hooks/useBeanDetails";
import DetailsPageComponent from "@/components/ui/Pages/DetailsPage/DetailsPage";

export const PATH_NAME = "/bean/details";

// eslint-disable-next-line react/display-name
const DetailsPage: FC = React.memo(() => {
  const router = useRouter();
  const { db } = useDatabase();
  const { id } = useLocalSearchParams();
  const [tastes, setTastes] = useState<{ flavor: string }[]>([]);

  const beansData = useBeanDetails();

  useEffect(() => {
    const fetchTasteByBeanId = async () => {
      const tasteIdData = await db
        .select({
          tasteId: beanTasteAssociationTable.tasteId,
        })
        .from(beanTasteAssociationTable)
        .where(eq(beanTasteAssociationTable.beanId, Number(id)));

      const tasteIds = tasteIdData.map((taste) => taste.tasteId);

      const tasteData = await db
        .select({ flavor: beanTasteTable.flavor })
        .from(beanTasteTable)
        .where(inArray(beanTasteTable.id, tasteIds));

      setTastes(tasteData);
    };

    fetchTasteByBeanId();
  }, [db, id]);

  if (!beansData) {
    return null;
  }

  const handleEditPress = () => router.navigate(`/bean/edit/${id}`);
  const handleDegreePress = () => router.navigate(`/bean/edit/degree/${id}`);

  return (
    <DetailsPageComponent
      beansData={beansData}
      tastes={tastes}
      onEditPress={handleEditPress}
      onDegreePress={handleDegreePress}
    />
  );
});

export default DetailsPage;
