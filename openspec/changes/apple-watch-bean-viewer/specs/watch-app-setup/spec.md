## ADDED Requirements

### Requirement: watchOS target exists in Xcode project

The system SHALL include a watchOS app target named "GrindItWatch" in the existing GrindIt.xcodeproj Xcode project.

#### Scenario: watchOS target is configured

- **WHEN** the Xcode project is opened
- **THEN** a watchOS app target named "GrindItWatch" MUST be present in the target list

#### Scenario: Target uses standalone Watch app model

- **WHEN** the watchOS target is inspected
- **THEN** it MUST be configured as a standalone Watch app (watchOS 7+ model, not Watch App Extension)

### Requirement: Watch app bundle configuration

The system SHALL configure the Watch app with appropriate bundle identifiers and versioning.

#### Scenario: Bundle identifier is set correctly

- **WHEN** the Watch app target is built
- **THEN** the bundle identifier MUST be "com.grindit.app.watchkitapp" (or follow Expo's bundle ID pattern)

#### Scenario: Version numbers match iOS app

- **WHEN** the iOS app version is updated
- **THEN** the Watch app version MUST match the iOS app version number

### Requirement: Build settings for watchOS

The system SHALL configure build settings specific to watchOS development.

#### Scenario: Minimum deployment target is set

- **WHEN** the Watch app is built
- **THEN** the deployment target MUST be watchOS 9.0 or higher

#### Scenario: SwiftUI is enabled

- **WHEN** the Watch app project settings are inspected
- **THEN** SwiftUI MUST be enabled as the UI framework

### Requirement: SQLite.swift dependency

The system SHALL include the SQLite.swift library for database access on watchOS.

#### Scenario: SQLite.swift is added via dependency manager

- **WHEN** dependencies are installed
- **THEN** SQLite.swift MUST be available to the watchOS target via CocoaPods or Swift Package Manager

#### Scenario: SQLite.swift is linked to Watch target

- **WHEN** the Watch app is built
- **THEN** SQLite.swift MUST be successfully linked and importable in Swift files

### Requirement: Shared code between iOS and watchOS

The system SHALL create a Shared folder for code reused between iOS and watchOS targets.

#### Scenario: Shared folder exists

- **WHEN** the Xcode project structure is inspected
- **THEN** a "Shared" folder MUST exist at the ios/ level containing common code

#### Scenario: Shared folder is linked to both targets

- **WHEN** files are added to the Shared folder
- **THEN** they MUST be accessible to both the iOS app target and watchOS app target

### Requirement: Watch app folder structure

The system SHALL organize Watch app code in a structured directory hierarchy.

#### Scenario: GrindItWatch folder contains required subdirectories

- **WHEN** the Watch app target folder is inspected
- **THEN** it MUST contain subdirectories: Models/, Managers/, Database/, and Views/ (or appropriate organization)

#### Scenario: Assets catalog exists for Watch app

- **WHEN** the GrindItWatch folder is inspected
- **THEN** an Assets.xcassets MUST be present for Watch app icons and images

### Requirement: Info.plist configuration for Watch app

The system SHALL configure the Watch app's Info.plist with required keys.

#### Scenario: Required Info.plist keys are present

- **WHEN** the Watch app Info.plist is inspected
- **THEN** it MUST contain WKApplication key set to true (for standalone Watch app)

#### Scenario: WatchKit configuration is complete

- **WHEN** the Watch app is launched
- **THEN** it MUST launch as a standalone app without requiring a companion iOS extension

### Requirement: Build pipeline compatibility

The system SHALL ensure the Watch app builds successfully in the project's build environment.

#### Scenario: Local Xcode builds succeed

- **WHEN** the project is built locally via Xcode
- **THEN** both iOS and watchOS targets MUST build without errors

#### Scenario: Build configuration is documented

- **WHEN** EAS Build does not support watchOS targets
- **THEN** documentation MUST exist for building the Watch app locally via Xcode
