import { useDatabase } from "@/provider/DatabaseProvider";
import { exportAllData } from "@/utils/dataExport";
import { useState } from "react";

interface UseDataExportReturn {
  exportData: () => Promise<string | null>;
  isExporting: boolean;
  error: string | null;
}

export const useDataExport = (): UseDataExportReturn => {
  const { db } = useDatabase();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (): Promise<string | null> => {
    setIsExporting(true);
    setError(null);

    try {
      const jsonData = await exportAllData(db);
      return jsonData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error("Export failed:", err);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting,
    error,
  };
};
