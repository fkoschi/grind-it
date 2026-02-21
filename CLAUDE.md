# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grind It is a React Native mobile app built with Expo for coffee lovers who grind their beans at home. It helps track coffee beans, origins, and grind settings to brew the perfect cup.

## Core Technologies

- **Framework**: Expo (React Native) with expo-router for file-based navigation
- **Language**: TypeScript with strict mode enabled
- **UI Framework**: Tamagui (React Native UI framework with custom theme)
- **Database**: SQLite with Drizzle ORM
- **State Management**: Zustand stores
- **Animations**: Reanimated with Moti
- **AI Integration**: Vercel AI SDK with OpenAI and Apple Intelligence APIs
- **Development Tools**: Storybook for component development

## Build & Development Commands

```bash
# Development
npm start                    # Start Expo dev server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator
npm run storybook            # Start with Storybook enabled (sets EXPO_PUBLIC_STORYBOOK_ENABLED=true)

# Code Quality
npm test                     # Run Jest tests (watch mode)
npm run format               # Format code with oxfmt
npm run lint                 # Lint with oxlint
npm run lint:fix             # Auto-fix lint issues

# Building
eas build --platform ios --profile development           # Development build
eas build --platform ios --profile production            # Production build
eas build --platform ios --profile production --auto-submit  # Build and submit to TestFlight
```

## Release Process

This project uses conventional commits for automated versioning:

- `feat:` - Minor version bump (1.4.0 → 1.5.0)
- `fix:` - Patch version bump (1.4.0 → 1.4.1)
- `feat!:` or `BREAKING CHANGE:` - Major version bump (1.4.0 → 2.0.0)

```bash
# Release workflow (always from main branch)
npm run release                    # Auto-detect version bump from commits
git push --follow-tags origin main # Push commits AND tags
eas build --platform ios --profile production --auto-submit

# Manual version control
npm run release:patch              # Force patch bump
npm run release:minor              # Force minor bump
npm run release:major              # Force major bump
```

The release script updates both `package.json` and `app.json` versions automatically and generates a CHANGELOG.md.

## Architecture

### File-Based Routing (expo-router)

The app uses expo-router with a Stack navigator. Routes are defined by files in the `app/` directory:

- `app/index.tsx` - Dashboard (main screen)
- `app/settings.tsx` - Settings screen
- `app/add-bean.tsx` - Add/edit bean modal
- `app/chat.tsx` - AI chat assistant modal
- `app/bean/[id].tsx` - Bean detail screen
- `app/roasteries/EditRoasteryPage.tsx` - Roastery editor
- `app/taste/EditTasteComponent.tsx` - Taste editor

### Database Schema (Drizzle ORM)

Located in `db/schema.ts`:

- `beanTable` - Coffee bean records with grind settings and aroma profiles (9 aroma metrics: fruity, floral, sweet, nutty, spices, roasted, green, sour, other)
- `roasteryTable` - Coffee roasteries
- `beanTasteTable` - Taste descriptors
- `beanTasteAssociationTable` - Many-to-many relationship between beans and tastes

Database is SQLite running locally on device via expo-sqlite. Migrations are in `drizzle/` directory.

### State Management

Zustand stores in `store/`:

- `bean-store.ts` - Selected bean state
- `toast-store.ts` - Toast notification state

### Providers

Located in `provider/`:

- `DatabaseProvider` - Drizzle database connection wrapper
- `BeanDataProvider` - Manages bean data loading and queries

Provider hierarchy (from `app/App.tsx`):

```
TamaguiProvider
  └─ DatabaseProvider
      └─ PortalProvider
          └─ BeanDataProvider
```

### UI Components

All components are in `components/`:

- `components/ui/` - Tamagui-based UI primitives (Button, Input, Toast, etc.)
- `components/Dashboard/` - Dashboard-specific components
- `components/Chat/` - AI chat components
- `components/BeanHeaderLayout/` - Bean detail header
- `components/Navigation/` - Custom navigation components
- `components/NoData/` - Empty state component
- `components/ScrollView/` - Custom scroll view wrapper
- `components/BottomSheet/` - Bottom sheet modal components

Components support Storybook stories (`.stories.tsx` files).

### Custom Hooks

Located in `hooks/`:

- `useBeanDetails.ts` - Fetch bean details by ID
- `useBensData.ts` - Fetch all beans data
- `useDuplicateCheck.ts` - Check for duplicate bean names
- `useDataExport.ts` / `useDataImport.ts` - Database backup/restore
- `useKeyboardIsVisible.ts` - Keyboard visibility state
- `useKeyboard.ts` - Keyboard height tracking for modal screens
- `useIsBottomSheetActive.ts` - Bottom sheet active state
- `useBackButtonTrigger.ts` - Android back button handling

### Theming (Tamagui)

Custom theme defined in `tamagui.config.ts`:

- Custom color tokens (primary: #E89E3F, secondary: #664F3F, etc.)
- Custom font: "TBJSodabery-Light"
- Animation presets using Moti (bouncy, quick, lazy, etc.)
- Custom shorthands for common props (mt, mx, bgC, etc.)

### AI Integration

The app has two AI integration paths:

1. **OpenAI API** - Via Vercel AI SDK for chat functionality
2. **Apple Intelligence** - Via `@react-native-ai/apple` for on-device AI

Chat interface in `app/chat.tsx` uses streaming responses via a custom `AppleChatTransport` that implements the Vercel AI SDK `ChatTransport` interface.

#### Apple Foundation Models — Known Issues & Constraints

**Simulator does NOT work.** Apple's on-device Foundation Models require:
- A **physical iPhone** running **iOS 26+**
- **Apple Intelligence enabled** in Settings > Apple Intelligence & Siri
- The on-device model **fully downloaded** (background download after enabling)

Running on the simulator will produce `FoundationModels.LanguageModelSession.GenerationError -1`. This is expected — not a code bug.

**Known error codes** (`LanguageModelSession.GenerationError`):

| Error | Meaning | Fix |
|---|---|---|
| `GenerationError -1` | Internal OS-level error (`ModelManagerError 1026`). Known Apple framework bug. | Restart device, or toggle Apple Intelligence off/on in Settings. |
| `guardrailViolation` | Safety guardrails triggered by prompt or response content. | Rephrase the prompt to avoid restricted topics. |
| `exceededContextWindowSize` | Exceeded the **4,096 token** hard context window limit. | Prune older messages before sending. No way to increase this limit. |
| `rateLimited` | Too many requests in a short period. | Add backoff/retry logic. |
| `assetsUnavailable` | Model assets not downloaded or corrupted. | Check Settings > Apple Intelligence, restart device. |
| `unsupportedLanguageOrLocale` | Unsupported language requested. | Use English or a supported locale. |

**Context window management:** The `@react-native-ai/apple` package creates a new `LanguageModelSession` per request and replays the full conversation history via a `Transcript` object. This means the system prompt + all messages are re-sent every time. The 4,096 token budget is consumed fast (~3-4 chars/token for English). After ~10-15 exchanges, you'll hit the limit. Consider implementing message pruning (sliding window) in the transport's `sendMessages` before converting messages.

**Known package bugs** (`@react-native-ai/apple`):
- Context window overflow can crash the app instead of throwing a catchable error ([GitHub #125](https://github.com/callstackincubator/ai/issues/125))
- First token in streamed responses can come back as literal `"null"` string ([GitHub #128](https://github.com/callstackincubator/ai/issues/128))

### Git Hooks (Husky)

Pre-commit hook runs:

```json
{
  "*.{js,jsx,ts,tsx}": ["oxlint --fix", "oxfmt --write"]
}
```

Auto-formats and lints staged files before commit.

## Important Patterns

### Path Aliases

TypeScript is configured with `@/*` path alias mapping to root directory:

```typescript
import { Button } from "@/components/ui/Button";
import { useBeanDetails } from "@/hooks/useBeanDetails";
```

### Storybook Mode

Enable Storybook by setting environment variable:

```bash
EXPO_PUBLIC_STORYBOOK_ENABLED=true npm start
```

This changes the root layout to render Storybook UI instead of the app.

### Database Queries

Use Drizzle queries from `db/queries.ts`:

```typescript
import { db } from "@/provider/DatabaseProvider";
import { beanTable } from "@/db/schema";

const beans = await db.select().from(beanTable);
```

### Testing

Tests use Jest with jest-expo preset. Run tests in watch mode by default.

## Platform-Specific Notes

### Keyboard Handling in Modals

**`KeyboardAvoidingView` does NOT work reliably in iOS modals** (screens with `presentation: "modal"` in expo-router). It cannot correctly calculate the modal's offset from the screen top, so the input gets hidden behind the keyboard regardless of `keyboardVerticalOffset`.

**Always use the `useKeyboardHeight` hook** from `hooks/useKeyboard.ts`. Never inline keyboard listener logic directly in components.

```typescript
import { useKeyboardHeight } from "@/hooks/useKeyboard";

const keyboardHeight = useKeyboardHeight();
```

Then apply `paddingBottom={keyboardHeight}` on the content container. The hook handles platform differences internally (`keyboardWillShow`/`keyboardWillHide` on iOS, `keyboardDidShow`/`keyboardDidHide` on Android).

This is used in `app/chat.tsx` and should be used for any future screens that need keyboard-aware layout.

### iOS

- Builds configured in `ios/` directory
- Uses Expo build properties plugin for native configuration
- TestFlight submission automated via EAS

### Android

- Configuration in `android/` directory
- Auto-increment build numbers enabled in eas.json

## Environment Variables

Located in `.env` and `.env.local` (gitignored):

- OpenAI API keys for chat functionality
- Other service credentials

Never commit these files.

## Pull Request Workflow

Every feature or bug fix PR **must** include a simulator screenshot. Follow this process:

1. **Take a screenshot** from the iOS simulator using the MCP `ios-simulator` tool:
   ```
   mcp__ios-simulator__screenshot → .github/screenshots/<descriptive-name>.png
   ```
2. **Commit** the code changes and the screenshot together.
3. **Push** the branch and **create/update the PR** with:
   - A concise title and summary of the changes
   - The screenshot embedded using a raw GitHub URL:
     ```
     ![Description](https://raw.githubusercontent.com/fkoschi/grind-it/<branch>/.github/screenshots/<name>.png)
     ```

Screenshots live in `.github/screenshots/` and are committed to the repo so they render in PR descriptions.

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- Build checks on merge to main
- iOS simulator build validation
