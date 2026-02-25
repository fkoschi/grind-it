import { useCallback, useEffect, useState } from "react";
import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { configureKbRuntime, ensureCoffeeKnowledgeBaseIndexed } from "@/kb";
import { formatRagPromptContext } from "@/features/chat/utils/promptHelpers";

export const useChatKnowledgeBase = (db: ExpoSQLiteDatabase) => {
  const [isKbReady, setIsKbReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeKnowledgeBase = async () => {
      try {
        configureKbRuntime({ db });
        await ensureCoffeeKnowledgeBaseIndexed(db);
      } catch (error) {
        console.warn("KB indexing failed; chat will run without local RAG context.", error);
      } finally {
        if (mounted) {
          setIsKbReady(true);
        }
      }
    };

    initializeKnowledgeBase();

    return () => {
      mounted = false;
    };
  }, [db]);

  const getRagPromptContext = useCallback(
    async (query: string): Promise<string | null> => {
      if (!isKbReady) return null;

      try {
        return await formatRagPromptContext(query);
      } catch (error) {
        console.warn("RAG context build failed; continuing without retrieved context.", error);
        return null;
      }
    },
    [isKbReady],
  );

  return {
    isKbReady,
    getRagPromptContext,
  };
};
