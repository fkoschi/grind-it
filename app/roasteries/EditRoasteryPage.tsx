import { FC, useState } from "react";
import { roasteryTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Text, ScrollView, View, XStack, YStack } from "tamagui";
import { useDatabase } from "@/provider/DatabaseProvider";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import NoData from "@/components/NoData/NoData";
import { ActionButton, AddIcon, Sheet as BottomSheet } from "@/components/ui";
import { Star } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import RoasteryLogo from "@/components/ui/RoasteryLogo/RoasteryLogo";

import { AddRoasteryFrame } from "@/components";

const EditRoasteries: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { db } = useDatabase();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { data } = useLiveQuery(db.select().from(roasteryTable));

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
        <Pressable style={{ position: "sticky", top: 80, left: 32 }} onPress={() => router.back()}>
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
      <YStack gap="$3" pb="$12">
        {data.map((roastery) => (
          <Pressable
            key={roastery.id}
            onPress={() => router.navigate(`/roasteries/${roastery.id}/detail`)}
          >
            <XStack
              backgroundColor="white"
              borderRadius="$8"
              py="$4"
              px="$3"
              alignItems="center"
              gap="$3"
              style={{
                shadowOffset: { width: 0, height: 2 },
                elevation: 4,
                shadowOpacity: 0.1,
                shadowRadius: 2,
              }}
            >
              {!!roastery.website && <RoasteryLogo websiteUrl={roastery.website} size={40} />}
              <YStack flex={1} gap="$1">
                <Text fontSize={16} numberOfLines={1}>
                  {roastery.name}
                </Text>
                {!!roastery.address && (
                  <Text fontSize={10} color="$placeholderColor" numberOfLines={1}>
                    {roastery.address}
                  </Text>
                )}
                {!!roastery.rating && roastery.rating > 0 && (
                  <XStack gap="$1" mt="$1">
                    {Array.from({ length: roastery.rating }).map((_, i) => (
                      <Star key={i} size={14} color="#E89E3F" fill="#E89E3F" />
                    ))}
                  </XStack>
                )}
              </YStack>
            </XStack>
          </Pressable>
        ))}
      </YStack>
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
