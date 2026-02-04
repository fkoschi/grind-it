import React from "react";
import { View, Text, Button, ScrollView, StyleSheet, Platform } from "react-native";
import { useManualWatchSync } from "@/hooks/useManualWatchSync";
import { Stack } from "expo-router";

/**
 * Test screen for Watch sync functionality
 * Navigate to /watch-sync-test to use
 */
export default function WatchSyncTestScreen() {
  const { triggerSync, isSyncing, lastSyncResult, getWatchStatus, beansCount } =
    useManualWatchSync();

  const watchStatus = getWatchStatus();

  if (Platform.OS !== "ios") {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Watch Sync Test" }} />
        <Text style={styles.warning}>Watch sync only available on iOS</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Watch Sync Test" }} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Watch Status</Text>
        <Text style={styles.text}>Paired: {watchStatus.paired ? "✅ Yes" : "❌ No"}</Text>
        <Text style={styles.text}>Reachable: {watchStatus.reachable ? "✅ Yes" : "❌ No"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beans</Text>
        <Text style={styles.text}>Total beans in database: {beansCount}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Sync</Text>
        <Button
          title={isSyncing ? "Syncing..." : "Trigger Sync to Watch"}
          onPress={triggerSync}
          disabled={isSyncing || beansCount === 0}
        />
      </View>

      {lastSyncResult && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last Sync Result</Text>
          {lastSyncResult.success ? (
            <>
              <Text style={styles.success}>✅ Success</Text>
              <Text style={styles.text}>Synced {lastSyncResult.beansCount} beans</Text>
            </>
          ) : (
            <>
              <Text style={styles.error}>❌ Failed</Text>
              <Text style={styles.text}>Error: {lastSyncResult.error}</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Instructions</Text>
        <Text style={styles.instructions}>
          1. Make sure your Apple Watch is paired and nearby{"\n"}
          2. Open the GrindIt Watch app on your Watch{"\n"}
          3. Press "Trigger Sync to Watch" button above{"\n"}
          4. Check Watch app - beans should appear within a few seconds{"\n"}
          5. Try pull-to-refresh on Watch to see "last synced" timestamp{"\n"}
          {"\n"}
          Automatic sync:{"\n"}- Add/edit/delete beans in the main app{"\n"}- Watch should sync
          automatically after 2 seconds
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Console Logs</Text>
        <Text style={styles.text}>Check console for detailed sync logs</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
  success: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7AA996",
    marginBottom: 8,
  },
  error: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CD5B5B",
    marginBottom: 8,
  },
  warning: {
    fontSize: 16,
    color: "#CD5B5B",
    textAlign: "center",
    marginTop: 40,
  },
});
