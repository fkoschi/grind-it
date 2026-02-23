# Coding Conventions

**Analysis Date:** 2026-02-23

## Naming Patterns

**Files:**
- Components: PascalCase with descriptive names (e.g., `CoffeeCard.tsx`, `DashboardHeader.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useBeanDetails.ts`, `useKeyboard.ts`)
- Utilities: camelCase (e.g., `fuzzyMatch.ts`, `dataExport.ts`)
- Screens/Pages: PascalCase (e.g., `EditRoasteryPage.tsx`, `RoasteryDetailPage.tsx`)
- Index files: `index.ts` for barrel exports
- Test files: `*.test.ts` or `*.spec.ts` co-located with source (e.g., `fuzzyMatch.test.ts` alongside `fuzzyMatch.ts`)

**Functions:**
- camelCase for all functions
- Action-based names (e.g., `handlePress`, `calculateSimilarity`, `checkBeanDuplicate`)
- Async functions use camelCase (no special prefix, e.g., `exportAllData`, `importData`)

**Variables:**
- camelCase for all variable declarations
- Boolean variables: prefixed with is/has/can (e.g., `isFavorite`, `hasBeans`, `canImport`)
- Constants: UPPER_SNAKE_CASE (e.g., `EXPORT_VERSION`, `SIMILARITY_THRESHOLD`)
- State variables in stores: lowercase with descriptive names (e.g., `tasteFilter`, `editRoastery`)

**Types:**
- Interfaces: PascalCase, noun-based (e.g., `CoffeeBean`, `HomePageProps`, `ImportResult`)
- Interface names describe the shape (e.g., `ExportedData` not `DataForExport`)
- Type names for union/aliases: PascalCase (e.g., `Taste`)

## Code Style

**Formatting:**
- Tool: oxfmt (Rust-based formatter)
- Command: `npm run format` or `oxfmt . --write`
- Automatically applied via pre-commit hook
- No manual formatting configuration needed - oxfmt handles consistency

**Linting:**
- Tool: oxlint (from Oxc, Rust-based linter)
- Config: `.oxlintrc.json` (strict TypeScript and unicorn rules)
- Command: `npm run lint` (check) or `npm run lint:fix` (auto-fix)
- Automatically runs on staged files via pre-commit hook
- Core rules enabled:
  - TypeScript type safety rules (`typescript/*`)
  - Unicorn best practices (`unicorn/*`)
  - Oxc code quality rules (`oxc/*`)
  - Base JavaScript rules (no-unused-vars, no-debugger, etc.)

**No Inline Comments:**
- Code must be self-documenting through clear naming
- No comments allowed inside JSX or function bodies per project guidelines
- Documentation comments (JSDoc) are acceptable for utility functions with complex logic
- Comments in stores/hooks only for explaining non-obvious state patterns

## Import Organization

**Order:**
1. React and React Native imports (`import React`, `import { FC }`)
2. External dependencies (@ai-sdk, @tamagui, expo-*, react-native-*)
3. Internal aliases (`@/types`, `@/components`, `@/hooks`, `@/db`, `@/provider`, `@/store`)
4. Relative imports (same-folder helpers)

**Pattern:**
```typescript
// React/React Native
import React, { FC, useState } from "react";
import { View, Text } from "tamagui";

// External packages
import { useRouter } from "expo-router";
import { eq } from "drizzle-orm";

// Internal path aliases
import { CoffeeBean } from "@/types";
import { useBeanDetails } from "@/hooks/useBeanDetails";
import { useDatabase } from "@/provider/DatabaseProvider";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
```

**Path Aliases:**
- `@/*` maps to root directory
- Use `@/` for all internal imports (never relative imports across directories)
- Relative imports only within same directory (e.g., `./sibling.tsx`)

## Barrel Exports

**Pattern:**
Components and features expose their public API via `index.ts`:

```typescript
// components/Chat/index.tsx
import { ChatRoot } from "./ChatRoot";
import { ChatMessage } from "./ChatMessage";
import { ChatAvatar } from "./ChatAvatar";

export const Chat = {
  Root: ChatRoot,
  Message: ChatMessage,
  Avatar: ChatAvatar,
};

export { ChatRoot, ChatMessage, ChatAvatar };
```

**Usage:**
- Composition pattern: `<Chat.Root><Chat.Message /></Chat.Root>`
- Direct import: `import { ChatRoot } from "@/components/Chat"`

## Component Composition

**Pattern (Composition over Props):**
Components are built as namespace objects with sub-components for each functional part:

```typescript
// Root component - minimal props, renders children
const SomethingRoot: FC<PropsWithChildren<ViewProps>> = ({ children, ...props }) => (
  <View {...props}>{children}</View>
);

// Sub-components - one per functional part
const SomethingIcon: FC<IconProps> = (props) => <Icon {...props} />;
const SomethingText: FC<TextProps> = ({ children, ...props }) => <Text {...props}>{children}</Text>;

// Export as namespace
export const Something = {
  Root: SomethingRoot,
  Icon: SomethingIcon,
  Text: SomethingText,
};
```

**Rules:**
- Avoid boolean props for variants - use composition with children instead
- Expose sub-components rather than prop drilling
- Use React Context or custom hooks when sub-components share state
- Applied in: `Chat`, `Card`, `Tabs` components

## Error Handling

**Strategy:** Try-catch with explicit error type checking

**Pattern:**
```typescript
try {
  const parsedData = JSON.parse(jsonData);
  const validatedData = validateImportData(parsedData);
  // Process data
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  // Handle error with message
}
```

**Validation:**
- Explicit type guards and validation functions (e.g., `validateImportData`)
- Check for required fields before processing
- Return structured result objects with `success`, `errors`, and `duplicates` fields
- Example: `ImportResult` interface with explicit error array

**Database Operations:**
- Wrapped in try-catch blocks within event handlers
- Promise.all used for parallel operations with error handling
- Individual bean imports wrapped to capture per-item errors without stopping batch

## Logging

**Framework:** Native `console` object

**Patterns:**
- Use `console.log` for general information (not used extensively in production code)
- Use `console.error` for error conditions
- Avoid logging in business logic - let consumers handle logging
- Error messages are captured in result objects for UI feedback

**When to Log:**
- Never in utility functions or hooks - return values/results instead
- Logging happens at the caller level (screens, providers)
- Errors surfaced through result objects or toast notifications

## Functions

**Size:** Keep functions focused on single responsibility

**Pattern from codebase:**
- Small utility functions: 10-30 lines (`calculateSimilarity`, `levenshteinDistance`)
- Medium helpers: 30-60 lines (`findOrCreateRoastery`, `checkBeanDuplicate`)
- Large complex operations: 60-150 lines (`importData`, `exportAllData`)

**Parameters:**
- Maximum 3 parameters preferred; use object destructuring for more
- Database operations: `(db: ExpoSQLiteDatabase, param: Type, options?: {})`
- React components: destructure all props except `children`
- Async functions declare return type explicitly

**Return Values:**
- Utility functions return computed values (strings, numbers, booleans)
- Operations return structured result objects with status info
- Examples: `ImportResult { success, errors, duplicates }`, `DuplicateInfo { beanName, reason, similarity }`
- Async database queries return undefined or typed arrays

## Module Design

**Exports:**
- Named exports for utilities and hooks (preferred)
- Default exports for React components
- Barrel files export both named and default

**File Colocation:**
- Test files co-located with source: `utils/fuzzyMatch.ts` + `utils/fuzzyMatch.test.ts`
- Related files grouped: `components/Chat/ChatRoot.tsx`, `components/Chat/ChatMessage.tsx`, etc.
- Sub-directories for feature groups: `components/BottomSheet/Frames/Bean/Add/`

**Constants:**
- Define at module top level
- Group by semantic meaning: `EXPORT_VERSION`, `SIMILARITY_THRESHOLD` near import statements
- Use in: utility functions, validation thresholds, configuration values

## TypeScript Usage

**Strict Mode:** Enabled in `tsconfig.json`

**Patterns:**
- Always use explicit types for function parameters and returns
- Avoid `any` - investigate proper types instead (strict mode enforces this)
- Use `instanceof` checks for error handling: `error instanceof Error ? error.message : String(error)`
- Type guards with `Array.isArray()` and custom validation functions
- Interfaces over types for component props and data structures

**Generics:**
- Used in Zustand store definitions: `create<State & Action>()`
- Drizzle ORM queries are generic-based: `useLiveQuery<BeanType>(query)`
- Rarely needed in component code

## Convention Enforcement

**Pre-Commit Hook:**
- File: `.husky/pre-commit`
- Runs: `oxlint --fix` then `oxfmt --write` on staged files
- Prevents non-conforming code from being committed
- Developers run `npm run lint:fix && npm run format` before commit

**CI/CD:**
- GitHub Actions checks linting and formatting on merge

---

*Convention analysis: 2026-02-23*
