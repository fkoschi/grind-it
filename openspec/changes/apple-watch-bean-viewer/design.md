## Context

Grind It is a React Native (Expo) app built with TypeScript, using SQLite (Drizzle ORM) for local data storage. The current iOS app has no native watchOS component. The project uses Xcode with CocoaPods for iOS-specific dependencies.

The existing database schema includes:
- `beanTable`: Coffee beans with grind settings (degreeOfGrinding, singleShotDosis, doubleShotDosis) and aroma profiles (9 metrics)
- `roasteryTable`: Roastery information
- `beanTasteTable` and `beanTasteAssociationTable`: Many-to-many taste descriptors

Current constraints:
- Expo-managed workflow with native modules
- SQLite database file stored in iOS app's Documents directory
- No existing data sync infrastructure between platforms
- Build process uses EAS (Expo Application Services)

## Goals / Non-Goals

**Goals:**
- Create a standalone watchOS app that can display bean data when the Watch is offline (not dependent on active iPhone connection)
- Provide a clean, glanceable UI optimized for small Watch screens (38mm-49mm)
- Sync bean data from iOS to Watch using WatchConnectivity framework
- Display essential bean information: name, roastery, grind settings (degree, single/double shot dosis)
- Support scrolling through the bean collection
- Read-only experience (no mutations from Watch)

**Non-Goals:**
- Editing beans from the Watch (future enhancement)
- Real-time synchronization (periodic sync is sufficient)
- Complications or Watch face integration (phase 2)
- Independent data entry on Watch
- Sharing database file directly (each platform has its own SQLite instance)

## Decisions

### 1. Native watchOS App vs React Native for Watch

**Decision**: Build a native watchOS app using SwiftUI instead of attempting to use React Native.

**Rationale**:
- React Native Watch support is limited and requires third-party libraries with poor maintenance
- SwiftUI is the recommended Apple framework for watchOS with excellent performance
- Watch UI paradigms (Digital Crown, small screens, glanceable views) are better suited to native development
- Smaller binary size and better battery efficiency with native code
- Direct access to WatchConnectivity framework without bridge overhead

**Alternatives Considered**:
- React Native for Watch: Rejected due to limited ecosystem, poor performance, and maintenance burden
- Web-based Watch app: Rejected as watchOS doesn't support web views in the same way iOS does

### 2. Data Synchronization Strategy

**Decision**: Use WatchConnectivity framework with background transfers and maintain separate SQLite databases on each platform.

**Architecture**:
```
iOS App (React Native)                    watchOS App (SwiftUI)
├─ SQLite Database (source)               ├─ SQLite Database (replica)
├─ WatchConnectivity Manager              ├─ WatchConnectivity Manager
│  ├─ Serialize beans to JSON             │  ├─ Receive JSON data
│  ├─ Send via transferUserInfo()         │  ├─ Deserialize to Swift models
│  └─ Background transfer queue           │  └─ Update local SQLite
└─ Auto-sync on bean changes/launch       └─ Load from local DB instantly
                                          └─ Pull-to-refresh shows sync time
```

**Sync Strategy (Hybrid Push-Pull)**:
- **iOS Side**: Automatically pushes via transferUserInfo() when:
  - Beans are added, edited, or deleted
  - App launches (ensures Watch has latest data)
  - NO timers or periodic polling
- **Watch Side**:
  - Opens instantly, loads from local cached DB
  - Pull-to-refresh reloads from local DB + shows "last synced" timestamp
  - NO active sync requests to iPhone
  - Displays whatever data iOS already sent in background

**Rationale**:
- `transferUserInfo()` provides guaranteed delivery with background transfers
- Separate databases avoid file sharing complexity and allow offline access
- JSON serialization is simple and debuggable
- Watch displays cached data instantly (no waiting for sync)
- Battery efficient: no timers, sync only on actual data changes
- UX feels like "pull-to-refresh" but uses background-delivered data

**Alternatives Considered**:
- Shared SQLite file via App Groups: Rejected because Watch needs offline access and React Native SQLite library may not support App Groups easily
- `sendMessage()` for real-time sync: Rejected as it requires active connection and drains battery
- True pull-based sync (Watch requests data): Rejected because WatchConnectivity is fundamentally push-based; hybrid approach provides same UX with better battery life
- Timer-based periodic sync: Rejected due to battery drain and unnecessary syncs when data hasn't changed
- Core Data with CloudKit: Rejected to avoid introducing new persistence layer and iCloud dependency

### 3. Watch UI Architecture

**Decision**: SwiftUI with List + Card component for bean display.

**UI Structure**:
```
ContentView (SwiftUI)
├─ NavigationStack
│  └─ List
│     └─ ForEach(beans)
│        └─ BeanCardView
│           ├─ VStack (name, roastery)
│           ├─ HStack (grind settings)
│           └─ NavigationLink → BeanDetailView
```

**Rationale**:
- List provides native scrolling with Digital Crown support
- Cards provide visual separation and glanceable information
- NavigationStack allows tapping a bean to see full details
- SwiftUI's automatic layout handles different Watch sizes (38mm-49mm)

**Alternatives Considered**:
- TabView with pagination: Rejected as swiping through many beans is tedious
- Grid layout: Rejected as Watch screen is too small for multiple columns

### 4. Xcode Project Structure

**Decision**: Add watchOS app target to the existing `GrindIt.xcodeproj` with a Watch App target (not Watch App Extension, using watchOS 7+ standalone app model).

**Structure**:
```
ios/
├─ GrindIt/                 (existing iOS app)
├─ GrindItWatch/            (new Watch app target)
│  ├─ Assets.xcassets
│  ├─ ContentView.swift
│  ├─ BeanCardView.swift
│  ├─ Models/
│  │  └─ Bean.swift
│  ├─ Managers/
│  │  └─ WatchConnectivityManager.swift
│  └─ Database/
│     └─ SQLiteManager.swift
└─ Shared/                  (shared code between iOS and Watch)
   └─ BeanSchema.swift      (data models)
```

**Rationale**:
- Single Xcode project simplifies build configuration
- Shared folder allows code reuse for data models
- Standalone Watch app (watchOS 7+) doesn't require iOS extension
- Easier to manage in EAS build pipeline

**Alternatives Considered**:
- Separate Xcode project for Watch: Rejected due to build pipeline complexity
- Watch App Extension model: Rejected as it's deprecated in favor of standalone apps

### 5. SQLite on watchOS

**Decision**: Use SQLite.swift library for database access on watchOS.

**Rationale**:
- Lightweight, well-maintained Swift wrapper for SQLite
- No need for ORM complexity on Watch (simple read queries)
- Compatible with watchOS SDK
- Same database schema as iOS (Drizzle schema can be translated to SQLite.swift table definitions)

**Alternatives Considered**:
- Core Data: Rejected to avoid mixing persistence layers
- GRDB: Rejected as SQLite.swift is simpler for read-only use case
- Direct SQLite C API: Rejected due to verbose code and type safety issues

## Risks / Trade-offs

**[Risk]** WatchConnectivity transfers may fail if iPhone is not reachable
→ **Mitigation**: Watch app displays cached data; sync retries automatically when connection is restored. Show "last synced" timestamp in UI.

**[Risk]** Data sync could transfer large payloads if user has many beans
→ **Mitigation**: Implement incremental sync with timestamps (only sync changed beans). Start with full sync for MVP, optimize later.

**[Risk]** iOS app (React Native) needs native module to interface with WatchConnectivity
→ **Mitigation**: Create a simple Expo native module or use `expo-modules` to expose WatchConnectivity activation and data transfer methods to React Native.

**[Risk]** Xcode project modifications may conflict with Expo prebuild process
→ **Mitigation**: Use Expo config plugins to automate Watch target setup. Document manual steps if config plugin is too complex for MVP.

**[Risk]** EAS Build may not support watchOS targets out of the box
→ **Mitigation**: Verify EAS watchOS support; may need custom build configuration or local builds initially. Fall back to local Xcode builds if necessary.

**[Trade-off]** Native watchOS app introduces a new technology stack (SwiftUI)
→ **Accepted**: Necessary for proper Watch experience. Keep Watch app simple to minimize maintenance burden.

**[Trade-off]** Separate SQLite databases mean potential data drift if sync fails
→ **Accepted**: Read-only Watch app minimizes risk. iOS app is source of truth. Watch data can be fully replaced on next successful sync.

## Migration Plan

**Phase 1: Setup**
1. Add watchOS target to Xcode project
2. Configure build settings and Info.plist for Watch app
3. Add SQLite.swift dependency via CocoaPods or SPM
4. Update EAS build configuration (or document local build process)

**Phase 2: iOS Bridge**
5. Create Expo native module for WatchConnectivity
6. Expose `activateSession()` and `sendBeans(data)` methods to React Native
7. Integrate into BeanDataProvider to trigger sync on data changes

**Phase 3: Watch App**
8. Implement SQLite database on Watch
9. Create WatchConnectivityManager to receive bean data
10. Build SwiftUI views (ContentView, BeanCardView, BeanDetailView)
11. Implement data deserialization and database updates

**Phase 4: Testing**
12. Test sync with various bean counts (1, 10, 50+ beans)
13. Test offline scenarios (iPhone off, Airplane mode)
14. Test on different Watch models (Series 6, 7, 8, 9, Ultra)
15. Verify battery impact during background sync

**Rollback Strategy**:
- Watch app is additive; can be removed by deleting watchOS target from Xcode
- iOS native module can be conditionally loaded (no impact if Watch target is absent)
- No database schema changes, so no migration needed

## Open Questions

1. **Expo Config Plugin vs Manual Setup**: Should we automate Watch target creation with an Expo config plugin, or document manual Xcode steps? (Decision: Start manual, automate if needed)

2. **Which Bean Fields to Display**: Should we show all 9 aroma metrics on Watch or just a summary? (Decision: Defer to specs; likely show degree of grind + shot dosis for MVP, aroma in detail view)

3. **Sync Trigger Logic**: When should iOS app trigger sync? On every bean edit, on app launch, or manual button? (Decision: Defer to specs; likely on app launch + background sync)

4. **Watch Complications**: Should MVP include a complication showing favorite bean or bean count? (Decision: Non-goal for MVP, revisit in phase 2)
