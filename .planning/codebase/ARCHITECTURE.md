# Architecture

**Analysis Date:** 2026-02-23

## Pattern Overview

**Overall:** Modular Layered Architecture with File-Based Routing

Grind It follows a clean separation of concerns across four main layers:
- **Presentation Layer** (React components + screens)
- **State Management Layer** (Zustand stores + Context providers)
- **Data Access Layer** (Drizzle ORM queries)
- **Domain Layer** (TypeScript types and schema definitions)

**Key Characteristics:**
- File-based routing via expo-router (file structure = URL routes)
- Component composition pattern (namespace exports with sub-components)
- Provider-based dependency injection for context (Database, Bean Data)
- Custom hooks for domain logic extraction
- Drizzle ORM with live query support for reactive data binding
- Zustand for lightweight client-side state management

## Layers

**Presentation Layer:**
- Purpose: Render UI, handle user interactions, display data
- Location: `app/`, `components/`
- Contains: Screen components, modal forms, UI primitives, page layouts
- Depends on: State stores, custom hooks, UI components, Tamagui theme
- Used by: expo-router navigation stack
- Key files: `app/index.tsx` (Dashboard), `app/settings.tsx`, `app/chat.tsx`, `app/add-bean.tsx`, `components/ui/*`

**State Management Layer:**
- Purpose: Client-side state, UI state coordination, form state
- Location: `store/`, `provider/`
- Contains: Zustand stores (bean state, toast notifications), React Context providers (Database, Bean Data)
- Depends on: Database layer for data persistence, none for UI state
- Used by: All screen components and hooks
- Patterns:
  - `useBeanStore`: Manages bean form state (tastes, bottom sheet visibility, roastery selection)
  - `useToastStore`: Toast notification queue
  - `DatabaseProvider`: SQLite database connection (context)
  - `BeanDataProvider`: Cached bean list with Watch synchronization

**Data Access Layer:**
- Purpose: Query building, database operations, live query subscriptions
- Location: `db/queries.ts`, `db/schema.ts`, `hooks/` (data fetching hooks)
- Contains: Drizzle prepared queries, database schema definitions, query builders
- Depends on: Drizzle ORM, SQLite driver (expo-sqlite)
- Used by: Components, providers, and hooks that need database access
- Patterns:
  - Prepared queries for repeated operations (`selectTasteInArray`, `queryBeansBySearchAndFilter`)
  - `useLiveQuery` hook for reactive data binding
  - Custom hooks for data fetching (`useBeanDetails`, `useBensData`, `useRoasteryDetails`)

**Domain Layer:**
- Purpose: Type definitions, business logic, database schema
- Location: `types/index.ts`, `db/schema.ts`, `utils/`
- Contains: TypeScript interfaces (CoffeeBean, Taste), SQLite schema tables, business logic utilities
- Depends on: Drizzle ORM (schema) and Zod (validation)
- Used by: All layers for type safety

## Data Flow

**Bean Creation Flow:**

1. User navigates to `app/add-bean.tsx` (modal screen)
2. Component uses `useForm` (react-hook-form) + Zod validation for form state
3. Form data bound to `useBeanStore` for temporary taste state
4. On submit: `insertBean()` → writes to `beanTable` in SQLite
5. Associated tastes written to `beanTasteTable` + junction table (`beanTasteAssociationTable`)
6. `BeanDataProvider` queries refresh (via `useLiveQuery`) → Dashboard re-renders
7. Navigation pops modal back to dashboard

**Bean Display Flow:**

1. Dashboard (`app/index.tsx`) renders
2. `BeanDataProvider` hydrates `allBeans` list
3. Component queries filtered beans: `queryBeansBySearchAndFilter(db, tasteFilter, searchText)`
4. Results passed to `DashboardCards` → renders `Card` component per bean
5. User searches/filters → query re-executes via `useLiveQuery` subscription
6. Changes to database (favorite toggle, taste edit) trigger live query updates

**Bean Detail Flow:**

1. User taps card → navigates to `app/bean/[id]/details` (modal)
2. `useBeanDetails` hook fetches bean by ID with all related data
3. Child screens (aroma edit, degree change) update `beanTable` directly
4. Changes propagate back to detail page via `useLiveQuery`

**AI Chat Flow:**

1. User opens chat (`app/chat.tsx` modal)
2. `useChat` hook from Vercel AI SDK manages message state
3. On iOS: Uses `AppleChatTransport` (custom class) → Apple Foundation Models
4. On Android/fallback: API route `/api/chat` → Claude Sonnet via Anthropic gateway
5. Markdown responses rendered via `react-native-markdown-display`

**State Management:**

- **UI State (transient):** Zustand stores handle form state, modal visibility, filter preferences
  - Bean form data lives in `useBeanStore` until submission
  - Toast messages auto-dismiss after 3 seconds
  - Bottom sheet visibility controlled per interaction
- **Data State (persistent):** SQLite database via `useLiveQuery` subscriptions
  - All beans, roasteries, tastes, aroma profiles stored locally
  - `BeanDataProvider` caches bean IDs for app-wide availability
  - Watch sync debounced to prevent excessive writes

## Key Abstractions

**Bean Entity:**
- Purpose: Central domain model for coffee beans with aroma profiles
- Files: `types/index.ts` (CoffeeBean interface), `db/schema.ts` (beanTable)
- Pattern: Strongly typed interface with optional aroma metrics (fruity, floral, sweet, nutty, spices, roasted, green, sour, other)
- Relationships: One-to-many with Roastery, many-to-many with Taste via junction table

**Taste Filter System:**
- Purpose: Enable dynamic filtering of beans by taste descriptors
- Files: `store/bean-store.ts` (tasteFilter array), `db/queries.ts` (filter queries)
- Pattern: Store taste IDs to filter; also supports favorite-only filter (ID 0)
- Query: `queryBeansBySearchAndFilter` filters beans using `inArray` and `notInArray`

**Custom Hooks:**
- Purpose: Encapsulate business logic, abstract database queries, manage side effects
- Files: `hooks/` directory
- Pattern: Each hook has single responsibility (fetch data, sync, check duplicates)
- Examples:
  - `useBeanDetails(id)` → fetches single bean with joins
  - `useBensData()` → fetches all beans (dashboard query)
  - `useDuplicateCheck(name)` → checks if bean name exists
  - `useWatchSync()` → syncs beans to Apple Watch via custom native module

**Component Composition:**
- Purpose: Enable flexible component APIs without prop drilling
- Pattern: Root container + sub-components exported as namespace object
- Example: `Card` component (future refactoring) could expose `Card.Root`, `Card.Image`, `Card.Text`
- Currently used: Manual composition in modal forms (`BottomSheet/Frames/*`)

**Provider Pattern:**
- Purpose: Inject dependencies (database, cached data) into component tree
- Files: `provider/DatabaseProvider.tsx`, `provider/BeanDataProvider.tsx`
- Pattern: React Context + custom hook to access context safely
- Hierarchy: `TamaguiProvider` → `DatabaseProvider` → `PortalProvider` → `BeanDataProvider`

**Prepared Queries:**
- Purpose: Pre-compile queries for performance, reuse across components
- Files: `db/queries.ts`
- Pattern: Drizzle `prepare()` for prepared statements
- Examples: `selectTasteInArray`, `selectTasteNotInArray`, `queryBeansBySearchAndFilter`

## Entry Points

**App Initialization:**
- Location: `app/App.tsx`
- Triggers: Expo entry point (main: "expo-router/entry" in package.json)
- Responsibilities:
  - Load fonts (TBJSodabery-Light + Darker Grotesque)
  - Set up provider hierarchy (Tamagui, Database, Bean Data)
  - Handle splash screen lifecycle
  - Enable Drizzle Studio for development

**Root Layout:**
- Location: `app/_layout.tsx`
- Triggers: Expo router initialization
- Responsibilities:
  - Define Stack navigator with all routes
  - Configure screen presentations (modal, fullScreenModal)
  - Handle Storybook mode detection
  - Mount ToastViewport globally

**Dashboard (Home):**
- Location: `app/index.tsx`
- Triggers: Initial route / TabBar home tap
- Responsibilities:
  - Display search + filter UI
  - Query and render bean cards
  - Integrate live updates from database

**Settings:**
- Location: `app/settings.tsx`
- Triggers: TabBar settings tap
- Responsibilities:
  - Manage roastery editor, taste profiles
  - Data export/import functions
  - Brew Buddy card (AI feature)

**Add Bean Modal:**
- Location: `app/add-bean.tsx`
- Triggers: Dashboard "Add" button or navigation intent
- Responsibilities:
  - Form input for bean details (name, roastery, dosis, arabica/robusta %)
  - Taste selection modal integration
  - Validation via Zod schema
  - Insert into database

**Chat Modal:**
- Location: `app/chat.tsx`
- Triggers: Coffee icon in TabBar or settings
- Responsibilities:
  - Manage message state with Vercel AI SDK
  - Route to Apple Foundation Models (iOS) or OpenAI (Android)
  - Render markdown responses
  - Handle keyboard height for modal

**Bean Detail (Nested Route):**
- Location: `app/bean/[id]/details` + child routes
- Triggers: Card tap on dashboard
- Responsibilities:
  - Display bean metadata (roastery, grind degree, dosis)
  - Host nested edit flows (aroma, degree, taste)

## Error Handling

**Strategy:** Try-catch with user-facing error messages, console logging for debugging

**Patterns:**
- Database errors: Caught in providers, display LoadingScreen or error text
- Form validation: Zod schema + react-hook-form integration
- Apple Intelligence errors: `getErrorMessage()` maps error codes to user messages
- Query failures: Silently fail with empty state (UI shows "no data")
- Watch sync errors: Logged but non-fatal (app continues functioning)

**Specific Handling:**
- Apple Foundation Models context window overflow: Catch error, suggest pruning messages
- Chat streaming errors: Display error boundary message with retry suggestion
- Database migration errors: Block app with error message (critical)

## Cross-Cutting Concerns

**Logging:**
- Framework: `console.error()`, `console.log()` throughout codebase
- No centralized logger; errors logged where caught (Apple LLM, Watch sync)

**Validation:**
- Framework: Zod schemas in `app/add-bean.tsx` for form input
- Schema: `insertSchema` defines name (required), roastery/arabica/robusta (optional), dosis (positive numbers)
- Applied via: `react-hook-form` with `zodResolver`

**Authentication:**
- Approach: Device-local, no auth system (single-user mobile app)
- API keys stored in `.env` and `.env.local` for external services (OpenAI, Apple Intelligence)
- No user login/signup system

**Internationalization:**
- Framework: i18next via `react-i18next`
- Namespaces: Organized by feature (dashboard, settings, errors)
- Usage: `const { t } = useTranslation()` in components
- Fallback: English

**Animations:**
- Framework: Reanimated (gesture-based) + Moti (component-level animations)
- Configured: `tamagui.config.ts` defines animation presets (bouncy, quick, lazy)
- Used in: Modals, transitions, loading states

**Theming:**
- Framework: Tamagui with custom color tokens
- Colors: Primary (#E89E3F), Secondary (#664F3F), background shades
- Font: Custom "TBJSodabery-Light" loaded at app start
- Single theme: "light" mode

---

*Architecture analysis: 2026-02-23*
