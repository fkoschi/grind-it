import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "tamagui";
import AromaSlider from "./AromaSlider";

const meta: Meta<typeof AromaSlider> = {
  title: "UI/AromaSlider",
  component: AromaSlider,
  decorators: [
    (Story) => (
      <View padding="$4" backgroundColor="$screenBackground" flex={1}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AromaSlider>;

const StatefulWrapper = ({ initialValue, label }: { initialValue: number; label: string }) => {
  const [value, setValue] = useState(initialValue);
  return <AromaSlider label={label} value={value} onChange={setValue} />;
};

const MultipleWrapper = () => {
  const [fruity, setFruity] = useState(60);
  const [floral, setFloral] = useState(40);
  const [sweet, setSweet] = useState(80);

  return (
    <View gap="$4">
      <AromaSlider label="Fruchtig" value={fruity} onChange={setFruity} />
      <AromaSlider label="Blumig" value={floral} onChange={setFloral} />
      <AromaSlider label="Süß" value={sweet} onChange={setSweet} />
    </View>
  );
};

export const Default: Story = {
  render: () => <StatefulWrapper initialValue={50} label="Fruchtig" />,
};

export const MinValue: Story = {
  render: () => <StatefulWrapper initialValue={0} label="Blumig" />,
};

export const MaxValue: Story = {
  render: () => <StatefulWrapper initialValue={100} label="Süß" />,
};

export const MultipleSliders: Story = {
  render: () => <MultipleWrapper />,
};
