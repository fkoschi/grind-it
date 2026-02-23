# Phase 2: Equipment Detail Screen - Research

**Researched:** 2026-02-23
**Domain:** React Native screen construction (Expo Router, Tamagui, Drizzle ORM, react-hook-form)
**Confidence:** HIGH

## Summary

Phase 2 builds a single combined screen where users view and edit their saved machine and grinder profiles. The schema is already in place (Phase 1 complete): `machineTable` (id, manufacturer, name, type) and `grinderTable` (id, manufacturer, name) both exist in `db/schema.ts`, along with `MachineType` const and `INTEGRATED_GRINDER_TYPES`.

The app has a clear and repeatable pattern for detail/edit screens: a `LinearGradient` header area with back button and title, followed by a scrollable `YStack` of form fields below. The best reference for this phase is `app/roasteries/RoasteryDetailPage.tsx`, which uses `react-hook-form` + `zodResolver` for validation, `useLiveQuery` for live data, explicit save via `ActionButton`, and the same gradient header shape. All Tamagui `Select` components render as a native bottom `Sheet` on touch platforms via `Adapt`.

The key behavioral complexity is the conditional grinder section (DB-04 / DATA-03): when the user selects `super_automatic` or `capsule_pod` as machine type, the grinder form section must disappear from the UI but the grinder row in the DB must be preserved. This is purely a UI-conditional render driven by the `INTEGRATED_GRINDER_TYPES` array already exported from the schema.

**Primary recommendation:** Model the screen directly on `RoasteryDetailPage.tsx`. Use `react-hook-form` + `zod` for both machine and grinder sections in a single form, `useLiveQuery` for reactive data, Tamagui `Select` with grouped `Select.Group` + `Select.Label` for the type picker, and a Drizzle upsert (`onConflictDoUpdate`) to handle the create-or-update lifecycle.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DB-04 | Grinder profile is hidden when machine type is `super_automatic` or `capsule_pod` | `INTEGRATED_GRINDER_TYPES` array already exported from `db/schema.ts`; UI conditional render with `if (!INTEGRATED_GRINDER_TYPES.includes(machineType))` |
| UI-02 | Equipment detail screen shows combined machine + grinder view in a single screen | Single route `app/equipment/index.tsx` with two form sections (Machine, Grinder); reference: `RoasteryDetailPage.tsx` pattern |
| UI-03 | Detail view layout follows bean detail page patterns (header image area, form fields below) | `LinearGradient` header (`$14` height, `#FFDAAB` → `#E89E3F`, `borderBottomLeftRadius="$12"`) + scrollable `YStack` form below — identical to `EditRoasteryPage.tsx` and `RoasteryDetailPage.tsx` |
| UI-05 | Machine type picker groups types visually (Espresso, Manual/Filter, Other) | Tamagui `Select.Group` + `Select.Label` supports multiple named groups inside a single `Select.Viewport`; 14 types split into three groups |
| DATA-03 | Changing to `super_automatic`/`capsule_pod` hides grinder UI but preserves grinder data in DB | Save handler always writes the full grinder row regardless of machine type; UI conditional is purely presentational |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tamagui | ^1.138.6 | All UI primitives: `View`, `YStack`, `XStack`, `Input`, `Select`, `Text`, `Button`, `ScrollView` | Project-wide UI framework |
| drizzle-orm | ^0.36.4 | Database reads (`useLiveQuery`) and writes (`.insert().onConflictDoUpdate()`, `.update()`) | Project-wide ORM |
| react-hook-form | ^7.55.0 | Form state, validation, `Controller` wrappers | Used in `RoasteryDetailPage`, `EditBeanPage` |
| zod + @hookform/resolvers | already present | Schema validation tied to form | Used in `RoasteryDetailPage` |
| expo-router | ~6.0.15 | File-based routing, `useRouter` for back nav | Project navigation standard |
| tamagui/linear-gradient | ^1.138.6 | Gradient header matching bean/roastery pages | Used in all existing detail screens |
| react-native-safe-area-context | ~5.6.0 | `useSafeAreaInsets` for header top padding | Used in every screen with custom header |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tamagui/lucide-icons | ^1.138.6 | Back chevron and field icons | Standard icon source in the project |
| expo-image | ~3.0.10 | Header image area (illustrative machine graphic) | Per `ui-expo-image` skill rule: use `expo-image` not `<Image>` from RN |
| react-native-reanimated | ~4.1.1 | Optional animated transitions | Only if header needs animated height like `BeanHeaderLayout` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-hook-form` + `zod` | direct `useState` per field + `db.update` on blur (bean edit pattern) | The bean edit page uses the simpler pattern but has no save button — the equipment screen needs explicit save semantics (`isDirty` guard + `ActionButton`) which `react-hook-form` handles cleanly |
| Tamagui `Select` for type picker | Custom `Pressable` list in a bottom sheet | `Select` already renders as a native sheet on touch via `Adapt`; no custom sheet needed |
| `useLiveQuery` | one-time `useEffect` fetch | `useLiveQuery` is the standard; keeps data reactive if changed from another session |

**Installation:** No new packages needed. All dependencies already in `package.json`.

## Architecture Patterns

### Recommended Project Structure
```
app/
└── equipment/
    └── index.tsx          # Equipment detail + edit screen (single route)

components/
└── ui/
    └── EquipmentHeader/   # Header component for equipment screen
        ├── EquipmentHeader.tsx     # Root with LinearGradient
        └── index.ts

hooks/
└── useEquipmentData.ts    # useLiveQuery wrapper for machine + grinder rows
```

### Pattern 1: LinearGradient Header (matching existing screens)
**What:** A fixed-height gradient header with safe-area top padding, back button, and title. Identical shape used in `EditRoasteryPage`, `RoasteryDetailPage`, and `BeanHeaderLayout`.
**When to use:** All screens navigated to from Settings — the established visual language.
**Example:**
```tsx
// Source: app/roasteries/EditRoasteryPage.tsx (existing codebase)
const Header = () => (
  <LinearGradient
    height={"$14"}
    colors={["#FFDAAB", "#E89E3F"]}
    borderBottomLeftRadius="$12"
    borderBottomRightRadius="$12"
    start={[0, 1]}
    end={[0, 0]}
    paddingTop={topInset}
  >
    <Pressable
      style={{ position: "absolute", top: topInset + 12, left: 32 }}
      onPress={() => router.back()}
    >
      <ChevronDown size={28} color="white" />
    </Pressable>
    <View flex={1} justifyContent="flex-end" alignItems="center" gap="$3" mb="$6">
      <Text fontSize={32} c="$white" fontFamily="$sodabery">Equipment</Text>
    </View>
  </LinearGradient>
);
```

### Pattern 2: react-hook-form + zod + explicit save (RoasteryDetailPage pattern)
**What:** Form state managed by `useForm` with `zodResolver`, fields wired via `Controller`, save triggered by `ActionButton` only when `isDirty === true`.
**When to use:** When the screen has a save/update lifecycle rather than immediate-write-on-blur.
**Example:**
```tsx
// Source: app/roasteries/RoasteryDetailPage.tsx (existing codebase)
const schema = z.object({
  machineManufacturer: z.string().min(1),
  machineName: z.string().min(1),
  machineType: z.string().min(1),
  grinderManufacturer: z.string(),
  grinderName: z.string(),
});
type FormValues = z.infer<typeof schema>;

const { control, handleSubmit, watch, formState: { isDirty } } = useForm<FormValues>({
  resolver: zodResolver(schema),
  values: {
    machineManufacturer: machine?.manufacturer ?? "",
    machineName: machine?.name ?? "",
    machineType: machine?.type ?? MachineType.SEMI_AUTOMATIC,
    grinderManufacturer: grinder?.manufacturer ?? "",
    grinderName: grinder?.name ?? "",
  },
});

const currentMachineType = watch("machineType") as MachineType;
const showGrinderSection = !INTEGRATED_GRINDER_TYPES.includes(currentMachineType);
```

### Pattern 3: Grouped Tamagui Select for machine type picker (UI-05)
**What:** Multiple `Select.Group` blocks inside one `Select.Viewport`, each with a `Select.Label`. On touch platforms renders as a native bottom sheet via `Adapt`.
**When to use:** When items fall into distinct named categories.
**Example:**
```tsx
// Source: Context7 /tamagui/tamagui — Select component docs
<Select value={machineTypeValue} onValueChange={handleMachineTypeChange}>
  <Select.Trigger iconAfter={ChevronDown}>
    <Select.Value placeholder="Select type..." />
  </Select.Trigger>

  <Adapt when="sm" platform="touch">
    <Sheet native modal dismissOnSnapToBottom snapPoints={[60]} snapPointsMode="percent">
      <Sheet.Frame>
        <Sheet.ScrollView>
          <Adapt.Contents />
        </Sheet.ScrollView>
      </Sheet.Frame>
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
    </Sheet>
  </Adapt>

  <Select.Content zIndex={200_000_000}>
    <Select.Viewport minWidth={200}>
      <Select.Group>
        <Select.Label>Espresso</Select.Label>
        {ESPRESSO_TYPES.map((type, i) => (
          <Select.Item index={i} key={type.value} value={type.value}>
            <Select.ItemText>{type.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Group>
      <Select.Group>
        <Select.Label>Manual / Filter</Select.Label>
        {FILTER_TYPES.map((type, i) => (
          <Select.Item index={ESPRESSO_TYPES.length + i} key={type.value} value={type.value}>
            <Select.ItemText>{type.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Group>
      <Select.Group>
        <Select.Label>Other</Select.Label>
        {OTHER_TYPES.map((type, i) => (
          <Select.Item
            index={ESPRESSO_TYPES.length + FILTER_TYPES.length + i}
            key={type.value}
            value={type.value}
          >
            <Select.ItemText>{type.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Group>
    </Select.Viewport>
  </Select.Content>
</Select>
```

**Critical:** The `index` prop on `Select.Item` must be globally unique and sequential across all groups — it drives keyboard navigation and accessibility. Do not restart from 0 per group.

### Pattern 4: Drizzle upsert for single-row equipment tables (create-or-update)
**What:** The equipment screen must work whether the user has no saved equipment yet or is editing existing data. The correct pattern is insert-or-update rather than checking existence first.
**When to use:** Single-row configuration tables where id=1 is always the target.
**Example:**
```tsx
// Source: Context7 /drizzle-team/drizzle-orm-docs — upsert guide
const onSubmit = async (data: FormValues) => {
  // Machine upsert
  await db.insert(machineTable)
    .values({ id: 1, manufacturer: data.machineManufacturer, name: data.machineName, type: data.machineType })
    .onConflictDoUpdate({
      target: machineTable.id,
      set: { manufacturer: data.machineManufacturer, name: data.machineName, type: data.machineType },
    });

  // Grinder upsert — always write, regardless of machine type (DATA-03)
  await db.insert(grinderTable)
    .values({ id: 1, manufacturer: data.grinderManufacturer, name: data.grinderName })
    .onConflictDoUpdate({
      target: grinderTable.id,
      set: { manufacturer: data.grinderManufacturer, name: data.grinderName },
    });

  router.back();
};
```

### Pattern 5: DB-04 / DATA-03 — conditional UI, unconditional DB write
**What:** The grinder section is hidden when machine type is `super_automatic` or `capsule_pod`. The DB row is preserved by always writing the grinder upsert regardless of machine type.
**Implementation:**
```tsx
// Conditional render — purely presentational
{!INTEGRATED_GRINDER_TYPES.includes(currentMachineType) && (
  <GrinderSection control={control} />
)}

// Save handler — always writes grinder (DATA-03)
await db.insert(grinderTable)
  .values({ id: 1, manufacturer: data.grinderManufacturer, name: data.grinderName })
  .onConflictDoUpdate({ target: grinderTable.id, set: { ... } });
```

### Pattern 6: useLiveQuery hook for equipment data
**What:** Consistent with `useBeanDetails` and `useRoasteryDetails` — a thin hook wrapping `useLiveQuery` on `machineTable` and `grinderTable`, returning the first row or undefined.
**Example:**
```tsx
// Source: existing hooks/useBeanDetails.ts and hooks/useRoasteryDetails.ts patterns
export const useEquipmentData = () => {
  const { db } = useDatabase();
  const { data: machineData } = useLiveQuery(db.select().from(machineTable));
  const { data: grinderData } = useLiveQuery(db.select().from(grinderTable));
  return {
    machine: machineData?.[0],
    grinder: grinderData?.[0],
  };
};
```

### Pattern 7: Route registration in `_layout.tsx`
The new route must be registered in `app/_layout.tsx` inside the `<Stack>`, following the `roasteries/EditRoasteryPage` pattern (full-screen, no system header):
```tsx
<Stack.Screen
  name="equipment/index"
  options={{
    headerShown: false,
  }}
/>
```

### Machine type groupings for the picker (UI-05)
Based on the 14 `MachineType` values in `db/schema.ts`:

| Group | Types |
|-------|-------|
| Espresso | `manual_lever`, `spring_lever`, `semi_automatic`, `automatic`, `super_automatic`, `capsule_pod` |
| Manual / Filter | `moka_pot`, `pour_over`, `french_press`, `aeropress`, `siphon`, `cold_brew`, `turkish` |
| Other | `other` |

### Anti-Patterns to Avoid
- **Restarting `Select.Item` index per group:** The `index` prop must be globally sequential — `0, 1, 2...` across all groups. Restarting at `0` per group breaks keyboard navigation.
- **Using `KeyboardAvoidingView` in a modal:** Per CLAUDE.md, `KeyboardAvoidingView` does not work reliably in iOS modals. The equipment screen should NOT use `presentation: "modal"` — it should be a standard push screen like `roasteries/EditRoasteryPage`.
- **Writing grinder row only when visible:** DATA-03 requires grinder data to be preserved when the section is hidden. The save handler must always write the grinder upsert.
- **Creating a separate edit route:** Phase 2 combines view and edit in one screen (per roadmap decision). There is no separate "view" and "edit" split.
- **Checking existence before insert:** Use `.onConflictDoUpdate()` for upsert semantics instead of a read → branch → insert/update pattern.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Grouped type picker | Custom Pressable list + sheet + group headers | Tamagui `Select` with `Select.Group` + `Select.Label` | `Adapt` renders it as native sheet automatically; group labels built in |
| Form validation | `useState` per field + manual error checks | `react-hook-form` + `zod` | Project standard; `values:` prop syncs form with live data |
| Upsert logic | read + conditional insert/update | Drizzle `.onConflictDoUpdate()` | Atomic, no race condition, already used pattern in ecosystem |
| Live data subscription | `useEffect` + `db.select()` | `useLiveQuery` from `drizzle-orm/expo-sqlite` | Project standard; auto-rerenders on DB change |

**Key insight:** Every problem in this phase has a solved pattern already in the codebase. The implementation is primarily composition of existing patterns, not new infrastructure.

## Common Pitfalls

### Pitfall 1: Select.Item index must be globally unique across groups
**What goes wrong:** If index restarts at 0 for each `Select.Group`, keyboard navigation and ARIA accessibility breaks. Some items may not be selectable.
**Why it happens:** Tamagui's Select uses the `index` prop as a global position hint, not a per-group position.
**How to avoid:** Track a running counter across all groups: `ESPRESSO_TYPES.length + i` for filter group, `ESPRESSO_TYPES.length + FILTER_TYPES.length + i` for other group.
**Warning signs:** Items in the second or third group are unresponsive to keyboard navigation.

### Pitfall 2: Form `values:` prop requires stable references
**What goes wrong:** If the `values` object passed to `useForm` is recomputed on every render (new object reference), react-hook-form may continuously reset the form state, losing user edits.
**Why it happens:** `useForm({ values: { ... } })` resets when `values` changes by reference.
**How to avoid:** Pass `values` derived from stable `useLiveQuery` data. The query result only changes when the DB changes, so the reference is stable between user interactions.
**Warning signs:** Typing in a field immediately resets to the saved value.

### Pitfall 3: Grinder section re-mount loses form state
**What goes wrong:** If the grinder section is conditionally rendered with `{showGrinderSection && <GrinderSection />}`, unmounting it clears the form field values for those fields.
**Why it happens:** react-hook-form unregisters fields when their components unmount by default.
**How to avoid:** Use `shouldUnregister: false` in `useForm` config (default in v7), OR keep the grinder fields registered but render the section with `display: none` / opacity 0. The `values:` sync from `useLiveQuery` will repopulate them on re-mount anyway since DB data is preserved.
**Warning signs:** After switching back from `super_automatic` to `semi_automatic`, the grinder fields appear empty.

### Pitfall 4: Navigation registration for new route
**What goes wrong:** A new file at `app/equipment/index.tsx` will be picked up by expo-router automatically but without a `Stack.Screen` entry in `_layout.tsx` it will render with the default system header.
**Why it happens:** expo-router infers routes from the filesystem but uses defaults for unregistered screens.
**How to avoid:** Add `<Stack.Screen name="equipment/index" options={{ headerShown: false }} />` to `app/_layout.tsx`.

### Pitfall 5: Tamagui Select value type mismatch
**What goes wrong:** The existing `ThemedSelect` component in `components/ui/Select/Select.tsx` works with `{ id: number; name: string }[]` items. `MachineType` values are strings, not numeric IDs.
**Why it happens:** The existing Select wrapper was built for the roastery-picker use case.
**How to avoid:** Build a new `MachineTypeSelect` component directly using the Tamagui primitives (not wrapping `ThemedSelect`), passing `MachineType` string values directly.

## Code Examples

Verified patterns from official sources and codebase:

### Grouped machine type select with correct index tracking
```typescript
// Based on: Context7 /tamagui/tamagui Select docs + existing Select.tsx pattern
const ESPRESSO_TYPES = [
  { value: MachineType.MANUAL_LEVER, label: "Manual Lever" },
  { value: MachineType.SPRING_LEVER, label: "Spring Lever" },
  { value: MachineType.SEMI_AUTOMATIC, label: "Semi-Automatic" },
  { value: MachineType.AUTOMATIC, label: "Automatic" },
  { value: MachineType.SUPER_AUTOMATIC, label: "Super-Automatic" },
  { value: MachineType.CAPSULE_POD, label: "Capsule / Pod" },
];

const FILTER_TYPES = [
  { value: MachineType.MOKA_POT, label: "Moka Pot" },
  { value: MachineType.POUR_OVER, label: "Pour Over" },
  { value: MachineType.FRENCH_PRESS, label: "French Press" },
  { value: MachineType.AEROPRESS, label: "AeroPress" },
  { value: MachineType.SIPHON, label: "Siphon" },
  { value: MachineType.COLD_BREW, label: "Cold Brew" },
  { value: MachineType.TURKISH, label: "Turkish" },
];

const OTHER_TYPES = [{ value: MachineType.OTHER, label: "Other" }];
```

### Drizzle upsert for single-row config table
```typescript
// Source: Context7 /drizzle-team/drizzle-orm-docs upsert guide
await db.insert(machineTable)
  .values({ id: 1, manufacturer, name, type })
  .onConflictDoUpdate({
    target: machineTable.id,
    set: { manufacturer, name, type },
  });
```

### Conditional grinder section render
```typescript
// Source: db/schema.ts (INTEGRATED_GRINDER_TYPES already exported)
import { INTEGRATED_GRINDER_TYPES, MachineType } from "@/db/schema";

const currentMachineType = watch("machineType") as MachineType;
const showGrinderSection = !INTEGRATED_GRINDER_TYPES.includes(currentMachineType);

// In JSX:
{showGrinderSection && (
  <YStack gap="$4">
    {/* grinder fields */}
  </YStack>
)}
```

### Field label + input pattern (matching RoasteryDetailPage)
```tsx
// Source: app/roasteries/RoasteryDetailPage.tsx (existing codebase)
<YStack gap="$2">
  <ThemedText fw={600} fontSize={12} color="$copyText">
    Manufacturer
  </ThemedText>
  <Controller
    name="machineManufacturer"
    control={control}
    render={({ field: { onChange, onBlur, value } }) => (
      <Input
        borderWidth={0}
        bgC="white"
        borderRadius="$4"
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        size="$4"
      />
    )}
  />
</YStack>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `Adapt.Contents` in Sheet frame | `Select.SheetContents` (newer API) or `Adapt.Contents` (still works) | Tamagui ~1.19 | Both patterns work; codebase already uses `Adapt.Contents` — stick with it for consistency |
| `useEffect` + manual DB fetch | `useLiveQuery` from `drizzle-orm/expo-sqlite` | Drizzle Expo SQLite integration | Auto-reactive; project standard |

**Deprecated/outdated:**
- Manual read → branch → insert/update: Replaced by `.onConflictDoUpdate()` for upsert semantics.
- `ThemedSelect` wrapper for string-valued selects: The wrapper expects `{ id: number }[]` — not reusable for `MachineType` strings without modification.

## Open Questions

1. **No default machine type pre-selected vs. requiring selection**
   - What we know: `machineTable.type` is `text().notNull()` — a value is required.
   - What's unclear: Should the form default to `semi_automatic` on first open, or show an empty/placeholder state requiring the user to pick?
   - Recommendation: Default to `MachineType.SEMI_AUTOMATIC` (most common espresso machine type); avoids empty-string validation errors on first save.

2. **Grinder fields when section is hidden — required or optional?**
   - What we know: `grinderTable.manufacturer` and `grinderTable.name` are `text().notNull()`.
   - What's unclear: What value to write when a `super_automatic` user saves and the grinder fields are hidden (they may have never filled them in).
   - Recommendation: Default grinder fields to empty string `""` when not filled; the upsert always writes the current form state, and the grinder section being hidden means the user is not being asked to fill it — so whatever was last saved (or empty string as default) is preserved.

3. **Section divider between Machine and Grinder areas**
   - What we know: The screen has two logical sections on one scroll view.
   - What's unclear: Whether a visual separator (divider line, section title, subtle background) is expected.
   - Recommendation: Use a `ThemedText` section heading (`ThemedText fw={700} fontSize={16}`) above each section, consistent with how the roastery detail page uses `ThemedText` for field labels.

## Sources

### Primary (HIGH confidence)
- `/tamagui/tamagui` (Context7) — Select component with `Select.Group`, `Select.Label`, `Adapt` sheet behavior, `Select.Item` index semantics
- `/drizzle-team/drizzle-orm-docs` (Context7) — `.onConflictDoUpdate()` upsert syntax for SQLite
- `app/roasteries/RoasteryDetailPage.tsx` (codebase) — canonical pattern for `react-hook-form` + `zod` + `ActionButton` save
- `app/roasteries/EditRoasteryPage.tsx` (codebase) — canonical `LinearGradient` header pattern
- `db/schema.ts` (codebase) — `machineTable`, `grinderTable`, `MachineType`, `INTEGRATED_GRINDER_TYPES` confirmed complete from Phase 1
- `components/ui/Select/Select.tsx` (codebase) — existing `ThemedSelect` uses `Adapt.Contents` pattern; confirmed not reusable for string-value selects
- `app/_layout.tsx` (codebase) — Stack navigator; confirmed registration pattern for new routes
- `CLAUDE.md` — `KeyboardAvoidingView` not reliable in modals; always use `useKeyboardHeight` hook for keyboard-aware layout

### Secondary (MEDIUM confidence)
- `hooks/useBeanDetails.ts`, `hooks/useRoasteryDetails.ts` (codebase) — `useLiveQuery` hook wrapper pattern
- `tamagui.config.ts` (codebase) — confirmed color tokens (`$primary`, `$secondary`, `$screenBackground`, `$copyText`, `$white`), font (`$sodabery`), animation presets

### Tertiary (LOW confidence)
- None — all critical findings verified against codebase or Context7.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in `package.json`; versions confirmed
- Architecture: HIGH — direct codebase references; patterns exist and are working in production
- Pitfalls: HIGH for pitfalls 1, 4, 5 (verified against codebase); MEDIUM for pitfalls 2, 3 (react-hook-form behavior, standard RHF knowledge)

**Research date:** 2026-02-23
**Valid until:** 2026-03-25 (stable libraries, 30-day window)
