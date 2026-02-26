import coffeeKb from "@/assets/coffee-kb.json";
import { chunkCorpus, chunkMarkdownEntry } from "@/kb/chunker";
import { configureEmbeddingModel, DeterministicEmbeddingModel, embedChunks } from "@/kb/embedding";
import { searchKbInMemory } from "@/kb/search";
import type { KbCorpusEntry } from "@/kb/types";

describe("KB chunking and retrieval", () => {
  beforeAll(() => {
    configureEmbeddingModel(new DeterministicEmbeddingModel());
  });

  test("chunks espresso-basics and retrieves troubleshooting context for sour espresso", async () => {
    const entries = coffeeKb as KbCorpusEntry[];
    const espressoBasics = entries.find((entry) => entry.id === "espresso-basics");

    expect(espressoBasics).toBeDefined();

    const chunksForBasics = chunkMarkdownEntry(espressoBasics!);
    expect(chunksForBasics.length).toBeGreaterThan(0);

    const allChunks = chunkCorpus(entries);
    const embeddedChunks = await embedChunks(allChunks);

    const candidates = allChunks.map((chunk, index) => ({
      chunk,
      embedding: embeddedChunks[index]?.embedding ?? [],
    }));

    const results = await searchKbInMemory("sour espresso", candidates, 5);

    expect(results.length).toBeGreaterThan(0);

    const troubleshootingResult = results.find(
      (result) => result.chunk.fileId === "espresso-troubleshooting",
    );

    expect(troubleshootingResult).toBeDefined();
    expect(troubleshootingResult?.score ?? 0).toBeGreaterThan(0.05);
  });
});
