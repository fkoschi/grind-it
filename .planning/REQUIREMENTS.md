# Requirements: Grind It — Machine Profile

**Defined:** 2026-02-23
**Core Value:** Users get concrete, hardware-aware coffee advice from Brew Buddy tailored to the exact machine and grinder they own.

## v1 Requirements

### Database

- [ ] **DB-01**: User can save one espresso machine/brew device with manufacturer, name, and type
- [ ] **DB-02**: User can save one grinder with manufacturer and name
- [ ] **DB-03**: Machine type is selected from a comprehensive enum covering all brew methods (14 types: manual_lever, spring_lever, semi_automatic, automatic, super_automatic, capsule_pod, moka_pot, pour_over, french_press, aeropress, siphon, cold_brew, turkish, other)
- [ ] **DB-04**: Grinder profile is hidden when machine type is super_automatic or capsule_pod

### UI

- [ ] **UI-01**: Settings page shows an equipment card entry point (simple title + icon, no preview)
- [ ] **UI-02**: Equipment detail screen shows combined machine + grinder view in a single screen
- [ ] **UI-03**: Detail view layout follows bean detail page patterns (header image, form fields below)
- [ ] **UI-04**: Schematic/illustrative machine image matches app warm design language (primary #E89E3F, secondary #664F3F)
- [ ] **UI-05**: Machine type picker groups types visually (Espresso, Manual/Filter, Other)

### Chat Integration

- [ ] **CHAT-01**: Brew Buddy detects hardware-related keywords in user messages and injects equipment context on-demand
- [ ] **CHAT-02**: Chat shows intro message referencing user's saved equipment when chat opens (if equipment is saved)
- [ ] **CHAT-03**: Equipment context string stays under ~30 tokens to preserve Apple FM 4,096 token context window

### Data Integrity

- [ ] **DATA-01**: Data export includes machine and grinder data in the export payload
- [ ] **DATA-02**: Data import handles equipment fields gracefully (missing fields from older backups = skip, present = restore)
- [ ] **DATA-03**: Changing machine type to super_automatic or capsule_pod hides grinder UI but preserves grinder data in DB

## v2 Requirements

### Grinder Details

- **GRIND-01**: User can save grinder burr type (flat, conical, blade, ghost, other)
- **GRIND-02**: User can save grinder adjustment type (stepped, stepless, hybrid, digital)
- **GRIND-03**: User can save burr size in mm

### Equipment Enhancements

- **EQUIP-01**: User can save a photo of their machine
- **EQUIP-02**: Multiple equipment profiles (different setups for home vs office)
- **EQUIP-03**: Equipment-specific bean grind recommendations based on history

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiple machine profiles | Single-user app with one setup at a time |
| Machine-specific recipe database | Brew Buddy handles advice conversationally |
| Grinder calibration tracking | Too niche for v1 |
| Equipment marketplace/links | Not core to the app's value proposition |
| Machine maintenance tracking | Separate feature, not part of this milestone |
| Auto-detect machine via Bluetooth | Hardware integration too complex for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DB-01 | Phase 1 | Pending |
| DB-02 | Phase 1 | Pending |
| DB-03 | Phase 1 | Pending |
| DB-04 | Phase 2 | Pending |
| UI-01 | Phase 3 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 3 | Pending |
| UI-05 | Phase 2 | Pending |
| CHAT-01 | Phase 4 | Pending |
| CHAT-02 | Phase 4 | Pending |
| CHAT-03 | Phase 4 | Pending |
| DATA-01 | Phase 5 | Pending |
| DATA-02 | Phase 5 | Pending |
| DATA-03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-02-23*
*Last updated: 2026-02-23 after roadmap creation*
