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

const AROMA_LABELS: Record<string, string> = {
  aromaFruity: "Fruity",
  aromaFloral: "Floral",
  aromaSweet: "Sweet",
  aromaNutty: "Nutty",
  aromaSpices: "Spices",
  aromaRoasted: "Roasted",
  aromaGreen: "Green",
  aromaSour: "Sour",
  aromaOther: "Other",
};

const aromaRating = (value: number | null | undefined): string => {
  if (value == null || value <= 0) return "";
  if (value <= 33) return "";
  if (value <= 66) return "+";
  if (value <= 84) return "++";
  return "+++";
};

export type BeanContextRow = {
  name: string | null;
  roastery?: string | null;
  arabicaAmount?: number | null;
  robustaAmount?: number | null;
  degreeOfGrinding?: number | null;
  singleShotDosis?: number | null;
  doubleShotDosis?: number | null;
  aromaFruity?: number | null;
  aromaFloral?: number | null;
  aromaSweet?: number | null;
  aromaNutty?: number | null;
  aromaSpices?: number | null;
  aromaRoasted?: number | null;
  aromaGreen?: number | null;
  aromaSour?: number | null;
  aromaOther?: number | null;
};

export const formatSingleBeanContext = (
  bean: BeanContextRow,
  tastes: { flavor: string }[],
): string => {
  const nameParts = [bean.name, bean.roastery ? `(${bean.roastery})` : null].filter(Boolean);
  const lines: string[] = [`Current bean: ${nameParts.join(" ")}`];

  const arabica = bean.arabicaAmount ?? 0;
  const robusta = bean.robustaAmount ?? 0;
  if (arabica > 0 || robusta > 0) {
    lines.push(`Varietal: Arabica ${arabica}%, Robusta ${robusta}%`);
  }

  const grindParts = [
    bean.degreeOfGrinding != null ? `Grind: ${bean.degreeOfGrinding}` : null,
    bean.singleShotDosis != null ? `Single: ${bean.singleShotDosis}g` : null,
    bean.doubleShotDosis != null ? `Double: ${bean.doubleShotDosis}g` : null,
  ].filter(Boolean);
  if (grindParts.length > 0) {
    lines.push(grindParts.join(" | "));
  }

  const aromaEntries = Object.entries(AROMA_LABELS)
    .map(([key, label]) => {
      const value = (bean as Record<string, number | null | undefined>)[key];
      return value != null && value > 0 ? `${label} ${value}` : null;
    })
    .filter((x): x is string => x !== null);
  if (aromaEntries.length > 0) {
    lines.push(`Aroma: ${aromaEntries.join(", ")}`);
  }

  if (tastes.length > 0) {
    lines.push(`Taste notes: ${tastes.map((t) => t.flavor).join(", ")}`);
  }

  return lines.join("\n");
};

export const formatAllBeansContext = (beans: BeanContextRow[]): string | null => {
  if (beans.length === 0) return null;

  const beanLines = beans.map((bean) => {
    const name = [bean.name, bean.roastery ? `(${bean.roastery})` : null].filter(Boolean).join(" ");

    const metaParts = [
      bean.degreeOfGrinding != null ? `grind ${bean.degreeOfGrinding}` : null,
      bean.doubleShotDosis != null ? `dose ${bean.doubleShotDosis}g` : null,
      bean.arabicaAmount != null ? `Arabica ${bean.arabicaAmount}%` : null,
    ].filter(Boolean);

    const aromaSummary = Object.entries(AROMA_LABELS)
      .map(([key, label]) => {
        const value = (bean as Record<string, number | null | undefined>)[key];
        const rating = aromaRating(value);
        return rating ? `${label}${rating}` : null;
      })
      .filter((x): x is string => x !== null)
      .join(" ");

    const metaStr = metaParts.join(", ");
    const suffix = [metaStr, aromaSummary ? `| ${aromaSummary}` : null].filter(Boolean).join(" ");

    return `- ${name}${suffix ? `: ${suffix}` : ""}`;
  });

  const header = `Bean collection (${beans.length} bean${beans.length !== 1 ? "s" : ""}):`;
  return [header, ...beanLines].join("\n");
};
