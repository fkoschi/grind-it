## ADDED Requirements

### Requirement: List view displays all beans
The system SHALL display all coffee beans stored in the Watch's local database in a scrollable list view.

#### Scenario: Beans are displayed in a list
- **WHEN** the Watch app is launched
- **THEN** all beans MUST be displayed in a vertical scrollable list

#### Scenario: List is empty when no beans exist
- **WHEN** the Watch app has no synced beans
- **THEN** the list view MUST display an empty state message (e.g., "No beans synced yet")

#### Scenario: List supports Digital Crown scrolling
- **WHEN** the user rotates the Digital Crown
- **THEN** the bean list MUST scroll smoothly up or down

### Requirement: Bean card displays essential information
The system SHALL display each bean in a card format showing name, roastery, and grind settings.

#### Scenario: Card shows bean name
- **WHEN** a bean is displayed in the list
- **THEN** the bean's name MUST be prominently visible on the card

#### Scenario: Card shows roastery name
- **WHEN** a bean has an associated roastery
- **THEN** the roastery name MUST be displayed on the card below or near the bean name

#### Scenario: Card shows grind settings
- **WHEN** a bean has grind settings configured
- **THEN** the card MUST display degreeOfGrinding, singleShotDosis, and doubleShotDosis values

#### Scenario: Card handles missing roastery gracefully
- **WHEN** a bean has no associated roastery
- **THEN** the card MUST display "Unknown Roastery" or omit the roastery field

#### Scenario: Card handles missing grind settings gracefully
- **WHEN** a bean has null or missing grind settings
- **THEN** the card MUST display "Not set" or hide the missing fields

### Requirement: Card UI is optimized for Watch screen sizes
The system SHALL ensure cards are readable and visually balanced on all Apple Watch sizes.

#### Scenario: Cards display correctly on 38mm-41mm watches
- **WHEN** the app runs on smaller Watch models (Series 3, SE, Series 4-6 38mm/40mm/41mm)
- **THEN** card text MUST be legible without horizontal scrolling or truncation

#### Scenario: Cards display correctly on 42mm-49mm watches
- **WHEN** the app runs on larger Watch models (Series 4-9 44mm/45mm, Ultra 49mm)
- **THEN** cards MUST utilize the larger screen space while maintaining visual balance

### Requirement: Tap to view bean details
The system SHALL allow users to tap a bean card to navigate to a detail view.

#### Scenario: Tapping a card opens detail view
- **WHEN** user taps on a bean card
- **THEN** the app MUST navigate to a BeanDetailView showing full bean information

#### Scenario: Detail view shows all bean fields
- **WHEN** the BeanDetailView is displayed
- **THEN** it MUST show name, roastery, roast percentages (robusta/arabica), grind settings, and any additional metadata

#### Scenario: Back navigation returns to list
- **WHEN** user swipes right or taps the back button in the detail view
- **THEN** the app MUST return to the bean list view

### Requirement: Card design is minimalistic
The system SHALL use a clean, minimalistic design with appropriate spacing and typography.

#### Scenario: Card has clear visual separation
- **WHEN** multiple cards are displayed in the list
- **THEN** each card MUST have clear borders, padding, or spacing to visually separate them

#### Scenario: Typography is legible
- **WHEN** text is displayed on cards
- **THEN** font sizes MUST be appropriate for Watch screens (minimum 12pt for body text, larger for bean names)

#### Scenario: Card uses appropriate color scheme
- **WHEN** cards are rendered
- **THEN** they MUST use a color scheme that works in both light and dark Watch modes

### Requirement: List performance with many beans
The system SHALL maintain smooth scrolling performance even with a large bean collection.

#### Scenario: List scrolls smoothly with 50+ beans
- **WHEN** the Watch app has 50 or more beans synced
- **THEN** scrolling through the list MUST remain smooth without lag or stuttering

#### Scenario: Cards are efficiently rendered
- **WHEN** the list is scrolled
- **THEN** only visible and adjacent cards MUST be rendered (lazy loading)

### Requirement: Read-only interaction
The system SHALL prevent editing, adding, or deleting beans from the Watch interface.

#### Scenario: No edit buttons are present
- **WHEN** a bean card or detail view is displayed
- **THEN** no edit, delete, or add buttons MUST be visible

#### Scenario: Long-press does not trigger edit mode
- **WHEN** user long-presses a bean card
- **THEN** no context menu or edit actions MUST appear

### Requirement: Bean data refresh indicator
The system SHALL indicate when bean data is being loaded or refreshed.

#### Scenario: Loading state is shown on app launch
- **WHEN** the Watch app is first launched and loading data from the database
- **THEN** a loading indicator MUST be displayed until beans are loaded

#### Scenario: Pull to refresh is not required for MVP
- **WHEN** user attempts to pull down on the list
- **THEN** no manual refresh action is required (sync is automatic via WatchConnectivity)
