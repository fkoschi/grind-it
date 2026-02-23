# Project Research Summary

**Project:** Grind It — Machine/Grinder Profile Milestone
**Domain:** Mobile coffee tracking app (Expo + React Native)
**Researched:** 2026-02-23
**Confidence:** HIGH

## Executive Summary

This milestone adds equipment profiles (machine + grinder) to an existing, well-architected Expo app. Because the core stack is already established and production-tested, the implementation surface is narrower than a greenfield feature: two new SQLite tables, new CRUD screens following existing patterns, a settings card entry point, and an injection of equipment data into the Brew Buddy chat context. No new dependencies are required. Every technology decision falls within already-deployed patterns (Drizzle ORM for schema, react-hook-form + Zod for validation, expo-router for navigation, Tamagui for UI).

The recommended approach is a strict 6-phase build order driven by hard dependencies: schema first, data hooks second, CRUD UI third, settings integration fourth, chat injection fifth, and export/import polish last. This ordering ensures every phase delivers a testable increment and that no phase is blocked by incomplete upstream work. The single most complex piece — Brew Buddy context injection — is deliberately saved for Phase 5, after equipment data can actually be saved and read.

The primary risk in this milestone is the Apple Foundation Models 4,096-token context window. Equipment context injection must be kept to ~20-30 tokens (a one-line string format is defined in the architecture research). The second risk is SQLite migration correctness: new tables are safe, but any ALTER TABLE operations on existing tables will fail on older SQLite versions. Both risks have concrete mitigations and neither is a blocker.

---

## Key Findings

### Recommended Stack

The existing stack covers all requirements. Drizzle ORM handles schema and migrations, Tamagui provides all needed form components, react-hook-form + Zod provides validation consistent with the bean creation flow, expo-router handles the new modal screen, and i18next handles translation keys. No new libraries should be added.

Machine type enums should be stored as text in SQLite (no native enum support) with TypeScript const objects providing compile-time safety. This is already the pattern used in the codebase.

**Core technologies (no changes needed):**
- Drizzle ORM + SQLite: schema, migrations, and queries — already deployed
- Tamagui: Select, Input, Label form primitives — already in use
- react-hook-form + Zod: form validation — already used in add-bean flow
- expo-router: modal and fullScreenModal routes — already in use
- i18next: translation keys for new UI and chat context — already configured

### Expected Features

**Must have (table stakes):**
- Machine Profile CRUD — manufacturer, model name, machine type enum
- Grinder Profile CRUD — manufacturer, model name, burr type
- Machine type enum in schema — drives UI behavior and AI context
- Integrated grinder logic — hide grinder section for super-automatic and capsule/pod types
- Settings card entry point — follows existing Brew Buddy / Roastery / Taste card pattern
- Equipment detail view — combined machine + grinder screen following roastery detail layout
- Brew Buddy context injection — one-line equipment string appended to system prompt

**Should have (differentiators):**
- Boiler/heating type field — enables temperature surfing tips from Brew Buddy
- Grinder adjustment type (stepped/stepless) — changes how grind advice is phrased
- Burr size field (mm) — adds specificity to grind speed and retention guidance
- Schematic machine illustration — visual polish on settings card and detail screen

**Defer (v2+):**
- Multiple equipment profiles — single machine + single grinder per PROJECT.md spec
- Bluetooth device integration — massive scope, Beanconqueror's core differentiator
- Grinder calibration tracking — too niche for v1
- Preparation method as a separate entity — adds schema complexity without v1 value
- Equipment purchase/warranty tracking — no contribution to core value prop

### Architecture Approach

The feature follows the existing composition-pattern component model, with two new DB tables (`machine_table`, `grinder_table`), two new hooks (`useEquipmentProfile`, `useEquipmentContext`), and a new screen at `app/equipment/detail.tsx`. The 1:1 constraint (one machine, one grinder per device) is enforced at the application layer via upsert logic in `useEquipmentProfile`, not the schema layer. Chat injection uses an always-on strategy: a ~20-token equipment string is appended to the system prompt whenever equipment data exists, avoiding brittle keyword detection while consuming negligible token budget.

**Major components:**
1. `useEquipmentProfile` hook — DB reads/writes for machine and grinder, enforces upsert/1:1 logic
2. `EquipmentDetailPage` screen — full-screen modal for CRUD, follows roastery detail pattern
3. `EquipmentCard` settings card — entry point on settings page, shows current equipment or setup prompt
4. `useEquipmentContext` hook + `equipmentChatContext` utility — formats equipment data for chat system prompt injection
5. Export/import extension — adds optional `machine` and `grinder` fields to `ExportedData`

### Critical Pitfalls

1. **SQLite ALTER TABLE limitations** — Only use `CREATE TABLE` for the two new tables. Never ALTER existing tables in migrations. Test migrations on a real device before shipping. (Phase 1 risk)

2. **Apple Foundation Models token overflow** — Keep equipment context string to ~20-30 tokens. Always-inject is safe at that length, but the system prompt must be measured after adding equipment context to ensure the combined budget stays well under 4,096 tokens. The known `@react-native-ai/apple` crash bug on context overflow (GitHub #125) makes this a stability risk, not just a quality risk. (Phase 5 risk)

3. **Grinder data loss on machine type change** — When a user switches to an integrated-grinder machine type, do NOT delete the grinder row. Hide the grinder section in the UI only. This allows restoring the grinder data if the user switches back. (Phase 3 risk)

4. **Data export/import regression** — Adding new tables without updating export/import utilities silently drops equipment data from backups. New `machine` and `grinder` fields in `ExportedData` must be optional to maintain backward compatibility with existing backups. (Phase 6 risk)

5. **Machine type enum granularity** — The enum must cover both espresso and non-espresso brewing methods (pour-over, French press, AeroPress, etc.) because the app already tracks diverse grind settings implying diverse brewing methods. Group types visually in the picker. Always include `other` as an escape hatch. (Phase 1 design risk)

---

## Implications for Roadmap

Based on research, the feature has clear sequential dependencies that determine phase structure. The FEATURES.md dependency graph and ARCHITECTURE.md build order are in full agreement.

### Phase 1: Database Schema and Migration

**Rationale:** The schema is the foundation for all other work. Both new tables must exist before any hook, UI, or chat integration can function. Doing this first also forces the critical design decision on the machine type enum (which broadcasting methods to include) before UI work begins.
**Delivers:** `machine_table` and `grinder_table` in SQLite, `MachineType` TypeScript enum, `INTEGRATED_GRINDER_TYPES` constant, Drizzle migration file registered in `migrations.js`.
**Addresses:** F3 (machine type enum), foundational requirement for F1 and F2.
**Avoids:** SQLite ALTER TABLE pitfall (create new tables only, no ALTER on existing tables).

### Phase 2: Data Access Hook

**Rationale:** The data hook encapsulates all DB access and the 1:1 upsert logic. Both the UI screen and the chat integration depend on it. Isolating this in a dedicated phase keeps the hook testable before any UI is built on top of it.
**Delivers:** `useEquipmentProfile` hook with `machine`, `grinder`, `saveMachine`, `saveGrinder`, `deleteGrinder` (soft-hide, not actual delete); prepared queries in `db/queries.ts`.
**Addresses:** F1 and F2 data layer.
**Avoids:** Single-row enforcement pitfall (hook is the single access point).

### Phase 3: Equipment Detail Page and Route

**Rationale:** This is the primary user-facing deliverable. The form allows users to actually save equipment data, which is required for Phase 5 (chat injection) to have anything to inject. The grinder visibility toggle (integrated grinder logic) lives here.
**Delivers:** `app/equipment/detail.tsx` registered as `fullScreenModal` in `_layout.tsx`, `EquipmentDetailPage` and `MachineTypePicker` components, working CRUD with form validation via Zod.
**Addresses:** F1 (machine CRUD), F2 (grinder CRUD), F4 (integrated grinder logic), D2/D3/D4 (optional boiler, adjustment type, burr size fields — low effort, include here).
**Avoids:** Grinder data loss pitfall (hide section, keep data row).

### Phase 4: Settings Integration

**Rationale:** The detail page route must exist before the settings card can navigate to it. Translation keys are added here alongside the visible UI entry point.
**Delivers:** `EquipmentCard` on settings page navigating to the detail screen, `en.json` and `de.json` translation keys for all equipment UI strings, card shows current equipment name or "Set up your equipment" placeholder.
**Addresses:** F5 (settings card), F6 (equipment detail view is now reachable).
**Avoids:** No new pitfalls introduced; this phase is low-risk.

### Phase 5: Brew Buddy Context Injection

**Rationale:** Requires equipment data to be saveable (Phases 1-4 complete). This is the highest-complexity phase and the core value differentiator — no competing coffee app combines equipment profiles with conversational AI. Isolated to its own phase to allow focused testing.
**Delivers:** `useEquipmentContext` hook, `utils/equipmentChatContext.ts` pure utility, modified `app/chat.tsx` that appends the one-line equipment string to the system prompt. Brew Buddy gives hardware-specific advice when equipment is configured.
**Addresses:** F7 (Brew Buddy context injection), enables D1 (machine-specific grind guidance) and D6 (equipment-aware bean recommendations) via prompt engineering.
**Avoids:** Token overflow pitfall (keep equipment string to ~20-30 tokens; measure total system prompt length after injection).

### Phase 6: Export/Import and Polish

**Rationale:** Non-critical path. Export/import correctness is a data integrity concern that should ship with the feature but does not block core functionality. Storybook stories and edge-case testing complete the phase.
**Delivers:** Equipment fields (`machine`, `grinder`) added to `ExportedData` interface as optional fields; export writes them, import reads them with graceful fallback for older backups; Storybook stories for `EquipmentCard` and `EquipmentDetailPage`; D5 machine illustration asset if sourced.
**Addresses:** Data export/import regression pitfall (optional fields, backward compatible).
**Avoids:** Import crash on older backups (optional fields with graceful handling).

### Phase Ordering Rationale

- Schema-first is mandatory: Drizzle `useLiveQuery` cannot run against tables that don't exist, and the migration must run on app boot.
- Hook-before-UI is the established pattern in this codebase (`useBeanDetails`, `useBensData`, etc.).
- Settings card comes after the detail route because it navigates to it — routing to a non-existent route will crash.
- Chat injection comes last among core phases because it has the highest complexity, the most risk (token budget), and depends on real equipment data being present in the DB to test properly.
- Export/import is genuinely last because it is the only phase that does not block the core user journey.

### Research Flags

Phases with standard patterns (skip `/gsd:research-phase`):
- **Phase 1** — Drizzle schema and migration patterns are well-documented and already in use.
- **Phase 2** — Data hooks follow the existing `useBeanDetails` / `useLiveQuery` pattern exactly.
- **Phase 3** — CRUD form follows the add-bean and roastery detail patterns. No novel patterns needed.
- **Phase 4** — Settings card follows the exact Brew Buddy / Roastery / Taste card pattern.
- **Phase 6** — Export/import extension follows the existing `ExportedData` interface pattern.

Phases likely needing deeper research:
- **Phase 5** — Apple Foundation Models context window management is under-documented. The known package bugs (#125, #128) in `@react-native-ai/apple` may require workarounds. Prompt engineering for equipment-aware advice needs iteration. Recommend a focused research spike on token budget measurement before starting Phase 5 implementation.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No new dependencies. Existing stack is verified in production. All decisions confirmed against current codebase. |
| Features | HIGH | Grounded in competitive analysis of Beanconqueror, Decent, Filtru, Brewfather. Feature scope aligns with PROJECT.md constraints. |
| Architecture | HIGH | Follows established codebase patterns throughout. Component boundaries, data flow, and build order are fully specified. |
| Pitfalls | MEDIUM | SQLite migration and export/import pitfalls are verified. Apple FM token pitfalls are documented but the exact system prompt token count is not yet measured — this is the main unknown. |

**Overall confidence:** HIGH

### Gaps to Address

- **System prompt token length**: The current `chat.systemPrompt` translation value has not been measured. Phase 5 must measure the base system prompt length before adding equipment context to confirm the combined budget is safe. If the base prompt exceeds ~300 tokens, it should be trimmed.
- **Machine type scope decision**: The PROJECT.md says "espresso machine" but the app supports diverse brewing methods. Research recommends including non-espresso types (pour-over, French press, AeroPress, etc.) in the enum. This decision must be confirmed before writing the schema migration in Phase 1.
- **Illustration asset source**: No illustration asset has been sourced yet. Phase 6 depends on a CC0 or custom schematic illustration of an espresso machine. This should be initiated early (in parallel with Phase 1-3) so it does not become a blocker for the final polish phase.
- **Combined vs. separate screens**: Architecture research recommends a combined machine + grinder screen with a hidden grinder section. PROJECT.md has a pending decision here. The combined screen approach should be confirmed before Phase 3 implementation begins.

---

## Sources

### Primary (HIGH confidence)
- Beanconqueror GitHub (graphefruit/Beanconqueror) — competitive feature analysis, grinder entity modeling
- Drizzle ORM SQLite docs — migration patterns, text enum pattern
- `@react-native-ai/apple` GitHub issues #125, #128 — known token overflow crash and null token bugs
- Existing codebase (`app/`, `db/`, `hooks/`, `components/`) — confirmed patterns for hook structure, CRUD screens, settings cards

### Secondary (MEDIUM confidence)
- Brewfather Equipment Docs — equipment profile field modeling
- Clive Coffee boiler type guide — boiler enum values and descriptions
- Perfect Daily Grind — flat vs conical burr grinder classification
- Mazzer stepless vs stepped grinder guide — adjustment type enum
- Espresso Outlet machine type comparison — manual lever, spring lever, semi/automatic distinctions

### Tertiary (LOW confidence)
- Apple Foundation Models token budget: The 4,096 token limit is documented, but exact token-per-character ratios under real app conditions are estimated (~3-4 chars/token). Measure empirically in Phase 5.

---
*Research completed: 2026-02-23*
*Ready for roadmap: yes*
