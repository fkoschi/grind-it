# Feature Research: Coffee Equipment Profiles

> **Dimension:** Features
> **Milestone:** Machine/Grinder Profile for Grind It
> **Date:** 2026-02-23

## Research Summary

This document catalogs features for coffee equipment profile systems, drawing from competitive analysis of Beanconqueror, Decent Espresso Profiler, Filtru, Brewfather, and other coffee tracking apps. Features are categorized as table stakes (must-have), differentiators (competitive advantage), and anti-features (deliberately excluded). Each feature includes complexity estimates and dependency notes to feed into requirements and schema design.

---

## 1. Espresso Machine Types (Comprehensive Enum)

A core requirement for the DB schema. Machine type determines UI behavior (integrated grinder suppresses grinder section) and feeds into Brew Buddy advice context.

### Category: Machine Operation Type

| Enum Value | Display Name | Has Integrated Grinder | Notes |
|---|---|---|---|
| `manual_lever` | Manual Lever (Direct) | No | User generates all pressure manually by pushing/pulling a lever. Maximum control, high variability. Examples: Flair, ROK. |
| `spring_lever` | Spring Lever | No | User compresses a spring by pulling lever down; spring pushes water through puck on release. More consistent than direct lever. Examples: La Pavoni Europiccola, Londinium. |
| `semi_automatic` | Semi-Automatic | No | User grinds, tamps, starts/stops shot manually. Pump generates pressure. Most common prosumer type. Examples: Gaggia Classic, Rancilio Silvia, Lelit Bianca. |
| `automatic` | Automatic | No | Like semi-automatic but machine stops the shot automatically (volumetric or timed). User still grinds and tamps. Examples: Breville Dual Boiler (volumetric mode), many commercial machines. |
| `super_automatic` | Super-Automatic (Bean-to-Cup) | **Yes** | Grinds, tamps, brews, and often froths milk automatically. Built-in grinder is integral. Examples: Jura, De'Longhi Magnifica, Philips 3200. |
| `capsule_pod` | Capsule / Pod | N/A (pre-ground) | Uses pre-packaged capsules. No grinder needed at all. Examples: Nespresso, Dolce Gusto, Illy iperEspresso. |
| `moka_pot` | Moka Pot (Stovetop) | No | Steam pressure forces water through grounds. Not true espresso (~1.5 bar vs 9 bar) but widely used. Examples: Bialetti Moka Express. |
| `pour_over` | Pour Over / Drip | No | Manual pour (V60, Chemex, Kalita Wave) or electric drip (Moccamaster). Gravity-fed, no pressure. |
| `french_press` | French Press / Immersion | No | Full immersion brewing with metal mesh plunger filter. Coarse grind. |
| `aeropress` | AeroPress | No | Hybrid immersion/pressure brewing. Versatile, portable. |
| `siphon` | Siphon / Vacuum | No | Vapor pressure and vacuum brewing. Produces very clean cup. |
| `cold_brew` | Cold Brew | No | Extended cold water immersion (12-24 hours). No heat. |
| `turkish` | Turkish / Ibrik | No | Extra-fine grounds simmered in cezve/ibrik. Unfiltered. |
| `other` | Other | No | Catch-all for unlisted methods. |

### Integrated Grinder Logic

- **`super_automatic`**: Always has integrated grinder. Hide grinder profile section entirely.
- **`capsule_pod`**: Uses pre-ground capsules. Hide grinder profile section entirely.
- **All other types**: Show grinder profile section; user needs a separate grinder.

### Recommendation for v1

The PROJECT.md specifies the feature as "machine profile" but the app already tracks grind settings per bean, implying users brew with methods beyond espresso. Including non-espresso brewing methods (pour-over, French press, AeroPress, etc.) broadens the enum to cover the full user base. However, for v1 with a single equipment profile, calling it "brew method" or "equipment" rather than strictly "espresso machine" may be more inclusive.

**Decision needed:** Should the enum cover only espresso-category machines, or all brewing methods? The PROJECT.md says "espresso machine" but the app supports diverse coffee preparation.

---

## 2. Grinder Types and Properties

### Grinder Burr Type (Enum)

| Enum Value | Display Name | Notes |
|---|---|---|
| `flat_burr` | Flat Burr | Two parallel rings with angled teeth. More uniform particle distribution. Common in prosumer/commercial grinders. |
| `conical_burr` | Conical Burr | Inner cone sits inside outer ring. Gentler on beans, less heat, bimodal distribution. Most hand grinders use this. |
| `blade` | Blade | Propeller-like blade chops beans. Inconsistent grind. Budget option. |
| `ghost_burr` | Ghost Burr | Conical variant (used by Mazzer, some Eureka). Hybrid geometry. |
| `other` | Other | Catch-all. |

### Grinder Adjustment Type (Enum)

| Enum Value | Display Name | Notes |
|---|---|---|
| `stepped` | Stepped | Predefined click positions. Easy to return to settings. Beginner-friendly. |
| `stepless` | Stepless (Micrometric) | Infinite adjustment. Allows micro-tuning. Preferred for espresso dialing. |
| `hybrid` | Hybrid / Convertible | Can switch between stepped and stepless modes. Rare (e.g., Mazzer Philos). |
| `digital` | Digital | Electronic grind setting (e.g., Acaia Orbit, some super-automatics). |

### Additional Grinder Properties (Optional Fields)

| Property | Type | Notes | Complexity |
|---|---|---|---|
| Burr size (mm) | Integer | Common sizes: 38, 48, 54, 58, 64, 75, 80, 83, 98mm. Affects grind speed and consistency. | Low |
| Single dosing capable | Boolean | Whether designed for single-dose workflow (low retention). Relevant for home use. | Low |
| RPM | Integer | Burr rotation speed. Lower RPM = less heat = better flavor preservation. | Low |
| Motor type | Enum (AC/DC) | Affects noise and workflow. Not critical for v1. | Low |

---

## 3. Espresso Machine Properties

### Boiler/Heating Type (Enum)

| Enum Value | Display Name | Notes |
|---|---|---|
| `single_boiler` | Single Boiler | One boiler for brew and steam. Cannot do both simultaneously. Entry-level. |
| `dual_boiler` | Dual Boiler | Separate brew and steam boilers. Simultaneous operation. Prosumer/commercial. |
| `heat_exchanger` | Heat Exchanger (HX) | Single steam boiler with brew water tube running through it. Simultaneous operation. Mid-range. |
| `thermoblock` | Thermoblock | Water heated through narrow pipe in metal block. Fast heat-up, less stable temp. Budget machines. |
| `thermocoil` | Thermocoil | Coiled tube in heated block. Better than thermoblock, used in Breville/Sage. |
| `thermojet` | Thermojet | Breville's proprietary fast-heating system. 3-second heat-up. |
| `none` | None / Not Applicable | For non-espresso brewing methods (pour-over, French press, etc.). |

---

## 4. Feature Categories

### Table Stakes (Must-Have)

These are the minimum viable features. Without them, the equipment profile adds no value and users will ignore it.

#### F1: Machine Profile CRUD
- **Description:** User can create, read, update, and delete a single machine profile with manufacturer name, model name, and machine type.
- **Complexity:** Medium
- **Dependencies:** New DB table (`machineTable`), Drizzle migration, new screen/form.
- **Rationale:** Core data entry. Every competing app (Beanconqueror, Filtru, Brewprint) lets users save equipment.

#### F2: Grinder Profile CRUD
- **Description:** User can create, read, update, and delete a single grinder profile with manufacturer name, model name, and burr type.
- **Complexity:** Medium
- **Dependencies:** New DB table (`grinderTable`), Drizzle migration, new screen/form.
- **Rationale:** Grinder is arguably more important than machine for grind quality. Beanconqueror treats grinders as first-class entities.

#### F3: Machine Type Enum in Schema
- **Description:** Database stores machine type as a validated enum value. Used for UI logic and Brew Buddy context.
- **Complexity:** Low
- **Dependencies:** Schema design must be finalized before migration.
- **Rationale:** Machine type drives two key behaviors: grinder section visibility and AI advice specificity.

#### F4: Integrated Grinder Logic
- **Description:** When machine type is `super_automatic` or `capsule_pod`, the grinder profile section is hidden or disabled in the UI.
- **Complexity:** Low
- **Dependencies:** F1, F3 (machine type must be set first).
- **Rationale:** Explicitly called out in PROJECT.md. Prevents confusing UX where user has a bean-to-cup machine and sees a grinder form.

#### F5: Settings Card Entry Point
- **Description:** A card on the settings page that navigates to the machine/grinder management screen. Follows existing card design pattern (Brew Buddy, Roastery, Taste).
- **Complexity:** Low
- **Dependencies:** Existing settings page card layout.
- **Rationale:** Consistent with existing app navigation patterns. Users expect equipment settings alongside other settings.

#### F6: Equipment Detail View
- **Description:** A detail screen showing the saved machine and grinder info. Similar layout to the existing bean detail or roastery detail views.
- **Complexity:** Medium
- **Dependencies:** F1, F2. Follows roastery detail view as layout reference.
- **Rationale:** Users need to see their saved equipment at a glance.

#### F7: Brew Buddy Context Injection
- **Description:** When the user asks a hardware-related question in the AI chat, machine and grinder info is appended to the prompt context.
- **Complexity:** High
- **Dependencies:** F1, F2, chat transport (`AppleChatTransport`), context window budget.
- **Rationale:** The core value proposition of this milestone. Without this, the machine profile is just static data. Beanconqueror does NOT do AI-powered hardware advice; this is where Grind It differentiates.
- **Constraints:** Apple Foundation Models have a 4,096 token context window. Machine info must be concise (under ~200 tokens). On-demand injection (not every message) is critical.

### Differentiators (Competitive Advantage)

These features are not required for launch but would set Grind It apart from competitors.

#### D1: Machine-Specific Grind Guidance
- **Description:** Brew Buddy provides grind size recommendations calibrated to the user's specific machine type and grinder capabilities. For example: "With your semi-automatic and conical burr grinder, try setting 14-16 for this medium roast."
- **Complexity:** Medium (prompt engineering, not code)
- **Dependencies:** F7 (context injection must work first).
- **Rationale:** No competing app does this. Beanconqueror tracks grind settings but offers no AI-driven recommendations. This is the "killer feature" value prop.

#### D2: Boiler/Heating Type in Profile
- **Description:** Store boiler type as an optional field. Enables Brew Buddy to give temperature surfing tips (single boiler), or note that temperature stability is less of a concern (dual boiler).
- **Complexity:** Low (schema field + UI picker)
- **Dependencies:** F1, boiler type enum.
- **Rationale:** Boiler type significantly affects workflow advice. Adds depth to AI recommendations without high implementation cost.

#### D3: Grinder Adjustment Type
- **Description:** Store whether the grinder is stepped or stepless. Affects how Brew Buddy describes grind adjustments ("move 2 clicks finer" vs "turn slightly clockwise").
- **Complexity:** Low (schema field + UI picker)
- **Dependencies:** F2, adjustment type enum.
- **Rationale:** Stepped vs stepless fundamentally changes how grind advice is communicated. Low-cost, high-value for AI personalization.

#### D4: Burr Size Field
- **Description:** Optional numeric field for burr diameter in mm. Enables more precise grind speed and retention guidance from Brew Buddy.
- **Complexity:** Low
- **Dependencies:** F2.
- **Rationale:** Enthusiasts know their burr size. Makes advice more specific. Low effort to add.

#### D5: Schematic Machine Illustration
- **Description:** A line-art or schematic illustration of an espresso machine displayed on the detail/settings card. Matches the app's warm design language (#E89E3F primary, #664F3F secondary).
- **Complexity:** Medium (asset creation/sourcing, not code)
- **Dependencies:** Design asset needed. Could be SVG for flexibility.
- **Rationale:** Visual polish. Makes the equipment profile feel intentional rather than a form dump. Called out in PROJECT.md.

#### D6: Equipment-Aware Bean Recommendations
- **Description:** When viewing a bean, Brew Buddy can factor in machine type to suggest optimal grind settings for that specific bean + machine combination.
- **Complexity:** High
- **Dependencies:** F7, bean data integration, prompt engineering.
- **Rationale:** Connects equipment data to the existing bean tracking workflow. High value but requires careful prompt design within the 4,096 token budget.

### Anti-Features (Deliberately NOT Building)

These are features that competing apps have or that seem logical but are explicitly out of scope for this milestone.

#### X1: Multiple Equipment Profiles
- **Why not:** PROJECT.md specifies "single machine + single grinder per user (1:1)." The app is for personal use, not a cafe. Most home users have one setup. Adding profile switching adds complexity with marginal value.
- **Competitors that do this:** Beanconqueror supports multiple grinders and preparation methods.
- **Revisit when:** Users request it or the app targets cafe owners.

#### X2: Equipment-Specific Recipe Database
- **Why not:** PROJECT.md explicitly excludes this. Brew Buddy handles advice conversationally. A static recipe database requires ongoing content curation and doesn't leverage the AI advantage.
- **Competitors that do this:** Brewfather has detailed equipment-linked recipes. Decent has profile-linked shot recipes.
- **Revisit when:** The app adds structured recipe/brew logging.

#### X3: Grinder Calibration Tracking
- **Why not:** PROJECT.md marks this as "too niche for v1." Tracking burr wear, zero-point calibration, or retention measurements is power-user territory.
- **Competitors that do this:** None of the consumer apps do this well. It is mainly done via spreadsheets in enthusiast communities.
- **Revisit when:** V2+ if enthusiast user segment grows.

#### X4: Bluetooth Equipment Integration
- **Why not:** Connecting to smart scales, Decent machines, or Acaia grinders requires per-device BLE protocol work. Massive scope. Beanconqueror has this but it is their core differentiator with years of development.
- **Competitors that do this:** Beanconqueror (extensive BLE support), Decent app (proprietary machine integration).
- **Revisit when:** Never for this milestone. Potentially a standalone feature track.

#### X5: Preparation Method as Separate Entity
- **Why not:** Beanconqueror treats "preparation method" (V60, Espresso, AeroPress, etc.) as a separate entity from "machine." For Grind It v1, the machine type enum covers brewing method implicitly. Adding a separate preparation entity creates three entities (machine, grinder, method) with complex relationships.
- **Revisit when:** The app adds brew logging with per-brew method selection.

#### X6: Equipment Purchase Tracking (Price, Date, Warranty)
- **Why not:** Adds form fields that do not contribute to the core value prop (AI-powered brewing advice). Bloats the profile with inventory management concerns.
- **Revisit when:** Users specifically request it.

#### X7: Sharing / Social Features
- **Why not:** No user accounts, no backend. Single-user local app.
- **Revisit when:** The app adds cloud sync or social features.

---

## 5. Feature Dependencies Graph

```
F3 (Machine Type Enum)
 |
 v
F1 (Machine Profile CRUD) -----> F4 (Integrated Grinder Logic)
 |                                        |
 v                                        v
F5 (Settings Card)               F2 (Grinder Profile CRUD)
 |                                        |
 v                                        v
F6 (Equipment Detail View) <----- F2 (Grinder Profile)
 |
 v
F7 (Brew Buddy Context Injection)
 |
 +---> D1 (Machine-Specific Grind Guidance)
 +---> D6 (Equipment-Aware Bean Recommendations)

Independent:
 D2 (Boiler Type) --- depends on F1
 D3 (Adjustment Type) --- depends on F2
 D4 (Burr Size) --- depends on F2
 D5 (Schematic Illustration) --- independent, design asset
```

### Suggested Implementation Order

1. **F3** - Define enums and schema (unblocks everything)
2. **F1 + F2** - Machine and grinder CRUD (can be parallel)
3. **F4** - Integrated grinder logic (needs F1 machine type)
4. **F5** - Settings card entry point
5. **F6** - Equipment detail view
6. **D2, D3, D4** - Optional profile fields (low effort, can slip into F1/F2)
7. **D5** - Machine illustration asset
8. **F7** - Brew Buddy context injection (highest complexity, saved for last)
9. **D1, D6** - AI-powered recommendations (prompt engineering on top of F7)

---

## 6. Competitive Landscape

| Feature | Beanconqueror | Decent App | Filtru | Brewfather | **Grind It (Proposed)** |
|---|---|---|---|---|---|
| Equipment profiles | Multiple grinders + methods | Machine-specific (Decent only) | Basic method selection | Detailed brew system profiles | Single machine + grinder |
| Machine type categorization | Preparation methods (not machine types) | N/A (single machine) | Method-based | Equipment-based | Machine type enum |
| Grinder tracking | First-class entity with last-used setting | N/A | No | No | First-class entity |
| AI-powered advice | No | No | Timer-based guidance | No | **Yes (Brew Buddy)** |
| Equipment-aware recommendations | No | Profile-based shot logging | No | Recipe scaling by equipment | **Yes (via AI)** |
| BLE device integration | Extensive (scales, pressure, refractometer) | Proprietary machine protocol | No | No | No (out of scope) |
| Brew logging tied to equipment | Yes (per-brew grinder/method) | Yes (per-shot profiles) | Yes (timer + method) | Yes (brew day logs) | No (v1 - equipment is context, not per-brew) |

### Key Takeaway

Grind It's differentiator is AI-powered equipment-aware advice. No competing coffee app combines equipment profiles with conversational AI recommendations. Beanconqueror has the most sophisticated equipment management but zero AI capability. Decent's app is locked to their hardware. This is a clear gap in the market.

---

## 7. Schema Implications

Based on this research, the minimum schema for v1 needs:

### `machineTable`
- `id` (integer, primary key)
- `manufacturer` (text, required)
- `model` (text, required)
- `machineType` (text enum, required) - from the machine type enum above
- `boilerType` (text enum, optional) - differentiator D2
- `createdAt` (integer, timestamp)
- `updatedAt` (integer, timestamp)

### `grinderTable`
- `id` (integer, primary key)
- `manufacturer` (text, required)
- `model` (text, required)
- `burrType` (text enum, optional) - from the burr type enum above
- `adjustmentType` (text enum, optional) - differentiator D3
- `burrSizeMm` (integer, optional) - differentiator D4
- `createdAt` (integer, timestamp)
- `updatedAt` (integer, timestamp)

### Enum Values for Schema

```typescript
// Machine operation types
const machineTypes = [
  'manual_lever',
  'spring_lever',
  'semi_automatic',
  'automatic',
  'super_automatic',
  'capsule_pod',
  'moka_pot',
  'pour_over',
  'french_press',
  'aeropress',
  'siphon',
  'cold_brew',
  'turkish',
  'other',
] as const;

// Boiler/heating types (espresso machines only)
const boilerTypes = [
  'single_boiler',
  'dual_boiler',
  'heat_exchanger',
  'thermoblock',
  'thermocoil',
  'thermojet',
  'none',
] as const;

// Grinder burr types
const burrTypes = [
  'flat_burr',
  'conical_burr',
  'blade',
  'ghost_burr',
  'other',
] as const;

// Grinder adjustment types
const adjustmentTypes = [
  'stepped',
  'stepless',
  'hybrid',
  'digital',
] as const;
```

---

## 8. Open Questions

1. **Machine type scope:** Should the machine type enum include non-espresso brewing methods (pour-over, French press, etc.)? The PROJECT.md says "espresso machine" but the app tracks diverse beans with different grind settings. Recommendation: Include them for completeness; the UI can group them visually.

2. **Combined vs. separate screens:** PROJECT.md has a pending decision on whether machine + grinder should be one combined screen or two separate ones. Given the "single profile" constraint and few data fields, a combined screen with collapsible sections seems optimal.

3. **On-demand detection:** How does the chat transport detect "hardware-related questions" to trigger context injection? Options: keyword matching, always-inject (with concise format), or let the AI model decide (requires a two-pass approach). Recommendation: Always inject a one-line equipment summary; let the AI decide relevance.

4. **Illustration asset:** Source a schematic espresso machine SVG/PNG that works with the warm color palette. Options: commission illustration, use an open-source icon set, or generate with AI image tools.

---

## Sources

- [Beanconqueror Official Site](https://beanconqueror.com/)
- [Beanconqueror GitHub](https://github.com/graphefruit/Beanconqueror)
- [Beanconqueror Guide - Kaffeemacher](https://kaffeemacher.de/en/blogs/kaffeewissen/beanconqueror)
- [Brewfather Equipment Docs](https://docs.brewfather.app/profiles/equipment)
- [Espresso Machine Types Comparison - Espresso Outlet](https://espressooutlet.com/blogs/news/comparison-of-espresso-machine-types-super-automatic-automatic-semi-automatic-and-manual-lever)
- [Manual vs Automatic - CoffeeGeek](https://coffeegeek.com/blog/technology/manual-vs-automatic-vs-super-auto/)
- [KitchenAid Espresso Machine Types](https://www.kitchenaid.com/pinch-of-help/countertop-appliances/espresso-machine-differences-manual-vs-semi-automatic-vs-automatic.html)
- [Espresso Machine Boiler Types - Clive Coffee](https://clivecoffee.com/blogs/learn/espresso-machine-types-by-boiler)
- [Single vs Dual Boiler vs HX - Coffee Blog UK](https://coffeeblog.co.uk/single-heat-dual-boiler-espresso-machine/)
- [Thermoblock vs Boiler - Centri Coffee](https://centricoffee.com/blogs/news/thermoblock-vs-boiler-espresso-machines)
- [Flat vs Conical Burrs - Perfect Daily Grind](https://perfectdailygrind.com/2020/05/conical-vs-flat-burr-coffee-grinders-difference/)
- [Burr vs Blade Grinders - Mahlkonig](https://www.mahlkoenig.us/blogs/news/guide-to-coffee-grinders)
- [Stepped vs Stepless Grinders - Mazzer](https://shop.mazzer.com/blogs/journal/stepless-vs-stepped-grinders)
- [Manual Lever vs Spring Lever - Espresso Outlet](https://espressooutlet.com/blogs/blog-articles/manual-lever-vs-spring-lever-espresso-machines-a-comprehensive-comparison)
- [Coffee Brewing Methods - Colipse](https://colipsecoffee.com/blogs/coffee/brewing-methods)
- [Recipes and Brew Logging - Cropster](https://www.cropster.com/blog-post/recipes-and-brew-logging/)
- [Filtru App](https://getfiltru.com/)
- [Espresso Machine Wikipedia](https://en.wikipedia.org/wiki/Espresso_machine)
