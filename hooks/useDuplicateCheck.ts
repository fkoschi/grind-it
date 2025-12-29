import { useDatabase } from "@/provider/DatabaseProvider";
import { calculateSimilarity } from "@/utils/fuzzyMatch";
import { useDebounce } from "@uidotdev/usehooks";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { useEffect, useState } from "react";

interface UseDuplicateCheckOptions {
  table: SQLiteTableWithColumns<any>;
  fieldName: string;
  similarityThreshold?: number;
}

interface UseDuplicateCheckReturn {
  duplicateError: string | null;
  checkInput: (input: string) => void;
  clearError: () => void;
}

/**
 * Custom hook for fuzzy duplicate detection in database entries.
 *
 * Checks user input against existing database entries using Levenshtein distance
 * to catch both exact matches and similar entries (typos, variations).
 *
 * @param options - Configuration object
 * @param options.table - The Drizzle table to check against
 * @param options.fieldName - The field name to compare (e.g., 'flavor', 'name')
 * @param options.similarityThreshold - Minimum similarity percentage to flag as duplicate (default: 80)
 *
 * @returns Object containing:
 * - duplicateError: Error message string or null
 * - checkInput: Function to trigger duplicate check for input value
 * - clearError: Function to clear the error state
 *
 * @example
 * ```tsx
 * const { duplicateError, checkInput, clearError } = useDuplicateCheck({
 *   table: beanTasteTable,
 *   fieldName: 'flavor',
 *   similarityThreshold: 80
 * });
 *
 * // In your input component
 * <Input
 *   onChangeText={(text) => {
 *     onChange(text);
 *     checkInput(text);
 *   }}
 *   borderColor={duplicateError ? "$red10" : undefined}
 * />
 * {duplicateError && <Text color="$red10">{duplicateError}</Text>}
 * ```
 */
export const useDuplicateCheck = ({
  table,
  fieldName,
  similarityThreshold = 80,
}: UseDuplicateCheckOptions): UseDuplicateCheckReturn => {
  const { db } = useDatabase();
  const [currentInput, setCurrentInput] = useState("");
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const debouncedInput = useDebounce(currentInput, 300);

  useEffect(() => {
    const checkDuplicates = async () => {
      if (!debouncedInput.trim()) {
        setDuplicateError(null);
        return;
      }

      try {
        const existingEntries = await db.select().from(table);

        for (const entry of existingEntries) {
          const existingValue = entry[fieldName];
          if (!existingValue || typeof existingValue !== "string") continue;

          const similarity = calculateSimilarity(debouncedInput, existingValue);

          // Exact match (case-insensitive)
          if (debouncedInput.toLowerCase() === existingValue.toLowerCase()) {
            setDuplicateError(
              `Der Geschmack "${existingValue}" existiert bereits.`,
            );
            return;
          }

          // Fuzzy match
          if (similarity >= similarityThreshold) {
            setDuplicateError(
              `Ähnlicher Geschmack "${existingValue}" existiert bereits.`,
            );
            return;
          }
        }

        setDuplicateError(null);
      } catch (error) {
        console.error("Error checking duplicates:", error);
        setDuplicateError(null);
      }
    };

    checkDuplicates();
  }, [debouncedInput, db, table, fieldName, similarityThreshold]);

  const checkInput = (input: string) => {
    setCurrentInput(input);
  };

  const clearError = () => {
    setCurrentInput("");
    setDuplicateError(null);
  };

  return {
    duplicateError,
    checkInput,
    clearError,
  };
};
