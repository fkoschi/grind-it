import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export const EXPORT_VERSION = "1.0.0";

export interface ExportedBean {
  name: string;
  robustaAmount: number | null;
  arabicaAmount: number | null;
  roasteryName: string | null;
  degreeOfGrinding: number | null;
  singleShotDosis: number | null;
  doubleShotDosis: number | null;
  isFavorit: boolean | null;
  aromaFruity: number | null;
  aromaFloral: number | null;
  aromaSweet: number | null;
  aromaNutty: number | null;
  aromaSpices: number | null;
  aromaRoasted: number | null;
  aromaGreen: number | null;
  aromaSour: number | null;
  aromaOther: number | null;
  tastes: string[];
}

export interface ExportedData {
  version: string;
  exportDate: string;
  beans: ExportedBean[];
}

export const exportAllData = async (
  db: ExpoSQLiteDatabase,
): Promise<string> => {
  const beans = await db.select().from(beanTable);

  const exportedBeans: ExportedBean[] = await Promise.all(
    beans.map(async (bean) => {
      let roasteryName: string | null = null;
      if (bean.roastery) {
        const roasteryResult = await db
          .select()
          .from(roasteryTable)
          .where(eq(roasteryTable.id, bean.roastery));
        roasteryName = roasteryResult[0]?.name || null;
      }

      const tasteAssociations = await db
        .select()
        .from(beanTasteAssociationTable)
        .where(eq(beanTasteAssociationTable.beanId, bean.id));

      const tastesData = await Promise.all(
        tasteAssociations.map(async (assoc) => {
          const taste = await db
            .select()
            .from(beanTasteTable)
            .where(eq(beanTasteTable.id, assoc.tasteId));
          return taste[0]?.flavor;
        }),
      );

      return {
        name: bean.name,
        robustaAmount: bean.robustaAmount,
        arabicaAmount: bean.arabicaAmount,
        roasteryName,
        degreeOfGrinding: bean.degreeOfGrinding,
        singleShotDosis: bean.singleShotDosis,
        doubleShotDosis: bean.doubleShotDosis,
        isFavorit: bean.isFavorit,
        aromaFruity: bean.aromaFruity,
        aromaFloral: bean.aromaFloral,
        aromaSweet: bean.aromaSweet,
        aromaNutty: bean.aromaNutty,
        aromaSpices: bean.aromaSpices,
        aromaRoasted: bean.aromaRoasted,
        aromaGreen: bean.aromaGreen,
        aromaSour: bean.aromaSour,
        aromaOther: bean.aromaOther,
        tastes: tastesData.filter((t): t is string => t !== undefined),
      };
    }),
  );

  const exportData: ExportedData = {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    beans: exportedBeans,
  };

  return JSON.stringify(exportData, null, 2);
};
