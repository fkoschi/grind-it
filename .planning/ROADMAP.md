# Roadmap: Grind It — Machine Profile

## Overview

This milestone adds equipment profiles to Grind It so Brew Buddy can give hardware-specific brewing advice. The build follows a strict dependency chain: schema first (tables must exist), then the CRUD screen (users can save equipment), then settings integration (users can reach the screen), then chat injection (Brew Buddy uses the data), and finally export/import (data survives backups). Each phase delivers a testable increment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Database Schema** - New tables and migration for machine and grinder profiles
- [ ] **Phase 2: Equipment Detail Screen** - Combined machine + grinder CRUD with form validation and integrated grinder logic
- [ ] **Phase 3: Settings Integration** - Equipment card on settings page with illustration and navigation
- [ ] **Phase 4: Brew Buddy Integration** - Equipment context injection into chat for hardware-aware advice
- [ ] **Phase 5: Export/Import** - Equipment data included in backup/restore with backward compatibility

## Phase Details

### Phase 1: Database Schema
**Goal**: The app has persistent storage for one machine and one grinder with a comprehensive machine type system
**Depends on**: Nothing (first phase)
**Requirements**: DB-01, DB-02, DB-03
**Success Criteria** (what must be TRUE):
  1. App boots without error after migration adds machine_table and grinder_table to SQLite
  2. Machine type enum covers all 14 brew methods (manual_lever through other) as TypeScript constants
  3. Machine row stores manufacturer, name, and type; grinder row stores manufacturer and name
**Plans**: 1 plan

Plans:
- [ ] 01-01-PLAN.md -- Define schema tables (machineTable, grinderTable), MachineType enum, generate and register migration

### Phase 2: Equipment Detail Screen
**Goal**: Users can view, create, and edit their machine and grinder from a single combined screen
**Depends on**: Phase 1
**Requirements**: DB-04, UI-02, UI-03, UI-05, DATA-03
**Success Criteria** (what must be TRUE):
  1. User can save a machine profile by entering manufacturer, name, and selecting a type from a grouped picker (Espresso / Manual-Filter / Other)
  2. User can save a grinder profile by entering manufacturer and name on the same screen below the machine section
  3. When user selects super_automatic or capsule_pod as machine type, the grinder section disappears but previously saved grinder data is preserved in the database
  4. Screen layout follows bean detail page patterns (header image area, form fields below)
**Plans**: 1 plan

Plans:
- [ ] 02-01-PLAN.md -- Equipment data hook, combined screen with grouped type picker, conditional grinder, upsert save, route registration

### Phase 3: Settings Integration
**Goal**: Users can discover and navigate to equipment management from the settings page
**Depends on**: Phase 2
**Requirements**: UI-01, UI-04
**Success Criteria** (what must be TRUE):
  1. Settings page shows an equipment card with title and icon that navigates to the equipment detail screen on tap
  2. A schematic machine illustration in the app's warm color palette (#E89E3F / #664F3F) appears on the equipment card or detail header
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Brew Buddy Integration
**Goal**: Brew Buddy gives hardware-specific brewing advice using the user's saved equipment data
**Depends on**: Phase 2
**Requirements**: CHAT-01, CHAT-02, CHAT-03
**Success Criteria** (what must be TRUE):
  1. When user asks a hardware-related question in chat, Brew Buddy references their specific machine and grinder in its response
  2. When chat opens with saved equipment, the intro message acknowledges the user's equipment setup
  3. Equipment context string injected into the system prompt stays under ~30 tokens to preserve the Apple FM 4,096 token budget
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

### Phase 5: Export/Import
**Goal**: Equipment data survives backup/restore cycles without breaking older backups
**Depends on**: Phase 2
**Requirements**: DATA-01, DATA-02
**Success Criteria** (what must be TRUE):
  1. Exporting data produces a payload that includes machine and grinder records alongside existing bean data
  2. Importing a backup that contains equipment data restores the machine and grinder profiles
  3. Importing an older backup (without equipment fields) completes without error and skips equipment restoration
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
(Phases 3, 4, and 5 all depend on Phase 2 but are independent of each other.)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Database Schema | 0/1 | Not started | - |
| 2. Equipment Detail Screen | 0/? | Not started | - |
| 3. Settings Integration | 0/? | Not started | - |
| 4. Brew Buddy Integration | 0/? | Not started | - |
| 5. Export/Import | 0/? | Not started | - |
