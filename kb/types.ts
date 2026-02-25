export type KbCorpusEntry = {
  id: string;
  fileName: string;
  text: string;
};

export type KbChunk = {
  id: string;
  fileId: string;
  heading: string;
  text: string;
  topic: string;
  language: "en";
  tags: string[];
};

export type KbEmbedding = {
  id: string;
  chunkId: string;
  model: string;
  embedding: number[];
};

export type KbSearchFilter = {
  topic?: string;
  language?: string;
};

export type RetrievedChunk = {
  chunk: KbChunk;
  score: number;
};

export type RagContext = {
  query: string;
  retrievedChunks: RetrievedChunk[];
};
