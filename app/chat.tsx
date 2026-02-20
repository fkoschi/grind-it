import { FC, useRef, useEffect, useMemo } from "react";
import { KeyboardAvoidingView, Platform, ScrollView as RNScrollView, Image } from "react-native";
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

const ChatPage: FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<RNScrollView>(null);

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

      <ProFeatureOverlay>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={48}
        >
          <YStack flex={1}>
            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              flex={1}
              contentContainerStyle={{
                paddingHorizontal: "$4",
                paddingBottom: "$4",
                flexGrow: 1,
              }}
            >
              <Chat.Root>
                {/* Empty State */}
                {messages.length === 0 && (
                  <YStack
                    flex={1}
                    maxWidth={"90%"}
                    alignItems="center"
                    justifyContent="center"
                    gap="$4"
                    paddingBottom="$8"
                  >
                    <Text fontSize="$9" fontFamily="$sodabery" color="$primary">
                      {t("chat.title")}
                    </Text>
                    <Image
                      source={require("@/assets/images/no-data.png")}
                      style={{ width: 200, height: 200 }}
                      resizeMode="contain"
                    />
                    <Chat.Message alignment="left">
                      <Markdown
                        style={{
                          body: {
                            color: "#000000",
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
                              color: "#000000",
                              fontSize: 15,
                              lineHeight: 22,
                            },
                            heading1: {
                              fontSize: 20,
                              fontWeight: "bold",
                              marginTop: 8,
                              marginBottom: 4,
                              color: "#000000",
                            },
                            heading2: {
                              fontSize: 18,
                              fontWeight: "bold",
                              marginTop: 8,
                              marginBottom: 4,
                              color: "#000000",
                            },
                            heading3: {
                              fontSize: 16,
                              fontWeight: "bold",
                              marginTop: 6,
                              marginBottom: 3,
                              color: "#000000",
                            },
                            strong: {
                              fontWeight: "bold",
                              color: "#000000",
                            },
                            em: {
                              fontStyle: "italic",
                              color: "#000000",
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
                              backgroundColor: "rgba(0, 0, 0, 0.05)",
                              color: "#000000",
                              fontFamily: "monospace",
                              fontSize: 14,
                              paddingHorizontal: 4,
                              paddingVertical: 2,
                              borderRadius: 3,
                            },
                            code_block: {
                              backgroundColor: "rgba(0, 0, 0, 0.05)",
                              color: "#000000",
                              fontFamily: "monospace",
                              fontSize: 14,
                              padding: 8,
                              borderRadius: 4,
                              marginVertical: 4,
                            },
                            fence: {
                              backgroundColor: "rgba(0, 0, 0, 0.05)",
                              color: "#000000",
                              fontFamily: "monospace",
                              fontSize: 14,
                              padding: 8,
                              borderRadius: 4,
                              marginVertical: 4,
                            },
                            blockquote: {
                              backgroundColor: "rgba(0, 0, 0, 0.03)",
                              borderLeftColor: "rgba(0, 0, 0, 0.2)",
                              borderLeftWidth: 3,
                              marginLeft: 0,
                              paddingLeft: 10,
                              paddingVertical: 4,
                              marginVertical: 4,
                            },
                            link: {
                              color: "#0066cc",
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
                  {error.message}
                </Text>
              </YStack>
            )}

            {/* Input */}
            <Chat.Input onSend={(text) => sendMessage({ text })} isLoading={status !== "ready"} />
          </YStack>
        </KeyboardAvoidingView>
      </ProFeatureOverlay>
    </View>
  );
};

export default ChatPage;
