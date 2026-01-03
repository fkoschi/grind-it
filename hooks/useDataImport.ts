import { useDatabase } from "@/provider/DatabaseProvider";
import { importData, ImportResult } from "@/utils/dataImport";
import { useState } from "react";

interface UseDataImportReturn {
  importData: (
    jsonData: string,
    skipDuplicates?: boolean
  ) => Promise<ImportResult | null>;
  isImporting: boolean;
  lastResult: ImportResult | null;
  error: string | null;
}

export const useDataImport = (): UseDataImportReturn => {
  const { db } = useDatabase();
  const [isImporting, setIsImporting] = useState(false);
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performImport = async (
    jsonData: string,
    skipDuplicates: boolean = true
  ): Promise<ImportResult | null> => {
    setIsImporting(true);
    setError(null);

    try {
      const result = await importData(db, jsonData, { skipDuplicates });
      setLastResult(result);

      if (!result.success && result.errors.length > 0) {
        setError(result.errors.join(", "));
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error("Import failed:", err);
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importData: performImport,
    isImporting,
    lastResult,
    error,
  };
};
