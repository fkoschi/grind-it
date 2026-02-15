## ADDED Requirements

### Requirement: App detects device locale on startup

The app SHALL read the device locale via `expo-localization` at startup and select the matching language (English or German). If the device locale is neither English nor German, the app SHALL fall back to German.

#### Scenario: Device locale is English

- **WHEN** the device locale language code is `en`
- **THEN** the app displays all UI strings in English

#### Scenario: Device locale is German

- **WHEN** the device locale language code is `de`
- **THEN** the app displays all UI strings in German

#### Scenario: Device locale is unsupported

- **WHEN** the device locale language code is neither `en` nor `de` (e.g., `fr`, `es`)
- **THEN** the app falls back to German for all UI strings

### Requirement: Translation files exist for English and German

The app SHALL provide two complete translation files (`locales/en.json` and `locales/de.json`) containing all user-facing strings. Both files SHALL have identical key sets.

#### Scenario: All keys present in both files

- **WHEN** comparing the key sets of `en.json` and `de.json`
- **THEN** both files contain the same set of translation keys with no missing entries

#### Scenario: German file matches current app strings

- **WHEN** the German translation file is loaded
- **THEN** all values match the currently hardcoded German strings in the app (no behavioral change for German users)

### Requirement: All hardcoded UI strings use translation function

Every user-facing string in screens and components SHALL be replaced with a call to the translation function (`t("key")`). No hardcoded German or English display strings SHALL remain in component/screen source files.

#### Scenario: Screen renders translated text

- **WHEN** a screen or component renders user-facing text
- **THEN** the text is sourced from the translation function, not hardcoded

#### Scenario: Alert dialogs use translated strings

- **WHEN** the app shows an alert dialog (e.g., import confirmation, export error)
- **THEN** the alert title and message are sourced from translation keys

### Requirement: Translation keys follow naming convention

Translation keys SHALL use dot-separated namespaces matching their screen or component area (e.g., `dashboard.noData.title`, `settings.roasteries`, `common.cancel`). Common strings reused across screens SHALL use the `common.` prefix.

#### Scenario: Key for a screen-specific string

- **WHEN** a string belongs to a specific screen (e.g., the dashboard empty state title)
- **THEN** its key is prefixed with the screen name (e.g., `dashboard.noData.title`)

#### Scenario: Key for a shared string

- **WHEN** a string is reused across multiple screens (e.g., "Cancel", "Save")
- **THEN** its key uses the `common.` prefix (e.g., `common.cancel`, `common.save`)

### Requirement: i18n initializes synchronously with bundled resources

The i18n system SHALL initialize synchronously at module load time using bundled JSON resources. It SHALL NOT require an async loading step or additional provider wrapper. App startup time SHALL NOT be affected.

#### Scenario: App renders without i18n loading state

- **WHEN** the app starts up
- **THEN** translations are available immediately on first render with no loading spinner or flash of untranslated content

### Requirement: User-generated content is not translated

User-generated content (bean names, roastery names, taste descriptors) stored in the database SHALL NOT be affected by the i18n system. These values are displayed as entered by the user regardless of the active locale.

#### Scenario: Bean name displays as entered

- **WHEN** a user creates a bean with the name "Äthiopien Yirgacheffe"
- **AND** the device locale changes from German to English
- **THEN** the bean name still displays as "Äthiopien Yirgacheffe"
