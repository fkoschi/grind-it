## Why

The app is currently hardcoded entirely in German. To reach a broader audience via the App Store (especially in English-speaking markets), we need internationalization support. Starting with English and German allows us to serve both the existing German user base and English-speaking users, with the language selected automatically based on the device locale.

## What Changes

- Add `expo-localization` for detecting the device locale (maps to App Store country/language settings)
- Add `i18next` + `react-i18next` as a lightweight, pragmatic translation framework
- Create two translation files: `en.json` (English) and `de.json` (German, current default)
- Introduce a simple `i18n.ts` config that initializes i18next with expo-localization's detected locale
- Replace all hardcoded German strings across screens and components with `t()` translation calls
- German remains the fallback language (current behavior preserved for existing users)

## Capabilities

### New Capabilities

- `i18n`: Internationalization infrastructure — locale detection via expo-localization, translation loading via i18next, and a `t()` function available app-wide. Covers two locales (en, de) with German as fallback. Translation files live in `locales/en.json` and `locales/de.json`.

### Modified Capabilities

_(none — this is additive, no existing spec-level behavior changes)_

## Impact

- **New dependencies**: `expo-localization`, `i18next`, `react-i18next`
- **New files**: `locales/en.json`, `locales/de.json`, `i18n.ts` (config)
- **Modified files**: ~23 screen/component files that contain hardcoded German strings (all files under `app/`, key components under `components/BottomSheet/`, `components/ui/`, `components/Dashboard/`, `components/BeanHeaderLayout/`, `components/Chat/`, `components/NoData/`)
- **Estimated ~160 translatable strings** covering labels, buttons, alerts, placeholders, and aroma descriptions
- **No database changes** — user-generated content (bean names, roastery names, taste descriptors) stays as-is
- **No breaking changes** — German users see the same text, English users get translated text
- **Provider hierarchy**: No new provider needed; i18n initializes at import time before the app renders
