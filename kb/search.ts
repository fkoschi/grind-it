import { and, eq } from "drizzle-orm";
import { kbChunksTable, kbEmbeddingsTable } from "@/db/schema";
import { embedQuery } from "@/kb/embedding";
import { getKbDatabase } from "@/kb/runtime";
import type { KbChunk, KbSearchFilter, RetrievedChunk } from "@/kb/types";

type CandidateEmbedding = {
  chunk: KbChunk;
  embedding: number[];
};

const parseTags = (tags: string): string[] => {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseEmbedding = (embedding: string): number[] => {
  try {
    const parsed = JSON.parse(embedding);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const cosineSimilarity = (queryEmbedding: number[], candidateEmbedding: number[]): number => {
  if (queryEmbedding.length === 0 || candidateEmbedding.length === 0) return 0;

  const dimensions = Math.min(queryEmbedding.length, candidateEmbedding.length);
  let dot = 0;
  let queryNorm = 0;
  let candidateNorm = 0;

  for (let i = 0; i < dimensions; i += 1) {
    const queryValue = queryEmbedding[i];
    const candidateValue = candidateEmbedding[i];

    dot += queryValue * candidateValue;
    queryNorm += queryValue * queryValue;
    candidateNorm += candidateValue * candidateValue;
  }

  const denominator = Math.sqrt(queryNorm) * Math.sqrt(candidateNorm);
  if (denominator === 0) return 0;

  return dot / denominator;
};

const scoreCandidates = (
  queryEmbedding: number[],
  candidates: CandidateEmbedding[],
  k = 5,
): RetrievedChunk[] =>
  candidates
    .map((candidate) => ({
      chunk: candidate.chunk,
      score: cosineSimilarity(queryEmbedding, candidate.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

export const searchKbInMemory = async (
  query: string,
  candidates: CandidateEmbedding[],
  k = 5,
): Promise<RetrievedChunk[]> => {
  const queryEmbedding = await embedQuery(query);
  return scoreCandidates(queryEmbedding, candidates, k);
};

export const searchKb = async (
  query: string,
  filter?: KbSearchFilter,
  k = 5,
): Promise<RetrievedChunk[]> => {
  const db = getKbDatabase();

  const filterClause = and(
    filter?.topic ? eq(kbChunksTable.topic, filter.topic) : undefined,
    filter?.language ? eq(kbChunksTable.language, filter.language) : undefined,
  );

  const rows = await db
    .select({
      chunkId: kbEmbeddingsTable.chunkId,
      embedding: kbEmbeddingsTable.embedding,
      fileId: kbChunksTable.fileId,
      heading: kbChunksTable.heading,
      topic: kbChunksTable.topic,
      language: kbChunksTable.language,
      tags: kbChunksTable.tags,
      text: kbChunksTable.text,
    })
    .from(kbEmbeddingsTable)
    .innerJoin(kbChunksTable, eq(kbEmbeddingsTable.chunkId, kbChunksTable.id))
    .where(filterClause);

  const candidates: CandidateEmbedding[] = rows.map((row) => ({
    chunk: {
      id: row.chunkId,
      fileId: row.fileId,
      heading: row.heading,
      topic: row.topic,
      language: row.language as "en",
      tags: parseTags(row.tags),
      text: row.text,
    },
    embedding: parseEmbedding(row.embedding),
  }));

  return searchKbInMemory(query, candidates, k);
};
