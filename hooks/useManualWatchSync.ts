import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { useWatchSync } from "./useWatchSync";
import { useAllBeansForSync } from "./useAllBeansForSync";

/**
 * Hook for manually testing Watch sync
 * Use this in development to trigger sync on demand
 */
export function useManualWatchSync() {
  const { syncBeans } = useWatchSync();
  const { beans, roasteries } = useAllBeansForSync();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean;
    beansCount: number;
    error?: string;
  } | null>(null);

  const triggerSync = useCallback(async () => {
    if (Platform.OS !== "ios") {
      setLastSyncResult({
        success: false,
        beansCount: 0,
        error: "Watch sync only available on iOS",
      });
      return;
    }

    setIsSyncing(true);
    setLastSyncResult(null);

    try {
      console.log("📤 Manually triggering Watch sync...");
      console.log(`   Beans to sync: ${beans?.length || 0}`);
      console.log(`   Roasteries: ${roasteries?.length || 0}`);

      if (!beans || beans.length === 0) {
        setLastSyncResult({
          success: false,
          beansCount: 0,
          error: "No beans to sync",
        });
        setIsSyncing(false);
        return;
      }

      await syncBeans(beans, roasteries);

      setLastSyncResult({
        success: true,
        beansCount: beans.length,
      });

      console.log("✅ Manual sync completed successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastSyncResult({
        success: false,
        beansCount: beans?.length || 0,
        error: errorMessage,
      });

      console.error("❌ Manual sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [beans, roasteries, syncBeans]);

  const getWatchStatus = useCallback(() => {
    if (Platform.OS !== "ios") {
      return { paired: false, reachable: false };
    }

    try {
      const WatchConnectivity = require("../modules/watch-connectivity");
      return {
        paired: WatchConnectivity.isPaired(),
        reachable: WatchConnectivity.isReachable(),
      };
    } catch (error) {
      console.error("Failed to get Watch status:", error);
      return { paired: false, reachable: false };
    }
  }, []);

  return {
    triggerSync,
    isSyncing,
    lastSyncResult,
    getWatchStatus,
    beansCount: beans?.length || 0,
  };
}
