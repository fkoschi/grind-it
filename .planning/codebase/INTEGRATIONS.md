# External Integrations

**Analysis Date:** 2026-02-23

## APIs & External Services

**AI & Language Models:**
- Vercel AI Gateway (default backend for web API)
  - Model: `anthropic/claude-sonnet-4.5`
  - Endpoint: `POST /api/chat` (location: `app/api/chat+api.ts`)
  - Auth: Vercel Gateway handles authentication

- Apple Intelligence (on-device)
  - SDK: `@react-native-ai/apple` v0.11.0
  - Platform: iOS 26+ only, physical device required
  - Auth: None (on-device model)
  - Implementation: Custom `AppleChatTransport` class in `app/chat.tsx`
  - Context window: 4,096 tokens (hard limit)
  - Known issues: Crashes on window overflow, first token can return as `"null"` string

**Chat API Implementation:**
- Location: `app/api/chat+api.ts`
- Method: `POST`
- Request body: `{ messages: UIMessage[] }`
- Response: Streamed message responses with `Content-Type: application/octet-stream`
- Client hook: `useChat` from `@ai-sdk/react`

## Data Storage

**Databases:**
- SQLite (expo-sqlite 16.0.9)
  - Database file: `grind-it.db` (device-local)
  - Location: Device filesystem (platform-dependent)
  - ORM: Drizzle ORM v0.36.4
  - No external database server

**Schema Tables:**
- `bean_table` - Coffee bean records with grind settings and aroma profiles
  - 9 aroma metrics: fruity, floral, sweet, nutty, spices, roasted, green, sour, other
  - Foreign key to `roastery_table`
  - Timestamps: None (implicit via platform)

- `roastery_table` - Coffee roasteries with location and contact info
  - Fields: id, name, website, address, latitude, longitude, rating

- `bean_taste_table` - Flavor descriptors/vocabulary
  - Fields: id, flavor

- `bean_taste_association_table` - Many-to-many: beans ↔ tastes
  - Junction table with foreign keys to bean_table and bean_taste_table

**File Storage:**
- Local filesystem only via Expo File System (`expo-file-system`)
- Data export/import: JSON files via document picker (`expo-document-picker`)
- No cloud storage integration

**Caching:**
- In-memory via React Context (DatabaseProvider, BeanDataProvider)
- Live queries via Drizzle ORM (`useLiveQuery` hook)
- Zustand stores for UI state (`bean-store.ts`, `toast-store.ts`)

## Authentication & Identity

**Auth Provider:**
- Custom implementation (none detected)
- Chat feature uses Vercel Gateway for backend authentication
- Apple Intelligence: Built-in device authentication, no external provider

**User Sessions:**
- Local-only, no user accounts
- Data persists locally on device
- No multi-device sync

## Platform Integrations

**Apple Watch (watchOS):**
- Native module: `modules/watch-connectivity`
- Transport: WatchConnectivity framework (iOS native)
- Sync functionality: `useWatchSync` hook in `hooks/useWatchSync.ts`
- Data synced: Bean details (name, roastery, grind settings, aroma profile)
- Availability check: `WatchConnectivity.isPaired()`
- Debounce interval: 2 seconds (in `BeanDataProvider.tsx`)

**Clipboard:**
- `expo-clipboard` v8.0.8 - Copy/paste functionality
- Usage: Data sharing within app

**Haptics:**
- `expo-haptics` v15.0.7 - Vibration feedback
- Platform-specific implementation

**Device Localization:**
- `expo-localization` v17.0.8 - Device language/locale detection
- i18n initialization uses device locale (fallback: German)

## Monitoring & Observability

**Error Tracking:**
- Not detected - no Sentry, Bugsnag, or similar integration
- Error logging: Console.error calls in catch blocks

**Logs:**
- Console-based logging (`console.log`, `console.error`)
- Example: Watch sync status logs in `useWatchSync.ts`
- No centralized logging service

**Performance Monitoring:**
- Not detected - no built-in performance tracking
- Storybook development mode: Visual testing capability

## CI/CD & Deployment

**Hosting:**
- EAS (Expo Application Services) - Build service
- App Store Connect - iOS app distribution
- Google Play - Android app distribution (manual)

**CI Pipeline:**
- GitHub Actions workflows in `.github/workflows/`
- Build checks on merge to main
- iOS simulator build validation
- No automated deployment to stores (manual via `eas build --auto-submit`)

**Build Configuration:**
- `eas.json` - Build profiles: development, preview, production
- Profile-specific environment variables
- Auto-increment version codes (Android)
- Scheme configuration (iOS: GrindIt)

**Deployment Targets:**
- **iOS:** App Store via TestFlight submission
  - ASC App ID: 6740140366
  - Auto-submit command: `eas build --platform ios --profile production --auto-submit`

- **Android:** Manual Google Play upload
  - Version code auto-increment enabled

**Release Automation:**
- `standard-version` - Conventional commit-based versioning
- Scripts: `release`, `release:major`, `release:minor`, `release:patch`
- Generates CHANGELOG.md automatically

## Environment Configuration

**Required Environment Variables:**
- `.env` file present (not tracked in git)
- `.env.local` file present (machine-specific)
- Variables not exposed to frontend unless prefixed `EXPO_PUBLIC_`

**Critical Variables:**
- Vercel API keys (if using Vercel AI Gateway beyond default)
- Apple Intelligence keys: None (on-device, no external auth)

**Secrets Location:**
- `.env` / `.env.local` files (root directory)
- EAS environment variables in `eas.json` build profiles
- No vault or secret manager integration detected

## Webhooks & Callbacks

**Incoming:**
- Chat API endpoint: `POST /api/chat` (receives chat messages)
- No other webhook receivers detected

**Outgoing:**
- Not detected - no outgoing webhooks
- Apple Watch syncing is unidirectional (phone → watch)

## Data Sync & Integration

**Apple Watch Sync:**
- Direction: One-way (iPhone → Apple Watch)
- Trigger: BeanDataProvider detects database changes
- Transport: Native WatchConnectivity framework
- Format: JSON serialized beans with roastery data
- Retry: Error logged but app continues (non-critical)

**Internal Data Flow:**
- Bean changes → Drizzle live queries → BeanDataProvider context
- BeanDataProvider → useWatchSync hook (2s debounce) → Watch sync
- No external cloud sync

## Third-Party SDKs & Packages

**AI/ML:**
- `ai` (Vercel AI SDK)
- `@ai-sdk/react`
- `@ai-sdk/openai`
- `@react-native-ai/apple`

**UI/Styling:**
- `tamagui` (UI framework)
- `@tamagui/animations-moti`
- `@tamagui/lucide-icons`
- `react-native-reanimated`
- `react-native-gesture-handler`

**Forms:**
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

**Navigation:**
- `expo-router`
- `@react-navigation/native`
- `@react-navigation/elements`

**Database:**
- `drizzle-orm`
- `drizzle-kit`
- `expo-sqlite`

**Internationalization:**
- `i18next`
- `react-i18next`

**Development:**
- `@storybook/react-native`
- `jest` / `jest-expo`

**Code Quality:**
- `oxlint`
- `oxfmt`
- `husky`
- `lint-staged`

---

*Integration audit: 2026-02-23*
