import { FC } from "react";
import { Button, Input, Spinner, Text, XStack, YStack } from "tamagui";
import type { AiProvider } from "@/store/ai-provider-store";

type KeyEditorProps = {
  label: string;
  placeholder: string;
  value: string;
  hasKey: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onChangeValue: (value: string) => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  savedLabel: string;
  missingLabel: string;
  saveLabel: string;
  deleteLabel: string;
};

const KeyEditor: FC<KeyEditorProps> = ({
  label,
  placeholder,
  value,
  hasKey,
  isSaving,
  isDeleting,
  onChangeValue,
  onSave,
  onDelete,
  savedLabel,
  missingLabel,
  saveLabel,
  deleteLabel,
}) => (
  <YStack gap="$2">
    <Text fontSize={14} color="$copyText">
      {label}
    </Text>
    <Input
      secureTextEntry
      autoCapitalize="none"
      autoCorrect={false}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeValue}
    />
    <XStack gap="$2">
      <Button
        flex={1}
        onPress={onSave}
        disabled={isSaving}
        icon={isSaving ? () => <Spinner size="small" /> : undefined}
      >
        {saveLabel}
      </Button>
      <Button
        flex={1}
        variant="outlined"
        onPress={onDelete}
        disabled={!hasKey || isDeleting}
        icon={isDeleting ? () => <Spinner size="small" /> : undefined}
      >
        {deleteLabel}
      </Button>
    </XStack>
    <Text fontSize={12} color="$copyText">
      {hasKey ? savedLabel : missingLabel}
    </Text>
  </YStack>
);

type ChatAiConfigSheetProps = {
  provider: AiProvider;
  hasOpenAiApiKey: boolean;
  hasClaudeApiKey: boolean;
  openAiApiKeyInput: string;
  claudeApiKeyInput: string;
  isSavingOpenAiKey: boolean;
  isSavingClaudeKey: boolean;
  isDeletingOpenAiKey: boolean;
  isDeletingClaudeKey: boolean;
  onProviderChange: (provider: AiProvider) => Promise<void>;
  onOpenAiApiKeyInputChange: (value: string) => void;
  onClaudeApiKeyInputChange: (value: string) => void;
  onSaveOpenAiApiKey: () => Promise<void>;
  onSaveClaudeApiKey: () => Promise<void>;
  onDeleteOpenAiApiKey: () => Promise<void>;
  onDeleteClaudeApiKey: () => Promise<void>;
  t: (key: string) => string;
};

export const ChatAiConfigSheet: FC<ChatAiConfigSheetProps> = ({
  provider,
  hasOpenAiApiKey,
  hasClaudeApiKey,
  openAiApiKeyInput,
  claudeApiKeyInput,
  isSavingOpenAiKey,
  isSavingClaudeKey,
  isDeletingOpenAiKey,
  isDeletingClaudeKey,
  onProviderChange,
  onOpenAiApiKeyInputChange,
  onClaudeApiKeyInputChange,
  onSaveOpenAiApiKey,
  onSaveClaudeApiKey,
  onDeleteOpenAiApiKey,
  onDeleteClaudeApiKey,
  t,
}) => (
  <YStack p="$4" gap="$3" backgroundColor="$screenBackground">
    <YStack gap="$1">
      <Text fontSize={18} fontWeight="700">
        {t("settings.ai.title")}
      </Text>
      <Text color="$copyText">
        {provider === "openai"
          ? t("settings.ai.provider.openai.description")
          : provider === "claude"
            ? t("settings.ai.provider.claude.description")
            : t("settings.ai.provider.onDevice.description")}
      </Text>
    </YStack>

    <XStack gap="$2">
      <Button
        flex={1}
        theme={provider === "on-device" ? "active" : undefined}
        onPress={() => onProviderChange("on-device")}
      >
        {t("settings.ai.provider.onDevice.title")}
      </Button>
      <Button
        flex={1}
        theme={provider === "openai" ? "active" : undefined}
        onPress={() => onProviderChange("openai")}
      >
        {t("settings.ai.provider.openai.title")}
      </Button>
      <Button
        flex={1}
        theme={provider === "claude" ? "active" : undefined}
        onPress={() => onProviderChange("claude")}
      >
        {t("settings.ai.provider.claude.title")}
      </Button>
    </XStack>

    <KeyEditor
      label={t("settings.ai.openAiApiKeyLabel")}
      placeholder={t("settings.ai.openAiApiKeyPlaceholder")}
      value={openAiApiKeyInput}
      hasKey={hasOpenAiApiKey}
      isSaving={isSavingOpenAiKey}
      isDeleting={isDeletingOpenAiKey}
      onChangeValue={onOpenAiApiKeyInputChange}
      onSave={onSaveOpenAiApiKey}
      onDelete={onDeleteOpenAiApiKey}
      savedLabel={t("settings.ai.keyStatus.saved")}
      missingLabel={t("settings.ai.keyStatus.missing")}
      saveLabel={t("settings.ai.saveKey")}
      deleteLabel={t("settings.ai.deleteKey")}
    />

    <KeyEditor
      label={t("settings.ai.claudeApiKeyLabel")}
      placeholder={t("settings.ai.claudeApiKeyPlaceholder")}
      value={claudeApiKeyInput}
      hasKey={hasClaudeApiKey}
      isSaving={isSavingClaudeKey}
      isDeleting={isDeletingClaudeKey}
      onChangeValue={onClaudeApiKeyInputChange}
      onSave={onSaveClaudeApiKey}
      onDelete={onDeleteClaudeApiKey}
      savedLabel={t("settings.ai.keyStatus.saved")}
      missingLabel={t("settings.ai.keyStatus.missing")}
      saveLabel={t("settings.ai.saveKey")}
      deleteLabel={t("settings.ai.deleteKey")}
    />
  </YStack>
);
