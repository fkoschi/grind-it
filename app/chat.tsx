import { FC, useEffect, useMemo, useRef } from "react";
import { Modal, Platform, ScrollView as RNScrollView } from "react-native";
import { ScrollView, View, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChat } from "@ai-sdk/react";
import { LinearGradient } from "tamagui/linear-gradient";
import { useTranslation } from "react-i18next";
import { apple } from "@react-native-ai/apple";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Chat } from "@/components/Chat";
import { ProFeatureOverlay } from "@/components/ui";
import {
  ChatEmptyState,
  ChatErrorBanner,
  ChatHeader,
  ChatMessageList,
  ChatUnavailableBanner,
} from "@/components/Chat/ChatScreenParts";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { useKeyboardHeight } from "@/hooks/useKeyboard";
import { ChatAiConfigSheet } from "@/features/chat/components/ChatAiConfigSheet";
import { useChatAiConfig } from "@/features/chat/hooks/useChatAiConfig";
import { useChatKnowledgeBase } from "@/features/chat/hooks/useChatKnowledgeBase";
import { ProviderChatTransport } from "@/features/chat/transport/ProviderChatTransport";
import { getChatErrorMessage } from "@/features/chat/utils/chatHelpers";
import { buildEquipmentSummary } from "@/features/chat/utils/promptHelpers";
import { useBeanChatContext } from "@/features/chat/hooks/useBeanChatContext";

const getOnDeviceUnavailableReason = (): "android" | "ios" | null => {
  if (Platform.OS !== "ios") return "android";
  if (!apple.isAvailable()) return "ios";
  return null;
};

const ChatPage: FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<RNScrollView>(null);
  const { machine, grinder } = useEquipmentData();
  const { db } = useDatabase();
  const { beanId } = useLocalSearchParams<{ beanId?: string }>();
  const beanContext = useBeanChatContext(beanId ? Number(beanId) : undefined);

  const keyboardHeight = useKeyboardHeight();
  const onDeviceUnavailableReason = useMemo(() => getOnDeviceUnavailableReason(), []);

  const {
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
  } = useChatAiConfig({ t });

  const { getRagPromptContext } = useChatKnowledgeBase(db);

  const equipmentLabels = useMemo(
    () => ({
      machine: t("equipment.machine"),
      grinder: t("equipment.grinder"),
    }),
    [i18n.language],
  );

  const equipmentSummary = useMemo(
    () => buildEquipmentSummary(machine, grinder, equipmentLabels, "; "),
    [machine, grinder, equipmentLabels],
  );

  const equipmentWelcome = useMemo(
    () => buildEquipmentSummary(machine, grinder, equipmentLabels, ", "),
    [machine, grinder, equipmentLabels],
  );

  const equipmentContext = useMemo(
    () => (equipmentSummary ? t("chat.equipment.context", { summary: equipmentSummary }) : null),
    [equipmentSummary, i18n.language],
  );

  const welcomeMessage = useMemo(
    () =>
      equipmentWelcome
        ? `${t("chat.welcome")}\n\n${t("chat.welcomeEquipmentLine", {
            equipment: equipmentWelcome,
          })}`
        : t("chat.welcome"),
    [equipmentWelcome, i18n.language],
  );

  const transport = useMemo(
    () =>
      new ProviderChatTransport({
        systemPrompt: t("chat.systemPrompt"),
        getEquipmentContext: () => equipmentContext,
        getBeanContext: () => beanContext,
        getRagPromptContext,
        getProviderConfig,
        unavailableMessage: t("chat.error.appleUnavailable"),
        missingOpenAiKeyMessage: t("chat.error.openAiMissingKey"),
        missingClaudeKeyMessage: t("chat.error.claudeMissingKey"),
      }),
    [equipmentContext, beanContext, getProviderConfig, getRagPromptContext, i18n.language],
  );

  const { messages, error, sendMessage, status } = useChat({
    transport,
    onError: (transportError: Error) => console.error(transportError),
  });

  useEffect(() => {
    if (messages.length === 0) return;

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const openAiUnavailable = provider === "openai" && !hasOpenAiApiKey ? "openaiNoKey" : null;
  const claudeUnavailable = provider === "claude" && !hasClaudeApiKey ? "claudeNoKey" : null;
  const onDeviceUnavailable = provider === "on-device" ? onDeviceUnavailableReason : null;
  const activeUnavailableReason = onDeviceUnavailable ?? openAiUnavailable ?? claudeUnavailable;

  return (
    <View flex={1} backgroundColor="$screenBackground">
      <LinearGradient flex={1} colors={["#FFFFFF", "#F5E6D0"]} start={[0, 0]} end={[0, 1]}>
        <ChatHeader
          onClose={() => router.back()}
          onOpenConfig={() => setIsAiConfigSheetOpen(true)}
        />

        <ProFeatureOverlay isPro={true}>
          <YStack flex={1} bgC="transparent" paddingBottom={keyboardHeight}>
            <ScrollView
              ref={scrollViewRef}
              flex={1}
              contentContainerStyle={{
                paddingHorizontal: "$4",
                flexGrow: 1,
              }}
            >
              {messages.length === 0 && <ChatEmptyState message={welcomeMessage} />}
              {activeUnavailableReason && (
                <ChatUnavailableBanner message={t(`chat.unavailable.${activeUnavailableReason}`)} />
              )}
              <ChatMessageList messages={messages} />
            </ScrollView>

            {error && <ChatErrorBanner message={getChatErrorMessage(error, t)} />}

            <Chat.Input
              onSend={(text) => sendMessage({ text })}
              isLoading={status !== "ready"}
              disabled={activeUnavailableReason !== null}
            />
          </YStack>
        </ProFeatureOverlay>
      </LinearGradient>

      <Modal
        visible={isAiConfigSheetOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsAiConfigSheetOpen(false)}
      >
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <View flex={1} backgroundColor="$screenBackground">
              <ChatAiConfigSheet
                provider={provider}
                hasOpenAiApiKey={hasOpenAiApiKey}
                hasClaudeApiKey={hasClaudeApiKey}
                openAiApiKeyInput={openAiApiKeyInput}
                claudeApiKeyInput={claudeApiKeyInput}
                isSavingOpenAiKey={isSavingOpenAiKey}
                isSavingClaudeKey={isSavingClaudeKey}
                isDeletingOpenAiKey={isDeletingOpenAiKey}
                isDeletingClaudeKey={isDeletingClaudeKey}
                onProviderChange={handleProviderChange}
                onOpenAiApiKeyInputChange={setOpenAiApiKeyInput}
                onClaudeApiKeyInputChange={setClaudeApiKeyInput}
                onSaveOpenAiApiKey={handleSaveOpenAiApiKey}
                onSaveClaudeApiKey={handleSaveClaudeApiKey}
                onDeleteOpenAiApiKey={handleDeleteOpenAiApiKey}
                onDeleteClaudeApiKey={handleDeleteClaudeApiKey}
                onClose={() => setIsAiConfigSheetOpen(false)}
                t={t}
              />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </View>
  );
};

export default ChatPage;
