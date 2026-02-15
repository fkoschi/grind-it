## ADDED Requirements

### Requirement: WatchConnectivity session activation
The system SHALL activate WatchConnectivity sessions on both iOS and watchOS to enable communication.

#### Scenario: iOS app activates WatchConnectivity session on launch
- **WHEN** the iOS app launches
- **THEN** it MUST activate a WatchConnectivity session if a paired Watch is available

#### Scenario: Watch app activates WatchConnectivity session on launch
- **WHEN** the Watch app launches
- **THEN** it MUST activate a WatchConnectivity session to receive data from the iOS app

#### Scenario: Session activation handles no paired Watch gracefully
- **WHEN** the iOS app activates WatchConnectivity but no Watch is paired
- **THEN** the app MUST continue functioning without errors

### Requirement: Expo native module for WatchConnectivity
The system SHALL provide a React Native bridge to WatchConnectivity framework on iOS.

#### Scenario: Native module exposes activateSession method
- **WHEN** the React Native code imports the WatchConnectivity module
- **THEN** an activateSession() method MUST be callable from TypeScript

#### Scenario: Native module exposes sendBeans method
- **WHEN** the React Native code needs to sync beans to Watch
- **THEN** a sendBeans(data) method MUST be available that accepts bean data as JSON

#### Scenario: Native module handles errors gracefully
- **WHEN** WatchConnectivity operations fail (e.g., Watch not reachable)
- **THEN** the native module MUST return error messages to React Native without crashing

### Requirement: Bean data serialization to JSON
The system SHALL serialize bean data from the iOS SQLite database to JSON format for transfer.

#### Scenario: All beans are serialized on sync
- **WHEN** a sync operation is triggered
- **THEN** all beans in the iOS database MUST be converted to a JSON array

#### Scenario: JSON includes required bean fields
- **WHEN** bean data is serialized
- **THEN** each bean object MUST include: id, name, roastery (including roastery name), degreeOfGrinding, singleShotDosis, doubleShotDosis, arabicaAmount, robustaAmount

#### Scenario: JSON includes optional fields if present
- **WHEN** a bean has taste associations or aroma profile data
- **THEN** these fields MUST be included in the JSON if not null

#### Scenario: Roastery data is joined in serialization
- **WHEN** a bean has a roastery foreign key
- **THEN** the roastery name MUST be joined and included in the bean JSON object (not just the ID)

### Requirement: Data transfer via WatchConnectivity
The system SHALL use WatchConnectivity transferUserInfo for guaranteed background delivery.

#### Scenario: iOS sends bean data via transferUserInfo
- **WHEN** the iOS app triggers a sync
- **THEN** it MUST call WatchConnectivity's transferUserInfo() method with the serialized bean JSON

#### Scenario: transferUserInfo queues in background
- **WHEN** the Watch is not immediately reachable
- **THEN** the transfer MUST be queued and delivered when the Watch becomes reachable

#### Scenario: Watch receives data in background
- **WHEN** the iOS app sends data via transferUserInfo
- **THEN** the Watch app MUST receive the data even if it's not actively running (background delivery)

### Requirement: Watch app deserializes and stores bean data
The system SHALL deserialize received JSON on the Watch and update the local SQLite database.

#### Scenario: Received JSON is parsed into Swift models
- **WHEN** the Watch app receives bean data
- **THEN** it MUST parse the JSON into Swift Bean model objects

#### Scenario: Watch database is cleared before update
- **WHEN** new bean data is received
- **THEN** the Watch's local SQLite database MUST be cleared of old beans before inserting new data

#### Scenario: Beans are inserted into Watch database
- **WHEN** parsed Bean models are ready
- **THEN** they MUST be inserted into the Watch's local SQLite database

#### Scenario: UI refreshes after database update
- **WHEN** the Watch database is updated with new beans
- **THEN** the Watch UI MUST refresh to display the updated bean list

### Requirement: Sync trigger on iOS app launch
The system SHALL automatically sync beans to Watch when the iOS app launches.

#### Scenario: Sync occurs on app launch
- **WHEN** the iOS app completes its initial launch sequence
- **THEN** it MUST trigger a bean sync to the Watch

#### Scenario: Sync does not block app startup
- **WHEN** the sync is triggered on launch
- **THEN** it MUST run asynchronously without blocking the UI or delaying app readiness

#### Scenario: No timer-based periodic sync
- **WHEN** the iOS app is running
- **THEN** it MUST NOT use timers or periodic polling to trigger syncs
- **AND** syncs MUST only occur on actual data changes or app launch events

### Requirement: Sync trigger on bean data changes
The system SHALL sync beans to Watch when bean data is modified in the iOS app.

#### Scenario: Sync occurs after adding a bean
- **WHEN** a new bean is added in the iOS app
- **THEN** a sync MUST be triggered to send updated bean data to the Watch

#### Scenario: Sync occurs after editing a bean
- **WHEN** an existing bean is modified in the iOS app
- **THEN** a sync MUST be triggered to send updated bean data to the Watch

#### Scenario: Sync occurs after deleting a bean
- **WHEN** a bean is deleted in the iOS app
- **THEN** a sync MUST be triggered to send updated bean data to the Watch

#### Scenario: Sync is debounced for rapid changes
- **WHEN** multiple beans are edited in quick succession
- **THEN** syncs MUST be debounced to avoid sending duplicate transfers (e.g., wait 2 seconds after last change)

### Requirement: Offline Watch access
The system SHALL allow the Watch app to function offline using cached bean data.

#### Scenario: Watch displays beans when iPhone is off
- **WHEN** the iPhone is powered off or unreachable
- **THEN** the Watch app MUST display beans from its local database

#### Scenario: Watch displays beans in airplane mode
- **WHEN** both iPhone and Watch are in airplane mode
- **THEN** the Watch app MUST display beans from its local database

#### Scenario: Watch indicates data may be stale
- **WHEN** the Watch has not synced recently
- **THEN** the UI MAY display a "Last synced: [timestamp]" indicator (optional for MVP)

### Requirement: Full sync strategy for MVP
The system SHALL use a full database replacement strategy for the initial implementation.

#### Scenario: Full bean list is sent on every sync
- **WHEN** a sync is triggered
- **THEN** the complete list of all beans MUST be serialized and sent to the Watch

#### Scenario: Incremental sync is not required for MVP
- **WHEN** implementing the sync logic
- **THEN** incremental sync (only sending changed beans) is NOT required for the initial version

### Requirement: Error handling and retry logic
The system SHALL handle sync errors gracefully and retry failed transfers.

#### Scenario: Sync errors do not crash the iOS app
- **WHEN** WatchConnectivity transferUserInfo fails
- **THEN** the iOS app MUST log the error but continue functioning normally

#### Scenario: Failed transfers are retried automatically
- **WHEN** a transfer fails due to temporary connectivity issues
- **THEN** WatchConnectivity MUST automatically retry the transfer when the Watch is reachable

#### Scenario: Watch handles corrupt JSON gracefully
- **WHEN** the Watch receives malformed JSON data
- **THEN** it MUST log the error and retain the previous cached bean data without crashing

### Requirement: WatchConnectivity session state monitoring
The system SHALL monitor WatchConnectivity session state and handle state changes.

#### Scenario: iOS monitors Watch reachability
- **WHEN** WatchConnectivity session state changes
- **THEN** the iOS app MUST detect whether the Watch is reachable or not

#### Scenario: iOS monitors Watch pairing state
- **WHEN** the Watch is unpaired from the iPhone
- **THEN** the iOS app MUST detect the unpaired state and stop attempting to sync

#### Scenario: Watch activates session when returning from background
- **WHEN** the Watch app returns to the foreground after being backgrounded
- **THEN** it MUST ensure the WatchConnectivity session is active and ready to receive data

### Requirement: Watch app loads data instantly on open
The system SHALL load bean data from local cache immediately when the Watch app opens.

#### Scenario: Instant load from local database
- **WHEN** the Watch app is opened (.onAppear)
- **THEN** it MUST load beans from the local SQLite database synchronously
- **AND** display the cached data immediately without waiting for sync

#### Scenario: No loading spinner on app open
- **WHEN** the Watch app loads cached data
- **THEN** it MUST NOT show a loading spinner or delay
- **AND** it MAY show a "last synced" timestamp indicator

### Requirement: Pull-to-refresh reloads from local cache
The system SHALL provide pull-to-refresh functionality that reloads from local database.

#### Scenario: Pull-to-refresh reloads local data
- **WHEN** the user performs pull-to-refresh gesture on the Watch
- **THEN** the app MUST reload beans from the local SQLite database
- **AND** update the "last synced" timestamp display

#### Scenario: Pull-to-refresh does not trigger active sync
- **WHEN** the user pulls to refresh
- **THEN** the app MUST NOT send a sync request to the iPhone
- **AND** it MUST display whatever data iOS already sent via background delivery

#### Scenario: Last synced timestamp is displayed
- **WHEN** the Watch app displays the bean list
- **THEN** it MUST show a "Last synced: X mins/hours ago" indicator
- **AND** update this timestamp when new data arrives from iOS

#### Scenario: Pull-to-refresh shows updated timestamp
- **WHEN** the user pulls to refresh
- **THEN** the timestamp MUST reflect the most recent data received from iOS
- **AND** provide visual feedback that refresh completed
