import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { configureEmbeddingModel, type EmbeddingModel } from "@/kb/embedding";

let dbInstance: ExpoSQLiteDatabase | null = null;

export const configureKbRuntime = (options: {
  db: ExpoSQLiteDatabase;
  embeddingModel?: EmbeddingModel;
}) => {
  dbInstance = options.db;
  if (options.embeddingModel) {
    configureEmbeddingModel(options.embeddingModel);
  }
};

export const getKbDatabase = (): ExpoSQLiteDatabase => {
  if (!dbInstance) {
    throw new Error("KB runtime is not configured. Call configureKbRuntime({ db }) first.");
  }
  return dbInstance;
};
