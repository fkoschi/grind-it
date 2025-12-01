import { ChevronDown } from "@tamagui/lucide-icons";
import { FC } from "react";
import { Adapt, Select, SelectProps, Sheet } from "tamagui";

interface Props {
  label: string;
  placeholder?: string;
  items?: { id: number; name: string }[];
  SelectProps?: SelectProps;
  onChange?: (value: number) => void;
  onOpenChange?: (value: number) => void;
  value?: number;
}
const ThemedSelect: FC<Props> = ({
  label,
  onChange,
  placeholder,
  items,
  SelectProps,
  value,
}) => {
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
    <Select
      value={items?.find((item) => item.id === value)?.name.toLowerCase()}
      onValueChange={handleValueChange}
      {...SelectProps}
    >
      <Select.Trigger iconAfter={ChevronDown} disabled={!items?.length}>
        <Select.Value placeholder={placeholder ? placeholder : "Select..."} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native
          modal
          dismissOnSnapToBottom
          snapPoints={[50]}
          snapPointsMode="percent"
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200_000_000}>
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
