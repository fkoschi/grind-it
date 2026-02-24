import { FC, useRef, useEffect, useMemo } from "react";
import { Platform, ScrollView as RNScrollView } from "react-native";
import { View, YStack, ScrollView } from "tamagui";
import { useRouter } from "expo-router";
import { Chat } from "@/components/Chat";
import { useChat } from "@ai-sdk/react";
import {
  ChatTransport,
  UIMessage,
  UIMessageChunk,
  createUIMessageStream,
  convertToModelMessages,
  streamText,
} from "ai";
import { apple } from "@react-native-ai/apple";
import { ProFeatureOverlay } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "tamagui/linear-gradient";
import { useKeyboardHeight } from "@/hooks/useKeyboard";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import {
  ChatHeader,
  ChatEmptyState,
  ChatErrorBanner,
  ChatMessageList,
  ChatUnavailableBanner,
} from "@/components/Chat/ChatScreenParts";

const normalizeLabel = (value?: string | null) => (value ? value.replace(/_/g, " ") : "");

const buildEquipmentSummary = (
  machine: { manufacturer?: string | null; name?: string | null; type?: string | null } | null,
  grinder: { manufacturer?: string | null; name?: string | null } | null,
  labels: { machine: string; grinder: string },
  separator: string,
) => {
  const machineLabel = [machine?.manufacturer, machine?.name].filter(Boolean).join(" ");
  const machineType = normalizeLabel(machine?.type);
  const machineValue = machineLabel || machineType;
  const machineSummary = machineValue ? `${labels.machine} ${machineValue}`.trim() : "";

  const grinderLabel = [grinder?.manufacturer, grinder?.name].filter(Boolean).join(" ");
  const grinderSummary = grinderLabel ? `${labels.grinder} ${grinderLabel}` : "";

  const summary = [machineSummary, grinderSummary].filter(Boolean).join(separator);
  return summary || null;
};

class AppleChatTransport implements ChatTransport<UIMessage> {
  private readonly systemPrompt: string;
  private readonly getEquipmentContext: () => string | null;
  private readonly unavailableMessage: string;

  constructor(options: {
    systemPrompt: string;
    getEquipmentContext: () => string | null;
    unavailableMessage: string;
  }) {
    this.systemPrompt = options.systemPrompt;
    this.getEquipmentContext = options.getEquipmentContext;
    this.unavailableMessage = options.unavailableMessage;
  }

  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>["sendMessages"]>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    if (!apple.isAvailable()) {
      throw new Error(this.unavailableMessage);
    }

    const modelMessages = await convertToModelMessages(messages);

    const equipmentContext = this.getEquipmentContext();
    const systemPrompt = equipmentContext
      ? `${this.systemPrompt}\n\n${equipmentContext}`
      : this.systemPrompt;

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          model: apple(),
          system: systemPrompt,
          messages: modelMessages,
          abortSignal,
        });

        writer.merge(result.toUIMessageStream());
      },
      onError: (error) => {
        console.error(error);
        return error instanceof Error ? error.message : String(error);
      },
    });

    return stream;
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null;
  }
}

function getUnavailableReason(): "android" | "ios" | null {
  if (Platform.OS !== "ios") return "android";
  if (!apple.isAvailable()) return "ios";
  return null;
}

function getErrorMessage(error: Error, t: (key: string) => string): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("context window") || msg.includes("exceededcontextwindowsize")) {
    return t("chat.error.contextWindow");
  }
  return t("chat.error.generic");
}

const ChatPage: FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<RNScrollView>(null);
  const { machine, grinder } = useEquipmentData();

  const unavailableReason = useMemo(() => getUnavailableReason(), []);

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
  const appleUnavailableMessage = useMemo(() => t("chat.error.appleUnavailable"), [i18n.language]);
  const systemPrompt = useMemo(() => t("chat.systemPrompt"), [i18n.language]);

  const transport = useMemo(
    () =>
      new AppleChatTransport({
        systemPrompt,
        getEquipmentContext: () => equipmentContext,
        unavailableMessage: appleUnavailableMessage,
      }),
    // Recreate when language changes so the system prompt is always in the right language
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [systemPrompt, equipmentContext, appleUnavailableMessage],
  );

  const { messages, error, sendMessage, status } = useChat({
    transport,
    onError: (error) => console.error(error),
  });

  const keyboardHeight = useKeyboardHeight();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <View flex={1} backgroundColor="$screenBackground">
      <LinearGradient flex={1} colors={["#FFFFFF", "#F5E6D0"]} start={[0, 0]} end={[0, 1]}>
        {/* Header with Logo and Close Button — always rendered above the PRO overlay */}
        <ChatHeader onClose={() => router.back()} />

        <ProFeatureOverlay isPro={true}>
          <YStack flex={1} bgC="transparent" paddingBottom={keyboardHeight}>
            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              flex={1}
              contentContainerStyle={{
                paddingHorizontal: "$4",
                flexGrow: 1,
              }}
            >
              {/* Empty State */}
              {messages.length === 0 && <ChatEmptyState message={welcomeMessage} />}

              {/* Unavailability Banner */}
              {unavailableReason && (
                <ChatUnavailableBanner message={t(`chat.unavailable.${unavailableReason}`)} />
              )}

              <ChatMessageList messages={messages} />
            </ScrollView>

            {/* Inline error banner */}
            {error && <ChatErrorBanner message={getErrorMessage(error, t)} />}

            {/* Input */}
            <Chat.Input
              onSend={(text) => sendMessage({ text })}
              isLoading={status !== "ready"}
              disabled={unavailableReason !== null}
            />
          </YStack>
        </ProFeatureOverlay>
      </LinearGradient>
    </View>
  );
};

export default ChatPage;
