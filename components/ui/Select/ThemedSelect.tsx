import { FC, useMemo, useState } from "react";
import { Adapt, Select, Sheet } from "tamagui";
import ArrowDown from "../Icons/ArrowDown";
import CheckIcon from "../Icons/Check";
import React from "react";

interface Props {
  placeholder: string;
  items: Array<any>;
}
const ThemedSelect: FC<Props> = ({ placeholder = "", items, ...other }) => {
  const [value, setValue] = useState("Fausto");

  const renderItems = useMemo(
    () =>
      items.map((item, i) => (
        <Select.Item index={i} key={item.name} value={item.name}>
          <Select.ItemText>{item.name}</Select.ItemText>
          <Select.ItemIndicator marginLeft="auto">
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )),
    [items]
  );

  return (
    <Select
      value={value}
      onValueChange={setValue}
      disablePreventBodyScroll
      {...other}
    >
      <Select.Trigger iconAfter={ArrowDown} bgC="white">
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport minWidth={200}>
          <Select.Group>{renderItems}</Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};

export default ThemedSelect;
