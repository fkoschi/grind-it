# Grind It — Machine Profile Milestone

## What This Is

Grind It is a React Native (Expo) mobile app for home coffee enthusiasts who grind their own beans. It tracks coffee beans, origins, and grind settings. This milestone adds a **Machine Profile** feature — letting users define their espresso machine and grinder so the Brew Buddy AI chat can give hardware-specific brewing advice.

## Core Value

Users get concrete, hardware-aware coffee advice from Brew Buddy — grind size guidance, brewing parameters, and troubleshooting tailored to the exact machine and grinder they own.

## Requirements

### Validated

- ✓ Bean tracking with aroma profiles and grind settings — existing
- ✓ Roastery management with detail views and map — existing
- ✓ Taste descriptor system with many-to-many bean associations — existing
- ✓ AI chat (Brew Buddy) via Apple Foundation Models and OpenAI fallback — existing
- ✓ Dashboard with search, filter, and live query updates — existing
- ✓ Data export/import (backup/restore) — existing
- ✓ Settings page with card-based navigation — existing
- ✓ Internationalization (i18next) — existing
- ✓ Storybook component development — existing

### Active

- [ ] Machine profile: users can save their espresso machine (manufacturer, name, type)
- [ ] Grinder profile: users can save their grinder (manufacturer, name)
- [ ] Machine type determines grinder visibility (integrated grinder hides grinder section)
- [ ] Settings card entry point for machine/grinder management
- [ ] Detail view for machine/grinder similar in layout to bean detail
- [ ] Schematic/illustrative machine image matching the app's warm design language
- [ ] Brew Buddy integration: machine/grinder info injected on-demand when user asks hardware-related questions
- [ ] Single machine + single grinder per user (1:1, not a collection)

### Out of Scope

- Multiple machine profiles — single-user app, one setup at a time
- Machine-specific recipe database — Brew Buddy handles advice conversationally
- Grinder calibration tracking — too niche for v1
- Bean Rating (1–5) — separate backlog item
- BYO API Key / LLM Adapter — separate backlog item
- Chat RAG / Knowledge Enhancement — separate backlog item
- BottomSheet consistency pass — separate backlog item

## Context

**Existing app architecture:** Expo Router file-based navigation, Tamagui UI framework, SQLite + Drizzle ORM, Zustand stores, composition-pattern components. The settings page already has card-based entries (Brew Buddy, roastery editor, taste profiles). The roastery detail view provides a good reference for the machine detail view layout.

**Machine types to research:** The DB schema needs a `type` enum for espresso machine categories (manual lever, semi-automatic, automatic, super-automatic, pod/capsule, etc.). Types with integrated grinders (automatic, super-automatic) should suppress the grinder section in the UI.

**Brew Buddy integration:** Machine/grinder context should be injected on-demand — not in every message. The chat transport (`AppleChatTransport`) or the system prompt construction needs a mechanism to detect hardware-related questions and append machine info. This preserves the tight 4,096 token context window on Apple Foundation Models.

**Image asset:** Need a schematic/line-art style espresso machine illustration that fits the app's warm color palette (primary #E89E3F, secondary #664F3F). Research needed — if no suitable asset found, use a placeholder.

## Constraints

- **Tech stack**: Must use existing Expo + Tamagui + Drizzle ORM stack
- **DB**: SQLite local-only, requires Drizzle migration for new tables
- **Context window**: Apple Foundation Models limited to 4,096 tokens — machine info must be concise when injected
- **Single user**: No auth, no multi-profile — one machine, one grinder per device
- **Design**: Composition pattern required for new components (per project rules)
- **Code style**: No comments in code, no `any` types, minimal props (per project rules)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Combined machine + grinder view | Few data points per entity; avoids two nearly-identical screens | — Pending |
| Machine type controls grinder visibility | Integrated-grinder machines don't need separate grinder entry | — Pending |
| On-demand chat context injection | Preserves Apple FM context window; most chat questions aren't hardware-specific | — Pending |
| Settings card as simple entry point | Keeps settings page clean; detail lives in its own screen | — Pending |
| Research machine types via web | Need accurate, comprehensive enum for DB schema | — Pending |

---
*Last updated: 2026-02-23 after initialization*
