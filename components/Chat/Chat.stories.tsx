import type { Meta, StoryObj } from "@storybook/react-native";
import { View, Text } from "react-native";
import { Chat } from "./index";
import Markdown from "react-native-markdown-display";

const meta = {
  title: "Chat",
  component: Chat.Root,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Chat.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

// User message with bubble
export const UserMessage: Story = {
  render: () => (
    <Chat.Message alignment="right">
      <Chat.Bubble variant="primary">
        Hello, how do I brew better espresso?
      </Chat.Bubble>
    </Chat.Message>
  ),
};

// Bot message as plain text
export const BotMessage: Story = {
  render: () => (
    <Chat.Message alignment="left">
      <Text style={{ fontSize: 14, lineHeight: 20 }}>
        To brew better espresso, start with fresh beans and a consistent grind.
      </Text>
    </Chat.Message>
  ),
};

// User message with markdown
export const UserMessageWithMarkdown: Story = {
  render: () => (
    <Chat.Message alignment="right">
      <Chat.Bubble variant="primary">
        {`Tell me about **espresso** brewing with \`technical\` details!`}
      </Chat.Bubble>
    </Chat.Message>
  ),
};

// Bot message with markdown (no bubble)
export const BotMessageWithMarkdown: Story = {
  render: () => (
    <Chat.Message alignment="left">
      <Markdown
        style={{
          body: { fontSize: 14, lineHeight: 20, color: "#000000" },
        }}
      >
        {`To brew better espresso:

1. Use **fresh beans** (within 2 weeks of roasting)
2. Maintain *consistent* grind size  
3. Use \`18-20g\` of coffee
4. Aim for ~~25~~ 30 seconds extraction

> Pro tip: Temperature matters!

Learn more at [Coffee Guide](https://example.com)`}
      </Markdown>
    </Chat.Message>
  ),
};

export const CodeBlockExample: Story = {
  render: () => (
    <Chat.Message alignment="left">
      <Markdown
        style={{
          body: { fontSize: 14, lineHeight: 20, color: "#000000" },
        }}
      >
        {`Here's a simple calculation:

\`\`\`
Ratio = Coffee / Water
Example: 18g / 36g = 1:2
\`\`\`

This is the **golden ratio** for espresso!`}
      </Markdown>
    </Chat.Message>
  ),
};

export const Input: Story = {
  render: () => <Chat.Input onSend={(msg) => console.log(msg)} />,
  decorators: [
    (Story) => (
      <View style={{ width: "100%" }}>
        <Story />
      </View>
    ),
  ],
};

export const FullConversation: Story = {
  render: () => (
    <Chat.Root>
      <Chat.Message alignment="right">
        <Chat.Bubble variant="primary">
          {`How do I make **great** espresso?`}
        </Chat.Bubble>
      </Chat.Message>

      <Chat.Message alignment="left">
        <Markdown
          style={{
            body: { fontSize: 14, lineHeight: 20, color: "#000000" },
          }}
        >
          {`Great espresso requires three key elements:

1. **Fresh beans** - roasted within 2 weeks
2. **Proper grind** - fine, but not too fine
3. **Correct temperature** - around \`93°C\`

> Remember: consistency is key!`}
        </Markdown>
      </Chat.Message>

      <Chat.Message alignment="right">
        <Chat.Bubble variant="primary">What is a good grind size?</Chat.Bubble>
      </Chat.Message>

      <Chat.Input onSend={(msg) => console.log(msg)} />
    </Chat.Root>
  ),
  decorators: [
    (Story) => (
      <View style={{ flex: 1, width: "100%", height: 500 }}>
        <Story />
      </View>
    ),
  ],
};
