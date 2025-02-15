import { int, real, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const roasteryTable = sqliteTable("roastery_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const beanTasteTable = sqliteTable("bean_taste_table", {
  id: int().primaryKey({ autoIncrement: true }),
  flavor: text().notNull(),
});

export const beanTable = sqliteTable("bean_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  robustaAmount: int(),
  arabicaAmount: int(),
  singleShotAmount: real(),
  doubleShotAmount: real(),
  roastery: int().references(() => roasteryTable.id),
  degreeOfGrinding: real(),
  isFavorit: integer({ mode: "boolean" }),
});

// Junction table for many-to-many relationship between beans and tastes
export const beanTasteAssociationTable = sqliteTable("bean_taste_association", {
  id: int().primaryKey({ autoIncrement: true }),
  beanId: int()
    .notNull()
    .references(() => beanTable.id), // Foreign key to beanTable
  tasteId: int()
    .notNull()
    .references(() => beanTasteTable.id), // Foreign key to beanTasteTable
});
