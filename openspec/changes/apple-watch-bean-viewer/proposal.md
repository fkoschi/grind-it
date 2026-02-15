## Why

Coffee enthusiasts who use Grind It often want quick access to their bean collection while preparing their coffee, without pulling out their phone. An Apple Watch companion app provides at-a-glance access to stored beans, allowing users to quickly reference grind settings and bean details while standing at their grinder.

## What Changes

- Add a new Apple Watch companion app target to the Xcode project
- Create a watchOS interface that displays all stored coffee beans
- Implement a minimalistic card-based UI optimized for the Apple Watch screen size
- Enable data synchronization between the iOS app's SQLite database and the Watch app (read-only access)
- Display key bean information: name, roastery, roast level, and grind settings
- Provide a scrollable list view for browsing the bean collection
- Initial version is read-only (no editing, adding, or deleting beans from the Watch)

## Capabilities

### New Capabilities

- `watch-app-setup`: watchOS app target configuration, project structure, and build settings for the Apple Watch companion app
- `watch-bean-display`: Display coffee beans in a card-based UI optimized for Apple Watch, showing essential bean details (name, roastery, grind settings)
- `watch-data-sync`: Synchronize bean data from the iOS app's SQLite database to the Watch app for read-only access

### Modified Capabilities

None - this is an additive feature that doesn't modify existing iOS app capabilities.

## Impact

**Affected Systems:**

- Xcode project configuration (new watchOS target)
- Build pipeline (EAS build configuration for Watch app)
- Database access layer (shared access between iOS and watchOS)
- Data providers (BeanDataProvider may need watchOS compatibility)

**New Dependencies:**

- watchOS SDK and SwiftUI for Watch interface
- WatchConnectivity framework for iOS ↔ Watch communication
- Shared database schema access between iOS and watchOS targets

**No Impact:**

- Existing iOS app functionality remains unchanged
- No breaking changes to current user experience
- Database schema remains the same (read-only access)
