import { FC, useState } from "react";
import { roasteryTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { desc } from "drizzle-orm";
import { Text, ScrollView, View } from "tamagui";
import { useDatabase } from "@/provider/DatabaseProvider";
import { LinearGradient } from "tamagui/linear-gradient";
import { Animated, Pressable } from "react-native";
import { useRouter } from "expo-router";
import NoData from "@/components/NoData/NoData";
import { ActionButton, AddIcon, RoasteryCard, Sheet as BottomSheet } from "@/components/ui";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

import { AddRoasteryFrame } from "@/components";

const EditRoasteries: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { db } = useDatabase();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { data } = useLiveQuery(
    db.select().from(roasteryTable).orderBy(desc(roasteryTable.rating)),
  );
  const { getAnimatedStyle } = useStaggeredReveal({ itemCount: data.length });

  const Header = () => (
    <LinearGradient
      height={"$14"}
      colors={["#FFDAAB", "#E89E3F"]}
      borderBottomLeftRadius="$12"
      borderBottomRightRadius="$12"
      start={[0, 1]}
      end={[0, 0]}
    >
      <View>
        <Pressable
          style={{ position: "absolute", top: 80, left: 32 }}
          onPress={() => router.back()}
        >
          <Image
            source={require("@/assets/icons/back.png")}
            style={{ width: 24, height: 24, tintColor: "white" }}
          />
        </Pressable>
      </View>
      <View flex={1} justifyContent="flex-end" alignItems="center">
        <Text fontSize={32} c={"$white"} fontFamily="$sodabery" mb="$6">
          {t("roastery.title")}
        </Text>
      </View>
    </LinearGradient>
  );

  const DataView = () => (
    <ScrollView px="$2">
      <View gap="$3" pb="$12">
        {data.map((roastery, index) => (
          <Animated.View key={roastery.id} style={getAnimatedStyle(index)}>
            <RoasteryCard.Root onPress={() => router.navigate(`/roasteries/${roastery.id}/detail`)}>
              <RoasteryCard.Icon />
              <RoasteryCard.Info name={roastery.name} address={roastery.address} />
              <RoasteryCard.Rating rating={roastery.rating} />
              <RoasteryCard.Bg websiteUrl={roastery.website} />
            </RoasteryCard.Root>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );

  const noData = data.length === 0;
  const hasData = data.length > 0;

  return (
    <View flex={1}>
      <Header />
      <View flex={1} mt="$4" py="$6">
        {noData && (
          <NoData variant={3} headline={t("common.noData")} copy={t("roastery.noData.subtitle")} />
        )}
        {hasData && <DataView />}
      </View>
      <View flex={0} style={{ position: "absolute", bottom: 0 }}>
        <ActionButton
          bgC="$primary"
          icon={<AddIcon />}
          onPress={() => setOpenSheet(true)}
          pressStyle={{ backgroundColor: "$primaryHover" }}
        />
      </View>
      <BottomSheet
        sheetProps={{
          open: openSheet,
          onOpenChange: (open: boolean) => setOpenSheet(open),
          dismissOnSnapToBottom: true,
        }}
        frame={<AddRoasteryFrame open={openSheet} onFormSubmit={() => setOpenSheet(false)} />}
      />
    </View>
  );
};
export default EditRoasteries;
