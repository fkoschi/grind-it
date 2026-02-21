import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import BrewBuddyCard from "./BrewBuddyCard";
import { View } from "tamagui";

const meta = {
  title: "Components/BrewBuddyCard",
  component: BrewBuddyCard,
  decorators: [
    (Story: ComponentType) => (
      <View p="$4" bgC="$screenBackground" flex={1}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BrewBuddyCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onPress: () => console.log("BrewBuddyCard pressed"),
  },
};
