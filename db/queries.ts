import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "./schema";
import { eq, sql, and, inArray, notInArray } from "drizzle-orm";

/**
 * List of prepared Queries
 */
const selectTasteNotInArray = (db: ExpoSQLiteDatabase, filterBy: number[]) => {
  const activeFilter = filterBy?.length > 0;

  return db
    .selectDistinct()
    .from(beanTasteTable)
    .where(activeFilter ? notInArray(beanTasteTable.id, filterBy) : sql`TRUE`)
    .prepare();
};

const selectTasteInArray = (db: ExpoSQLiteDatabase, filterBy: number[]) => {
  const activeFilter = filterBy?.length > 0;

  return db
    .selectDistinct()
    .from(beanTasteTable)
    .where(activeFilter ? inArray(beanTasteTable.id, filterBy) : sql`TRUE`)
    .prepare();
};

const selectRoasteries = (db: ExpoSQLiteDatabase) =>
  db.select().from(roasteryTable).prepare();

const queryBeansBySearchAndFilter = (
  db: ExpoSQLiteDatabase,
  beanTasteFilter: number[],
  search: string
) => {
  const tasteFilter = beanTasteFilter?.filter((filter) => filter !== 0);
  const hasFavoriteFilter = beanTasteFilter?.includes(0);

  return db
    .selectDistinct({
      id: beanTable.id,
      name: beanTable.name,
      roastery: roasteryTable.name,
      degreeOfGrinding: beanTable.degreeOfGrinding,
      singleShotDosis: beanTable.singleShotDosis,
      doubleShotDosis: beanTable.doubleShotDosis,
      isFavorite: beanTable.isFavorit,
    })
    .from(beanTable)
    .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
    .leftJoin(
      beanTasteAssociationTable,
      eq(beanTable.id, beanTasteAssociationTable.beanId)
    )
    .where(
      and(
        sql`${beanTable.name} like ${`%${search}%`}`,
        hasFavoriteFilter ? beanTable.isFavorit : undefined,
        tasteFilter.length > 0
          ? inArray(beanTasteAssociationTable.tasteId, tasteFilter)
          : undefined
      )
    );
};

const selectFilteredBeanTasteSuggestion = (
  db: ExpoSQLiteDatabase,
  beanTasteFilter: number[]
) =>
  db
    .select({ id: beanTasteTable.id, flavor: beanTasteTable.flavor })
    .from(beanTasteTable)
    .where(notInArray(beanTasteTable.id, beanTasteFilter))
    .prepare();

const selectBeanTasteById = (
  db: ExpoSQLiteDatabase,
  beanId: string | string[]
) =>
  db
    .select({ id: beanTasteTable.id, flavor: beanTasteTable.flavor })
    .from(beanTasteTable)
    .innerJoin(
      beanTasteAssociationTable,
      eq(beanTasteAssociationTable.tasteId, beanTasteTable.id)
    )
    .where(eq(beanTasteAssociationTable.beanId, Number(beanId)))
    .prepare();

export {
  selectTasteInArray,
  selectBeanTasteById,
  selectFilteredBeanTasteSuggestion,
  selectTasteNotInArray,
  queryBeansBySearchAndFilter,
  selectRoasteries,
};
