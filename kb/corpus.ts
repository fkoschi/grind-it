import type { KbCorpusEntry } from "@/kb/types";

const bundledCoffeeKb = require("@/assets/coffee-kb.json") as KbCorpusEntry[];

export const loadCoffeeKbEntries = async (): Promise<KbCorpusEntry[]> => {
  // Bundled JSON keeps ingestion fully offline and deterministic.
  return bundledCoffeeKb;
};
