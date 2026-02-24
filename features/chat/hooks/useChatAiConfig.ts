import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  AiProvider,
  getClaudeApiKey,
  getOpenAiApiKey,
  useAiProviderStore,
} from "@/store/ai-provider-store";
import type { ProviderConfig } from "@/features/chat/transport/ProviderChatTransport";

type UseChatAiConfigParams = {
  t: (key: string) => string;
};

export const useChatAiConfig = ({ t }: UseChatAiConfigParams) => {
  const [isAiConfigSheetOpen, setIsAiConfigSheetOpen] = useState(false);
  const [openAiApiKeyInput, setOpenAiApiKeyInput] = useState("");
  const [claudeApiKeyInput, setClaudeApiKeyInput] = useState("");
  const [isSavingOpenAiKey, setIsSavingOpenAiKey] = useState(false);
  const [isSavingClaudeKey, setIsSavingClaudeKey] = useState(false);
  const [isDeletingOpenAiKey, setIsDeletingOpenAiKey] = useState(false);
  const [isDeletingClaudeKey, setIsDeletingClaudeKey] = useState(false);

  const {
    provider,
    hasOpenAiApiKey,
    hasClaudeApiKey,
    hydrate,
    setProvider,
    saveOpenAiApiKey,
    clearOpenAiApiKey,
    saveClaudeApiKey,
    clearClaudeApiKey,
  } = useAiProviderStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const getProviderConfig = useCallback(async (): Promise<ProviderConfig> => {
    if (provider === "openai") {
      return {
        provider,
        openAiApiKey: await getOpenAiApiKey(),
        claudeApiKey: null,
      };
    }

    if (provider === "claude") {
      return {
        provider,
        openAiApiKey: null,
        claudeApiKey: await getClaudeApiKey(),
      };
    }

    return {
      provider,
      openAiApiKey: null,
      claudeApiKey: null,
    };
  }, [provider]);

  const handleProviderChange = useCallback(
    async (nextProvider: AiProvider) => {
      if (nextProvider === "openai" && !hasOpenAiApiKey) {
        Alert.alert(
          t("settings.ai.errors.missingKey.title"),
          t("settings.ai.errors.missingKey.message"),
        );
        return;
      }

      if (nextProvider === "claude" && !hasClaudeApiKey) {
        Alert.alert(
          t("settings.ai.errors.missingClaudeKey.title"),
          t("settings.ai.errors.missingClaudeKey.message"),
        );
        return;
      }

      await setProvider(nextProvider);
    },
    [hasClaudeApiKey, hasOpenAiApiKey, setProvider, t],
  );

  const handleSaveOpenAiApiKey = useCallback(async () => {
    if (!openAiApiKeyInput.trim()) {
      Alert.alert(
        t("settings.ai.errors.missingKey.title"),
        t("settings.ai.errors.missingKey.message"),
      );
      return;
    }

    setIsSavingOpenAiKey(true);
    try {
      await saveOpenAiApiKey(openAiApiKeyInput);
      setOpenAiApiKeyInput("");
    } finally {
      setIsSavingOpenAiKey(false);
    }
  }, [openAiApiKeyInput, saveOpenAiApiKey, t]);

  const handleDeleteOpenAiApiKey = useCallback(async () => {
    setIsDeletingOpenAiKey(true);
    try {
      await clearOpenAiApiKey();
    } finally {
      setIsDeletingOpenAiKey(false);
    }
  }, [clearOpenAiApiKey]);

  const handleSaveClaudeApiKey = useCallback(async () => {
    if (!claudeApiKeyInput.trim()) {
      Alert.alert(
        t("settings.ai.errors.missingClaudeKey.title"),
        t("settings.ai.errors.missingClaudeKey.message"),
      );
      return;
    }

    setIsSavingClaudeKey(true);
    try {
      await saveClaudeApiKey(claudeApiKeyInput);
      setClaudeApiKeyInput("");
    } finally {
      setIsSavingClaudeKey(false);
    }
  }, [claudeApiKeyInput, saveClaudeApiKey, t]);

  const handleDeleteClaudeApiKey = useCallback(async () => {
    setIsDeletingClaudeKey(true);
    try {
      await clearClaudeApiKey();
    } finally {
      setIsDeletingClaudeKey(false);
    }
  }, [clearClaudeApiKey]);

  return {
    provider,
    hasOpenAiApiKey,
    hasClaudeApiKey,
    isAiConfigSheetOpen,
    setIsAiConfigSheetOpen,
    openAiApiKeyInput,
    claudeApiKeyInput,
    isSavingOpenAiKey,
    isSavingClaudeKey,
    isDeletingOpenAiKey,
    isDeletingClaudeKey,
    setOpenAiApiKeyInput,
    setClaudeApiKeyInput,
    getProviderConfig,
    handleProviderChange,
    handleSaveOpenAiApiKey,
    handleSaveClaudeApiKey,
    handleDeleteOpenAiApiKey,
    handleDeleteClaudeApiKey,
  };
};
