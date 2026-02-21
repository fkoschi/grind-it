import { FC, useRef, useEffect, useMemo } from "react";
import { Platform, ScrollView as RNScrollView, Image } from "react-native";
import { View, YStack, Text, Button, ScrollView } from "tamagui";
import { useRouter } from "expo-router";
import { ChevronDown } from "@tamagui/lucide-icons";
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
import Markdown from "react-native-markdown-display";
import { ProFeatureOverlay } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "tamagui/linear-gradient";
import { useKeyboardHeight } from "@/hooks/useKeyboard";

class AppleChatTransport implements ChatTransport<UIMessage> {
  private readonly systemPrompt: string;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>["sendMessages"]>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    if (!apple.isAvailable()) {
      throw new Error(
        "Apple Intelligence is not available on this device. " +
          "Please ensure you are running on a physical iPhone with iOS 26+, " +
          "Apple Intelligence is enabled in Settings → Apple Intelligence & Siri, " +
          "and the language model has finished downloading.",
      );
    }

    const modelMessages = await convertToModelMessages(messages);

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          model: apple(),
          system: this.systemPrompt,
          messages: modelMessages,
          abortSignal,
        });

        writer.merge(result.toUIMessageStream());
      },
      onError: (error) => {
        console.error("Apple LLM error:", error);
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

  const unavailableReason = useMemo(() => getUnavailableReason(), []);

  const transport = useMemo(
    () => new AppleChatTransport(t("chat.systemPrompt")),
    // Recreate when language changes so the system prompt is always in the right language
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language],
  );

  const { messages, error, sendMessage, status } = useChat({
    transport,
    onError: (error) => console.error(error, "ERROR"),
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
        <YStack
          paddingHorizontal="$4"
          paddingTop="$3"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          <Button
            size="$3"
            circular
            icon={ChevronDown}
            onPress={() => router.back()}
            backgroundColor="transparent"
          />
        </YStack>

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
              {messages.length === 0 && (
                <YStack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  gap="$4"
                  paddingBottom="$8"
                >
                  <Image
                    source={require("@/assets/images/no-data.png")}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                  />
                  <Chat.Message alignment="left">
                    <Markdown
                      style={{
                        body: {
                          color: "#664F3F",
                          fontSize: 15,
                          lineHeight: 22,
                        },
                        paragraph: {
                          marginVertical: 0,
                          fontSize: 15,
                          lineHeight: 22,
                        },
                      }}
                    >
                      {t("chat.welcome")}
                    </Markdown>
                  </Chat.Message>
                </YStack>
              )}

              {/* Unavailability Banner */}
              {unavailableReason && (
                <YStack
                  backgroundColor="rgba(255, 255, 255, 0.7)"
                  borderRadius="$4"
                  padding="$4"
                  marginHorizontal="$2"
                  marginBottom="$3"
                >
                  <Text color="$secondary" fontSize="$3" lineHeight="$3">
                    {t(`chat.unavailable.${unavailableReason}`)}
                  </Text>
                </YStack>
              )}

              <Chat.Root>
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  const text = msg.parts
                    .filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("");

                  return (
                    <Chat.Message key={msg.id} alignment={isUser ? "right" : "left"}>
                      {isUser ? (
                        <Chat.Bubble variant="primary">{text}</Chat.Bubble>
                      ) : (
                        <Markdown
                          style={{
                            body: {
                              color: "#4A3728",
                              fontSize: 15,
                              lineHeight: 22,
                            },
                            heading1: {
                              fontSize: 20,
                              fontWeight: "bold",
                              marginTop: 8,
                              marginBottom: 4,
                              color: "#3A2A1C",
                            },
                            heading2: {
                              fontSize: 18,
                              fontWeight: "bold",
                              marginTop: 8,
                              marginBottom: 4,
                              color: "#3A2A1C",
                            },
                            heading3: {
                              fontSize: 16,
                              fontWeight: "bold",
                              marginTop: 6,
                              marginBottom: 3,
                              color: "#3A2A1C",
                            },
                            strong: {
                              fontWeight: "bold",
                              color: "#3A2A1C",
                            },
                            em: {
                              fontStyle: "italic",
                              color: "#4A3728",
                            },
                            list_item: {
                              marginVertical: 2,
                              flexDirection: "row",
                            },
                            bullet_list: {
                              marginVertical: 4,
                            },
                            ordered_list: {
                              marginVertical: 4,
                            },
                            paragraph: {
                              marginVertical: 4,
                              fontSize: 15,
                              lineHeight: 22,
                            },
                            code_inline: {
                              backgroundColor: "rgba(102, 79, 63, 0.08)",
                              color: "#4A3728",
                              fontFamily: "monospace",
                              fontSize: 14,
                              paddingHorizontal: 4,
                              paddingVertical: 2,
                              borderRadius: 3,
                            },
                            code_block: {
                              backgroundColor: "rgba(102, 79, 63, 0.08)",
                              color: "#4A3728",
                              fontFamily: "monospace",
                              fontSize: 14,
                              padding: 8,
                              borderRadius: 4,
                              marginVertical: 4,
                            },
                            fence: {
                              backgroundColor: "rgba(102, 79, 63, 0.08)",
                              color: "#4A3728",
                              fontFamily: "monospace",
                              fontSize: 14,
                              padding: 8,
                              borderRadius: 4,
                              marginVertical: 4,
                            },
                            blockquote: {
                              backgroundColor: "rgba(102, 79, 63, 0.05)",
                              borderLeftColor: "#C4853A",
                              borderLeftWidth: 3,
                              marginLeft: 0,
                              paddingLeft: 10,
                              paddingVertical: 4,
                              marginVertical: 4,
                            },
                            link: {
                              color: "#C4853A",
                              textDecorationLine: "underline",
                            },
                          }}
                        >
                          {text}
                        </Markdown>
                      )}
                    </Chat.Message>
                  );
                })}
              </Chat.Root>
            </ScrollView>

            {/* Inline error banner */}
            {error && (
              <YStack
                paddingHorizontal="$4"
                paddingVertical="$3"
                backgroundColor="$red2"
                borderTopWidth={1}
                borderTopColor="$red6"
              >
                <Text color="$red10" fontSize="$3" lineHeight="$3">
                  {getErrorMessage(error, t)}
                </Text>
              </YStack>
            )}

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
