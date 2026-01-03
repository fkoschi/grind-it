import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { ExportedData, EXPORT_VERSION } from "./dataExport";
import { calculateSimilarity } from "./fuzzyMatch";

export interface ImportResult {
  success: boolean;
  beansCreated: number;
  beansSkipped: number;
  roasteriesCreated: number;
  tastesCreated: number;
  errors: string[];
  duplicates: DuplicateInfo[];
}

export interface DuplicateInfo {
  beanName: string;
  reason: string;
  similarity?: number;
}

const SIMILARITY_THRESHOLD = 85;

const validateImportData = (data: unknown): ExportedData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid import data format");
  }

  const exportData = data as Partial<ExportedData>;

  if (
    !exportData.version ||
    !exportData.beans ||
    !Array.isArray(exportData.beans)
  ) {
    throw new Error("Missing required fields in import data");
  }

  if (exportData.version !== EXPORT_VERSION) {
    throw new Error(
      `Incompatible export version. Expected ${EXPORT_VERSION}, got ${exportData.version}`,
    );
  }

  return exportData as ExportedData;
};

const findOrCreateRoastery = async (
  db: ExpoSQLiteDatabase,
  roasteryName: string | null,
  stats: { created: number },
): Promise<number | null> => {
  if (!roasteryName) return null;

  const existing = await db
    .select()
    .from(roasteryTable)
    .where(eq(roasteryTable.name, roasteryName));

  if (existing.length > 0) {
    return existing[0].id;
  }

  const result = await db
    .insert(roasteryTable)
    .values({ name: roasteryName })
    .returning();

  stats.created++;
  return result[0].id;
};

const findOrCreateTaste = async (
  db: ExpoSQLiteDatabase,
  flavor: string,
  stats: { created: number },
): Promise<number> => {
  const existing = await db
    .select()
    .from(beanTasteTable)
    .where(eq(beanTasteTable.flavor, flavor));

  if (existing.length > 0) {
    return existing[0].id;
  }

  const result = await db.insert(beanTasteTable).values({ flavor }).returning();

  stats.created++;
  return result[0].id;
};

const checkBeanDuplicate = async (
  db: ExpoSQLiteDatabase,
  beanName: string,
): Promise<DuplicateInfo | null> => {
  const existingBeans = await db.select().from(beanTable);

  for (const existingBean of existingBeans) {
    if (beanName.toLowerCase() === existingBean.name.toLowerCase()) {
      return {
        beanName,
        reason: "Exact match",
      };
    }

    const similarity = calculateSimilarity(beanName, existingBean.name);
    if (similarity >= SIMILARITY_THRESHOLD) {
      return {
        beanName,
        reason: `Similar to "${existingBean.name}"`,
        similarity: Math.round(similarity),
      };
    }
  }

  return null;
};

export const importData = async (
  db: ExpoSQLiteDatabase,
  jsonData: string,
  options: { skipDuplicates: boolean } = { skipDuplicates: true },
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    beansCreated: 0,
    beansSkipped: 0,
    roasteriesCreated: 0,
    tastesCreated: 0,
    errors: [],
    duplicates: [],
  };

  try {
    const parsedData = JSON.parse(jsonData);
    const validatedData = validateImportData(parsedData);

    const roasteryStats = { created: 0 };
    const tasteStats = { created: 0 };

    for (const beanData of validatedData.beans) {
      try {
        const duplicate = await checkBeanDuplicate(db, beanData.name);

        if (duplicate) {
          result.duplicates.push(duplicate);
          if (options.skipDuplicates) {
            result.beansSkipped++;
            continue;
          }
        }

        const roasteryId = await findOrCreateRoastery(
          db,
          beanData.roasteryName,
          roasteryStats,
        );

        const insertedBean = await db
          .insert(beanTable)
          .values({
            name: beanData.name,
            robustaAmount: beanData.robustaAmount,
            arabicaAmount: beanData.arabicaAmount,
            roastery: roasteryId,
            degreeOfGrinding: beanData.degreeOfGrinding,
            singleShotDosis: beanData.singleShotDosis,
            doubleShotDosis: beanData.doubleShotDosis,
            isFavorit: beanData.isFavorit,
            aromaFruity: beanData.aromaFruity,
            aromaFloral: beanData.aromaFloral,
            aromaSweet: beanData.aromaSweet,
            aromaNutty: beanData.aromaNutty,
            aromaSpices: beanData.aromaSpices,
            aromaRoasted: beanData.aromaRoasted,
            aromaGreen: beanData.aromaGreen,
            aromaSour: beanData.aromaSour,
            aromaOther: beanData.aromaOther,
          })
          .returning();

        const beanId = insertedBean[0].id;

        for (const flavor of beanData.tastes) {
          const tasteId = await findOrCreateTaste(db, flavor, tasteStats);
          await db.insert(beanTasteAssociationTable).values({
            beanId,
            tasteId,
          });
        }

        result.beansCreated++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        result.errors.push(
          `Failed to import bean "${beanData.name}": ${errorMessage}`,
        );
      }
    }

    result.roasteriesCreated = roasteryStats.created;
    result.tastesCreated = tasteStats.created;
    result.success = result.errors.length === 0;

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`Import failed: ${errorMessage}`);
    return result;
  }
};
