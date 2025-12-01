import type { Meta, StoryObj } from "@storybook/react-native";
import { View, YStack } from "tamagui";
import { Chat } from "./index";

const meta = {
  title: "Chat/Components",
  component: View, // Dummy component for meta
  decorators: [
    (Story) => (
      <View flex={1} justifyContent="center" alignItems="center" p="$4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof View>;

export default meta;

type Story = StoryObj<typeof View>;

export const AvatarUser: Story = {
  render: () => <Chat.Avatar type="user" />,
};

export const AvatarBot: Story = {
  render: () => <Chat.Avatar type="bot" />,
};

export const MessageUser: Story = {
  render: () => (
    <YStack width="100%">
      <Chat.Message message="Hallo, wie kann ich dir helfen?" type="user" />
    </YStack>
  ),
};

export const MessageBot: Story = {
  render: () => (
    <YStack width="100%">
      <Chat.Message
        message="Ich bin dein persönlicher Barista Bot. Frag mich alles über Kaffee!"
        type="bot"
      />
    </YStack>
  ),
};

export const InputEmpty: Story = {
  render: () => (
    <View width="100%">
      <Chat.Input onSend={(text) => console.log(text)} />
    </View>
  ),
};

export const Conversation: Story = {
  render: () => (
    <YStack width="100%" gap="$2">
      <Chat.Message message="Welchen Mahlgrad empfiehlst du?" type="user" />
      <Chat.Message
        message="Für Espresso empfehle ich einen feinen Mahlgrad. Hast du eine bestimmte Bohne im Sinn?"
        type="bot"
      />
      <Chat.Input onSend={(text) => console.log(text)} />
    </YStack>
  ),
};
