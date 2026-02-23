# Testing Patterns

**Analysis Date:** 2026-02-23

## Test Framework

**Runner:**
- Jest 29.7.0
- jest-expo 54.0.13 preset
- Config: `package.json` with `"jest": { "preset": "jest-expo" }`

**Assertion Library:**
- Jest built-in matchers (expect, toBe, toEqual, etc.)

**Run Commands:**
```bash
npm test              # Run all tests in watch mode
npm run lint          # Lint code (oxlint)
npm run lint:fix      # Auto-fix lint issues
npm run format        # Format code (oxfmt)
```

**Pre-Commit Hook:**
- Runs `jest --watchAll=false` after linting (non-blocking - `|| true`)
- Allows commits even if tests fail, but linting must pass

## Test File Organization

**Location:**
- Co-located with source files in same directory
- Pattern: `SourceFile.ts` + `SourceFile.test.ts`
- Example: `/Users/fkoschi/Code/grind-it/utils/fuzzyMatch.ts` + `fuzzyMatch.test.ts`

**Naming:**
- `*.test.ts` extension for TypeScript utilities
- Test suites placed in `__tests__` subdirectories when grouped
- Example: `utils/__tests__/dataExportImport.test.ts`

**Structure:**
```
utils/
├── fuzzyMatch.ts
├── fuzzyMatch.test.ts          # Co-located
├── dataExport.ts
├── dataImport.ts
└── __tests__/
    └── dataExportImport.test.ts  # Grouped integration tests
```

## Test Structure

**Suite Organization:**
```typescript
describe("levenshteinDistance", () => {
  test("should return 0 for identical strings", () => {
    expect(levenshteinDistance("hello", "hello")).toBe(0);
  });

  test("should calculate correct distance for single character difference", () => {
    expect(levenshteinDistance("cat", "hat")).toBe(1);
  });
});

describe("calculateSimilarity", () => {
  test("should return 100 for identical strings", () => {
    expect(calculateSimilarity("hello", "hello")).toBe(100);
  });
});

describe("isSimilar", () => {
  test("should use 80% threshold by default", () => {
    expect(isSimilar("hello", "hallo")).toBe(true);
  });

  test("should accept custom threshold", () => {
    expect(isSimilar("kitten", "sitting", 50)).toBe(true);
  });
});
```

**Patterns:**
- Top-level `describe()` per function/class being tested
- Each test case as separate `test()` or `it()` block
- Descriptive test names starting with "should"
- One assertion focus per test (or grouped related assertions)

## Test Data & Mocking

**Mock Database Pattern:**
```typescript
const createMockDb = (): ExpoSQLiteDatabase => {
  const mockData = {
    beans: [{ id: 1, name: "Ethiopia Yirgacheffe", ... }],
    roasteries: [{ id: 1, name: "Counter Culture Coffee" }],
  };

  return {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockImplementation((table) => {
      if (table === beanTable) {
        return Promise.resolve(mockData.beans);
      }
      // Chain methods for fluent API
      const mock = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      };
      return mock;
    }),
    // ... other methods
  } as unknown as ExpoSQLiteDatabase;
};
```

**Applied in:** `utils/__tests__/dataExportImport.test.ts`

**Fixtures:**
- Mock data defined directly in test files
- No separate fixture files in current codebase
- Data structures match schema types exactly

**Mocking Approach:**
- jest.fn() for functions
- mockReturnThis() for chainable Drizzle API
- mockResolvedValue() for async operations
- Focused on return types, not implementation details

## Fixture and Factory Pattern

**Test Data Setup:**
```typescript
const createMockDb = (): ExpoSQLiteDatabase => {
  const mockData = {
    beans: [{
      id: 1,
      name: "Ethiopia Yirgacheffe",
      robustaAmount: 0,
      arabicaAmount: 100,
      roastery: 1,
      // ... all required fields
    }],
    roasteries: [{ id: 1, name: "Counter Culture Coffee" }],
    tastes: [
      { id: 1, flavor: "Fruity" },
      { id: 2, flavor: "Floral" },
    ],
    associations: [
      { id: 1, beanId: 1, tasteId: 1 },
      { id: 2, beanId: 1, tasteId: 2 },
    ],
  };
  // ... return mock implementation
};
```

**Location:**
- Defined within test files, not in separate fixture modules
- Factory functions create mock instances with default values
- Mutations allowed in test setup, not in shared fixtures

## Coverage

**Requirements:** None enforced - no coverage threshold configured

**Current Test Coverage:**
- Utility functions fully tested: `fuzzyMatch.ts`, `dataExport.ts`, `dataImport.ts`
- Components not tested (visual components rely on Storybook)
- Hooks not tested (require component context and React test renderer setup)

**View Coverage:**
```bash
npm test -- --coverage
# Not configured in jest.json, would need to add coverage options
```

**Gaps:**
- No component unit tests (Card, Button, etc.)
- No hook unit tests (useBeanDetails, useKeyboard, etc.)
- No integration tests for screens
- No e2e tests

## Test Types

**Unit Tests:**
- Scope: Individual utility functions
- Approach: Pure function testing with isolated inputs
- Examples:
  - `levenshteinDistance("kitten", "sitting")` → `3`
  - `calculateSimilarity("hello", "hallo")` → `80`
  - `isSimilar("Schokolade", "Schokolate")` → `true`
- File: `utils/fuzzyMatch.test.ts`

**Integration Tests:**
- Scope: Multi-step workflows with mocked database
- Approach: Full operation flow (export → JSON → import)
- Example: Export all beans, validate structure, parse JSON, reimport data
- File: `utils/__tests__/dataExportImport.test.ts`
- Mocking: Database methods (select, from, where, insert)

**E2E Tests:**
- Status: Not used
- Would require: Detox or similar mobile test framework
- Not part of current testing strategy

## Async Testing

**Pattern:**
```typescript
it("should export data with correct version and structure", async () => {
  const mockDb = createMockDb();
  const jsonData = await exportAllData(mockDb);
  const exportedData = JSON.parse(jsonData);

  expect(exportedData.version).toBe(EXPORT_VERSION);
  expect(exportedData.exportDate).toBeDefined();
});
```

**Approach:**
- `async`/`await` for all async operations
- No callback-style tests (Jest supports async natively)
- Promise chains handled with await
- Error cases tested separately

## Error Testing

**Pattern:**
```typescript
it("should validate export version", async () => {
  const mockDb = createMockDb();
  const invalidData = JSON.stringify({
    version: "0.0.1",
    exportDate: new Date().toISOString(),
    beans: [],
  });

  const result = await importData(mockDb, invalidData);
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});

it("should reject invalid JSON", async () => {
  const mockDb = createMockDb();
  const result = await importData(mockDb, "invalid json");

  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});
```

**Approach:**
- Result objects checked for `success: false`
- Errors captured in `errors` array
- Error messages validated for content
- No thrown errors in tested functions - all handled gracefully

## Common Test Patterns

**Boundary Testing:**
```typescript
test("should return the length when comparing with empty string", () => {
  expect(levenshteinDistance("hello", "")).toBe(5);
  expect(levenshteinDistance("", "world")).toBe(5);
});

test("should return 100 for empty strings", () => {
  expect(calculateSimilarity("", "")).toBe(100);
});
```

**Case Sensitivity:**
```typescript
test("should be case-sensitive", () => {
  expect(levenshteinDistance("Hello", "hello")).toBe(1);
  expect(levenshteinDistance("HELLO", "hello")).toBe(5);
});

test("should be case-insensitive", () => {
  expect(calculateSimilarity("Hello", "hello")).toBe(100);
});
```

**Domain-Specific Testing (Coffee):**
```typescript
test("should handle German taste names", () => {
  expect(calculateSimilarity("Schokolade", "Schokolate")).toBeGreaterThanOrEqual(90);
  expect(calculateSimilarity("Karamell", "Karamel")).toBeGreaterThan(85);
  expect(calculateSimilarity("Schokolade", "Vanille")).toBeLessThan(50);
});
```

**Approximate Assertions:**
```typescript
expect(calculateSimilarity("cat", "hat")).toBeCloseTo(66.67, 1);
expect(calculateSimilarity("kitten", "sitting")).toBeCloseTo(57.14, 1);
```

## What to Test

**Must Test:**
- Utility functions with complex logic
- Data transformation and validation
- Error conditions and edge cases
- Boundary values (empty strings, zero, null)
- Type conversions (string → number, JSON parse/stringify)

**Should Test:**
- Integration workflows (export → parse → import)
- Similarity matching with domain terminology

## What NOT to Test

**Skip Testing:**
- React component rendering (use Storybook instead)
- Styled components and visual styling
- Native module integration (expo-*, react-native-*)
- Database query builders (rely on Drizzle type safety)
- Event handlers in components
- Navigation logic (expo-router managed)

## Test Command Reference

**Run All Tests:**
```bash
npm test
```

**Run Tests in Watch Mode:**
```bash
npm test -- --watch
```

**Run Specific Test File:**
```bash
npm test -- fuzzyMatch.test.ts
```

**Run Tests with Coverage (if configured):**
```bash
npm test -- --coverage
```

**Pre-Commit Testing:**
```bash
pnpm exec jest --watchAll=false || true
```

The `|| true` allows commits even if tests fail, but linting failures block commits.

---

*Testing analysis: 2026-02-23*
