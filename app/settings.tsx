import { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, ScrollView, Spinner, Text, View } from "tamagui";
import { Coffee, Droplets, Share2, Store, Upload } from "@tamagui/lucide-icons";
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

const EquipmentBg = () => (
  <Svg width={80} height={80} viewBox="0 0 612 612" fill="none">
    <SvgPath
      d="M 395.17 430.35 C393.49,431.86 384.57,432.00 287.33,432.00 C185.89,432.00 181.24,431.92 179.65,430.17 C177.49,427.78 177.43,404.98 179.45,356.95 C180.25,338.00 181.84,298.42 182.98,269.00 C185.80,196.48 185.98,194.13 189.40,188.97 C191.09,186.42 193.73,184.12 196.32,182.94 C200.33,181.12 204.20,181.04 289.00,181.04 C372.51,181.04 377.73,181.15 381.50,182.87 C387.65,185.67 391.65,189.57 394.45,195.48 L 397.00 200.88 L 397.00 292.00 L 366.00 292.00 L 366.00 306.00 L 369.78 306.00 C373.06,306.00 373.71,305.60 374.69,303.00 L 375.83 300.00 L 385.16 299.92 C390.30,299.87 403.05,299.50 413.50,299.08 C425.29,298.62 432.97,298.69 433.75,299.29 C434.58,299.93 435.00,303.19 435.00,309.10 C435.00,309.65 435.00,310.18 435.01,310.69 C435.03,314.41 435.04,316.83 433.88,318.39 C431.73,321.30 425.51,321.20 407.66,320.89 C406.36,320.87 405.00,320.85 403.58,320.82 C375.96,320.38 374.00,320.05 374.00,315.88 C374.00,314.28 373.22,314.00 368.69,314.00 C363.64,314.00 363.29,314.17 361.76,317.37 C360.62,319.77 358.86,321.27 355.63,322.61 C353.14,323.64 350.90,325.27 350.65,326.24 C349.97,328.84 339.00,328.85 339.00,326.25 C338.99,325.14 337.44,323.85 334.75,322.72 C329.49,320.51 326.80,316.97 326.80,312.26 C326.80,310.28 326.17,308.03 325.40,307.26 C324.47,306.33 324.00,303.53 324.00,298.93 L 324.00 292.00 L 316.24 292.00 C307.88,292.00 302.12,293.21 300.84,295.23 C300.39,295.93 300.02,319.30 300.02,347.18 L 300.00 397.85 L 302.63 399.93 C304.75,401.59 306.70,402.00 312.47,402.00 C316.43,402.00 319.95,401.71 320.31,401.36 C320.66,401.01 319.81,399.37 318.42,397.73 C312.85,391.10 309.56,380.65 310.17,371.50 L 310.50 366.50 L 347.78 366.24 C387.98,365.95 389.13,366.08 392.38,371.27 C398.31,380.74 390.98,393.00 379.38,393.00 C375.84,393.00 374.86,393.50 372.62,396.43 C371.18,398.32 370.00,400.35 370.00,400.93 C370.00,401.63 374.04,402.00 381.57,402.00 C387.93,402.00 394.00,402.47 395.07,403.04 C396.82,403.97 397.00,405.23 397.00,416.38 C397.00,427.04 396.75,428.91 395.17,430.35 ZM 185.38 390.25 L 184.74 402.00 L 292.00 402.00 L 292.00 210.00 L 246.75 210.01 C219.00,210.01 200.08,210.41 197.82,211.03 C194.95,211.83 193.91,212.76 193.10,215.28 C192.29,217.80 191.58,234.02 191.94,241.75 C191.98,242.66 194.60,243.00 201.50,243.00 C210.97,243.00 211.00,243.01 211.00,245.50 L 211.00 248.00 L 191.00 248.00 L 191.00 262.00 L 211.13 262.00 L 210.50 267.50 L 200.21 267.79 L 189.91 268.07 L 190.21 274.68 L 190.50 281.29 L 199.50 281.13 C209.14,280.96 211.40,281.65 210.84,284.62 C210.52,286.28 209.24,286.56 199.99,287.00 L 189.50 287.50 L 188.82 304.00 C188.45,313.08 187.66,333.55 187.08,349.50 C186.49,365.45 185.73,383.79 185.38,390.25 ZM 300.00 188.00 L 300.00 285.02 L 344.75 284.76 L 389.50 284.50 L 389.79 245.00 C389.95,223.27 389.81,204.03 389.49,202.23 C388.72,197.97 383.57,192.16 378.51,189.86 C374.86,188.21 371.12,188.04 337.25,188.02 ZM 251.68 354.94 C248.05,356.31 240.07,356.25 237.50,354.84 C234.36,353.11 229.95,348.75 228.47,345.92 C227.41,343.89 227.08,333.31 226.91,295.31 L 226.70 247.27 L 229.10 242.89 C235.49,231.21 254.18,230.99 260.71,242.52 C262.97,246.50 262.97,246.54 262.98,294.80 C263.00,334.46 262.75,343.58 261.59,345.80 C259.70,349.43 255.13,353.63 251.68,354.94 ZM 185.00 408.99 L 185.00 425.01 L 287.25 424.75 L 389.50 424.50 L 389.50 409.50 L 287.25 409.25 ZM 238.57 348.05 C240.27,349.18 243.24,349.99 245.63,349.99 C249.19,350.00 250.27,349.44 253.38,346.00 L 257.00 341.99 L 257.00 295.56 C257.00,267.82 256.61,248.10 256.02,246.57 C254.66,242.98 249.35,240.01 244.28,240.00 C240.79,240.00 239.46,240.60 236.53,243.53 L 233.00 247.07 L 233.04 294.28 L 233.04 296.90 C233.07,337.03 233.07,343.29 236.20,346.32 C236.85,346.95 237.63,347.43 238.57,348.05 ZM 325.22 396.72 L 330.43 402.00 L 359.58 402.00 L 364.24 397.25 C369.87,391.52 373.03,384.74 373.75,376.86 L 374.28 371.00 L 316.00 371.00 L 316.00 375.52 C316.00,383.07 319.36,390.78 325.22,396.72 ZM 193.67 203.33 C194.03,203.70 216.31,204.00 243.17,204.00 L 292.00 204.00 L 292.00 188.00 L 247.53 188.00 C198.05,188.00 197.63,188.05 194.53,194.57 C192.94,197.93 192.52,202.18 193.67,203.33 ZM 380.00 306.19 L 380.00 315.03 L 404.75 314.77 L 429.50 314.50 L 429.81 309.16 L 430.11 303.82 L 414.31 304.43 C405.61,304.77 394.34,305.30 389.25,305.62 ZM 373.75 229.52 C369.91,233.64 365.72,234.65 361.45,232.49 C354.91,229.17 352.98,220.56 357.56,215.11 C364.10,207.34 377.00,212.01 377.00,222.15 C377.00,225.14 376.26,226.82 373.75,229.52 ZM 330.69 302.36 C331.07,302.74 337.71,302.93 345.44,302.78 L 359.50 302.50 L 359.80 297.25 L 360.10 292.00 L 330.00 292.00 L 330.00 296.83 C330.00,299.49 330.31,301.98 330.69,302.36 ZM 337.50 317.99 C339.15,318.52 343.34,318.78 346.82,318.58 C354.13,318.16 357.43,315.89 357.80,311.03 L 358.03 308.00 L 332.00 308.00 L 332.00 310.81 C332.00,314.47 333.79,316.81 337.50,317.99 ZM 378.32 384.75 C377.85,386.72 378.17,387.00 380.94,387.00 C385.11,387.00 389.00,383.14 389.00,379.00 C389.00,375.46 385.18,371.00 382.16,371.00 C380.56,371.00 380.11,371.97 379.54,376.75 C379.16,379.91 378.61,383.51 378.32,384.75 ZM 267.00 376.00 L 267.00 384.00 L 260.67 384.00 C257.18,384.00 254.03,383.70 253.67,383.33 C253.30,382.97 253.00,381.17 253.00,379.33 L 253.00 376.00 ZM 237.12 376.00 L 236.50 383.50 L 229.75 383.80 C225.58,383.98 222.96,383.69 222.89,383.05 C222.83,382.47 222.78,381.10 222.78,380.00 C222.78,378.90 222.83,377.55 222.89,377.00 C222.95,376.44 226.09,376.00 230.06,376.00 ZM 362.06 226.06 C364.69,228.69 367.76,228.23 370.30,224.81 C372.20,222.26 372.22,221.98 370.63,219.56 C368.67,216.56 364.60,216.14 361.83,218.65 C359.43,220.83 359.51,223.51 362.06,226.06 Z"
      transform="translate(-62 -62) scale(1.22)"
      fill="#D4A647"
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

          <SettingsCard.Root onPress={() => router.navigate("/equipment")}>
            <SettingsCard.Icon color="$accentAmber">
              <Coffee size={24} color="$accentAmber" />
            </SettingsCard.Icon>
            <SettingsCard.Content
              title={t("settings.equipment")}
              subtitle={t("settings.equipment.description")}
            />
            <SettingsCard.Bg>
              <EquipmentBg />
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
