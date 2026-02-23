# Architecture Research: Equipment Profiles

**Research Date:** 2026-02-23
**Dimension:** Architecture
**Feature:** Machine/Grinder Profiles for Brew Buddy Integration

---

## 1. Component Map

### New Components

```
db/schema.ts                          -- Add machineTable, grinderTable
db/queries.ts                         -- Add equipment query helpers
drizzle/0009_*.sql                    -- Migration for new tables

hooks/useEquipmentProfile.ts          -- Read/write machine + grinder from DB
hooks/useEquipmentContext.ts           -- Build concise equipment string for chat injection

store/equipment-store.ts               -- (Optional) Transient UI state if bottom sheets are needed

components/Equipment/                  -- New composition-pattern component
  EquipmentCard.tsx                    -- Settings card entry point (SettingsCard pattern)
  EquipmentDetailPage.tsx              -- Combined machine + grinder detail/edit screen
  EquipmentSummary.tsx                 -- Read-only summary sub-component
  MachineTypePicker.tsx                -- Machine type selector (enum-based)

app/equipment/detail.tsx               -- Route: full-screen modal for equipment editing
app/_layout.tsx                        -- Register new Stack.Screen

locales/en.json, locales/de.json       -- Translation keys for equipment UI + chat context
utils/dataExport.ts                    -- Include equipment in export payload
utils/dataImport.ts                    -- Include equipment in import payload
utils/equipmentChatContext.ts          -- Format equipment data for system prompt injection
```

### Existing Components Modified

| File | Change |
|------|--------|
| `app/settings.tsx` | Add Equipment `SettingsCard` entry between Taste and Export cards |
| `app/_layout.tsx` | Register `equipment/detail` screen (fullScreenModal) |
| `app/chat.tsx` | Pass equipment context to `AppleChatTransport`; modify system prompt construction |
| `db/schema.ts` | Add `machineTable` and `grinderTable` definitions |
| `db/queries.ts` | Add `selectMachine`, `selectGrinder` prepared queries |
| `drizzle/migrations.js` | Register new migration (m0009) |
| `utils/dataExport.ts` | Add `machine` and `grinder` fields to `ExportedData` |
| `utils/dataImport.ts` | Handle `machine` and `grinder` fields on import |
| `locales/en.json` | Add equipment translation keys |
| `locales/de.json` | Add equipment translation keys |

---

## 2. Data Model

### Database Schema (Drizzle ORM)

**`machineTable`** -- new table in `db/schema.ts`

```typescript
export const machineTable = sqliteTable("machine_table", {
  id: int().primaryKey({ autoIncrement: true }),
  manufacturer: text().notNull(),
  name: text().notNull(),
  type: text().notNull(),  // stores MachineType enum value as text
});
```

**`grinderTable`** -- new table in `db/schema.ts`

```typescript
export const grinderTable = sqliteTable("grinder_table", {
  id: int().primaryKey({ autoIncrement: true }),
  manufacturer: text().notNull(),
  name: text().notNull(),
});
```

**Machine type enum** (TypeScript-level, stored as text in SQLite):

```typescript
export const MachineType = {
  MANUAL_LEVER: "manual_lever",
  SEMI_AUTOMATIC: "semi_automatic",
  AUTOMATIC: "automatic",
  SUPER_AUTOMATIC: "super_automatic",
  POD_CAPSULE: "pod_capsule",
  POUR_OVER: "pour_over",
  MOKA_POT: "moka_pot",
  FRENCH_PRESS: "french_press",
} as const;

export type MachineType = (typeof MachineType)[keyof typeof MachineType];
```

**Types with integrated grinder** (grinder section hidden in UI):

```typescript
export const INTEGRATED_GRINDER_TYPES: MachineType[] = [
  MachineType.AUTOMATIC,
  MachineType.SUPER_AUTOMATIC,
];
```

### Design Decisions

**Why text column for machine type instead of integer enum:**
SQLite does not support native enums. Using text makes the stored value self-documenting and simplifies debugging via Drizzle Studio. The TypeScript const object provides compile-time safety.

**Why separate tables instead of a single equipment table:**
Machine and grinder are distinct entities with different fields. A single table would require nullable columns for grinder-only or machine-only fields, and the `type` column only applies to machines. Two tables keep the schema clean and allow independent CRUD. The 1:1 constraint (one machine, one grinder per device) is enforced at the application layer, not the schema layer -- the app reads the first row or inserts/updates the single row.

**Why no foreign key between machine and grinder:**
They are independent entities. A machine with an integrated grinder simply has no corresponding grinder row. The relationship is implicit: if `machineTable.type` is in `INTEGRATED_GRINDER_TYPES`, the grinder section is hidden.

### Migration

New migration file `drizzle/0009_*.sql`:

```sql
CREATE TABLE `machine_table` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `manufacturer` text NOT NULL,
  `name` text NOT NULL,
  `type` text NOT NULL
);

CREATE TABLE `grinder_table` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `manufacturer` text NOT NULL,
  `name` text NOT NULL
);
```

Update `drizzle/migrations.js` to import and register `m0009`.

---

## 3. Data Flow

### Equipment CRUD Flow

```
User taps Equipment card on Settings
  --> router.push("/equipment/detail")
  --> app/equipment/detail.tsx renders EquipmentDetailPage
  --> useEquipmentProfile() hook fetches machine + grinder via useLiveQuery
  --> useForm (react-hook-form + Zod) binds to form fields
  --> User edits manufacturer, name, type
  --> Machine type change triggers INTEGRATED_GRINDER_TYPES check
      --> If integrated: grinder section hidden, grinder row deleted if exists
      --> If external: grinder section visible
  --> On save: upsert machineTable row (insert if none, update if exists)
  --> On save: upsert grinderTable row (same pattern, only if type is external)
  --> useLiveQuery triggers re-render
  --> router.back() returns to Settings
```

### Chat Context Injection Flow

```
User opens Chat modal (app/chat.tsx)
  --> ChatPage component renders
  --> useEquipmentContext() hook called
      --> Reads machineTable (first row) via useDatabase()
      --> Reads grinderTable (first row) via useDatabase()
      --> Returns formatted string or null if no equipment saved
  --> AppleChatTransport constructed with base system prompt + equipment context
  --> On each message send:
      --> System prompt = base prompt (from i18n) + equipment appendix
      --> Equipment appendix only included when equipment data exists
      --> Keeps injection concise (~50-80 tokens) to preserve context window
```

**Equipment context string format** (injected into system prompt):

```
The user's equipment: [Manufacturer] [Name] ([Type]). Grinder: [Manufacturer] [Name].
```

Example: `The user's equipment: Rocket Espresso Appartamento (semi-automatic). Grinder: Eureka Mignon Specialita.`

For integrated grinder machines: `The user's equipment: De'Longhi Magnifica Evo (super-automatic, integrated grinder).`

### Why always-inject instead of on-demand detection

The PROJECT.md specifies on-demand injection (detect hardware-related questions). However, after analyzing the architecture constraints:

1. **Apple Foundation Models have a 4,096 token context window.** The equipment string adds ~15-20 tokens. This is negligible.
2. **On-demand detection requires either keyword matching (brittle) or a separate LLM call (expensive and slow).** The Apple FM transport creates a new session per request and replays the full conversation. Adding a classification step would double latency.
3. **The system prompt is already re-sent with every message** (see `AppleChatTransport.sendMessages`). The equipment context is a one-line appendix.
4. **Simpler implementation.** No keyword detection logic, no conditional branching, no edge cases where the user asks about grind settings without explicitly mentioning "machine."

**Recommendation:** Always append equipment context to the system prompt when equipment data exists. The token cost is trivial (~15-20 tokens out of 4,096). If the user has no equipment saved, nothing is appended. This is the simplest correct solution.

**Alternative considered:** Inject only when equipment exists AND the conversation is under a certain message count (to preserve tokens for long conversations). This adds unnecessary complexity for v1 but could be revisited if context window pressure becomes a problem.

### Data Export/Import Integration

The `ExportedData` interface in `utils/dataExport.ts` needs two new optional fields:

```typescript
export interface ExportedData {
  version: string;
  exportDate: string;
  beans: ExportedBean[];
  machine?: ExportedMachine;   // new
  grinder?: ExportedGrinder;   // new
}

export interface ExportedMachine {
  manufacturer: string;
  name: string;
  type: string;
}

export interface ExportedGrinder {
  manufacturer: string;
  name: string;
}
```

Export version should remain `"1.0.0"` since the new fields are optional and backwards-compatible.

---

## 4. Component Boundaries

### EquipmentDetailPage (Screen)

**Responsibility:** Full-screen modal for editing machine and grinder data.
**Talks to:** `useEquipmentProfile` hook, `useDatabase`, `useForm`, router.
**Pattern:** Follows `RoasteryDetailPage` pattern exactly -- LinearGradient header, ScrollView body, form fields, ActionButton for save.
**Does NOT talk to:** Chat system, BeanDataProvider, Zustand stores.

### useEquipmentProfile (Hook)

**Responsibility:** Fetch machine + grinder rows from DB, provide upsert functions.
**Talks to:** `DatabaseProvider` via `useDatabase()`, Drizzle `useLiveQuery`.
**Returns:** `{ machine, grinder, saveMachine, saveGrinder, deleteGrinder }`.
**Does NOT talk to:** UI components, chat system, stores.

### useEquipmentContext (Hook)

**Responsibility:** Build a concise equipment context string for chat injection.
**Talks to:** `DatabaseProvider` via `useDatabase()`, reads machineTable + grinderTable.
**Returns:** `string | null` -- the formatted equipment string, or null if no equipment saved.
**Does NOT talk to:** Chat transport directly (it is consumed by ChatPage).

### equipmentChatContext (Utility)

**Responsibility:** Pure function that formats machine + grinder data into a prompt-friendly string.
**Talks to:** Nothing (pure function, no side effects).
**Input:** Machine data object + optional grinder data object.
**Output:** Formatted string.

### EquipmentCard (Settings Card)

**Responsibility:** Settings page entry point. Shows machine name or "Set up your equipment" placeholder.
**Talks to:** `useEquipmentProfile` (to show current equipment name), router (to navigate).
**Pattern:** Uses `SettingsCard.Root`, `SettingsCard.Icon`, `SettingsCard.Content`, `SettingsCard.Bg` composition.

### MachineTypePicker (Sub-component)

**Responsibility:** Selection UI for machine type enum.
**Talks to:** Parent component via `onSelect` callback.
**Pattern:** Could be a simple `Select` component (existing `components/ui/Select/Select.tsx`) or a custom bottom sheet.
**Does NOT talk to:** Database or hooks directly.

---

## 5. Suggested Build Order

The build order follows dependency chains. Each phase produces a testable increment.

### Phase 1: Database Schema + Migration

**Files:** `db/schema.ts`, new migration SQL, `drizzle/migrations.js`
**Why first:** Everything else depends on the schema. Migration must run before any queries.
**Deliverable:** Tables exist in SQLite. Verifiable via Drizzle Studio.
**Dependencies:** None.

### Phase 2: Data Access Hook

**Files:** `hooks/useEquipmentProfile.ts`, `db/queries.ts` (add prepared queries)
**Why second:** The hook wraps the schema from Phase 1. The detail page and chat integration both consume this hook.
**Deliverable:** Hook that reads/writes equipment data. Testable in isolation.
**Dependencies:** Phase 1 (schema).

### Phase 3: Equipment Detail Page + Route

**Files:** `app/equipment/detail.tsx`, `app/_layout.tsx` (register route), `components/Equipment/EquipmentDetailPage.tsx`, `components/Equipment/MachineTypePicker.tsx`
**Why third:** Needs the data hook from Phase 2. This is the primary user-facing feature -- users must be able to save equipment before chat can use it.
**Deliverable:** Working equipment editor accessible via direct navigation. Form validates, saves to DB, grinder section toggles based on machine type.
**Dependencies:** Phase 1 (schema), Phase 2 (hook).

### Phase 4: Settings Integration

**Files:** `app/settings.tsx`, `components/Equipment/EquipmentCard.tsx`, `locales/en.json`, `locales/de.json`
**Why fourth:** The detail page from Phase 3 must exist before the settings card can navigate to it. Translation keys are added here.
**Deliverable:** Equipment card appears on Settings page. Tapping navigates to the detail page. Card shows current equipment name or setup prompt.
**Dependencies:** Phase 3 (detail page route).

### Phase 5: Chat Context Injection

**Files:** `hooks/useEquipmentContext.ts`, `utils/equipmentChatContext.ts`, `app/chat.tsx`
**Why fifth:** Requires equipment data to exist in the DB (Phases 1-4). The chat page modification is isolated -- it only changes how the system prompt is constructed.
**Deliverable:** Brew Buddy responses reflect the user's equipment. Verifiable by saving equipment, opening chat, and asking a hardware question.
**Dependencies:** Phase 2 (data hook), Phase 3 (equipment must be saveable).

### Phase 6: Export/Import + Polish

**Files:** `utils/dataExport.ts`, `utils/dataImport.ts`, translation polish, Storybook stories
**Why last:** Non-critical path. Export/import is an existing feature that needs extension. This phase also covers edge cases (empty state, delete equipment, re-import).
**Deliverable:** Equipment data included in JSON export. Import restores equipment. Storybook stories for new components.
**Dependencies:** All previous phases.

---

## 6. Risks and Constraints

### Context Window Pressure

The Apple Foundation Models hard limit is 4,096 tokens. The system prompt (from `chat.systemPrompt` translation key) is already of unknown length. Adding ~15-20 tokens for equipment context is safe, but the cumulative effect matters. If the system prompt is already 500+ tokens, adding equipment context leaves less room for conversation history.

**Mitigation:** Keep the equipment context string as short as possible. Measure the system prompt length after equipment injection. Consider adding a token budget warning if the system prompt exceeds 300 tokens.

### Single-Row Enforcement

The schema allows multiple rows in `machineTable` and `grinderTable`. The application must enforce the 1:1 constraint by always reading the first row and using upsert logic (insert if no row exists, update if one does).

**Mitigation:** The `useEquipmentProfile` hook encapsulates this logic. No other code should query these tables directly.

### Machine Type Enum Evolution

New machine types may be needed in the future. Since the type is stored as text, adding new values is backwards-compatible -- existing rows are unaffected.

**Mitigation:** The `MachineType` const object is the single source of truth. UI pickers and the `INTEGRATED_GRINDER_TYPES` array derive from it.

### Grinder Deletion on Type Change

When a user changes their machine type from external-grinder to integrated-grinder, the grinder row should be deleted (or the grinder section simply hidden). If they switch back, the grinder data is gone.

**Mitigation:** Show a confirmation dialog before deleting grinder data when switching to an integrated-grinder machine type. Alternatively, keep the grinder row but hide it in the UI (simpler, less data loss risk). Recommended: hide in UI, keep data.

---

## 7. Open Questions

| Question | Impact | Default if unanswered |
|----------|--------|-----------------------|
| Should grinder data be deleted or just hidden when machine type is integrated? | UX and data integrity | Hide only (keep data, safer) |
| What is the current system prompt token length? | Determines how tight the context budget is | Measure during Phase 5; if over 400 tokens, consider trimming |
| Should the equipment detail page use `presentation: "fullScreenModal"` or standard push? | Navigation feel | `fullScreenModal` (matches roastery detail pattern) |
| Should MachineTypePicker be a Select dropdown or a BottomSheet with visual cards? | UI polish | Select dropdown (simpler, matches existing patterns) |

---

*Architecture research completed: 2026-02-23*
