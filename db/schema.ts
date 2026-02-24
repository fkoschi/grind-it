import { int, real, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const roasteryTable = sqliteTable("roastery_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  website: text(),
  address: text(),
  latitude: real(),
  longitude: real(),
  rating: int(),
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
  roastery: int().references(() => roasteryTable.id),
  degreeOfGrinding: real(),
  singleShotDosis: real(),
  doubleShotDosis: real(),
  isFavorit: integer({ mode: "boolean" }),
  // Coffee aroma profile metrics (0-100)
  aromaFruity: int(),
  aromaFloral: int(),
  aromaSweet: int(),
  aromaNutty: int(),
  aromaSpices: int(),
  aromaRoasted: int(),
  aromaGreen: int(),
  aromaSour: int(),
  aromaOther: int(),
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

export const MachineType = {
  MANUAL_LEVER: "manual_lever",
  SPRING_LEVER: "spring_lever",
  SEMI_AUTOMATIC: "semi_automatic",
  AUTOMATIC: "automatic",
  SUPER_AUTOMATIC: "super_automatic",
  CAPSULE_POD: "capsule_pod",
  MOKA_POT: "moka_pot",
  POUR_OVER: "pour_over",
  FRENCH_PRESS: "french_press",
  AEROPRESS: "aeropress",
  SIPHON: "siphon",
  COLD_BREW: "cold_brew",
  TURKISH: "turkish",
  OTHER: "other",
} as const;

export type MachineType = (typeof MachineType)[keyof typeof MachineType];

export const INTEGRATED_GRINDER_TYPES: MachineType[] = [
  MachineType.SUPER_AUTOMATIC,
  MachineType.CAPSULE_POD,
];

export const machineTable = sqliteTable("machine_table", {
  id: int().primaryKey({ autoIncrement: true }),
  manufacturer: text().notNull(),
  name: text().notNull(),
  type: text().notNull(),
});

export const grinderTable = sqliteTable("grinder_table", {
  id: int().primaryKey({ autoIncrement: true }),
  manufacturer: text().notNull(),
  name: text().notNull(),
});
