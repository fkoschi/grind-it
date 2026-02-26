# Bean Context in Chat — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Inject the user's bean data into the chat AI system prompt, scoped to the entry point: all beans when opened from the homepage, a single bean's full detail when opened from a bean detail page.

**Architecture:** A new `useBeanChatContext(beanId?)` hook queries the database and returns a formatted context string. `app/chat.tsx` reads an optional `beanId` router param, calls the hook, and passes the result to `ProviderChatTransport` as a new `getBeanContext` callback — mirroring the existing `getEquipmentContext` pattern. Chat buttons on the homepage and bean detail page set the param at navigation time.

**Tech Stack:** Expo Router (`useLocalSearchParams`), Drizzle ORM (`db.select()`), Tamagui (`Button`, `ActionButton`), React (`useState`, `useEffect`), existing project patterns from `features/chat/`.

---

### Task 1: Format helper functions

**Files:**
- Modify: `features/chat/utils/promptHelpers.ts`
- Create: `features/chat/utils/__tests__/promptHelpers.test.ts`

**Step 1: Write the failing tests**

Create `features/chat/utils/__tests__/promptHelpers.test.ts`:

```ts
import {
  formatSingleBeanContext,
  formatAllBeansContext,
} from "@/features/chat/utils/promptHelpers";

const fullBean = {
  name: "Ethiopian Yirgacheffe",
  roastery: "Square Mile Coffee",
  arabicaAmount: 100,
  robustaAmount: 0,
  degreeOfGrinding: 8.5,
  singleShotDosis: 9,
  doubleShotDosis: 18.5,
  aromaFruity: 90,
  aromaFloral: 70,
  aromaSweet: 60,
  aromaNutty: 0,
  aromaSpices: null,
  aromaRoasted: 20,
  aromaGreen: null,
  aromaSour: 35,
  aromaOther: null,
};

const tastes = [{ flavor: "Berry" }, { flavor: "Citrus" }];

describe("formatSingleBeanContext", () => {
  it("includes bean name and roastery", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Ethiopian Yirgacheffe (Square Mile Coffee)");
  });

  it("includes varietal", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Arabica 100%");
  });

  it("includes grind settings", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Grind: 8.5");
    expect(result).toContain("Single: 9g");
    expect(result).toContain("Double: 18.5g");
  });

  it("includes only non-zero aroma fields", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Fruity 90");
    expect(result).toContain("Sour 35");
    expect(result).not.toContain("Nutty");
    expect(result).not.toContain("Spices");
  });

  it("includes taste notes", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Berry, Citrus");
  });

  it("handles fully null bean gracefully", () => {
    const result = formatSingleBeanContext({ name: "My Bean" }, []);
    expect(result).toContain("My Bean");
  });
});

describe("formatAllBeansContext", () => {
  it("returns null for empty list", () => {
    expect(formatAllBeansContext([])).toBeNull();
  });

  it("includes count in header", () => {
    const result = formatAllBeansContext([fullBean, { name: "Other Bean" }]);
    expect(result).toContain("2 beans");
  });

  it("uses +/++/+++ for aroma shorthand", () => {
    const result = formatAllBeansContext([fullBean]);
    expect(result).toContain("Fruity+++"); // 90 → +++
    expect(result).toContain("Sour+"); // 35 → +
    expect(result).not.toContain("Nutty"); // 0 → omit
  });

  it("includes grind and dose per bean", () => {
    const result = formatAllBeansContext([fullBean]);
    expect(result).toContain("grind 8.5");
    expect(result).toContain("dose 18.5g");
  });
});
```

**Step 2: Run tests — verify they fail**

```bash
npm test -- --testPathPattern="promptHelpers" --no-coverage
```

Expected: FAIL — `formatSingleBeanContext is not a function`

**Step 3: Add the implementation to `features/chat/utils/promptHelpers.ts`**

Add after the existing `buildEquipmentSummary` export (keep all existing code intact):

```ts
const AROMA_LABELS: Record<string, string> = {
  aromaFruity: "Fruity",
  aromaFloral: "Floral",
  aromaSweet: "Sweet",
  aromaNutty: "Nutty",
  aromaSpices: "Spices",
  aromaRoasted: "Roasted",
  aromaGreen: "Green",
  aromaSour: "Sour",
  aromaOther: "Other",
};

const aromaRating = (value: number | null | undefined): string => {
  if (value == null || value <= 0) return "";
  if (value <= 33) return "";
  if (value <= 66) return "+";
  if (value <= 84) return "++";
  return "+++";
};

export type BeanContextRow = {
  name: string | null;
  roastery?: string | null;
  arabicaAmount?: number | null;
  robustaAmount?: number | null;
  degreeOfGrinding?: number | null;
  singleShotDosis?: number | null;
  doubleShotDosis?: number | null;
  aromaFruity?: number | null;
  aromaFloral?: number | null;
  aromaSweet?: number | null;
  aromaNutty?: number | null;
  aromaSpices?: number | null;
  aromaRoasted?: number | null;
  aromaGreen?: number | null;
  aromaSour?: number | null;
  aromaOther?: number | null;
};

export const formatSingleBeanContext = (
  bean: BeanContextRow,
  tastes: { flavor: string }[],
): string => {
  const nameParts = [bean.name, bean.roastery ? `(${bean.roastery})` : null].filter(Boolean);
  const lines: string[] = [`Current bean: ${nameParts.join(" ")}`];

  const arabica = bean.arabicaAmount ?? 0;
  const robusta = bean.robustaAmount ?? 0;
  if (arabica > 0 || robusta > 0) {
    lines.push(`Varietal: Arabica ${arabica}%, Robusta ${robusta}%`);
  }

  const grindParts = [
    bean.degreeOfGrinding != null ? `Grind: ${bean.degreeOfGrinding}` : null,
    bean.singleShotDosis != null ? `Single: ${bean.singleShotDosis}g` : null,
    bean.doubleShotDosis != null ? `Double: ${bean.doubleShotDosis}g` : null,
  ].filter(Boolean);
  if (grindParts.length > 0) {
    lines.push(grindParts.join(" | "));
  }

  const aromaEntries = Object.entries(AROMA_LABELS)
    .map(([key, label]) => {
      const value = (bean as Record<string, number | null | undefined>)[key];
      return value != null && value > 0 ? `${label} ${value}` : null;
    })
    .filter((x): x is string => x !== null);
  if (aromaEntries.length > 0) {
    lines.push(`Aroma: ${aromaEntries.join(", ")}`);
  }

  if (tastes.length > 0) {
    lines.push(`Taste notes: ${tastes.map((t) => t.flavor).join(", ")}`);
  }

  return lines.join("\n");
};

export const formatAllBeansContext = (beans: BeanContextRow[]): string | null => {
  if (beans.length === 0) return null;

  const beanLines = beans.map((bean) => {
    const name = [bean.name, bean.roastery ? `(${bean.roastery})` : null]
      .filter(Boolean)
      .join(" ");

    const metaParts = [
      bean.degreeOfGrinding != null ? `grind ${bean.degreeOfGrinding}` : null,
      bean.doubleShotDosis != null ? `dose ${bean.doubleShotDosis}g` : null,
      bean.arabicaAmount != null ? `Arabica ${bean.arabicaAmount}%` : null,
    ].filter(Boolean);

    const aromaSummary = Object.entries(AROMA_LABELS)
      .map(([key, label]) => {
        const value = (bean as Record<string, number | null | undefined>)[key];
        const rating = aromaRating(value);
        return rating ? `${label}${rating}` : null;
      })
      .filter((x): x is string => x !== null)
      .join(" ");

    const metaStr = metaParts.join(", ");
    const suffix = [metaStr, aromaSummary ? `| ${aromaSummary}` : null]
      .filter(Boolean)
      .join(" ");

    return `- ${name}${suffix ? `: ${suffix}` : ""}`;
  });

  const header = `Bean collection (${beans.length} bean${beans.length !== 1 ? "s" : ""}):`;
  return [header, ...beanLines].join("\n");
};
```

**Step 4: Run tests — verify they pass**

```bash
npm test -- --testPathPattern="promptHelpers" --no-coverage
```

Expected: PASS — all 10 tests green

**Step 5: Commit**

```bash
git add features/chat/utils/promptHelpers.ts features/chat/utils/__tests__/promptHelpers.test.ts
git commit -m "feat(chat): add formatSingleBeanContext and formatAllBeansContext helpers"
```

---

### Task 2: `useBeanChatContext` hook

**Files:**
- Create: `features/chat/hooks/useBeanChatContext.ts`

No unit test — the hook depends on a live Drizzle DB which requires integration setup not present in the existing test suite. Correctness is validated through the formatter tests in Task 1 and manual smoke test in Task 7.

**Step 1: Create the file**

`features/chat/hooks/useBeanChatContext.ts`:

```ts
import { useState, useEffect } from "react";
import { eq } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";
import { beanTable, beanTasteAssociationTable, beanTasteTable, roasteryTable } from "@/db/schema";
import {
  formatSingleBeanContext,
  formatAllBeansContext,
} from "@/features/chat/utils/promptHelpers";

const BEAN_FIELDS = {
  name: beanTable.name,
  roastery: roasteryTable.name,
  arabicaAmount: beanTable.arabicaAmount,
  robustaAmount: beanTable.robustaAmount,
  degreeOfGrinding: beanTable.degreeOfGrinding,
  singleShotDosis: beanTable.singleShotDosis,
  doubleShotDosis: beanTable.doubleShotDosis,
  aromaFruity: beanTable.aromaFruity,
  aromaFloral: beanTable.aromaFloral,
  aromaSweet: beanTable.aromaSweet,
  aromaNutty: beanTable.aromaNutty,
  aromaSpices: beanTable.aromaSpices,
  aromaRoasted: beanTable.aromaRoasted,
  aromaGreen: beanTable.aromaGreen,
  aromaSour: beanTable.aromaSour,
  aromaOther: beanTable.aromaOther,
} as const;

export const useBeanChatContext = (beanId?: number): string | null => {
  const { db } = useDatabase();
  const [beanContext, setBeanContext] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      if (beanId != null) {
        const [beanRows, tasteRows] = await Promise.all([
          db
            .select(BEAN_FIELDS)
            .from(beanTable)
            .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
            .where(eq(beanTable.id, beanId)),
          db
            .select({ flavor: beanTasteTable.flavor })
            .from(beanTasteTable)
            .innerJoin(
              beanTasteAssociationTable,
              eq(beanTasteAssociationTable.tasteId, beanTasteTable.id),
            )
            .where(eq(beanTasteAssociationTable.beanId, beanId)),
        ]);

        const bean = beanRows[0];
        if (bean) {
          setBeanContext(formatSingleBeanContext(bean, tasteRows));
        }
      } else {
        const beans = await db
          .select(BEAN_FIELDS)
          .from(beanTable)
          .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id));

        setBeanContext(formatAllBeansContext(beans));
      }
    };

    fetchContext().catch((err) => console.warn("useBeanChatContext: failed to load context", err));
  }, [db, beanId]);

  return beanContext;
};
```

**Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: 0 errors

**Step 3: Commit**

```bash
git add features/chat/hooks/useBeanChatContext.ts
git commit -m "feat(chat): add useBeanChatContext hook for DB-backed bean context"
```

---

### Task 3: Wire `getBeanContext` into `ProviderChatTransport`

**Files:**
- Modify: `features/chat/transport/ProviderChatTransport.ts`

**Step 1: Add `getBeanContext` to the options type**

In `ProviderChatTransportOptions`, add one line after `getEquipmentContext`:

```ts
type ProviderChatTransportOptions = {
  systemPrompt: string;
  getEquipmentContext: () => string | null;
  getBeanContext: () => string | null;           // ← add this line
  getRagPromptContext: (query: string) => Promise<string | null>;
  getProviderConfig: () => Promise<ProviderConfig>;
  unavailableMessage: string;
  missingOpenAiKeyMessage: string;
  missingClaudeKeyMessage: string;
};
```

**Step 2: Slot bean context into the system prompt array**

Update the system prompt assembly block:

```ts
const systemPrompt = [
  this.options.systemPrompt,
  this.options.getEquipmentContext(),
  this.options.getBeanContext(),             // ← add this line
  ragPromptContext,
]
  .filter(Boolean)
  .join("\n\n");
```

**Step 3: Check TypeScript — expect one error**

```bash
npx tsc --noEmit
```

Expected: 1 error in `app/chat.tsx` — `getBeanContext` missing. That's expected; fixed in Task 4.

**Step 4: Commit**

```bash
git add features/chat/transport/ProviderChatTransport.ts
git commit -m "feat(chat): add getBeanContext option to ProviderChatTransport"
```

---

### Task 4: Wire bean context into `app/chat.tsx`

**Files:**
- Modify: `app/chat.tsx`

**Step 1: Add import**

After the existing imports at the top:

```ts
import { useBeanChatContext } from "@/features/chat/hooks/useBeanChatContext";
```

**Step 2: Read the `beanId` param and call the hook**

Add these two lines inside `ChatPage`, right after `const { db } = useDatabase();`:

```ts
const { beanId } = useLocalSearchParams<{ beanId?: string }>();
const beanContext = useBeanChatContext(beanId ? Number(beanId) : undefined);
```

**Step 3: Pass `getBeanContext` to the transport**

Inside the `transport` `useMemo`, add `getBeanContext` between `getEquipmentContext` and `getRagPromptContext`, and add `beanContext` to the dependency array:

```ts
const transport = useMemo(
  () =>
    new ProviderChatTransport({
      systemPrompt: t("chat.systemPrompt"),
      getEquipmentContext: () => equipmentContext,
      getBeanContext: () => beanContext,          // ← add this line
      getRagPromptContext,
      getProviderConfig,
      unavailableMessage: t("chat.error.appleUnavailable"),
      missingOpenAiKeyMessage: t("chat.error.openAiMissingKey"),
      missingClaudeKeyMessage: t("chat.error.claudeMissingKey"),
    }),
  [equipmentContext, beanContext, getProviderConfig, getRagPromptContext, i18n.language],
  //              ↑ add beanContext to deps array
);
```

**Step 4: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: 0 errors

**Step 5: Run all tests**

```bash
npm test -- --no-coverage
```

Expected: all pass

**Step 6: Commit**

```bash
git add app/chat.tsx
git commit -m "feat(chat): read beanId param and inject bean context into chat transport"
```

---

### Task 5: Chat button on the homepage

**Files:**
- Modify: `components/Dashboard/DashboardHeader.tsx`

**Step 1: Add `useRouter` import**

Add to the existing imports at the top:

```ts
import { useRouter } from "expo-router";
```

**Step 2: Add router and the chat button**

Inside `DashboardHeader`, add `const router = useRouter();` after the existing `const [showFilter, setShowFilter] = useState<boolean>(false);`.

Then update the `XStack` block — wrap the filter button in a `flexDirection="row"` sub-`View` with a new chat button alongside it:

```tsx
<XStack mb="$3" columnGap="$2" alignItems="center">
  <Search onChangeText={onChangeText} />
  <View flex={0} justifyContent="flex-end" flexDirection="row" columnGap="$2">
    <StyledFilterButton
      circular
      onPress={() => setShowFilter(!showFilter)}
      icon={
        <View flex={1} alignItems="center">
          <Image
            contentFit="contain"
            source={require("@/assets/icons/filter.png")}
            style={{ flex: 1, height: 24, width: 24 }}
          />
        </View>
      }
    />
    <StyledFilterButton
      circular
      onPress={() => router.push("/chat")}
      icon={
        <View flex={1} alignItems="center">
          <Image
            contentFit="contain"
            source={require("@/assets/icons/chat.png")}
            style={{ flex: 1, height: 24, width: 24 }}
          />
        </View>
      }
    />
  </View>
</XStack>
```

> **Icon note:** Check `assets/icons/` for a `chat.png`. If none exists, use this temporary fallback until one is added:
> ```tsx
> icon={<Text color="white" fontSize={16}>💬</Text>}
> ```

**Step 3: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: 0 errors

**Step 4: Commit**

```bash
git add components/Dashboard/DashboardHeader.tsx
git commit -m "feat(dashboard): add chat button to dashboard header"
```

---

### Task 6: Chat button on the bean detail page

**Files:**
- Modify: `components/ui/ActionButton/ActionButton.tsx`
- Modify: `components/ui/Pages/DetailsPage/DetailsPage.tsx`
- Modify: `app/bean/details/[id].tsx`

**Step 1: Add optional `bottom` prop to `ActionButton`**

`ActionButton` currently hardcodes `bottom={40}`. Update it to accept a prop so two instances can stack:

```tsx
interface Props extends ButtonProps {
  onPress: () => void;
  icon: ReactElement;
  bottom?: number;             // ← add this
}
const ActionButton: FC<Props> = ({ onPress, icon, bottom = 40, ...props }) => {
  const { width } = Dimensions.get("window");

  return (
    <View position="absolute" bottom={bottom} width={width} alignItems="center" zIndex={100_000}>
      <Button circular width={52} height={52} onPress={onPress} {...props}>
        {icon}
      </Button>
    </View>
  );
};
```

**Step 2: Add `onChatPress` prop to `DetailsPageComponent`**

Update the `Props` interface in `components/ui/Pages/DetailsPage/DetailsPage.tsx`:

```ts
interface Props {
  beansData: CoffeeBean;
  tastes: { flavor: string }[];
  onEditPress: () => void;
  onDegreePress: () => void;
  onAromaEditPress: () => void;
  onAromaInfoPress: () => void;
  onChatPress: () => void;       // ← add this
}
```

Add `onChatPress` to the destructured props in the function signature.

**Step 3: Add the chat `ActionButton` in `DetailsPageComponent`**

The edit button sits at `bottom={40}` (default). The chat button goes at `bottom={104}` (= 40 + 52px height + 12px gap). Wrap the bottom section in a Fragment:

```tsx
<>
  <ActionButton
    bgC="$secondary"
    bottom={104}
    onPress={onChatPress}
    pressStyle={{ bgC: "$secondaryHover" }}
    icon={
      <Image
        source={require("@/assets/icons/chat.png")}
        style={{ width: 24, height: 24 }}
        contentFit="contain"
      />
    }
  />
  {!hideActionButton && (
    <ActionButton
      bgC="$primary"
      onPress={handleActionPress}
      pressStyle={{ bgC: "$primaryHover" }}
      icon={<EditIcon />}
    />
  )}
</>
```

> Same icon note as Task 5 — use `chat.png` or the emoji fallback.

**Step 4: Wire `handleChatPress` in `app/bean/details/[id].tsx`**

`useRouter` is already imported. Add the handler inside the component, after the existing handlers:

```ts
const handleChatPress = () =>
  router.push({ pathname: "/chat", params: { beanId: String(id) } });
```

Then add `onChatPress={handleChatPress}` to the `<DetailsPageComponent>` JSX element.

**Step 5: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: 0 errors

**Step 6: Run all tests**

```bash
npm test -- --no-coverage
```

Expected: all pass

**Step 7: Commit**

```bash
git add components/ui/ActionButton/ActionButton.tsx \
        components/ui/Pages/DetailsPage/DetailsPage.tsx \
        app/bean/details/[id].tsx
git commit -m "feat(bean-detail): add chat button to bean detail page"
```

---

### Task 7: Manual smoke test

```bash
npm run ios
```

Verify:
1. **Homepage** — Chat button visible in header next to filter. Tap it → chat opens → ask *"what's my heaviest dose bean?"* → AI lists beans from your collection with actual values, not 16–18g generic.
2. **Bean detail** — Chat button visible above edit button (floating, circular). Tap it → chat opens → ask *"what grind setting am I using?"* → AI states the exact value saved for that bean.
3. **Settings** — Existing chat button still works; opens with all-beans context (same as homepage).

---

## Files changed summary

| File | Action |
|---|---|
| `features/chat/utils/promptHelpers.ts` | Add `BeanContextRow`, `formatSingleBeanContext`, `formatAllBeansContext` |
| `features/chat/utils/__tests__/promptHelpers.test.ts` | New — 10 unit tests for the formatters |
| `features/chat/hooks/useBeanChatContext.ts` | New — DB-querying hook returning `string \| null` |
| `features/chat/transport/ProviderChatTransport.ts` | Add `getBeanContext` option + slot into system prompt |
| `app/chat.tsx` | Read `beanId` param, call hook, wire to transport |
| `components/Dashboard/DashboardHeader.tsx` | Add chat button alongside filter button |
| `components/ui/ActionButton/ActionButton.tsx` | Add optional `bottom` prop (default 40, backward compatible) |
| `components/ui/Pages/DetailsPage/DetailsPage.tsx` | Add `onChatPress` prop + second floating ActionButton at bottom 104 |
| `app/bean/details/[id].tsx` | Wire `handleChatPress` → navigate to `/chat?beanId=<id>` |
