import type { KbChunk } from "@/kb/types";

const DEFAULT_MODEL_NAME = "executorch/all-MiniLM-L6-v2";
const FALLBACK_DIMENSIONS = 384;

export interface EmbeddingModel {
  readonly modelName: string;
  embed(texts: string[]): Promise<number[][]>;
}

export type EmbeddingBackend = "executorch" | "fallback" | "deterministic" | "unknown";

export type EmbeddingDiagnostics = {
  configuredModelName: string;
  activeModelName: string;
  backend: EmbeddingBackend;
  embeddingDimensions: number | null;
  lastError: string | null;
};

const embeddingDiagnostics: EmbeddingDiagnostics = {
  configuredModelName: DEFAULT_MODEL_NAME,
  activeModelName: "unknown",
  backend: "unknown",
  embeddingDimensions: null,
  lastError: null,
};

const updateDiagnostics = (
  values: Partial<EmbeddingDiagnostics> & { embedding?: number[] | null },
) => {
  if (typeof values.configuredModelName === "string") {
    embeddingDiagnostics.configuredModelName = values.configuredModelName;
  }
  if (typeof values.activeModelName === "string") {
    embeddingDiagnostics.activeModelName = values.activeModelName;
  }
  if (values.backend) {
    embeddingDiagnostics.backend = values.backend;
  }
  if (Object.prototype.hasOwnProperty.call(values, "embedding")) {
    embeddingDiagnostics.embeddingDimensions = values.embedding ? values.embedding.length : null;
  }
  if (Object.prototype.hasOwnProperty.call(values, "lastError")) {
    embeddingDiagnostics.lastError = values.lastError ?? null;
  }
};

export const getEmbeddingDiagnostics = (): EmbeddingDiagnostics => ({
  ...embeddingDiagnostics,
});

const normalizeVector = (vector: number[]): number[] => {
  const norm = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
  if (norm === 0) return vector;
  return vector.map((value) => value / norm);
};

const hashToken = (token: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export class DeterministicEmbeddingModel implements EmbeddingModel {
  readonly modelName = "deterministic-hash-v1";

  constructor(private readonly dimensions = FALLBACK_DIMENSIONS) {}

  async embed(texts: string[]): Promise<number[][]> {
    const vectors = texts.map((text) => {
      const vector = new Array<number>(this.dimensions).fill(0);
      const tokens = tokenize(text);

      for (const token of tokens) {
        const tokenHash = hashToken(token);
        const position = tokenHash % this.dimensions;
        const sign = (tokenHash & 1) === 0 ? 1 : -1;

        vector[position] += sign;
      }

      return normalizeVector(vector);
    });

    updateDiagnostics({
      configuredModelName: this.modelName,
      activeModelName: this.modelName,
      backend: "deterministic",
      embedding: vectors[0] ?? null,
      lastError: null,
    });

    return vectors;
  }
}

type ResourceSource = string | number | object;

type ExecuTorchEmbeddingModelSource = {
  modelSource: ResourceSource;
  tokenizerSource: ResourceSource;
};

type TextEmbeddingsModuleLike = {
  load: (...args: any[]) => Promise<void>;
  forward: (input: string) => Promise<number[]>;
};

const isExecuTorchModelSource = (value: unknown): value is ExecuTorchEmbeddingModelSource => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return "modelSource" in candidate && "tokenizerSource" in candidate;
};

const resolveExecuTorchModelSource = (
  runtime: Record<string, unknown>,
): ExecuTorchEmbeddingModelSource => {
  const combinedModel = runtime.ALL_MINILM_L6_V2;
  if (isExecuTorchModelSource(combinedModel)) {
    return combinedModel;
  }

  const modelSource =
    runtime.ALL_MINILM_L6_V2 ?? runtime.All_MINILM_L6_V2 ?? runtime.ALL_MINILM_L6_V2_MODEL;
  const tokenizerSource = runtime.ALL_MINILM_L6_V2_TOKENIZER ?? runtime.All_MINILM_L6_V2_TOKENIZER;

  if (!modelSource || !tokenizerSource) {
    throw new Error(
      "ExecuTorch text embedding model constants are unavailable (expected ALL_MINILM_L6_V2 and tokenizer source).",
    );
  }

  return {
    modelSource: modelSource as ResourceSource,
    tokenizerSource: tokenizerSource as ResourceSource,
  };
};

const resolveTextEmbeddingsModule = (
  runtime: Record<string, unknown>,
): TextEmbeddingsModuleLike => {
  const moduleCandidate = runtime.TextEmbeddingsModule as unknown;

  if (!moduleCandidate) {
    throw new Error("TextEmbeddingsModule is not exported by react-native-executorch.");
  }

  if (typeof moduleCandidate === "function") {
    const staticCandidate = moduleCandidate as unknown as TextEmbeddingsModuleLike;
    if (
      typeof staticCandidate.load === "function" &&
      typeof staticCandidate.forward === "function"
    ) {
      return staticCandidate;
    }

    const instance = new (moduleCandidate as new () => unknown)() as TextEmbeddingsModuleLike;
    if (typeof instance.load === "function" && typeof instance.forward === "function") {
      return instance;
    }
  }

  if (typeof moduleCandidate === "object") {
    const objectCandidate = moduleCandidate as TextEmbeddingsModuleLike;
    if (
      typeof objectCandidate.load === "function" &&
      typeof objectCandidate.forward === "function"
    ) {
      return objectCandidate;
    }
  }

  throw new Error("Unsupported TextEmbeddingsModule API shape in react-native-executorch.");
};

const loadExecuTorchEmbeddingModule = async (
  module: TextEmbeddingsModuleLike,
  model: ExecuTorchEmbeddingModelSource,
) => {
  try {
    // Newer API: load({ modelSource, tokenizerSource }, onDownloadProgress?)
    await module.load(model);
    return;
  } catch {
    // Legacy API: load(modelSource, tokenizerSource)
    await module.load(model.modelSource, model.tokenizerSource);
  }
};

export class ExecuTorchEmbeddingModel implements EmbeddingModel {
  readonly modelName: string;

  private modulePromise: Promise<TextEmbeddingsModuleLike> | null = null;
  private readonly fallbackModel = new DeterministicEmbeddingModel();

  constructor(modelName = DEFAULT_MODEL_NAME) {
    this.modelName = modelName;
    updateDiagnostics({
      configuredModelName: modelName,
      activeModelName: modelName,
    });
  }

  private async getModule(): Promise<TextEmbeddingsModuleLike> {
    if (this.modulePromise) return this.modulePromise;

    this.modulePromise = (async () => {
      const runtime = (await import("react-native-executorch")) as Record<string, unknown>;
      const modelSource = resolveExecuTorchModelSource(runtime);
      const module = resolveTextEmbeddingsModule(runtime);

      await loadExecuTorchEmbeddingModule(module, modelSource);
      return module;
    })();

    return this.modulePromise;
  }

  async embed(texts: string[]): Promise<number[][]> {
    try {
      const module = await this.getModule();
      const vectors = await Promise.all(
        texts.map(async (text) => normalizeVector(await module.forward(text))),
      );

      updateDiagnostics({
        configuredModelName: this.modelName,
        activeModelName: this.modelName,
        backend: "executorch",
        embedding: vectors[0] ?? null,
        lastError: null,
      });

      return vectors;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.warn(
        "ExecuTorch embedding model failed to initialize; falling back to deterministic embeddings.",
        error,
      );

      const vectors = await this.fallbackModel.embed(texts);

      updateDiagnostics({
        configuredModelName: this.modelName,
        activeModelName: this.fallbackModel.modelName,
        backend: "fallback",
        embedding: vectors[0] ?? null,
        lastError: errorMessage,
      });

      return vectors;
    }
  }
}

// Backward-compatible alias for callers expecting OnDeviceEmbeddingModel.
export class OnDeviceEmbeddingModel extends ExecuTorchEmbeddingModel {}

let activeEmbeddingModel: EmbeddingModel = new ExecuTorchEmbeddingModel();

export const configureEmbeddingModel = (embeddingModel: EmbeddingModel) => {
  activeEmbeddingModel = embeddingModel;
  updateDiagnostics({
    configuredModelName: embeddingModel.modelName,
    activeModelName: embeddingModel.modelName,
    backend: embeddingModel.modelName === "deterministic-hash-v1" ? "deterministic" : "unknown",
    embedding: null,
    lastError: null,
  });
};

export const getEmbeddingModel = (): EmbeddingModel => activeEmbeddingModel;

export const embedChunks = async (
  chunks: KbChunk[],
): Promise<{ chunkId: string; embedding: number[] }[]> => {
  if (chunks.length === 0) return [];

  const vectors = await activeEmbeddingModel.embed(chunks.map((chunk) => chunk.text));

  return chunks.map((chunk, index) => ({
    chunkId: chunk.id,
    embedding: vectors[index] ?? [],
  }));
};

export const embedQuery = async (query: string): Promise<number[]> => {
  const [embedding] = await activeEmbeddingModel.embed([query]);
  return embedding ?? [];
};

export const initializeEmbeddingRuntime = async (): Promise<void> => {
  // Warm-up once so the first real query avoids model-load latency.
  await activeEmbeddingModel.embed(["embedding runtime warmup"]);
};
