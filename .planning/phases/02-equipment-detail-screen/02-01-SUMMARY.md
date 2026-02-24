---
phase: 02-equipment-detail-screen
plan: 01
subsystem: ui, data
tags: [equipment, react-hook-form, tamagui, drizzle-orm, upsert]

requires:
  - phase: 01-database-schema
    provides: machineTable, grinderTable, MachineType, INTEGRATED_GRINDER_TYPES
provides:
  - useEquipmentData hook (reactive machine/grinder data)
  - Equipment detail screen at app/equipment/index.tsx
  - Route registration in app/_layout.tsx
---

## What Was Built

Combined equipment detail screen where users view, create, and edit their machine and grinder profiles in a single form.

## Key Files

### Created
- `hooks/useEquipmentData.ts` — Live-reactive hook returning `{ machine, grinder }` from Drizzle queries, plus ESPRESSO_TYPES/FILTER_TYPES/OTHER_TYPES grouping arrays
- `app/equipment/index.tsx` — Full equipment screen with LinearGradient header, machine form (manufacturer, name, grouped type picker), conditional grinder form, and Drizzle upsert save

### Modified
- `app/_layout.tsx` — Added Stack.Screen registration for equipment/index with headerShown: false

## Design Decisions

- **Single screen for machine + grinder** — combined form avoids duplicate screens for few data points
- **Default machine type: semi_automatic** — most common type, avoids validation error on first save
- **Grinder fields not required in zod** — empty strings allowed since grinder section hidden for super_automatic/capsule_pod
- **Always upsert both tables** — grinder data preserved in DB even when UI section is hidden (DATA-03)
- **Direct Tamagui Select** — ThemedSelect incompatible with string MachineType values (expects numeric IDs)
- **Ternary conditional rendering** — per project skill rule, `showGrinderSection ? (...) : null` instead of `&&`

## Deviations

None — plan executed as written.

## Self-Check: PASSED

- [x] Task 1: useEquipmentData hook with type grouping constants
- [x] Task 2: Equipment screen with grouped picker, conditional grinder, route registration
- [x] TypeScript compilation passes (no new errors)
- [x] Lint/format passes via pre-commit hook
