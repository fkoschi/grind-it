import { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Text, ListItem, View, YGroup, Separator, Spinner } from "tamagui";
import { ChevronRight, Share2, Upload } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Share, Alert, Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import TabBar from "@/components/Navigation/TabBar";
import { ThemedText } from "@/components/ui";
import { useDataExport } from "@/hooks/useDataExport";
import { useDataImport } from "@/hooks/useDataImport";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";

import { version } from "../package.json";

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
        // Ignore this specific error as it means the user just tapped too fast
        return;
      }
      Alert.alert(t("settings.import.error.title"), t("settings.import.error.message"));
    } finally {
      setIsPickingFile(false);
    }
  };

  return (
    <View bgC={"$screenBackground"} flex={1}>
      <View flex={1} pt={insets.top}>
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
        <YGroup mt="$4" p="$4">
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={ChevronRight}
              onPress={() => router.navigate("/roasteries/EditRoasteryPage")}
            >
              {t("settings.roasteries")}
            </ListItem>
          </YGroup.Item>
          <Separator />
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={ChevronRight}
              onPress={() => router.navigate("/taste/EditTasteComponent")}
            >
              {t("settings.taste")}
            </ListItem>
          </YGroup.Item>
        </YGroup>

        <YGroup p="$4">
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={isExporting || isSharing ? Spinner : Share2}
              onPress={handleShareData}
              disabled={isExporting || isSharing}
              opacity={isExporting || isSharing ? 0.5 : 1}
            >
              {t("settings.exportData")}
            </ListItem>
          </YGroup.Item>
          <Separator />
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={isImporting || isPickingFile ? Spinner : Upload}
              onPress={handleImportData}
              disabled={isImporting || isPickingFile}
              opacity={isImporting || isPickingFile ? 0.5 : 1}
            >
              {t("settings.importData")}
            </ListItem>
          </YGroup.Item>
        </YGroup>

        <YGroup p="$4">
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$primary"
              color="$white"
              textAlign="center"
              onPress={() => router.push("/chat")}
            >
              {t("settings.chat")}
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </View>
      <TabBar />
    </View>
  );
};
export default SettingsPage;
