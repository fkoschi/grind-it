## 1. Xcode Project Setup

- [ ] 1.1 Open GrindIt.xcodeproj in Xcode
- [ ] 1.2 Add new watchOS App target named "GrindItWatch" (standalone Watch app, not extension)
- [ ] 1.3 Set watchOS deployment target to 9.0 or higher
- [ ] 1.4 Configure bundle identifier (com.grindit.app.watchkitapp or following Expo pattern)
- [ ] 1.5 Set Watch app version to match iOS app version
- [ ] 1.6 Enable SwiftUI as the UI framework for Watch target
- [ ] 1.7 Create Shared folder at ios/ level for code shared between iOS and watchOS
- [ ] 1.8 Link Shared folder to both iOS and watchOS targets in Xcode

## 2. Watch App Directory Structure

- [x] 2.1 Create ios/GrindItWatch/ directory
- [ ] 2.2 Create Models/ subdirectory in GrindItWatch
- [x] 2.3 Create Managers/ subdirectory in GrindItWatch
- [x] 2.4 Create Database/ subdirectory in GrindItWatch
- [x] 2.5 Create Views/ subdirectory in GrindItWatch
- [x] 2.6 Add Assets.xcassets to GrindItWatch folder
- [ ] 2.7 Create and configure Info.plist with WKApplication key set to true

## 3. Dependencies and Build Configuration

- [x] 3.1 Add SQLite.swift dependency via Swift Package Manager or CocoaPods
- [x] 3.2 Link SQLite.swift library to GrindItWatch target
- [x] 3.3 Verify SQLite.swift is importable in Swift files
- [ ] 3.4 Test that both iOS and watchOS targets build successfully in Xcode
- [ ] 3.5 Document build process for local Xcode builds (if EAS doesn't support watchOS)

## 4. Shared Data Models

- [x] 4.1 Create ios/Shared/BeanSchema.swift with Bean model matching database schema
- [x] 4.2 Define Bean struct with fields: id, name, roastery, degreeOfGrinding, singleShotDosis, doubleShotDosis, arabicaAmount, robustaAmount
- [x] 4.3 Add Roastery struct to shared models
- [x] 4.4 Make models Codable for JSON serialization/deserialization
- [x] 4.5 Ensure shared models compile for both iOS and watchOS targets

## 5. Watch Database Implementation

- [x] 5.1 Create ios/GrindItWatch/Database/SQLiteManager.swift
- [x] 5.2 Implement database initialization using SQLite.swift
- [x] 5.3 Create table schema for beans matching iOS database structure
- [x] 5.4 Implement insertBeans() method to populate database
- [x] 5.5 Implement clearBeans() method to remove all beans
- [x] 5.6 Implement fetchAllBeans() method to retrieve beans
- [x] 5.7 Add error handling for database operations

## 6. iOS WatchConnectivity Native Module

- [x] 6.1 Create Expo native module for WatchConnectivity (use expo-modules)
- [x] 6.2 Implement activateSession() method in native module
- [x] 6.3 Implement sendBeans(data: JSON) method in native module
- [x] 6.4 Add WatchConnectivity session state monitoring
- [x] 6.5 Handle errors gracefully and return error messages to React Native
- [x] 6.6 Implement transferUserInfo() call for bean data transfer
- [x] 6.7 Add session activation on iOS app launch
- [x] 6.8 Monitor Watch pairing state and reachability

## 7. iOS Bean Data Serialization

- [x] 7.1 Create function to serialize all beans from SQLite to JSON
- [x] 7.2 Include required fields: id, name, roastery (with name), degreeOfGrinding, singleShotDosis, doubleShotDosis, arabicaAmount, robustaAmount
- [x] 7.3 Join roastery data to include roastery name in JSON
- [x] 7.4 Include optional fields (taste associations, aroma profile) if present
- [x] 7.5 Test serialization with various bean counts (1, 10, 50+ beans)

## 8. iOS Sync Trigger Integration

- [x] 8.1 Integrate WatchConnectivity module into BeanDataProvider
- [x] 8.2 Trigger sync on iOS app launch (asynchronously, non-blocking)
- [x] 8.3 Trigger sync after adding a bean
- [x] 8.4 Trigger sync after editing a bean
- [x] 8.5 Trigger sync after deleting a bean
- [x] 8.6 Implement debounce logic for rapid changes (2 second delay)
- [x] 8.7 Add error logging for failed syncs without crashing app
- [x] 8.8 Ensure NO timer-based or periodic sync (only event-driven sync)

## 9. Watch WatchConnectivity Manager

- [x] 9.1 Create ios/GrindItWatch/Managers/WatchConnectivityManager.swift
- [x] 9.2 Implement WatchConnectivity session activation on Watch app launch
- [x] 9.3 Implement delegate method to receive transferUserInfo data
- [x] 9.4 Parse received JSON into Swift Bean models
- [x] 9.5 Clear existing beans from database before inserting new data
- [x] 9.6 Insert parsed beans into Watch database
- [x] 9.7 Store current timestamp in UserDefaults as "lastBeanSync" when data is received
- [x] 9.8 Post notification to refresh UI after database update
- [x] 9.9 Handle corrupt JSON gracefully without crashing
- [x] 9.10 Reactivate session when app returns from background

## 10. Watch UI - Bean List View

- [x] 10.1 Create ios/GrindItWatch/Views/ContentView.swift
- [x] 10.2 Implement NavigationStack with List view
- [x] 10.3 Load beans from SQLite database instantly on .onAppear (synchronous)
- [x] 10.4 Display beans in ForEach loop with BeanCardView
- [x] 10.5 Show empty state message when no beans exist ("No beans synced yet")
- [x] 10.6 Implement pull-to-refresh with .refreshable modifier
- [x] 10.7 Pull-to-refresh reloads from local DB (no network request)
- [x] 10.8 Display "Last synced: X mins ago" timestamp in UI
- [x] 10.9 Store last sync timestamp in UserDefaults when data arrives
- [x] 10.10 Update timestamp display after pull-to-refresh
- [x] 10.11 Observe database update notifications to refresh list
- [x] 10.12 Ensure Digital Crown scrolling works smoothly

## 11. Watch UI - Bean Card Component

- [x] 11.1 Create ios/GrindItWatch/Views/BeanCardView.swift
- [x] 11.2 Display bean name prominently (VStack layout)
- [x] 11.3 Display roastery name below bean name
- [x] 11.4 Handle missing roastery gracefully (show "Unknown Roastery" or omit)
- [x] 11.5 Display grind settings in HStack (degreeOfGrinding, singleShotDosis, doubleShotDosis)
- [x] 11.6 Handle missing grind settings gracefully (show "Not set" or hide)
- [x] 11.7 Add clear visual separation between cards (borders/padding)
- [x] 11.8 Use appropriate font sizes (minimum 12pt body, larger for bean names)
- [x] 11.9 Support both light and dark mode color schemes
- [ ] 11.10 Test layout on different Watch sizes (38mm-49mm)

## 12. Watch UI - Bean Detail View

- [x] 12.1 Create ios/GrindItWatch/Views/BeanDetailView.swift
- [x] 12.2 Add NavigationLink from BeanCardView to BeanDetailView
- [x] 12.3 Display full bean information (name, roastery, roast percentages, grind settings)
- [x] 12.4 Include arabicaAmount and robustaAmount if available
- [ ] 12.5 Display any additional metadata (aroma profile if present)
- [x] 12.6 Ensure back navigation returns to list view
- [x] 12.7 Use ScrollView for content that may overflow screen

## 13. Performance Optimization

- [ ] 13.1 Verify list scrolls smoothly with 50+ beans
- [ ] 13.2 Ensure lazy loading of cards (only render visible and adjacent)
- [ ] 13.3 Profile memory usage with large bean collections
- [ ] 13.4 Optimize database queries for performance

## 14. Testing - Sync Functionality

- [ ] 14.1 Test sync with 1 bean
- [ ] 14.2 Test sync with 10 beans
- [ ] 14.3 Test sync with 50+ beans
- [ ] 14.4 Test sync when Watch is not reachable (verify queueing)
- [ ] 14.5 Test sync when iPhone is off (verify Watch uses cached data)
- [ ] 14.6 Test sync in airplane mode (verify offline access)
- [ ] 14.7 Test debounce logic with rapid bean changes
- [ ] 14.8 Verify automatic retry of failed transfers

## 15. Testing - Watch App Functionality

- [ ] 15.1 Test on Watch Series 6 or equivalent (smaller screen)
- [ ] 15.2 Test on Watch Ultra or Series 9 (larger screen)
- [ ] 15.3 Verify empty state displays correctly
- [ ] 15.4 Verify loading indicator appears on app launch
- [ ] 15.5 Test Digital Crown scrolling
- [ ] 15.6 Test tap navigation to detail view
- [ ] 15.7 Test back navigation from detail view
- [ ] 15.8 Verify no edit/delete buttons are visible (read-only)
- [ ] 15.9 Test long-press does not trigger edit mode
- [ ] 15.10 Verify app works in both light and dark mode

## 16. Testing - Error Scenarios

- [ ] 16.1 Test Watch app with corrupt JSON data
- [ ] 16.2 Test iOS app when Watch is unpaired
- [ ] 16.3 Test WatchConnectivity session activation failures
- [ ] 16.4 Verify iOS app continues functioning when sync fails
- [ ] 16.5 Test app behavior when returning from background

## 17. Documentation and Build Pipeline

- [ ] 17.1 Document manual Xcode build steps for watchOS target
- [ ] 17.2 Verify or document EAS build configuration for watchOS
- [ ] 17.3 Update README with Watch app development instructions
- [ ] 17.4 Document rollback procedure (removing Watch target)
- [ ] 17.5 Add battery impact testing results to documentation

## 18. Final Integration and Polish

- [ ] 18.1 Test complete flow: iOS app launch → sync → Watch displays beans
- [ ] 18.2 Test complete flow: Add bean on iOS → sync → Watch updates
- [ ] 18.3 Test complete flow: Edit bean on iOS → sync → Watch updates
- [ ] 18.4 Test complete flow: Delete bean on iOS → sync → Watch updates
- [ ] 18.5 Verify app icons are properly configured in Assets.xcassets
- [ ] 18.6 Review and optimize battery usage during sync
- [ ] 18.7 Ensure all requirements from specs are met
- [ ] 18.8 Perform final code review and cleanup
