import { useState, useEffect } from "react";
import { eq } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";
import { beanTable, beanTasteAssociationTable, beanTasteTable, roasteryTable } from "@/db/schema";
import {
  formatSingleBeanContext,
  formatAllBeansContext,
} from "@/features/chat/utils/promptHelpers";

const BEAN_FIELDS = {
  name: beanTable.name,
  roastery: roasteryTable.name,
  arabicaAmount: beanTable.arabicaAmount,
  robustaAmount: beanTable.robustaAmount,
  degreeOfGrinding: beanTable.degreeOfGrinding,
  singleShotDosis: beanTable.singleShotDosis,
  doubleShotDosis: beanTable.doubleShotDosis,
  aromaFruity: beanTable.aromaFruity,
  aromaFloral: beanTable.aromaFloral,
  aromaSweet: beanTable.aromaSweet,
  aromaNutty: beanTable.aromaNutty,
  aromaSpices: beanTable.aromaSpices,
  aromaRoasted: beanTable.aromaRoasted,
  aromaGreen: beanTable.aromaGreen,
  aromaSour: beanTable.aromaSour,
  aromaOther: beanTable.aromaOther,
} as const;

export const useBeanChatContext = (beanId?: number): string | null => {
  const { db } = useDatabase();
  const [beanContext, setBeanContext] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      if (beanId != null) {
        const [beanRows, tasteRows] = await Promise.all([
          db
            .select(BEAN_FIELDS)
            .from(beanTable)
            .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
            .where(eq(beanTable.id, beanId)),
          db
            .select({ flavor: beanTasteTable.flavor })
            .from(beanTasteTable)
            .innerJoin(
              beanTasteAssociationTable,
              eq(beanTasteAssociationTable.tasteId, beanTasteTable.id),
            )
            .where(eq(beanTasteAssociationTable.beanId, beanId)),
        ]);

        const bean = beanRows[0];
        if (bean && bean.name != null) {
          setBeanContext(formatSingleBeanContext({ ...bean, name: bean.name }, tasteRows));
        }
      } else {
        const beans = await db
          .select(BEAN_FIELDS)
          .from(beanTable)
          .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id));

        setBeanContext(formatAllBeansContext(beans));
      }
    };

    fetchContext().catch((err) => console.warn("useBeanChatContext: failed to load context", err));
  }, [db, beanId]);

  return beanContext;
};
