# Stack Research: Equipment Profiles

> **Dimension:** Stack
> **Milestone:** Machine/Grinder Profile for Grind It
> **Date:** 2026-02-23

## Research Summary

This is a subsequent milestone — the core stack (Expo, Tamagui, Drizzle ORM, SQLite, Zustand) is already established. This document focuses on what's needed *beyond* the existing stack for the equipment profile feature.

## New Dependencies Required

**None.** The existing stack covers all needs:

- **Database:** Drizzle ORM + SQLite already handles schema, migrations, and queries
- **UI:** Tamagui provides all needed form components (Input, Select, Label, etc.)
- **State:** Zustand (if transient UI state needed) + React Context (if shared)
- **Forms:** react-hook-form + Zod already in use for bean creation
- **Navigation:** expo-router already supports modal screens
- **i18n:** i18next already configured

## Stack Decisions

| Area | Decision | Rationale | Confidence |
|------|----------|-----------|------------|
| Machine type enum | TypeScript union type stored as text in SQLite | SQLite has no native enum; text column with TS validation is the Drizzle pattern already used | High |
| Image asset | Static require() in assets/ | No CDN or remote image loading needed for a single illustration | High |
| Chat context injection | Utility function, not a new library | Format equipment data as a concise string for system prompt; no RAG or vector store needed | High |
| Form validation | Zod schema (same as add-bean) | Consistent with existing patterns | High |

## What NOT to Add

- **No new state management library** — Zustand + Context sufficient
- **No image picker/camera** — Equipment profile uses a static illustration, not user photos
- **No external API** — Machine data is user-entered, not fetched from a database
- **No new navigation library** — expo-router handles the new screen

---
*Stack research: 2026-02-23*
