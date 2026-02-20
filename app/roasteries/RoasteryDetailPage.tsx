import { FC, useState } from "react";
import { roasteryTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { LinearGradient } from "tamagui/linear-gradient";
import { Button, Input, ScrollView, Text, View, XStack, YStack } from "tamagui";
import { KeyboardAvoidingView, Platform, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRoasteryDetails } from "@/hooks/useRoasteryDetails";
import ThemedText from "@/components/ui/Text/ThemedText";
import { ChevronDown, Globe, MapPin, Star } from "@tamagui/lucide-icons";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButton, SaveIcon } from "@/components/ui";
import Sheet from "@/components/ui/Sheet/Sheet";
import GooglePlacesFrame from "@/components/BottomSheet/Frames/Roastery/GooglePlacesFrame";
import StaticMap from "@/components/ui/StaticMap/StaticMap";

const editSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

const RoasteryDetailPage: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { top: topInset } = useSafeAreaInsets();
  const { db } = useDatabase();
  const roastery = useRoasteryDetails();
  const [showAddressSheet, setShowAddressSheet] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    values: {
      name: roastery?.name ?? "",
      website: roastery?.website ?? "",
      address: roastery?.address ?? "",
      latitude: roastery?.latitude ?? undefined,
      longitude: roastery?.longitude ?? undefined,
      rating: roastery?.rating ?? 0,
    },
  });

  const currentRating = watch("rating") ?? 0;

  const onSubmit = async (data: EditFormValues) => {
    if (!roastery) return;
    await db
      .update(roasteryTable)
      .set({
        name: data.name,
        website: data.website || null,
        address: data.address || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        rating: data.rating ?? null,
      })
      .where(eq(roasteryTable.id, roastery.id));
    router.back();
  };

  const handleOpenMaps = () => {
    const address = watch("address");
    if (!address) return;
    const encoded = encodeURIComponent(address);
    // Opens in Apple Maps on iOS, Google Maps on Android
    const url = `maps://?q=${encoded}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://maps.google.com/?q=${encoded}`);
      }
    });
  };

  const handleOpenWebsite = () => {
    const website = watch("website");
    if (!website) return;
    const url = website.startsWith("http") ? website : `https://${website}`;
    Linking.openURL(url);
  };

  const handleAddressSelected = (address: string, lat?: number, lng?: number) => {
    setValue("address", address, { shouldDirty: true });
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
    setShowAddressSheet(false);
  };

  if (!roastery) return null;

  return (
    <View flex={1} bgC="$screenBackground">
      <LinearGradient
        height={"$14"}
        colors={["#FFDAAB", "#E89E3F"]}
        borderBottomLeftRadius="$12"
        borderBottomRightRadius="$12"
        start={[0, 1]}
        end={[0, 0]}
        paddingTop={topInset}
      >
        <Pressable
          style={{ position: "absolute", top: topInset + 12, left: 32 }}
          onPress={() => router.back()}
        >
          <ChevronDown size={28} color="white" />
        </Pressable>
        <View flex={1} justifyContent="flex-end" alignItems="center" gap="$3" mb="$6">
          <Text fontSize={32} lineHeight={40} c="$white" fontFamily="$sodabery">
            {roastery.name}
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView flex={1} py="$6" px="$6">
          <YStack gap="$4" pb="$12">
            {/* Name */}
            <XStack gap="$3" alignItems="center" justifyContent="center">
              <YStack gap="$2" flex={1}>
                <ThemedText fw={600} fontSize={12} color="$copyText">
                  {t("common.name")}
                </ThemedText>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      borderWidth={0}
                      bgC="white"
                      borderRadius="$4"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      size="$4"
                    />
                  )}
                />
              </YStack>
            </XStack>

            {/* Rating */}
            <YStack gap="$2">
              <ThemedText fw={600} fontSize={12} color="$copyText">
                {t("roastery.rating")}
              </ThemedText>
              <XStack gap="$3" alignItems="center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => setValue("rating", star, { shouldDirty: true })}
                  >
                    <Star
                      size={28}
                      color={star <= currentRating ? "#E89E3F" : "#D9D9D9"}
                      fill={star <= currentRating ? "#E89E3F" : "transparent"}
                    />
                  </Pressable>
                ))}
                {currentRating > 0 && (
                  <Pressable onPress={() => setValue("rating", 0, { shouldDirty: true })}>
                    <ThemedText fw={400} fontSize={12} color="$copyText">
                      {t("roastery.clearRating")}
                    </ThemedText>
                  </Pressable>
                )}
              </XStack>
            </YStack>

            {/* Website */}
            <YStack gap="$2">
              <ThemedText fw={600} fontSize={12} color="$copyText">
                {t("roastery.website")}
              </ThemedText>
              <XStack gap="$2" alignItems="center">
                <View flex={1}>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        borderWidth={0}
                        bgC="white"
                        borderRadius="$4"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="url"
                        autoCapitalize="none"
                        placeholder="https://..."
                        size="$4"
                      />
                    )}
                  />
                </View>
                {!!watch("website") && (
                  <Button
                    circular
                    size="$3"
                    bgC="$secondary"
                    onPress={handleOpenWebsite}
                    pressStyle={{ bgC: "$secondaryHover" }}
                  >
                    <Globe size={16} color="white" />
                  </Button>
                )}
              </XStack>
            </YStack>

            {/* Map — driven from form state so it updates immediately on address change */}
            {(watch("latitude") ?? roastery.latitude) != null &&
              (watch("longitude") ?? roastery.longitude) != null && (
                <StaticMap
                  latitude={(watch("latitude") ?? roastery.latitude)!}
                  longitude={(watch("longitude") ?? roastery.longitude)!}
                  height={180}
                  onPress={handleOpenMaps}
                />
              )}

            {/* Address */}
            <YStack gap="$2">
              <ThemedText fw={600} fontSize={12} color="$copyText">
                {t("roastery.address")}
              </ThemedText>
              <XStack gap="$2" alignItems="center">
                <Button
                  unstyled
                  flex={1}
                  bgC="white"
                  borderRadius="$4"
                  px="$3"
                  py="$3"
                  minHeight={44}
                  justifyContent="center"
                  alignItems="flex-start"
                  onPress={() => setShowAddressSheet(true)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <ThemedText
                    fw={400}
                    fontSize={14}
                    color={watch("address") ? "$secondary" : "$placeholderColor"}
                  >
                    {watch("address") || t("roastery.addressPlaceholder")}
                  </ThemedText>
                </Button>
                {!!watch("address") && (
                  <Button
                    circular
                    size="$3"
                    bgC="$primary"
                    onPress={handleOpenMaps}
                    pressStyle={{ bgC: "$primaryHover" }}
                  >
                    <MapPin size={16} color="white" />
                  </Button>
                )}
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>

      {isDirty && (
        <ActionButton
          bgC="$primaryGreen"
          icon={<SaveIcon />}
          onPress={handleSubmit(onSubmit)}
          pressStyle={{ backgroundColor: "$primaryGreen" }}
        />
      )}

      <Sheet
        sheetProps={{
          modal: false,
          open: showAddressSheet,
          onOpenChange: setShowAddressSheet,
          snapPoints: [85],
          dismissOnSnapToBottom: true,
        }}
        frame={
          <GooglePlacesFrame
            open={showAddressSheet}
            initialAddress={watch("address")}
            onSelect={handleAddressSelected}
            onClose={() => setShowAddressSheet(false)}
          />
        }
      />
    </View>
  );
};

export default RoasteryDetailPage;
