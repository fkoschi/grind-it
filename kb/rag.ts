import { searchKb } from "@/kb/search";
import type { RagContext } from "@/kb/types";

export const buildRagContextForQuery = async (query: string): Promise<RagContext> => {
  const retrievedChunks = await searchKb(query, { language: "en" }, 5);

  return {
    query,
    retrievedChunks,
  };
};
