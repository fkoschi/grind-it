import { useEffect, useCallback } from "react";
import { Platform } from "react-native";

export function useWatchSync() {
  useEffect(() => {
    // Only activate on iOS
    if (Platform.OS !== "ios") {
      return;
    }

    // Activate session on mount
    (async () => {
      try {
        const WatchConnectivity = require("../modules/watch-connectivity");
        const result = await WatchConnectivity.activateSession();
        if (result) {
          console.log("✅ WatchConnectivity session activated");
        } else {
          console.warn("⚠️ WatchConnectivity not available on this device");
        }
      } catch (error) {
        console.error("Failed to activate WatchConnectivity:", error);
      }
    })();
  }, []);

  const syncBeans = useCallback(async (beans: any[], roasteries: any[]) => {
    // Only sync on iOS
    if (Platform.OS !== "ios") {
      return;
    }

    if (!beans || beans.length === 0) {
      console.log("No beans to sync");
      return;
    }

    try {
      const WatchConnectivity = require("../modules/watch-connectivity");

      // Check if Watch is paired
      const isPaired = await WatchConnectivity.isPaired();
      if (!isPaired) {
        console.log("Apple Watch not paired, skipping sync");
        return;
      }

      // Serialize beans with roastery names
      const beansWithRoastery = beans.map((bean) => {
        const roastery = roasteries?.find((r) => r.id === bean.roastery);
        return {
          id: bean.id,
          name: bean.name,
          roastery_name: roastery?.name || null,
          degree_of_grinding: bean.degreeOfGrinding,
          single_shot_dosis: bean.singleShotDosis,
          double_shot_dosis: bean.doubleShotDosis,
          arabica_amount: bean.arabicaAmount,
          robusta_amount: bean.robustaAmount,
          aroma_fruity: bean.aromaFruity,
          aroma_floral: bean.aromaFloral,
          aroma_sweet: bean.aromaSweet,
          aroma_nutty: bean.aromaNutty,
          aroma_spices: bean.aromaSpices,
          aroma_roasted: bean.aromaRoasted,
          aroma_green: bean.aromaGreen,
          aroma_sour: bean.aromaSour,
          aroma_other: bean.aromaOther,
        };
      });

      const beansJSON = JSON.stringify(beansWithRoastery);

      console.log(`📤 Sending ${beans.length} beans to Watch...`);
      console.log(`   JSON size: ${(beansJSON.length / 1024).toFixed(2)} KB`);

      await WatchConnectivity.sendBeans(beansJSON);

      console.log(`✅ Successfully queued ${beans.length} beans for Watch transfer`);
    } catch (error) {
      console.error("Failed to sync beans to Watch:", error);
    }
  }, []);

  return { syncBeans };
}
