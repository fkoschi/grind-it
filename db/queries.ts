import { db } from "@/services/db-service";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "./schema";
import { eq, sql, and, inArray, ne, notInArray } from "drizzle-orm";

const selectTastes = db.select().from(beanTasteTable).prepare();

const selectTasteNotInArray = (filterBy: Array<number>) => {
  const activeFilter = filterBy.length > 0;

  return db
    .select()
    .from(beanTasteTable)
    .where(activeFilter ? notInArray(beanTasteTable.id, filterBy) : sql`TRUE`)
    .prepare();
};

const selectTasteInArray = (filterBy: Array<number>) => {
  const activeFilter = filterBy.length > 0;

  return db
    .select()
    .from(beanTasteTable)
    /* .where(activeFilter ? inArray(beanTasteTable.id, filterBy) : sql`TRUE`) */
    .prepare();
};

const selectRoasteries = db.select().from(roasteryTable).prepare();

const selectBeansBySearch = db
  .selectDistinct({
    id: beanTable.id,
    name: beanTable.name,
    roastery: roasteryTable.name,
    isFavorite: beanTable.isFavorit,
  })
  .from(beanTable)
  .innerJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
  .where(sql`${beanTable.name} like ${sql.placeholder("search")}`)
  .prepare();

const selectBeansBySearchAndFilter = (beanTasteFilter: Array<number>) => {
  const tasteFilter = beanTasteFilter?.filter((filter) => filter !== 0);
  const favoriteFilter = beanTasteFilter?.includes(0);

  return db
    .selectDistinct({
      id: beanTable.id,
      name: beanTable.name,
      roastery: roasteryTable.name,
      isFavorite: beanTable.isFavorit,
    })
    .from(beanTable)
    .innerJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
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
