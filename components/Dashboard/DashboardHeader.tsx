import { FC, useState } from "react";
import { Button, styled, View, XStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import SearchFilter from "../../SearchFilter";
import Search from "../../Search";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";

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
  onChangeText: (text: string) => void;
}
const DashboardHeader: FC<Props> = ({ onChangeText }) => {
  const { db } = useDatabase();
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const { data: tasteFilters } = useLiveQuery(db.select().from(beanTasteTable));

  return (
    <>
      <LinearGradient
        flex={1}
        animation="slow"
        justifyContent="flex-end"
        maxHeight={showFilter ? 187 : 140}
        borderBottomLeftRadius="$8"
        borderBottomRightRadius="$8"
        colors={["#FFDAAB", "#E89E3F"]}
        start={[0, 1]}
        end={[0, 0]}
        py="$4"
        pb="$2"
      >
        <XStack mb="$3" columnGap="$2" alignItems="center">
          <Search onChangeText={onChangeText} />
          <View flex={0} justifyContent="flex-end">
            <StyledFilterButton
              circular
              onPress={() => setShowFilter(!showFilter)}
              icon={
                <View flex={1} alignItems="center">
                  <Image
                    contentFit="contain"
                    source={require("@/assets/icons/filter.png")}
                    style={{ flex: 1, height: 24, width: 24 }}
                  />
                </View>
              }
            />
          </View>
        </XStack>
        {showFilter && <SearchFilter filters={tasteFilters} />}
      </LinearGradient>
    </>
  );
};

export default DashboardHeader;
