## Context

The Grind It app is entirely hardcoded in German (~160 strings across ~23 files). There is no i18n infrastructure. The app uses Expo with expo-router, Tamagui for UI, and a provider hierarchy in `app/App.tsx`. We want a pragmatic, minimal approach to add English alongside German, with locale auto-detected from the device.

## Goals / Non-Goals

**Goals:**

- Auto-detect device locale and show English or German accordingly
- German remains the fallback for any unsupported locale
- Simple `t("key")` function usable anywhere in the app (components, screens, hooks)
- Two flat JSON translation files that are easy to maintain
- No impact on app startup performance

**Non-Goals:**

- Runtime language switching (settings toggle) — not in this iteration
- Pluralization rules or ICU message format — keep it simple
- Translating user-generated content (bean names, roastery names, taste descriptors)
- Right-to-left (RTL) layout support
- More than two languages

## Decisions

### 1. Use `expo-localization` + `i18next` + `react-i18next`

**Rationale**: `expo-localization` is the official Expo way to read device locale. `i18next` is the most mature JS i18n library with React Native support. Together they cover locale detection + translation lookup with minimal boilerplate.

**Alternatives considered**:

- **Custom solution (plain object lookup)**: Simpler but loses interpolation support, namespace support, and community tooling. Not worth reinventing.
- **`react-intl`**: Heavier, ICU-focused — overkill for our flat key-value needs.

### 2. Flat JSON translation files in `locales/`

Structure:

```
locales/
  en.json
  de.json
i18n.ts        # initialization config
```

Translation keys use dot-separated namespaces matching screen/component areas:

```json
{
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.done": "Done",
  "dashboard.noData.title": "No beans found",
  "dashboard.noData.subtitle": "Create your first bean.",
  "settings.roasteries": "Roasteries",
  "settings.taste": "Taste",
  "addBean.name": "Name",
  "aroma.fruity.name": "Fruity",
  "aroma.fruity.description": "Notes of berries, citrus, stone fruits..."
}
```

**Rationale**: Flat files with dotted keys are the simplest approach. No nested namespaces, no splitting into multiple files. Easy to diff, search, and maintain for ~160 keys.

### 3. Initialize i18n at module load time (no provider needed)

```typescript
// i18n.ts
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, de: { translation: de } },
  lng: Localization.getLocales()[0]?.languageCode ?? "de",
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});

export default i18n;
```

Import `@/i18n` once in `app/_layout.tsx` (side-effect import). Then use `useTranslation()` hook or `t()` in any component.

**Rationale**: i18next supports synchronous init with bundled resources. No async loading, no provider wrapper, no splash screen delay. Just import and go. This avoids adding complexity to the existing provider hierarchy.

### 4. Usage pattern in components

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t("dashboard.noData.title")}</Text>;
}
```

For non-component contexts (alerts, utility functions), import `i18n` directly:

```typescript
import i18n from "@/i18n";
Alert.alert(i18n.t("settings.export.error.title"), i18n.t("settings.export.error.message"));
```

### 5. German is the source of truth

Since the app is currently German, `de.json` is written first by extracting all existing strings. `en.json` is the translation. This means German strings are guaranteed complete, and any missing English keys fall back to German.

## Risks / Trade-offs

- **Large diff across 23+ files** → Mitigate by doing extraction methodically screen-by-screen. Each file change is mechanical (wrap string in `t()`), low risk of logic bugs.
- **Key naming drift over time** → Mitigate by establishing a clear convention now (dot-separated, grouped by screen/component). Document in CLAUDE.md.
- **No runtime language switch** → Acceptable for v1. Users who change device language and restart the app get the new language. Can add settings toggle later.
- **Aroma descriptions are lengthy** → They still go in the JSON files. ~9 entries with name + description + examples is manageable at this scale.

## Open Questions

_(none — approach is straightforward for the two-language scope)_
