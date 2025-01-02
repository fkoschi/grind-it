import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "./schema";
import { eq, sql, and, inArray, ne, notInArray } from "drizzle-orm";

const selectTastes = (db: ExpoSQLiteDatabase) =>
  db.select().from(beanTasteTable).prepare();

const selectTasteNotInArray = (
  db: ExpoSQLiteDatabase,
  filterBy: Array<number>
) => {
  const activeFilter = filterBy?.length > 0;

  return db
    .selectDistinct()
    .from(beanTasteTable)
    .where(activeFilter ? notInArray(beanTasteTable.id, filterBy) : sql`TRUE`)
    .prepare();
};

const selectTasteInArray = (
  db: ExpoSQLiteDatabase,
  filterBy: Array<number>
) => {
  const activeFilter = filterBy?.length > 0;

  return db
    .selectDistinct()
    .from(beanTasteTable)
    .where(activeFilter ? inArray(beanTasteTable.id, filterBy) : sql`TRUE`)
    .prepare();
};

const selectRoasteries = (db: ExpoSQLiteDatabase) =>
  db.select().from(roasteryTable).prepare();

const selectBeansBySearch = (db: ExpoSQLiteDatabase) =>
  db
    .selectDistinct({
      id: beanTable.id,
      name: beanTable.name,
      roastery: roasteryTable.name,
      degreeOfGrinding: beanTable.degreeOfGrinding,
      isFavorite: beanTable.isFavorit,
    })
    .from(beanTable)
    .innerJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
    .where(sql`${beanTable.name} like ${sql.placeholder("search")}`)
    .prepare();

const selectBeansBySearchAndFilter = (
  db: ExpoSQLiteDatabase,
  beanTasteFilter: Array<number>
) => {
  const tasteFilter = beanTasteFilter?.filter((filter) => filter !== 0);
  const favoriteFilter = beanTasteFilter?.includes(0);

  return db
    .selectDistinct({
      id: beanTable.id,
      name: beanTable.name,
      roastery: roasteryTable.name,
      degreeOfGrinding: beanTable.degreeOfGrinding,
      isFavorite: beanTable.isFavorit,
    })
    .from(beanTable)
    .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
    .fullJoin(
      beanTasteAssociationTable,
      eq(beanTable.id, beanTasteAssociationTable.beanId)
    )
    .where(
      and(
        sql`${beanTable.name} like ${sql.placeholder("search")}`,
        favoriteFilter ? beanTable.isFavorit : sql`True`,
        tasteFilter.length > 0
          ? inArray(beanTasteAssociationTable.tasteId, tasteFilter)
          : sql`TRUE`
      )
    )
    .prepare();
};

export {
  selectTastes,
  selectBeansBySearch,
  selectTasteInArray,
  selectTasteNotInArray,
  selectBeansBySearchAndFilter,
  selectRoasteries,
};
