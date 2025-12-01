import { View, XStack } from "tamagui";
import FilterChip from "./FilterChip";
import { StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";

const meta = {
  title: "Components/FilterChip",
  component: FilterChip,
  decorators: [
    (Story: ComponentType) => (
      <View p="$2">
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  render: () => {
    const items = [
      {
        id: 1,
        name: "Taste",
        active: true,
      },
      {
        id: 2,
        name: "Price",
        active: false,
      },
      {
        id: 3,
        name: "Rating",
        active: false,
      },
    ];
    return (
      <XStack gap="$2">
        {items.map((item, index) => (
          <FilterChip
            id={item.id}
            name={item.name}
            active={item.active}
            onPress={() => console.log("Filter pressed")}
          />
        ))}
      </XStack>
    );
  },
};
