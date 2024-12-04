import { ChevronDown } from "@tamagui/lucide-icons";
import { FC } from "react";
import { Adapt, Select, Sheet } from "tamagui";

interface Props {
  label: string;
  placeholder?: string;
  items?: Array<{ id: number; name: string }>;
  onChange?: (value: number) => void;
}
const ThemedSelect: FC<Props> = ({ label, onChange, placeholder, items }) => {
  const renderItems = () =>
    items?.map((item, i) => (
      <Select.Item
        index={i}
        key={`Select-Item-${i}`}
        value={item.name.toLowerCase()}
      >
        <Select.ItemText>{item.name}</Select.ItemText>
      </Select.Item>
    ));

  const handleValueChange = (value: string) => {
    // We are interessted in the Id and not the string value
    const item = items?.find((item) => item.name.toLowerCase() === value);
    if (item) {
      onChange?.(item.id);
    }
  };

  return (
    <Select onValueChange={handleValueChange}>
      <Select.Trigger iconAfter={ChevronDown}>
        <Select.Value placeholder={placeholder ? placeholder : "Select..."} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Select.Sheet snapPointsMode="constant" native>
          <Adapt.Contents />
        </Select.Sheet>
      </Adapt>

      <Select.Content zIndex={100_000_000}>
        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>{label}</Select.Label>
            {renderItems()}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};

export default ThemedSelect;
