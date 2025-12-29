import type { Meta, StoryObj } from "@storybook/react-native";
import { View, Button, ViewStyle } from "react-native";
import { LogoAnimation } from "./LogoAnimation";
import { useState } from "react";

const meta = {
  title: "Animations/LogoAnimation",
  component: LogoAnimation,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7F7F7",
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LogoAnimation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 200,
    autoPlay: true,
    loop: false,
    speed: 1,
  },
};

export const LargeSize: Story = {
  args: {
    size: 300,
    autoPlay: true,
    loop: false,
    speed: 1,
  },
};

export const SmallSize: Story = {
  args: {
    size: 120,
    autoPlay: true,
    loop: false,
    speed: 1,
  },
};

export const Looping: Story = {
  args: {
    size: 200,
    autoPlay: true,
    loop: true,
    speed: 1,
  },
};

export const SlowMotion: Story = {
  args: {
    size: 200,
    autoPlay: true,
    loop: false,
    speed: 0.5,
  },
};

export const FastAnimation: Story = {
  args: {
    size: 200,
    autoPlay: true,
    loop: false,
    speed: 1.5,
  },
};

export const Static: Story = {
  args: {
    size: 200,
    autoPlay: false,
    loop: false,
  },
};

const ReplayWrapper = (args: {
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  style?: ViewStyle;
}) => {
  const [key, setKey] = useState(0);

  return (
    <View style={{ alignItems: "center", gap: 20 }}>
      <LogoAnimation {...args} key={key} autoPlay={true} loop={false} />
      <Button title="Replay Animation" onPress={() => setKey((k) => k + 1)} />
    </View>
  );
};

export const WithReplay: Story = {
  args: {
    size: 200,
    autoPlay: false,
    loop: false,
  },
  render: ReplayWrapper,
};
