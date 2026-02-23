# Pitfalls Research: Equipment Profiles

> **Dimension:** Pitfalls
> **Milestone:** Machine/Grinder Profile for Grind It
> **Date:** 2026-02-23

## Research Summary

Common mistakes when adding equipment profile features to an existing Expo + Drizzle + SQLite app, with specific prevention strategies.

---

## Pitfall 1: SQLite ALTER TABLE Limitations with Drizzle

**Risk:** High
**Phase:** Database schema (Phase 1)

**What goes wrong:** SQLite has limited ALTER TABLE support — you can't add constraints, modify column types, or rename columns in older SQLite versions. Drizzle Kit generates migrations that may use unsupported operations.

**Warning signs:**
- Migration fails on device with "near ALTER: syntax error"
- Works in dev but fails on production app update

**Prevention:**
- Use only `CREATE TABLE` for new tables (machine, grinder) — no ALTER on existing tables
- Test migrations on a real device, not just the simulator
- Keep migration simple: two new tables, no foreign keys to existing tables initially
- Use `drizzle-kit generate` and review the SQL before applying

---

## Pitfall 2: Apple Foundation Models Token Budget Overflow

**Risk:** Medium
**Phase:** Brew Buddy integration (Phase 3-4)

**What goes wrong:** The Apple FM context window is 4,096 tokens. Injecting machine + grinder info into the system prompt on every hardware question eats into an already tight budget.

**Warning signs:**
- `exceededContextWindowSize` errors after a few messages
- App crash (known bug in @react-native-ai/apple with context overflow)

**Prevention:**
- Keep equipment context string ultra-concise: "Machine: Gaggia Classic Pro (semi-automatic). Grinder: Eureka Mignon Notte (stepless, 50mm flat burr)." — ~30 tokens
- Only inject when the user's message mentions machine/grinder/setup keywords
- Consider stripping equipment context from older messages in the transcript replay

---

## Pitfall 3: Machine Type Enum Too Granular or Too Coarse

**Risk:** Medium
**Phase:** Database schema + UI (Phase 1-2)

**What goes wrong:** Too many types overwhelm users in a picker. Too few types lose useful information for Brew Buddy.

**Warning signs:**
- Users can't find their machine type in the picker
- Brew Buddy gives generic advice despite having machine type

**Prevention:**
- Start with ~14 types (covering all major categories from espresso to cold brew)
- Group visually in the picker (Espresso machines, Manual/Filter, Other)
- Include "Other" as escape hatch
- The type value should be meaningful to Brew Buddy (e.g., "semi_automatic" tells it about pressure, temperature, workflow)

---

## Pitfall 4: Data Export/Import Regression

**Risk:** Medium
**Phase:** Database + export integration

**What goes wrong:** Adding new tables without updating the export/import utilities breaks backup/restore for users.

**Warning signs:**
- Exported JSON doesn't include machine/grinder data
- Import from older backup (without equipment) crashes

**Prevention:**
- Update both `useDataExport` and `useDataImport` hooks
- Handle missing equipment fields gracefully on import (older backups won't have them)
- Test: export with equipment → import on fresh install → verify equipment restored

---

## Pitfall 5: Image Asset Licensing

**Risk:** Low
**Phase:** UI (Phase 2)

**What goes wrong:** Using an image from the web without proper licensing leads to copyright issues.

**Warning signs:**
- Image sourced from Google Images without checking license
- SVG from a site with restricted commercial use

**Prevention:**
- Use royalty-free/CC0 sources (Unsplash, Flaticon with attribution, custom illustration)
- If no suitable free asset found, use a placeholder icon from Lucide Icons (already in the project)
- Document the image source and license in a comment near the import

---

## Pitfall 6: Grinder Visibility Logic Bugs

**Risk:** Low
**Phase:** UI (Phase 2)

**What goes wrong:** The conditional grinder section (hidden for super-automatic and capsule/pod machines) has edge cases — user changes machine type after already saving grinder data.

**Warning signs:**
- Orphaned grinder data in DB when machine type changes to super-automatic
- Grinder section flickers during type selection

**Prevention:**
- Don't delete grinder data when machine type changes — just hide the UI section
- If machine type is super_automatic or capsule_pod, grinder data is ignored (not deleted)
- This way, switching back to semi_automatic restores the previously entered grinder info

---
*Pitfalls research: 2026-02-23*
