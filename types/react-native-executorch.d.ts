declare module "react-native-executorch" {
  export type ResourceSource = string | number | object;

  export type EmbeddingModelSource = {
    modelSource: ResourceSource;
    tokenizerSource: ResourceSource;
  };

  export const ALL_MINILM_L6_V2: EmbeddingModelSource;
  export const ALL_MINILM_L6_V2_MODEL: ResourceSource;
  export const ALL_MINILM_L6_V2_TOKENIZER: ResourceSource;

  export const TextEmbeddingsModule: {
    load: (...args: any[]) => Promise<void>;
    forward: (input: string) => Promise<number[]>;
  };
}
