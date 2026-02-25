# Bean Context in Chat — Design

**Date:** 2026-02-25
**Status:** Approved

## Problem

The chat AI answers generic coffee questions (e.g. "16–18g for a double shot") instead of referencing the user's own bean data, because no bean information is injected into the system prompt.

## Goal

Inject the right bean context into the chat depending on where it was opened from:

| Entry point | Bean context |
|---|---|
| Homepage button | All saved beans (compact summary) |
| Bean detail button | That specific bean (full detail) |
| Settings button (existing) | All saved beans (same as homepage) |

## Approach

Option C: router param as routing signal + dedicated `useBeanChatContext` hook.

Pass an optional `beanId` query param when navigating to `/chat`. A new hook owns DB queries and context formatting. `chat.tsx` stays thin.

## Architecture

### New file

`features/chat/hooks/useBeanChatContext.ts`
Takes `beanId?: number`. Queries the database and returns `beanContext: string | null`.

- `beanId` present → fetch single bean row + taste associations → `formatSingleBeanContext()`
- `beanId` absent → fetch all bean rows → `formatAllBeansContext()`

### Modified files

| File | Change |
|---|---|
| `features/chat/utils/promptHelpers.ts` | Add `formatSingleBeanContext()` and `formatAllBeansContext()` pure helpers |
| `features/chat/transport/ProviderChatTransport.ts` | Add `getBeanContext: () => string \| null` option, slot into system prompt |
| `app/chat.tsx` | Read `beanId` from `useLocalSearchParams()`, call `useBeanChatContext`, wire to transport |
| `components/Dashboard/DashboardHeader.tsx` | Add circular chat icon button to existing search/filter XStack |
| `app/bean/details/[id].tsx` | Add chat icon button (second floating ActionButton above edit button) |
| `locales/en.json` | Add i18n strings for bean context sections |

## Data Flow

```
Homepage button       → router.push("/chat")            → beanId undefined → all beans
Bean detail button    → router.push("/chat?beanId=42")  → beanId = 42      → single bean
Settings button       → router.push("/chat")            → beanId undefined → all beans

app/chat.tsx
  const { beanId } = useLocalSearchParams()
  const beanContext = useBeanChatContext(beanId ? Number(beanId) : undefined)

ProviderChatTransport system prompt:
  [systemPrompt] + [equipmentContext] + [beanContext] + [ragContext]
```

## Context String Format

### Single bean

```
Current bean: Ethiopian Yirgacheffe (Square Mile Coffee)
Varietal: Arabica 100%, Robusta 0%
Grind: 8.5 | Single: 9g | Double: 18.5g
Aroma: Fruity 85, Floral 70, Sweet 60, Sour 40
Taste notes: Berry, Citrus, Jasmine
```

Only aroma fields with a value > 0 are included. Null fields are omitted.

### All beans

```
Bean collection (3 beans):
- Ethiopian Yirgacheffe (Square Mile): grind 8.5, dose 18.5g, Arabica 100% | Fruity+++ Floral++
- Colombian Huila: grind 7.0, dose 17g, Arabica 80% | Sweet+++ Nutty++
- Blend No.4: grind 6.5, dose 16g, Arabica 70% | Roasted+++ Spices+
```

Aroma compacted to `+`/`++`/`+++` (34–66 / 67–84 / 85–100). Fields with 0 or null omitted. One line per bean to minimise token usage.

## Token Budget Note

Apple Intelligence has a hard 4,096-token context window. With the system prompt (~120 tokens), equipment context (~30 tokens), and RAG context (~400 tokens), roughly 3,500 tokens remain. A compact all-beans summary costs ~30–50 tokens per bean, leaving headroom for ~60 beans before risk. No cap is needed now, but worth revisiting if collections grow large.

## UI Placement

**Homepage** — circular chat icon button added to `DashboardHeader`, same `XStack` as the existing search + filter button. Matches `StyledFilterButton` style.

**Bean detail** — second circular floating button in `DetailsPageComponent`, positioned above the existing edit `ActionButton`.
