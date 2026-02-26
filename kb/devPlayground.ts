import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { getEmbeddingDiagnostics } from "@/kb/embedding";
import { ingestCoffeeKnowledgeBase } from "@/kb/ingest";
import { configureKbRuntime } from "@/kb/runtime";
import { buildRagContextForQuery } from "@/kb/rag";

export const runKbDevPlayground = async (db: ExpoSQLiteDatabase) => {
  configureKbRuntime({ db });

  const ingestion = await ingestCoffeeKnowledgeBase(db, {
    clearExisting: true,
  });

  const context = await buildRagContextForQuery("How do I fix sour espresso?");

  console.log("[KB] Ingestion complete", ingestion);
  console.log(
    "[KB] Top chunks",
    context.retrievedChunks.map((entry) => ({
      chunkId: entry.chunk.id,
      fileId: entry.chunk.fileId,
      heading: entry.chunk.heading,
      score: entry.score,
    })),
  );
  console.log("[KB] Embedding diagnostics", getEmbeddingDiagnostics());

  return {
    ingestion,
    context,
    diagnostics: getEmbeddingDiagnostics(),
  };
};
