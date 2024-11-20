import { FC, useState } from "react";
import { Button, Input, styled, View, XStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import SearchFilter from "./SearchFilter";
import { taste } from "@/db/__mock__/taste";
import Search from "./Search";

const StyledFilterButton = styled(Button, {
  bgC: "#664F3F",
  pressStyle: {
    bgC: "#664F3F",
    borderWidth: 0,
  },
  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  },
});

interface Props {
  disabled: boolean;
}
const Header: FC<Props> = ({ disabled }) => {
  const mockedFilterData = taste;
  const [showFilter, setShowFilter] = useState<boolean>(false);

  return (
    <>
      <LinearGradient
        flex={0}
        animation="slow"
        justifyContent="flex-end"
        height="$14"
        borderBottomLeftRadius="$8"
        borderBottomRightRadius="$8"
        colors={["#FFDAAB", "#E89E3F"]}
        start={[0, 1]}
        end={[0, 0]}
        py="$4"
        pb="$2"
      >
        <XStack mb="$3" columnGap="$2" alignItems="center">
          <Search disabled={disabled} />
          <View flex={0} justifyContent="flex-end">
            <StyledFilterButton
              circular
              disabled={disabled}
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
            />
          </View>
        </XStack>
        <SearchFilter filters={mockedFilterData} isVisible={showFilter} />
      </LinearGradient>
    </>
  );
};

export default Header;
