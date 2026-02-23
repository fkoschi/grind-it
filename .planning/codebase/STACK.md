# Technology Stack

**Analysis Date:** 2026-02-23

## Languages

**Primary:**
- TypeScript 5.9.2 - Strict mode enabled, full codebase
- JavaScript - Babel plugins and configuration

**Secondary:**
- SQL - Database migrations and Drizzle schema

## Runtime

**Environment:**
- Node.js v25.4.0+
- React 19.1.0 (web/DOM)
- React Native 0.81.5 (mobile)
- Expo 54.0.25 (cross-platform build system)

**Package Manager:**
- npm - Default package manager
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core Mobile:**
- Expo Router 6.0.15 - File-based routing for React Native
- React Native - Cross-platform mobile framework
- Tamagui 1.138.6 - React Native UI framework with custom theming

**UI & Animations:**
- Tamagui Animations Moti 1.138.6 - Spring animations
- React Native Reanimated 4.1.1 - Worklet-based animations
- React Native Gesture Handler 2.28.0 - Touch handling
- Gorhom Bottom Sheet 5.2.7 - Modal bottom sheet component
- React Native Screen 4.16.0 - Screen navigation library

**State Management:**
- Zustand 5.0.3 - Lightweight state store (`store/bean-store.ts`, `store/toast-store.ts`)
- React Context - Provider-based state (DatabaseProvider, BeanDataProvider)

**AI/Chat:**
- Vercel AI SDK 6.0.3 - Unified AI SDK (`ai` package)
- AI SDK React 3.0.3 - React hooks for AI
- AI SDK OpenAI 3.0.1 - OpenAI integration
- Apple React Native AI 0.11.0 - On-device Apple Intelligence

**Database:**
- SQLite (expo-sqlite 16.0.9) - Local device database
- Drizzle ORM 0.36.4 - TypeScript-first ORM
- Drizzle Kit 0.28.1 - Migration and schema generation tool

**Forms & Validation:**
- React Hook Form 7.55.0 - Lightweight form library
- Zod 3.24.3 - TypeScript-first schema validation
- HookForm Resolvers 3.10.0 - Zod integration with React Hook Form

**Internationalization:**
- i18next 25.8.8 - Translation management
- React i18next 16.5.4 - React binding for i18next
- Expo Localization 17.0.8 - Device locale detection

**Markdown:**
- React Native Markdown Display 7.0.2 - Markdown rendering
- Expensify React Native Live Markdown 0.1.318 - Live markdown editor

**Development & Testing:**
- Jest 29.7.0 - Testing framework
- jest-expo 54.0.13 - Expo preset for Jest
- React Test Renderer 18.2.0 - Snapshot testing

**Storybook:**
- Storybook 10.1.2 - Component development environment
- Storybook React Native 10.1.0 - React Native addon
- Storybook Ondevice Actions 10.1.0 - Event logging
- Storybook Ondevice Controls 10.1.0 - Component control UI

**Code Quality:**
- oxlint 1.39.0 - Fast Rust-based linter
- oxfmt 0.24.0 - Fast Rust-based formatter
- ESLint - Configured via oxlint rules
- Prettier - Integrated via oxfmt
- Husky 9.1.7 - Git hooks manager
- lint-staged 16.2.7 - Run linters on staged files
- standard-version 9.5.0 - Conventional commit versioning

**Build & Dev Tools:**
- Babel 7.26.10 - JavaScript transpiler
- Babel Loader 8.4.1 - Webpack Babel loader
- Metro - React Native bundler (configured in `metro.config.js`)
- Expo Build Properties 0.12.0 - Build configuration plugin

**Platform-Specific:**
- Expo Asset 12.0.10 - Asset management
- Expo Clipboard 8.0.8 - Clipboard API
- Expo File System 19.0.21 - File system access
- Expo Document Picker 14.0.8 - File picker
- Expo Haptics 15.0.7 - Haptic feedback
- Expo Web Browser 15.0.9 - Web browser control
- React Navigation Elements 2.3.8 - Navigation primitives
- React Navigation Native 7.0.14 - Core navigation library
- React Native Safe Area Context 5.6.0 - Safe area handling
- React Native Worklets 0.5.2 - Worklet execution

**Fonts & Assets:**
- Expo Fonts 14.0.9 - Custom font loading
- Expo Vector Icons 15.0.3 - Icon library
- Tamagui Lucide Icons 1.138.6 - Icon component library
- React Native SVG 15.12.1 - SVG rendering
- Lottie React Native 7.3.1 - Animation file rendering
- DotLottie React 0.17.12 - Modern animation format

**Polyfills & Compatibility:**
- React Native Fetch API 3.0.0 - Fetch polyfill
- React Native URL Polyfill 3.0.0 - URL API polyfill
- React Native Get Random Values 2.0.0 - Crypto random polyfill
- React Native Polyfill Globals 3.1.0 - Global polyfills
- Stardazed Streams Text Encoding 1.0.2 - TextEncoder polyfill
- Web Streams Polyfill 3.3.3 - Streams API polyfill
- Text Encoding 0.7.0 - Encoding API polyfill
- base-64 1.0.0 - Base64 encoding/decoding

**Other Utilities:**
- Expensify Common 2.0.115 - Shared utilities
- HTML Entities 2.5.3 - HTML entity encoding
- Ungap Structured Clone 1.3.0 - Deep clone polyfill
- uidotdev Usehooks 2.4.1 - React hooks collection

## Configuration

**Environment:**
- `.env` and `.env.local` files (gitignored)
- Environment variables passed to Expo build via `eas.json`
- Expo Public variables prefixed with `EXPO_PUBLIC_`

**Build Configuration:**
- `tsconfig.json` - TypeScript with strict mode, path aliases (`@/*`)
- `babel.config.js` - Babel presets and plugins (Tamagui, Reanimated, Storybook)
- `metro.config.js` - Metro bundler with Reanimated and Storybook support
- `.eslintrc` or oxlint config - Code linting rules
- `.prettierrc` or oxfmt integration - Code formatting
- `tamagui.config.ts` - Tamagui theme, tokens, animations

**EAS Configuration:**
- `eas.json` - Expo Application Services build profiles (development, preview, production)
- `app.json` - Expo app manifest with iOS bundle ID, Android package, plugins

**Package Management:**
- `.npmrc` - npm configuration (handled via `eas.json` NPM_CONFIG_LEGACY_PEER_DEPS)
- `package.json` scripts for start, build, test, lint, format, release

## Platform Requirements

**Development:**
- Node.js v25.4.0+
- npm package manager
- TypeScript 5.9.2
- iOS development: Xcode with iOS SDK
- Android development: Android SDK and emulator

**Production:**
- **iOS:** App Store (via TestFlight with EAS submit)
  - Bundle ID: `com.fkoschi.grind-it`
  - Minimum iOS version: iOS 26+ (for Apple Intelligence features)
- **Android:** Google Play (manual upload)
  - Package: `com.fkoschi.grindit`
  - Target SDK: 36, Compile SDK: 36

**Database:**
- SQLite (bundled with Expo, device-local)
- No external database server required

---

*Stack analysis: 2026-02-23*
