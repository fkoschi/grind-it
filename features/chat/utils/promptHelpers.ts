import { buildRagContextForQuery } from "@/kb";
import { truncate } from "@/features/chat/utils/chatHelpers";

export const normalizeLabel = (value?: string | null) => (value ? value.replace(/_/g, " ") : "");

export const buildEquipmentSummary = (
  machine: { manufacturer?: string | null; name?: string | null; type?: string | null } | null,
  grinder: { manufacturer?: string | null; name?: string | null } | null,
  labels: { machine: string; grinder: string },
  separator: string,
): string | null => {
  const machineLabel = [machine?.manufacturer, machine?.name].filter(Boolean).join(" ");
  const machineType = normalizeLabel(machine?.type);
  const machineValue = machineLabel || machineType;
  const machineSummary = machineValue ? `${labels.machine} ${machineValue}`.trim() : "";

  const grinderLabel = [grinder?.manufacturer, grinder?.name].filter(Boolean).join(" ");
  const grinderSummary = grinderLabel ? `${labels.grinder} ${grinderLabel}` : "";

  const summary = [machineSummary, grinderSummary].filter(Boolean).join(separator);
  return summary || null;
};

export const formatRagPromptContext = async (query: string): Promise<string | null> => {
  const ragContext = await buildRagContextForQuery(query);
  if (ragContext.retrievedChunks.length === 0) return null;

  const lines = ragContext.retrievedChunks.slice(0, 3).map((entry, index) => {
    const source = `${entry.chunk.fileId} / ${entry.chunk.heading}`;
    const chunkText = truncate(entry.chunk.text, 900);
    return `[${index + 1}] ${source}\n${chunkText}`;
  });

  return [
    "Domain knowledge (retrieved from local coffee KB):",
    ...lines,
    "Use this knowledge when relevant and prefer it over guesses.",
  ].join("\n\n");
};
