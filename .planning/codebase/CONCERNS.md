# Codebase Concerns

**Analysis Date:** 2026-02-23

## Tech Debt

**Duplicate Taste Entries in Add Bean Flow:**
- Issue: Line 43 in `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx` has a TODO comment stating "Don't allow duplicate entries to be stored!" The component currently allows users to add the same taste multiple times to a bean without validation.
- Files: `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx:43`
- Impact: Users can accidentally add duplicate taste descriptors for the same bean, creating data integrity issues and poor UX. No database-level constraint prevents this.
- Fix approach: Implement client-side duplicate checking (similar to the `useDuplicateCheck` hook used in `EditBeanTasteFrame`) before calling `addBeanTaste()`. Check against existing bean tastes in store state.

**Hardcoded Design Token in FavoriteButton:**
- Issue: Line 13 in `components/ui/FavoriteButton/FavoriteButton.tsx` has color value `#CD5B5B` hardcoded with a TODO to move it to design tokens.
- Files: `components/ui/FavoriteButton/FavoriteButton.tsx:12-13`
- Impact: Design token inconsistency. Color management is scattered across components instead of centralized in `tamagui.config.ts`. Maintenance burden if design system colors change.
- Fix approach: Extract the color to `tamagui.config.ts` color tokens and reference it as `$favoriteHeartColor` or similar throughout the component.

## KeyboardAvoidingView Antipattern

**Keyboard Avoidance in Modals (Critical):**
- Issue: Multiple components use `KeyboardAvoidingView` with hardcoded `keyboardVerticalOffset` in modal screens, which is unreliable per `CLAUDE.md` documentation. Affected files:
  - `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx:70-73` (offset=100)
  - `components/BottomSheet/Frames/Bean/Edit/EditBeanTasteFrame.tsx` (uses KeyboardAvoidingView)
  - `app/roasteries/RoasteryDetailPage.tsx` (uses KeyboardAvoidingView)
  - `app/add-bean.tsx` (uses KeyboardAvoidingView)
- Files: Listed above
- Impact: Text inputs in modals get hidden behind the keyboard on iOS. Users cannot see what they're typing. CLAUDE.md explicitly warns: "KeyboardAvoidingView does NOT work reliably in iOS modals."
- Safe modification: Replace all `KeyboardAvoidingView` with the `useKeyboardHeight` hook from `hooks/useKeyboard.ts`. Apply the keyboard height as `paddingBottom={keyboardHeight}` on the scrollable content container. Already implemented correctly in `app/chat.tsx:105, 142` - use this as the pattern.

## Apple Intelligence Context Window Limitation

**4,096 Token Hard Limit on Chat Sessions:**
- Issue: Apple Foundation Models (via `@react-native-ai/apple` v0.11.0) have a hard context window of 4,096 tokens. The `AppleChatTransport` in `app/chat.tsx` replays the full conversation history on every request via the `Transcript` object. No message pruning or sliding window is implemented.
- Files: `app/chat.tsx:23-70`, `CLAUDE.md:196-205`
- Impact: After ~10-15 back-and-forth exchanges in chat, users hit the context window limit and get `exceededContextWindowSize` error. The app currently handles this gracefully with error message in `getErrorMessage()` but provides no recovery mechanism (e.g., clearing old messages, suggesting a new chat session).
- Fix approach: Implement message pruning in `AppleChatTransport.sendMessages()` before passing messages to `convertToModelMessages()`. Keep only the last N most recent messages (sliding window of ~5-8 messages). Document the limitation in chat UI ("This chat has a message limit of 10-15 exchanges due to device constraints").

**Known Apple Intelligence Package Bugs:**
- Bug 1: Context overflow can crash the app instead of throwing catchable error (`@react-native-ai/apple` #125)
- Bug 2: First token in streamed responses can return literal `"null"` string (`@react-native-ai/apple` #128)
- Files: `app/chat.tsx`, `node_modules/@react-native-ai/apple`
- Workaround: Error handling is in place (`app/chat.tsx:58-61`), but add extra null-string filtering in message rendering if needed.

**Simulator Incompatibility (Expected):**
- Issue: Apple Intelligence completely unavailable on iOS simulator. Generates `FoundationModels.LanguageModelSession.GenerationError -1`.
- Files: `app/chat.tsx:36-42, 72-76`
- Impact: Chat feature cannot be tested in simulator, only on physical iOS 26+ device with Apple Intelligence enabled and model downloaded.
- Current mitigation: `getUnavailableReason()` detects non-iOS or missing Apple availability and displays banner with explanation. Adequate.

## Type Safety Issues

**`any` Type Annotations:**
- Issue: Several components use `any` type which violates strict TypeScript principles and code style guide (`.claude/rules/code-style-guide.md`).
- Files:
  - `components/ui/Toast/Toast.stories.tsx:24` - `ToastTrigger` props
  - `components/ui/HapticTab/HapticTab.tsx:4` - Component props
  - `components/ui/Pages/RoasteryDetailPage/RoasteryDetailPage.stories.tsx:10` - Storybook stories
  - `components/BeanHeaderLayout/BeanHeaderLayout.Details.tsx:12` - Details props
- Impact: Loss of type safety and IDE autocomplete in these components. Makes refactoring risky.
- Fix approach: Replace each `any` with proper typed interfaces. For Storybook stories, use `React.FC<ComponentProps>`. For HapticTab, define proper prop interface matching usage.

## Missing Error Boundaries and Error Handling

**Limited Error Handling in Database Operations:**
- Issue: Database operations in multiple files lack comprehensive error handling:
  - `app/bean/details/[id].tsx:30-48` - `fetchTasteByBeanId()` has no error handling
  - `app/add-bean.tsx:71-115` - `onSubmit()` calls `insertBean()` with no try/catch
  - Most database mutation calls in bottom sheet frames lack error handling
- Files: `app/bean/details/[id].tsx`, `app/add-bean.tsx`, `components/BottomSheet/Frames/Bean/Edit/EditBeanTasteFrame.tsx:60-78`
- Impact: Silent failures when database operations fail. Users won't be notified if data isn't saved. Exception crashes app if unhandled.
- Fix approach: Wrap all database operations in try/catch blocks. Call toast notification on error (use `@/components/ui/Toast` already in codebase). Example: `catch (error) { showToast({ message: t("common.error.saveFailed"), type: "error" }); }`

**Missing Error State in Chat:**
- Issue: `app/chat.tsx:100-102` logs errors to console but doesn't display them to user. Error state exists in `useChat()` but `error` variable is unused.
- Files: `app/chat.tsx:100-102`
- Impact: Users don't know when chat fails. Silent failures.
- Fix approach: Add error display below unavailability banner. Show user-friendly error messages via toast or inline alert.

## Test Coverage Gaps

**Minimal Test Coverage:**
- Issue: Only 2 test files in the entire application (outside node_modules):
  - `utils/__tests__/dataExportImport.test.ts` - Covers data export/import with mocked DB
  - `utils/fuzzyMatch.test.ts` - Tests fuzzy matching utility
- Files: Test directory structure sparse
- Impact: Major features untested:
  - Bean CRUD operations (create, read, update, delete)
  - Taste filtering and suggestion logic
  - Roastery search and selection
  - Chat message handling
  - Database schema migrations
  - Sync and backup functionality
- Priority: High - Database operations and chat are critical user flows
- Safe modification: Start with unit tests for hooks (`useBeanDetails`, `useDuplicateCheck`, `useKeyboardHeight`). Add integration tests for database queries. Use jest-expo preset already configured in `package.json`.

## Fragile Areas

**Bean Taste Management State Complexity:**
- Files: `store/bean-store.ts`, `app/add-bean.tsx:74-80`, `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx:43-65`
- Why fragile: Bean tastes exist in three states during creation: (1) new unsaved tastes in Zustand store with `id: -1`, (2) selected existing tastes with database `id`, (3) tastes being filtered. The filter between new vs. existing tastes using `id !== -1` is fragile and error-prone. No validation prevents invalid state transitions.
- Safe modification: Create explicit type for taste state: `type TasteEntry = { type: 'new' | 'existing'; id: number; flavor: string }`. Use discriminated union pattern to prevent invalid combinations. Add state machine validation in store.

**Roastery Selection in Add Bean Modal:**
- Files: `app/add-bean.tsx:52`, `components/BottomSheet/Frames/Roastery/SelectRoasteryFrame.tsx`
- Why fragile: Roastery can be undefined in form data, but database expects nullable int. No validation that selected roastery exists in database before insert. Google Places integration uses Nominatim API which may return invalid coordinates.
- Safe modification: Add validation: (1) Validate roastery ID exists before insert, (2) Add bounds checking for lat/lon coordinates (±90, ±180), (3) Add fallback handling for missing coordinates.

**Large Component Files:**
- Files with 250+ lines:
  - `app/chat.tsx` (345 lines) - Complex state management, streaming, error handling
  - `app/roasteries/RoasteryDetailPage.tsx` (338 lines) - Multiple bottom sheets, form handling
  - `app/add-bean.tsx` (286 lines) - Multi-step form with bean creation
  - `app/bean/edit/[id].tsx` (278 lines) - Editing with multiple sub-components
  - `app/settings.tsx` (272 lines) - Settings panel with multiple features
- Impact: Hard to understand, test, and modify. High risk of introducing bugs.
- Fix approach: Break into smaller focused components following composition pattern from `.claude/rules/code-compositions.md`. Extract bottom sheet content into separate component files.

## Data Validation Gaps

**Insufficient Input Validation:**
- Issue: Multiple form inputs lack validation:
  - Taste flavor names: No length limits, no sanitization
  - Roastery names and URLs: No format validation, no length limits
  - Grind degree and dosage: Numeric validation exists via Zod in `app/add-bean.tsx` (min/max), but similar forms in bottom sheets lack it
  - Aroma values: Unchecked if they're 0-100 range in `EditAromaFrame.tsx`
- Files: `components/BottomSheet/Frames/Taste/AddTasteFrame.tsx`, `components/BottomSheet/Frames/Roastery/AddRoasteryFrame.tsx`, `components/BottomSheet/Frames/Bean/Edit/EditAromaFrame.tsx`
- Impact: Invalid or malicious data can be stored. UI can display truncated/broken text.
- Fix approach: Create shared Zod schemas for all domain entities and use with react-hook-form across all forms (not just `add-bean.tsx`). Add max-length inputs in UI.

## Performance Concerns

**Synchronous Database Queries in Render:**
- Issue: `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx:53-61` calls `selectTasteNotInArray()` synchronously during render.
- Files: `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx:53-61`
- Impact: Blocking render if database has large taste list. No loading state.
- Fix approach: Move into `useCallback` with memoization. Load suggestions via `useLiveQuery` (already used in `app/add-bean.tsx:55`).

**N+1 Query Problem in Bean Details:**
- Issue: `app/bean/details/[id].tsx:30-48` fetches tastes via two separate queries: first get taste IDs from association table, then fetch taste data. Could be single join query.
- Files: `app/bean/details/[id].tsx:30-48`
- Impact: Extra database round-trips, inefficient for large datasets.
- Fix approach: Add join query to `db/queries.ts`: `selectBeanTastesWithFlavors(db, beanId)` that returns both in single query.

## Security & Data Integrity

**No Referential Integrity Enforcement:**
- Issue: Database schema uses foreign keys in `beanTasteAssociationTable` (lines 43-48 in `db/schema.ts`) but SQLite foreign key constraints may not be enforced at the ORM level.
- Files: `db/schema.ts`, `provider/DatabaseProvider.tsx`
- Impact: Deleting a roastery or taste could orphan records. No cascade delete configured.
- Fix approach: Verify foreign key constraints are enabled in SQLite. Add cascade delete rules: `.references(() => beanTable.id, { onDelete: 'cascade' })` in schema.

**Missing Data Validation on Import:**
- Issue: `utils/dataImport.ts` checks export version and JSON structure but doesn't validate:
  - Aroma values are 0-100
  - Arabica/robusta amounts sum to 100 (if both present)
  - Bean IDs in associations reference existing beans
- Files: `utils/dataImport.ts`, `utils/__tests__/dataExportImport.test.ts`
- Impact: Corrupted import data could partially corrupt database state.
- Fix approach: Add schema validation using Zod for imported data. Test edge cases (empty database, duplicate IDs, foreign key violations).

## Deprecated/At-Risk Dependencies

**`@react-native-ai/apple` Known Issues:**
- Package: `@react-native-ai/apple@^0.11.0` (package.json:32)
- Risk: Multiple reported bugs (context overflow crash, null-string token), no recent updates
- Impact: Chat feature stability compromised on iOS
- Monitoring: Watch GitHub issues on `callstackincubator/ai` repository

**Legacy Markdown Rendering:**
- Package: `react-native-markdown-display@^7.0.2` (package.json:87) - Unmaintained since 2021
- Risk: Security patches, React Native compatibility
- Alternative: Consider `@expensify/react-native-live-markdown` (already in deps for editing)
- Impact: Chat message rendering may break with future React Native versions

## Environment & Secrets Management

**Environment Variables Scattered:**
- Issue: `.env`, `.env.local`, `ios/.xcode.env`, `ios/.xcode.env.local` all exist with different purposes. No clear documentation on which is used where.
- Files: Multiple `.env*` files
- Impact: Developer confusion, risk of accidentally committing secrets to wrong file
- Fix approach: Create `.env.example` documenting all required variables and their purpose. Document in README which file is used in which context (dev, build, production).

**API Endpoint Hardcoded:**
- Issue: `app/api/chat+api.ts` hardcodes `gateway("anthropic/claude-sonnet-4.5")` without ability to use different models per environment.
- Files: `app/api/chat+api.ts:7`
- Impact: Cannot A/B test models or switch to cheaper/faster models via environment config
- Fix approach: Move model selection to environment variable: `process.env.EXPO_PUBLIC_AI_MODEL || "anthropic/claude-sonnet-4.5"`

---

*Concerns audit: 2026-02-23*
