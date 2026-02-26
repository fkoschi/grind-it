import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type AiProvider = "on-device" | "openai" | "claude";

const AI_PROVIDER_KEY = "ai.provider";
const OPENAI_API_KEY = "ai.openai_api_key";
const CLAUDE_API_KEY = "ai.claude_api_key";

const DEFAULT_AI_PROVIDER: AiProvider = "on-device";

const readProviderFromStorage = async (): Promise<AiProvider> => {
  try {
    const value = await AsyncStorage.getItem(AI_PROVIDER_KEY);
    if (value === "openai" || value === "claude" || value === "on-device") return value;
    return DEFAULT_AI_PROVIDER;
  } catch {
    return DEFAULT_AI_PROVIDER;
  }
};

const writeProviderToStorage = async (provider: AiProvider): Promise<void> => {
  try {
    await AsyncStorage.setItem(AI_PROVIDER_KEY, provider);
  } catch {
    // Keep running with in-memory value if persistence fails.
  }
};

export const getOpenAiApiKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(OPENAI_API_KEY);
  } catch {
    return null;
  }
};

export const getClaudeApiKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(CLAUDE_API_KEY);
  } catch {
    return null;
  }
};

const setOpenAiApiKey = async (apiKey: string): Promise<void> => {
  await SecureStore.setItemAsync(OPENAI_API_KEY, apiKey, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};

const setClaudeApiKey = async (apiKey: string): Promise<void> => {
  await SecureStore.setItemAsync(CLAUDE_API_KEY, apiKey, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};

const deleteOpenAiApiKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(OPENAI_API_KEY);
};

const deleteClaudeApiKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(CLAUDE_API_KEY);
};

type AiProviderState = {
  provider: AiProvider;
  hasOpenAiApiKey: boolean;
  hasClaudeApiKey: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setProvider: (provider: AiProvider) => Promise<void>;
  saveOpenAiApiKey: (apiKey: string) => Promise<void>;
  clearOpenAiApiKey: () => Promise<void>;
  saveClaudeApiKey: (apiKey: string) => Promise<void>;
  clearClaudeApiKey: () => Promise<void>;
};

export const useAiProviderStore = create<AiProviderState>((set) => ({
  provider: DEFAULT_AI_PROVIDER,
  hasOpenAiApiKey: false,
  hasClaudeApiKey: false,
  isHydrated: false,

  hydrate: async () => {
    const [provider, openAiApiKey, claudeApiKey] = await Promise.all([
      readProviderFromStorage(),
      getOpenAiApiKey(),
      getClaudeApiKey(),
    ]);

    set({
      provider,
      hasOpenAiApiKey: Boolean(openAiApiKey),
      hasClaudeApiKey: Boolean(claudeApiKey),
      isHydrated: true,
    });
  },

  setProvider: async (provider) => {
    await writeProviderToStorage(provider);
    set({ provider });
  },

  saveOpenAiApiKey: async (apiKey) => {
    const sanitizedApiKey = apiKey.trim();
    if (!sanitizedApiKey) {
      throw new Error("OpenAI API key is empty.");
    }

    await setOpenAiApiKey(sanitizedApiKey);
    set({ hasOpenAiApiKey: true });
  },

  clearOpenAiApiKey: async () => {
    await deleteOpenAiApiKey();
    set((state) => ({
      hasOpenAiApiKey: false,
      provider: state.provider === "openai" ? "on-device" : state.provider,
    }));
    await writeProviderToStorage("on-device");
  },

  saveClaudeApiKey: async (apiKey) => {
    const sanitizedApiKey = apiKey.trim();
    if (!sanitizedApiKey) {
      throw new Error("Claude API key is empty.");
    }

    await setClaudeApiKey(sanitizedApiKey);
    set({ hasClaudeApiKey: true });
  },

  clearClaudeApiKey: async () => {
    await deleteClaudeApiKey();
    set((state) => ({
      hasClaudeApiKey: false,
      provider: state.provider === "claude" ? "on-device" : state.provider,
    }));
    await writeProviderToStorage("on-device");
  },
}));
