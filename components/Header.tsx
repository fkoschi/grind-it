import { FC, useState } from "react";
import { Button, Input, View, XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import SearchFilter from "./SearchFilter";
import { taste } from "@/data/__mock__/taste";

interface Props {
  disabled: boolean;
}
const Header: FC<Props> = ({ disabled }) => {
  const mockedFilterData = taste;
  const [showFilter, setShowFilter] = useState<boolean>(false);

  return (
    <LinearGradient
      flex={0}
      justifyContent="flex-end"
      height={showFilter ? "$16" : "$14"}
      borderRadius="$8"
      colors={["#FFDAAB", "#E89E3F"]}
      start={[0, 1]}
      end={[0, 0]}
      py="$4"
    >
      <XStack flex={0} columnGap="$2">
        <XStack
          flex={1}
          flexDirection="row"
          bgC="white"
          borderRadius="$10"
          alignItems="center"
          justifyContent="flex-start"
          height="$5"
          mb="$4"
        >
          <View
            flex={1}
            maxWidth={40}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Image
              source={require("../assets/icons/search.png")}
              contentFit="contain"
              style={{ width: 24, flex: 1, marginLeft: 8 }}
            />
          </View>
          <View flex={1}>
            <Input
              my="$0"
              py="$0"
              disabled={disabled}
              bgC="white"
              height="$5"
              borderWidth={0}
              borderRadius="$10"
              placeholder="Search..."
            />
          </View>
        </XStack>
        <Button
          width="$5"
          height="$5"
          bgC="#664F3F"
          disabled={disabled}
          circular
          onPress={() => setShowFilter(!showFilter)}
          icon={
            <View flex={1} alignItems="center">
              <Image
                contentFit="contain"
                source={require("../assets/icons/filter.png")}
                style={{ flex: 1, height: 24, width: 24 }}
              />
            </View>
          }
        ></Button>
      </XStack>
      {showFilter && <SearchFilter filters={mockedFilterData} />}
    </LinearGradient>
  );
};

export default Header;
