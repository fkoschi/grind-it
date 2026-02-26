import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { apple } from "@react-native-ai/apple";
import {
  ChatTransport,
  createUIMessageStream,
  convertToModelMessages,
  streamText,
  type UIMessage,
  type UIMessageChunk,
} from "ai";
import { extractLatestUserQuery } from "@/features/chat/utils/chatHelpers";
import type { AiProvider } from "@/store/ai-provider-store";

type ProviderConfig = {
  provider: AiProvider;
  openAiApiKey: string | null;
  claudeApiKey: string | null;
};

type ProviderChatTransportOptions = {
  systemPrompt: string;
  getEquipmentContext: () => string | null;
  getBeanContext: () => string | null;
  getRagPromptContext: (query: string) => Promise<string | null>;
  getProviderConfig: () => Promise<ProviderConfig>;
  unavailableMessage: string;
  missingOpenAiKeyMessage: string;
  missingClaudeKeyMessage: string;
};

export class ProviderChatTransport implements ChatTransport<UIMessage> {
  constructor(private readonly options: ProviderChatTransportOptions) {}

  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>["sendMessages"]>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    const modelMessages = await convertToModelMessages(messages);
    const { provider, openAiApiKey, claudeApiKey } = await this.options.getProviderConfig();

    const latestUserQuery = extractLatestUserQuery(messages);
    const ragPromptContext = latestUserQuery
      ? await this.options.getRagPromptContext(latestUserQuery)
      : null;

    const systemPrompt = [
      this.options.systemPrompt,
      this.options.getEquipmentContext(),
      this.options.getBeanContext(),
      ragPromptContext,
    ]
      .filter(Boolean)
      .join("\n\n");

    return createUIMessageStream({
      execute: async ({ writer }) => {
        if (provider === "openai") {
          if (!openAiApiKey) {
            throw new Error(this.options.missingOpenAiKeyMessage);
          }

          const client = createOpenAI({ apiKey: openAiApiKey });
          const result = streamText({
            model: client("gpt-4o-mini"),
            system: systemPrompt,
            messages: modelMessages,
            abortSignal,
          });

          writer.merge(result.toUIMessageStream());
          return;
        }

        if (provider === "claude") {
          if (!claudeApiKey) {
            throw new Error(this.options.missingClaudeKeyMessage);
          }

          const client = createAnthropic({ apiKey: claudeApiKey });
          const result = streamText({
            model: client("claude-3-5-haiku-latest"),
            system: systemPrompt,
            messages: modelMessages,
            abortSignal,
          });

          writer.merge(result.toUIMessageStream());
          return;
        }

        if (!apple.isAvailable()) {
          throw new Error(this.options.unavailableMessage);
        }

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
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null;
  }
}

export type { ProviderConfig, ProviderChatTransportOptions };
