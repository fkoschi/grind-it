import { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, ScrollView, Spinner, Text, View } from "tamagui";
import { Droplets, Share2, Store, Upload } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Share, Alert, Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import TabBar from "@/components/Navigation/TabBar";
import { BrewBuddyCard, SettingsCard, ThemedText } from "@/components/ui";
import { useDataExport } from "@/hooks/useDataExport";
import { useDataImport } from "@/hooks/useDataImport";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";
import Svg, { Path as SvgPath, Circle, Rect } from "react-native-svg";

import { version } from "../package.json";

const RoasteriesBg = () => (
  <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
    <Rect x="10" y="30" width="60" height="40" rx="4" fill="#D4876C" />
    <Rect x="20" y="10" width="40" height="24" rx="2" fill="#D4876C" />
    <Circle cx="40" cy="50" r="12" fill="#FFF" fillOpacity={0.3} />
  </Svg>
);

const TasteBg = () => (
  <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
    <SvgPath d="M30 10 C30 10 10 50 30 70 C50 90 50 50 30 10Z" fill="#8BAA91" />
    <SvgPath d="M50 5 C50 5 30 45 50 65 C70 85 70 45 50 5Z" fill="#8BAA91" fillOpacity={0.6} />
  </Svg>
);

const ExportBg = () => (
  <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
    <Circle cx="40" cy="40" r="8" fill="#D4A647" />
    <Circle cx="15" cy="20" r="6" fill="#D4A647" fillOpacity={0.6} />
    <Circle cx="65" cy="20" r="6" fill="#D4A647" fillOpacity={0.6} />
    <Circle cx="15" cy="60" r="6" fill="#D4A647" fillOpacity={0.6} />
    <Circle cx="65" cy="60" r="6" fill="#D4A647" fillOpacity={0.6} />
    <SvgPath
      d="M40 32 L15 20 M40 32 L65 20 M40 48 L15 60 M40 48 L65 60"
      stroke="#D4A647"
      strokeWidth={2}
    />
  </Svg>
);

const ImportBg = () => (
  <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
    <Rect x="15" y="45" width="50" height="8" rx="3" fill="#B08EA2" />
    <Rect x="10" y="50" width="60" height="20" rx="4" fill="#B08EA2" />
    <SvgPath
      d="M40 10 L40 42 M30 32 L40 42 L50 32"
      stroke="#B08EA2"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SettingsPage: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { exportData, isExporting } = useDataExport();
  const [isSharing, setIsSharing] = useState(false);

  const { importData, isImporting } = useDataImport();
  const [isPickingFile, setIsPickingFile] = useState(false);

  const handleShareData = async () => {
    setIsSharing(true);
    try {
      const jsonData = await exportData();

      if (!jsonData) {
        Alert.alert(t("settings.export.failed.title"), t("settings.export.failed.message"));
        return;
      }

      const fileName = `grind-it-export-${new Date().toISOString().split("T")[0]}.json`;
      const file = new File(Paths.document, fileName);

      if (file.exists) {
        await file.delete();
      }
      await file.create();
      await file.write(jsonData);

      const shareOptions = Platform.select({
        ios: {
          url: file.uri,
          message: t("settings.export.shareTitle"),
        },
        default: {
          title: t("settings.export.shareTitle"),
          url: file.uri,
        },
      });

      await Share.share(shareOptions);
    } catch (err) {
      console.error("Share error:", err);
      Alert.alert(t("settings.export.shareError.title"), t("settings.export.shareError.message"));
    } finally {
      setIsSharing(false);
    }
  };

  const handleImportData = async () => {
    if (isPickingFile) return;
    setIsPickingFile(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const file = new File(fileUri);
      const fileContent = await file.text();

      try {
        const parsedData = JSON.parse(fileContent);
        const beanCount = parsedData.beans?.length || 0;

        Alert.alert(
          t("settings.import.confirm.title"),
          t("settings.import.confirm.message", { count: beanCount }),
          [
            {
              text: t("common.cancel"),
              style: "cancel",
            },
            {
              text: t("settings.import.action"),
              onPress: async () => {
                const importResult = await importData(fileContent, true);

                if (importResult?.success) {
                  Alert.alert(
                    t("settings.import.success.title"),
                    t("settings.import.success.message", {
                      created: importResult.beansCreated,
                      skipped: importResult.beansSkipped,
                    }),
                  );
                } else if (importResult) {
                  Alert.alert(
                    t("settings.import.partial.title"),
                    t("settings.import.partial.message", {
                      created: importResult.beansCreated,
                      errors: importResult.errors.join("\n"),
                    }),
                  );
                }
              },
            },
          ],
        );
      } catch {
        Alert.alert(
          t("settings.import.invalidFile.title"),
          t("settings.import.invalidFile.message"),
        );
      }
    } catch (err) {
      console.error("Import error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("Different document picking in progress")) {
        return;
      }
      Alert.alert(t("settings.import.error.title"), t("settings.import.error.message"));
    } finally {
      setIsPickingFile(false);
    }
  };

  const isExportLoading = isExporting || isSharing;
  const isImportLoading = isImporting || isPickingFile;

  return (
    <View bgC={"$screenBackground"} flex={1}>
      <ScrollView flex={1} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 }}>
        <View alignItems="center" mt="$6">
          <Avatar circular size="$10">
            <Avatar.Image
              accessibilityLabel="Grind It Logo"
              src={require("@/assets/images/icon.png")}
            />
          </Avatar>
          <Text fontSize={24} fontFamily="TBJSodabery-LightOriginal">
            Grind It
          </Text>
          <ThemedText fw={400}>v.{version}</ThemedText>
        </View>

        <View p="$4" gap="$3" mt="$4">
          <SettingsCard.Root onPress={() => router.navigate("/roasteries/EditRoasteryPage")}>
            <SettingsCard.Icon color="$accentTerracotta">
              <Store size={24} color="$accentTerracotta" />
            </SettingsCard.Icon>
            <SettingsCard.Content
              title={t("settings.roasteries")}
              subtitle={t("settings.roasteries.description")}
            />
            <SettingsCard.Bg>
              <RoasteriesBg />
            </SettingsCard.Bg>
          </SettingsCard.Root>

          <SettingsCard.Root onPress={() => router.navigate("/taste/EditTasteComponent")}>
            <SettingsCard.Icon color="$accentSage">
              <Droplets size={24} color="$accentSage" />
            </SettingsCard.Icon>
            <SettingsCard.Content
              title={t("settings.taste")}
              subtitle={t("settings.taste.description")}
            />
            <SettingsCard.Bg>
              <TasteBg />
            </SettingsCard.Bg>
          </SettingsCard.Root>

          <SettingsCard.Root onPress={handleShareData} disabled={isExportLoading}>
            <SettingsCard.Icon color="$accentAmber">
              {isExportLoading ? (
                <Spinner size="small" color="$accentAmber" />
              ) : (
                <Share2 size={24} color="$accentAmber" />
              )}
            </SettingsCard.Icon>
            <SettingsCard.Content
              title={t("settings.exportData")}
              subtitle={t("settings.exportData.description")}
            />
            <SettingsCard.Bg>
              <ExportBg />
            </SettingsCard.Bg>
          </SettingsCard.Root>

          <SettingsCard.Root onPress={handleImportData} disabled={isImportLoading}>
            <SettingsCard.Icon color="$accentMauve">
              {isImportLoading ? (
                <Spinner size="small" color="$accentMauve" />
              ) : (
                <Upload size={24} color="$accentMauve" />
              )}
            </SettingsCard.Icon>
            <SettingsCard.Content
              title={t("settings.importData")}
              subtitle={t("settings.importData.description")}
            />
            <SettingsCard.Bg>
              <ImportBg />
            </SettingsCard.Bg>
          </SettingsCard.Root>

          <BrewBuddyCard onPress={() => router.push("/chat")} />
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
};
export default SettingsPage;
