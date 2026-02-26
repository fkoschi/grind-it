import type { KbChunk, KbCorpusEntry } from "@/kb/types";

const MIN_WORDS_PER_CHUNK = 150;
const MAX_WORDS_PER_CHUNK = 400;

type MarkdownSection = {
  heading: string;
  headingLine: string;
  content: string;
};

const wordCount = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
};

const normalizeHeadingText = (headingLine: string): string =>
  headingLine.replace(/^#{1,6}\s+/, "").trim() || "Section";

const splitIntoSectionsByHeading = (markdown: string): MarkdownSection[] => {
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];

  let currentHeadingLine = "## Overview";
  let currentHeading = "Overview";
  let buffer: string[] = [];

  const flush = () => {
    const content = buffer.join("\n").trim();
    if (!content) return;

    sections.push({
      heading: currentHeading,
      headingLine: currentHeadingLine,
      content,
    });
    buffer = [];
  };

  for (const line of lines) {
    if (/^#{1}\s+/.test(line) && currentHeading === "Overview" && buffer.length === 0) {
      currentHeading = normalizeHeadingText(line);
      currentHeadingLine = `## ${currentHeading}`;
      continue;
    }

    if (/^#{2,3}\s+/.test(line)) {
      flush();
      currentHeading = normalizeHeadingText(line);
      currentHeadingLine = line;
      continue;
    }

    buffer.push(line);
  }

  flush();

  if (sections.length === 0) {
    const fallback = markdown.trim();
    if (!fallback) return [];
    return [
      {
        heading: "Overview",
        headingLine: "## Overview",
        content: fallback,
      },
    ];
  }

  return sections;
};

const splitLongSection = (section: MarkdownSection): string[] => {
  const fullText = `${section.headingLine}\n\n${section.content}`.trim();
  if (wordCount(fullText) <= MAX_WORDS_PER_CHUNK) {
    return [fullText];
  }

  const paragraphs = section.content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return [fullText];
  }

  const output: string[] = [];
  let currentParagraphs: string[] = [];

  const flushCurrent = () => {
    if (currentParagraphs.length === 0) return;
    output.push(`${section.headingLine}\n\n${currentParagraphs.join("\n\n")}`.trim());
    currentParagraphs = [];
  };

  for (const paragraph of paragraphs) {
    const candidateParagraphs = [...currentParagraphs, paragraph];
    const candidateText = `${section.headingLine}\n\n${candidateParagraphs.join("\n\n")}`;
    const candidateWords = wordCount(candidateText);

    if (candidateWords <= MAX_WORDS_PER_CHUNK) {
      currentParagraphs = candidateParagraphs;
      continue;
    }

    const currentText = `${section.headingLine}\n\n${currentParagraphs.join("\n\n")}`;
    if (wordCount(currentText) >= MIN_WORDS_PER_CHUNK) {
      flushCurrent();
      currentParagraphs.push(paragraph);
      continue;
    }

    // If the current chunk is still short, force-add the paragraph to avoid tiny fragments.
    currentParagraphs = candidateParagraphs;
    flushCurrent();
  }

  flushCurrent();
  return output;
};

const inferTopicFromFileId = (fileId: string): string => {
  if (fileId.includes("troubleshooting")) return "troubleshooting";
  if (fileId.includes("water")) return "water";
  if (fileId.includes("science")) return "science";
  return fileId;
};

export const chunkMarkdownEntry = (entry: KbCorpusEntry): KbChunk[] => {
  const sections = splitIntoSectionsByHeading(entry.text);
  const chunks: KbChunk[] = [];

  let sectionIndex = 0;

  for (const section of sections) {
    const splitSections = splitLongSection(section);

    for (const sectionText of splitSections) {
      sectionIndex += 1;
      chunks.push({
        id: `${entry.id}#section-${sectionIndex}`,
        fileId: entry.id,
        heading: section.heading,
        text: sectionText,
        topic: inferTopicFromFileId(entry.id),
        language: "en",
        tags: [],
      });
    }
  }

  return chunks;
};

export const chunkCorpus = (entries: KbCorpusEntry[]): KbChunk[] =>
  entries.flatMap((entry) => chunkMarkdownEntry(entry));
