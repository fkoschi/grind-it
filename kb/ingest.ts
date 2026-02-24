import { eq, sql } from "drizzle-orm";
import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { kbChunksTable, kbEmbeddingsTable } from "@/db/schema";
import { chunkCorpus } from "@/kb/chunker";
import { loadCoffeeKbEntries } from "@/kb/corpus";
import {
  configureEmbeddingModel,
  embedChunks,
  getEmbeddingModel,
  type EmbeddingModel,
} from "@/kb/embedding";
import type { KbChunk, KbCorpusEntry } from "@/kb/types";

export type KbIngestionResult = {
  chunkCount: number;
  embeddingCount: number;
};

const toChunkInsert = (chunk: KbChunk) => ({
  id: chunk.id,
  fileId: chunk.fileId,
  heading: chunk.heading,
  topic: chunk.topic,
  language: chunk.language,
  tags: JSON.stringify(chunk.tags),
  text: chunk.text,
});

export const ingestCoffeeKnowledgeBase = async (
  db: ExpoSQLiteDatabase,
  options?: {
    clearExisting?: boolean;
    entries?: KbCorpusEntry[];
    embeddingModel?: EmbeddingModel;
  },
): Promise<KbIngestionResult> => {
  if (options?.embeddingModel) {
    configureEmbeddingModel(options.embeddingModel);
  }

  const entries = options?.entries ?? (await loadCoffeeKbEntries());
  const chunks = chunkCorpus(entries);
  const modelName = options?.embeddingModel?.modelName ?? getEmbeddingModel().modelName;

  if (options?.clearExisting) {
    await db.delete(kbEmbeddingsTable);
    await db.delete(kbChunksTable);
  }

  for (const chunk of chunks) {
    await db
      .insert(kbChunksTable)
      .values(toChunkInsert(chunk))
      .onConflictDoUpdate({
        target: kbChunksTable.id,
        set: toChunkInsert(chunk),
      });
  }

  const embeddedChunks = await embedChunks(chunks);

  for (const embeddedChunk of embeddedChunks) {
    await db
      .insert(kbEmbeddingsTable)
      .values({
        id: embeddedChunk.chunkId,
        chunkId: embeddedChunk.chunkId,
        model: modelName,
        embedding: JSON.stringify(embeddedChunk.embedding),
      })
      .onConflictDoUpdate({
        target: kbEmbeddingsTable.id,
        set: {
          chunkId: embeddedChunk.chunkId,
          model: modelName,
          embedding: JSON.stringify(embeddedChunk.embedding),
        },
      });
  }

  return {
    chunkCount: chunks.length,
    embeddingCount: embeddedChunks.length,
  };
};

export const getChunkById = async (db: ExpoSQLiteDatabase, chunkId: string) => {
  const rows = await db.select().from(kbChunksTable).where(eq(kbChunksTable.id, chunkId));
  return rows[0] ?? null;
};

export const ensureCoffeeKnowledgeBaseIndexed = async (
  db: ExpoSQLiteDatabase,
  options?: {
    embeddingModel?: EmbeddingModel;
  },
): Promise<KbIngestionResult | null> => {
  const chunkCountResult = await db.select({ count: sql<number>`count(*)` }).from(kbChunksTable);
  const embeddingCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(kbEmbeddingsTable);

  const chunkCount = Number(chunkCountResult[0]?.count ?? 0);
  const embeddingCount = Number(embeddingCountResult[0]?.count ?? 0);

  if (chunkCount > 0 && embeddingCount > 0) {
    return null;
  }

  return ingestCoffeeKnowledgeBase(db, {
    clearExisting: true,
    embeddingModel: options?.embeddingModel,
  });
};
