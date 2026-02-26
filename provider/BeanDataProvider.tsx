import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDatabase } from "./DatabaseProvider";
import { beanTable } from "@/db/schema";
import { useWatchSync } from "@/hooks/useWatchSync";
import { useAllBeansForSync } from "@/hooks/useAllBeansForSync";
import { usePurchase } from "@/provider/PurchaseProvider";

interface BeanDataContextState {
  allBeans?: { id: number }[];
}

const BeanDataContext = createContext<BeanDataContextState | undefined>(undefined);

export const BeanDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { db } = useDatabase();

  // Query all beans once at the provider level - persists across routes
  const { data: allBeans } = useLiveQuery(db.select({ id: beanTable.id }).from(beanTable));

  // Watch sync integration (Pro only)
  const { isPro } = usePurchase();
  const { syncBeans } = useWatchSync();
  const { beans, roasteries } = useAllBeansForSync();

  // Debounce timer ref
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync beans to Watch when they change (with 2 second debounce, Pro only)
  useEffect(() => {
    if (!isPro) return;

    // Clear any existing timer
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    // Set new timer
    syncTimerRef.current = setTimeout(() => {
      if (beans && roasteries) {
        syncBeans(beans, roasteries).catch((error) => {
          console.error("Watch sync error:", error);
          // App continues functioning even if sync fails
        });
      }
    }, 2000); // 2 second debounce

    // Cleanup
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [beans, roasteries, syncBeans, isPro]);

  return <BeanDataContext.Provider value={{ allBeans }}>{children}</BeanDataContext.Provider>;
};

export const useBeanData = (): BeanDataContextState => {
  const context = useContext(BeanDataContext);
  if (!context) {
    throw new Error("useBeanData must be used within BeanDataProvider");
  }
  return context;
};
