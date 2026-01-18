import { FC, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { beanTable, beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";
import React from "react";
import { useBeanDetails } from "@/hooks/useBeanDetails";
import DetailsPageComponent from "@/components/ui/Pages/DetailsPage/DetailsPage";
import BottomSheet from "@/components/ui/Sheet/Sheet";
import EditAromaFrame, {
  AromaValues,
} from "@/components/BottomSheet/Frames/Bean/Edit/EditAromaFrame";
import AromaInfoFrame from "@/components/BottomSheet/Frames/Bean/Info/AromaInfoFrame";

export const PATH_NAME = "/bean/details";

// eslint-disable-next-line react/display-name
const DetailsPage: FC = React.memo(() => {
  const router = useRouter();
  const { db } = useDatabase();
  const { id } = useLocalSearchParams();
  const [tastes, setTastes] = useState<{ flavor: string }[]>([]);
  const [showAromaEditSheet, setShowAromaEditSheet] = useState(false);
  const [showAromaInfoSheet, setShowAromaInfoSheet] = useState(false);

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
  const handleAromaEditPress = () => setShowAromaEditSheet(true);
  const handleAromaInfoPress = () => setShowAromaInfoSheet(true);

  const handleAromaSave = async (values: AromaValues) => {
    try {
      await db
        .update(beanTable)
        .set({
          aromaFruity: values.aromaFruity,
          aromaFloral: values.aromaFloral,
          aromaSweet: values.aromaSweet,
          aromaNutty: values.aromaNutty,
          aromaSpices: values.aromaSpices,
          aromaRoasted: values.aromaRoasted,
          aromaGreen: values.aromaGreen,
          aromaSour: values.aromaSour,
          aromaOther: values.aromaOther,
        })
        .where(eq(beanTable.id, Number(id)));
      setShowAromaEditSheet(false);
      // Refresh data by forcing re-fetch
      router.replace(`/bean/details/${id}`);
    } catch (error) {
      console.error("Error saving aroma values:", error);
    }
  };

  return (
    <>
      <DetailsPageComponent
        beansData={beansData}
        tastes={tastes}
        onEditPress={handleEditPress}
        onDegreePress={handleDegreePress}
        onAromaEditPress={handleAromaEditPress}
        onAromaInfoPress={handleAromaInfoPress}
      />

      <BottomSheet
        sheetProps={{
          open: showAromaEditSheet,
          onOpenChange: setShowAromaEditSheet,
          snapPoints: [90],
          dismissOnSnapToBottom: true,
          disableDrag: true,
          dismissOnOverlayPress: true,
        }}
        frame={
          <EditAromaFrame
            initialValues={{
              aromaFruity: beansData.aromaFruity ?? 0,
              aromaFloral: beansData.aromaFloral ?? 0,
              aromaSweet: beansData.aromaSweet ?? 0,
              aromaNutty: beansData.aromaNutty ?? 0,
              aromaSpices: beansData.aromaSpices ?? 0,
              aromaRoasted: beansData.aromaRoasted ?? 0,
              aromaGreen: beansData.aromaGreen ?? 0,
              aromaSour: beansData.aromaSour ?? 0,
              aromaOther: beansData.aromaOther ?? 0,
            }}
            onSave={handleAromaSave}
            onCancel={() => setShowAromaEditSheet(false)}
          />
        }
      />

      <BottomSheet
        sheetProps={{
          open: showAromaInfoSheet,
          animation: "quicker",
          onOpenChange: setShowAromaInfoSheet,
          snapPoints: [85],
          dismissOnSnapToBottom: true,
          disableDrag: true,
          dismissOnOverlayPress: true,
        }}
        frame={<AromaInfoFrame onClose={() => setShowAromaInfoSheet(false)} />}
      />
    </>
  );
});

export default DetailsPage;
