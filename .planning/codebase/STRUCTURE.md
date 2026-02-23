# Codebase Structure

**Analysis Date:** 2026-02-23

## Directory Layout

```
grind-it/
├── app/                          # Screens and routes (expo-router file-based)
│   ├── _layout.tsx               # Root layout, Stack navigator
│   ├── App.tsx                   # Provider setup
│   ├── index.tsx                 # Dashboard home screen
│   ├── settings.tsx              # Settings screen
│   ├── add-bean.tsx              # Add/edit bean modal
│   ├── chat.tsx                  # AI chat modal
│   ├── api/
│   │   └── chat+api.ts           # OpenAI chat API route
│   ├── bean/
│   │   ├── _layout.tsx           # Bean detail layout
│   │   ├── EditBean.tsx          # Bean editor wrapper
│   │   ├── details/              # Bean detail screens
│   │   └── edit/                 # Bean edit child routes
│   ├── roasteries/
│   │   ├── EditRoasteryPage.tsx  # Roastery form
│   │   └── [id]/detail           # Roastery detail modal
│   └── taste/
│       └── EditTasteComponent.tsx # Taste editor
├── components/                   # Reusable UI components
│   ├── ui/                       # Tamagui-based UI primitives
│   │   ├── Card/                 # Bean card component
│   │   ├── Input/                # Input fields, StepperInput
│   │   ├── Button/               # Action buttons
│   │   ├── Toast/                # Toast notification system
│   │   ├── Icons/                # Custom and icon library exports
│   │   ├── Chat/                 # Chat message components
│   │   ├── Pages/                # Full-page layouts
│   │   ├── SpiderChart/          # Aroma profile visualization
│   │   ├── AromaSlider/          # Slider for aroma metrics
│   │   ├── Badge/                # Status badges
│   │   ├── FavoriteButton/       # Heart/favorite toggle
│   │   ├── FilterChip/           # Taste filter chips
│   │   ├── BrewBuddyCard/        # AI assistant feature card
│   │   ├── RoasteryCard/         # Roastery preview
│   │   ├── SettingsCard/         # Settings row card
│   │   ├── TasteCard/            # Taste descriptor display
│   │   ├── ProFeatureOverlay/    # Premium feature gate
│   │   └── Loading/              # Loading states
│   ├── Dashboard/                # Dashboard-specific layouts
│   │   ├── DasboardCards.tsx     # Bean cards list
│   │   ├── DashboardHeader.tsx   # Search + header
│   │   └── DashboardNoData.tsx   # Empty state
│   ├── Chat/                     # Chat UI components
│   │   ├── ChatMessage.tsx       # Single message display
│   │   └── Chat.stories.tsx      # Storybook examples
│   ├── BeanHeaderLayout/         # Bean detail header
│   ├── Navigation/
│   │   └── TabBar.tsx            # Bottom tab navigation
│   ├── BottomSheet/              # Modal forms
│   │   ├── Frames/
│   │   │   ├── Bean/
│   │   │   │   ├── Add/          # Bean creation forms
│   │   │   │   └── Edit/         # Bean edit forms (aroma, taste, degree)
│   │   │   ├── Roastery/         # Roastery selection/creation
│   │   │   └── Taste/            # Taste descriptor selection
│   ├── ScrollView/               # Custom scroll view wrapper
│   └── NoData/                   # Empty state component
├── db/                           # Database layer
│   ├── schema.ts                 # Drizzle ORM table definitions
│   ├── queries.ts                # Prepared queries and query builders
│   └── __mock__/                 # Mock data for testing
├── drizzle/                      # Database migrations
│   ├── migrations.ts             # Migration loader
│   └── meta/                     # Migration metadata
├── provider/                     # React Context providers
│   ├── DatabaseProvider.tsx      # SQLite connection + useMigrations
│   └── BeanDataProvider.tsx      # Cached bean list + Watch sync
├── store/                        # Zustand state stores
│   ├── bean-store.ts             # Bean form + UI state (tastes, sheet visibility)
│   └── toast-store.ts            # Toast queue management
├── hooks/                        # Custom React hooks
│   ├── useBeanDetails.ts         # Fetch single bean by ID
│   ├── useBensData.ts            # Fetch all beans (dashboard)
│   ├── useRoasteryDetails.ts     # Fetch single roastery
│   ├── useDuplicateCheck.ts      # Check bean name duplicates
│   ├── useDataExport.ts          # Export all data to JSON
│   ├── useDataImport.ts          # Import data from JSON
│   ├── useKeyboard.ts            # Keyboard height tracking
│   ├── useKeyboardIsVisible.ts   # Keyboard visibility state
│   ├── useIsBottomSheetActive.ts # Bottom sheet active state
│   ├── useWatchSync.ts           # Sync data to Apple Watch
│   ├── useAllBeansForSync.ts     # Query beans for Watch sync
│   ├── useManualWatchSync.ts     # Manual sync trigger
│   ├── useBackButtonTrigger.ts   # Android back button handling
│   ├── useAutoFocus.ts           # Auto-focus text input on mount
│   ├── useIsRouteActive.ts       # Check current route
│   ├── useColorScheme.ts         # System color scheme detection
│   └── useIsProUser.ts           # Premium feature flag
├── types/                        # TypeScript type definitions
│   └── index.ts                  # CoffeeBean, Taste interfaces
├── utils/                        # Utility functions
│   ├── dataExport.ts             # JSON export logic
│   ├── dataImport.ts             # JSON import + validation
│   ├── fuzzyMatch.ts             # Fuzzy search implementation
│   └── __tests__/                # Utility tests
├── constants/                    # App constants
│   ├── fonts.ts                  # Font family imports
│   ├── mockAromaData.ts          # Test aroma profiles
│   └── index.ts                  # Exported constants
├── assets/                       # Static resources
│   ├── fonts/                    # Custom fonts (TBJSodabery-Light.otf)
│   ├── icons/                    # SVG icons
│   ├── images/                   # PNG/JPEG assets
│   └── animations/               # Lottie JSON animations
├── locales/                      # i18n translation files
│   └── [language].json           # Language-specific strings
├── modules/                      # Custom native modules
│   └── watch-connectivity/       # Apple Watch bridge (TypeScript wrapper)
├── tamagui.config.ts             # Tamagui theme + design tokens
├── polyfill.ts                   # Browser API polyfills
├── i18n.ts                       # i18next initialization
├── tsconfig.json                 # TypeScript configuration
├── app.json                      # Expo app manifest
├── package.json                  # Dependencies + scripts
├── .env                          # Environment variables (API keys, secrets)
├── .env.local                    # Local-only env overrides
├── jest.config.js                # Jest test runner config
├── .oxlintrc.json                # Oxlint configuration
├── .prettierrc                   # Code formatter config
└── ios/ & android/               # Native platform code
```

## Directory Purposes

**app/**
- Purpose: All routes and screens (expo-router file = URL segment)
- Contains: TSX files mapping to URLs, modal dialogs, nested routes with [id] params
- Key files: `index.tsx` (home), `_layout.tsx` (navigation), `add-bean.tsx` (modal)
- Structure follows file-based routing where path = filename (e.g., `app/settings.tsx` → `/settings`)

**components/ui/**
- Purpose: Tamagui-based design system components
- Contains: Buttons, inputs, cards, modals, icons, loaders, badges, custom charts
- Pattern: Each component in own subdirectory with component + stories + index
- Used by: All screens, composite components

**components/Dashboard/**
- Purpose: Dashboard screen specific components
- Contains: Card list, search header, empty state
- Used by: `app/index.tsx` only

**components/Chat/**
- Purpose: Chat-specific UI
- Contains: Message bubbles, input controls, loading states
- Used by: `app/chat.tsx`

**components/BottomSheet/**
- Purpose: Modal form dialogs accessed via bottom sheet
- Contains: Bean creation/edit forms, roastery selection, taste assignment
- Pattern: Frames organized by entity (Bean/Roastery/Taste) and operation (Add/Edit/Select)

**db/**
- Purpose: Database schema and queries
- Contains: Drizzle ORM table definitions, prepared query builders
- Key files: `schema.ts` (4 tables), `queries.ts` (6 prepared queries)
- Pattern: Queries are parameterized to prevent SQL injection and enable caching

**provider/**
- Purpose: Dependency injection via React Context
- Contains: DatabaseProvider (SQLite setup), BeanDataProvider (cached queries + Watch sync)
- Pattern: Each provider exports custom hook to access context safely

**store/**
- Purpose: Client-side state management via Zustand
- Contains: Bean form state (tastes, bottom sheet visibility), Toast queue
- Pattern: Store = state + actions in single create() call

**hooks/**
- Purpose: Encapsulate business logic and side effects
- Contains: Data fetching, validation, device features (keyboard, back button, watch)
- Pattern: Custom React hooks following hooks rules
- Reusable across: Multiple screens and components

**types/**
- Purpose: Centralized TypeScript type definitions
- Contains: CoffeeBean interface, Taste interface
- Used by: All layers for type safety and consistency

**utils/**
- Purpose: Pure utility functions and algorithms
- Contains: Data export/import, fuzzy search, test data
- Pattern: No side effects, testable logic
- Tests: Jest tests in `__tests__/` subdirectory

**constants/**
- Purpose: App-wide constants
- Contains: Font families, mock data, string constants
- Used by: Components and initialization

**assets/**
- Purpose: Static resources bundled with app
- Contains: Fonts (TBJSodabery-Light), icons, images, Lottie animations
- Pattern: Imported as modules in components and screens

**locales/**
- Purpose: Internationalization translation strings
- Contains: JSON files per language
- Used by: All screens via `useTranslation()` hook

**modules/watch-connectivity/**
- Purpose: Apple Watch integration wrapper
- Contains: TypeScript interfaces for native watch module
- Pattern: Wrapper around native Objective-C/Swift code
- Used by: `useWatchSync.ts`, `BeanDataProvider.tsx`

**ios/ & android/**
- Purpose: Native platform code
- Contains: Native modules, build configuration, app signing
- Excluded from version control (git): Pods, build artifacts

## Key File Locations

**Entry Points:**
- `app/App.tsx`: Provider hierarchy setup, font loading, splash screen
- `app/_layout.tsx`: Root Stack navigator with all routes and presentations
- `app/index.tsx`: Dashboard home screen (first screen shown)

**Configuration:**
- `tamagui.config.ts`: Design tokens, colors, fonts, animation presets
- `tsconfig.json`: TypeScript compiler options (strict mode, path aliases)
- `app.json`: Expo app manifest (name, version, plugins)
- `package.json`: Dependencies and npm scripts

**Core Logic:**
- `db/schema.ts`: Database table definitions (beanTable, roasteryTable, beanTasteTable, beanTasteAssociationTable)
- `db/queries.ts`: Query builders for searching, filtering, fetching related data
- `provider/DatabaseProvider.tsx`: SQLite connection and migrations
- `provider/BeanDataProvider.tsx`: Cached bean list and Watch sync orchestration

**Testing:**
- `utils/__tests__/`: Utility function tests (dataExportImport.test.ts, fuzzyMatch.test.ts)
- `jest.config.js`: Jest test runner configuration with jest-expo preset

## Naming Conventions

**Files:**
- Screen files: `lowercase.tsx` (e.g., `index.tsx`, `settings.tsx`)
- Component directories: `PascalCase/` (e.g., `components/Card/`, `components/Dashboard/`)
- Component files: `PascalCase.tsx` (e.g., `Card.tsx`, `DashboardCards.tsx`)
- Story files: `ComponentName.stories.tsx` (e.g., `Card.stories.tsx`)
- Test files: `*.test.ts` or `*.test.tsx` (e.g., `fuzzyMatch.test.ts`)
- Utility files: `camelCase.ts` (e.g., `dataExport.ts`, `useKeyboard.ts`)
- Store files: `kebab-case-store.ts` (e.g., `bean-store.ts`, `toast-store.ts`)

**Directories:**
- Route directories: `lowercase` or `[param]` for dynamic routes (e.g., `bean/[id]/`, `roasteries/[id]/`)
- Feature directories: `PascalCase` (e.g., `components/Dashboard/`, `components/Chat/`)
- Organizational: `lowercase` (e.g., `provider/`, `store/`, `utils/`)

**Functions & Variables:**
- React components: `PascalCase` (e.g., `Card`, `DashboardCards`)
- Hooks: `use` prefix + `PascalCase` (e.g., `useBeanDetails`, `useKeyboard`)
- Store creation: `use` prefix + `PascalCase` (e.g., `useBeanStore`, `useToastStore`)
- Regular functions: `camelCase` (e.g., `insertBean`, `exportAllData`)
- Variables: `camelCase` (e.g., `beanData`, `tasteFilter`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `EXPORT_VERSION`)
- React Context: `<Name>Context` (e.g., `DatabaseContext`, `BeanDataContext`)

**Database:**
- Tables: `camelCaseTable` (e.g., `beanTable`, `roasteryTable`)
- Columns: `camelCase` (e.g., `aromaFruity`, `singleShotDosis`)
- Prepared query functions: `camelCase` (e.g., `queryBeansBySearchAndFilter`)

## Where to Add New Code

**New Feature (complete user flow):**
- Primary code: `app/[feature].tsx` for new route or `app/[feature]/` directory for nested routes
- Components: `components/[Feature]/` subdirectory
- State: Add to existing store or create `store/[feature]-store.ts`
- Tests: `utils/__tests__/[feature].test.ts` for logic; Storybook stories for UI
- Database changes: Extend `db/schema.ts` with new table, add queries to `db/queries.ts`

**New Screen/Route:**
- File: Create `app/[route-name].tsx` (for single screen) or `app/[route-name]/index.tsx` (for nested)
- Register: Automatically discovered by expo-router
- Navigation: Add `Stack.Screen` to `app/_layout.tsx` if modal/special presentation needed
- Default: Stack screen with header hidden by default

**New Modal/Bottom Sheet:**
- File: `app/[modal-name].tsx` with `presentation: "modal"` or `presentation: "fullScreenModal"`
- Register in: `app/_layout.tsx` Stack configuration
- Frames: Use `components/BottomSheet/Frames/[Entity]/` structure for reusable modals

**New Component:**
- Directory: `components/ui/[ComponentName]/` or `components/[Feature]/[ComponentName]/`
- Files:
  - `[ComponentName].tsx` - main component
  - `[ComponentName].stories.tsx` - Storybook examples
  - `index.ts` - export barrel file
- Export: Add to `components/ui/index.ts` via `export * from "./[ComponentName]"`

**New Data Entity:**
- Database: Add table to `db/schema.ts` with relationships via `.references()`
- Queries: Add prepared query function to `db/queries.ts`
- Type: Add TypeScript interface to `types/index.ts`
- Hook: Create `hooks/use[Entity].ts` for data fetching if needed
- Migration: Auto-generated by drizzle-kit; review and commit

**New API Route:**
- File: `app/api/[route]+api.ts` (Expo Router convention)
- Pattern: Export async `POST`, `GET`, etc. functions
- Usage: Called from client via fetch to `/api/[route]`
- Example: `app/api/chat+api.ts` routes to OpenAI via Anthropic gateway

**Utilities & Logic:**
- Shared helpers: `utils/[feature].ts`
- Tests: `utils/__tests__/[feature].test.ts`
- Import: Use `@/utils/[feature]` path alias
- Pattern: Pure functions, no side effects

**Custom Hooks:**
- File: `hooks/use[Name].ts`
- Pattern: Follow React hooks rules, export single default hook
- Usage: Import in components and screens
- Types: Strongly typed parameters and return values

**State Management:**
- Transient UI state: Add to `useBeanStore` or create new store
- Cached data: Add to `BeanDataProvider` if app-wide
- Form state: Use `react-hook-form` with Controller pattern

## Special Directories

**dist/**
- Purpose: Build output for web/expo web
- Generated: Yes (by build system)
- Committed: No

**.expo/**
- Purpose: Expo development cache
- Generated: Yes (by expo start)
- Committed: No (in .gitignore)

**node_modules/**
- Purpose: npm dependencies
- Generated: Yes (by npm install)
- Committed: No (in .gitignore)

**drizzle/**
- Purpose: Database migration files
- Generated: Yes (by drizzle-kit generate sqlite)
- Committed: Yes (required for production)

**ios/ & android/**
- Purpose: Native platform files
- Generated: Yes (by eas build, expo prebuild)
- Committed: Selective (config yes, build artifacts no)

**.tamagui/**
- Purpose: Tamagui theme cache
- Generated: Yes (by Tamagui compiler)
- Committed: No

**.planning/**
- Purpose: GSD planning documents
- Generated: Yes (by Claude agents)
- Committed: Yes

**.storybook/**
- Purpose: Storybook configuration
- Generated: No (manually configured)
- Committed: Yes

**.husky/ & .env files**
- Purpose: Git hooks, local environment
- Generated: Manual setup
- Committed: .husky yes, .env no

---

*Structure analysis: 2026-02-23*
