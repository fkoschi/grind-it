import { FC, ReactNode } from "react";
import { Alert, Linking } from "react-native";
import { Button, Input, ScrollView, Spinner, Text, XStack, YStack } from "tamagui";
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
  onClose: () => void;
  t: (key: string) => string;
};

const OPENAI_KEYS_URL = "https://platform.openai.com/api-keys";
const CLAUDE_KEYS_URL = "https://console.anthropic.com/settings/keys";

type SectionCardProps = {
  title?: string;
  children: ReactNode;
};

const SectionCard: FC<SectionCardProps> = ({ title, children }) => (
  <YStack gap="$2" backgroundColor="white" borderRadius="$6" p="$3">
    {title ? (
      <Text fontSize={16} fontWeight="700">
        {title}
      </Text>
    ) : null}
    {children}
  </YStack>
);

type ProviderTabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

const ProviderTabButton: FC<ProviderTabButtonProps> = ({ label, isActive, onPress }) => (
  <Button
    flex={1}
    borderRadius="$5"
    backgroundColor={isActive ? "white" : "transparent"}
    color={isActive ? "$color12" : "$copyText"}
    borderWidth={isActive ? 1 : 0}
    borderColor={isActive ? "$gray6" : "transparent"}
    theme={isActive ? "active" : undefined}
    onPress={onPress}
  >
    {label}
  </Button>
);

type SetupStepListProps = {
  steps: string[];
};

const SetupStepList: FC<SetupStepListProps> = ({ steps }) => (
  <YStack gap="$2.5" mt="$1">
    {steps.map((step, index) => (
      <XStack key={step} gap="$2.5" alignItems="flex-start">
        <YStack
          width={22}
          height={22}
          borderRadius={11}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$gray3"
          mt={1}
        >
          <Text fontSize={11} fontWeight="700" color="$copyText">
            {index + 1}
          </Text>
        </YStack>
        <Text flex={1} color="$copyText">
          {step}
        </Text>
      </XStack>
    ))}
  </YStack>
);

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
  onClose,
  t,
}) => {
  const openExternal = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t("common.error"), t("settings.ai.openLinkError"));
    }
  };

  const isOpenAiSelected = provider === "openai";
  const isClaudeSelected = provider === "claude";
  const activeProviderTitle = isOpenAiSelected
    ? t("settings.ai.provider.openai.title")
    : isClaudeSelected
      ? t("settings.ai.provider.claude.title")
      : t("settings.ai.provider.onDevice.title");

  return (
    <ScrollView
      backgroundColor="$screenBackground"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 28,
        gap: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap="$1">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={18} fontWeight="700">
            {t("settings.ai.title")}
          </Text>
          <Button size="$2" variant="outlined" onPress={onClose}>
            {t("common.done")}
          </Button>
        </XStack>
        <Text color="$copyText">{t("settings.ai.intro")}</Text>
      </YStack>

      <SectionCard>
        <Text fontSize={12} color="$copyText">
          {t("common.currentSelection")} {activeProviderTitle}
        </Text>
        <Text fontSize={13} color="$copyText">
          {provider === "openai"
            ? t("settings.ai.provider.openai.description")
            : provider === "claude"
              ? t("settings.ai.provider.claude.description")
              : t("settings.ai.provider.onDevice.description")}
        </Text>
        <XStack mt="$2" p="$1" gap="$1" backgroundColor="$gray3" borderRadius="$6">
          <ProviderTabButton
            label={t("settings.ai.provider.onDevice.title")}
            isActive={provider === "on-device"}
            onPress={() => onProviderChange("on-device")}
          />
          <ProviderTabButton
            label={t("settings.ai.provider.openai.title")}
            isActive={provider === "openai"}
            onPress={() => onProviderChange("openai")}
          />
          <ProviderTabButton
            label={t("settings.ai.provider.claude.title")}
            isActive={provider === "claude"}
            onPress={() => onProviderChange("claude")}
          />
        </XStack>
      </SectionCard>

      {isOpenAiSelected ? (
        <>
          <SectionCard title={t("settings.ai.keys.title")}>
            <Text color="$copyText">{t("settings.ai.keys.description")}</Text>
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
          </SectionCard>

          <SectionCard title={t("settings.ai.setup.title")}>
            <YStack gap="$2" mt="$1">
              <Text fontWeight="700">{t("settings.ai.setup.openai.title")}</Text>
              <SetupStepList
                steps={[
                  t("settings.ai.setup.openai.step1"),
                  t("settings.ai.setup.openai.step2"),
                  t("settings.ai.setup.openai.step3"),
                ]}
              />
              <Button size="$2" onPress={() => openExternal(OPENAI_KEYS_URL)}>
                {t("settings.ai.setup.openai.openLink")}
              </Button>
            </YStack>
          </SectionCard>
        </>
      ) : isClaudeSelected ? (
        <>
          <SectionCard title={t("settings.ai.keys.title")}>
            <Text color="$copyText">{t("settings.ai.keys.description")}</Text>
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
          </SectionCard>

          <SectionCard title={t("settings.ai.setup.title")}>
            <YStack gap="$2" mt="$1">
              <Text fontWeight="700">{t("settings.ai.setup.claude.title")}</Text>
              <SetupStepList
                steps={[
                  t("settings.ai.setup.claude.step1"),
                  t("settings.ai.setup.claude.step2"),
                  t("settings.ai.setup.claude.step3"),
                ]}
              />
              <Button size="$2" onPress={() => openExternal(CLAUDE_KEYS_URL)}>
                {t("settings.ai.setup.claude.openLink")}
              </Button>
            </YStack>
          </SectionCard>
        </>
      ) : null}

      {(isOpenAiSelected || isClaudeSelected) && (
        <SectionCard>
          <XStack gap="$2.5" alignItems="center">
            <Text fontSize={16} fontWeight="700">
              {t("settings.ai.implications.title")}
            </Text>
          </XStack>
          <YStack gap="$2" pl="$1">
            <XStack gap="$2.5" alignItems="flex-start">
              <YStack width={8} height={8} borderRadius={4} backgroundColor="$accentAmber" mt={6} />
              <Text flex={1} color="$copyText">
                {t("settings.ai.implications.cloudData")}
              </Text>
            </XStack>
            <XStack gap="$2.5" alignItems="flex-start">
              <YStack width={8} height={8} borderRadius={4} backgroundColor="$accentAmber" mt={6} />
              <Text flex={1} color="$copyText">
                {t("settings.ai.implications.cloudCost")}
              </Text>
            </XStack>
            <XStack gap="$2.5" alignItems="flex-start">
              <YStack width={8} height={8} borderRadius={4} backgroundColor="$accentAmber" mt={6} />
              <Text flex={1} color="$copyText">
                {t("settings.ai.implications.security")}
              </Text>
            </XStack>
          </YStack>
        </SectionCard>
      )}
    </ScrollView>
  );
};
