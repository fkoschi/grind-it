---
description: How to implement fuzzy duplicate detection for taste entries
---

# Fuzzy Duplicate Detection Workflow

This workflow describes how to implement fuzzy duplicate detection using the Levenshtein distance algorithm to prevent duplicate taste entries.

## Overview

The fuzzy duplicate detection system uses string similarity matching to catch both exact duplicates and typos/variations of existing entries.

## Components

### 1. Core Utility Functions

Location: `utils/fuzzyMatch.ts`

Functions:
- `levenshteinDistance(str1, str2)` - Calculates edit distance between strings
- `calculateSimilarity(str1, str2)` - Returns similarity percentage (0-100)
- `isSimilar(str1, str2, threshold)` - Boolean check with threshold (default 80%)

### 2. Custom Hook

Location: `hooks/useDuplicateCheck.ts`

The `useDuplicateCheck` hook handles:
- Debounced input tracking (300ms)
- Database queries for existing entries
- Fuzzy matching against all entries
- Error message state management

Usage:
```typescript
const { duplicateError, checkInput, clearError } = useDuplicateCheck({
  tableName: beanTasteTable,
  fieldName: 'flavor',
  threshold: 80 // optional, defaults to 80
});
```

### 3. Implementation in Forms

Add to your form component:
1. Import the hook
2. Call `checkInput(text)` in the input's `onChangeText`
3. Display `duplicateError` below the input field
4. Add red border when error exists: `borderColor={duplicateError ? "$red10" : undefined}`
5. Prevent submission when `duplicateError` is truthy

## Testing

Run tests with:
```bash
npm test -- fuzzyMatch.test.ts
```

All 18 tests should pass, covering:
- Exact string matching
- Case insensitivity
- German characters (ü, ö, ä, ß)
- Similarity calculations
- Threshold variations

## Similarity Threshold

The default 80% threshold means:
- "Schokolade" vs "Schokolate" = 90% similar ✅ (blocked)
- "Schokolade" vs "Vanille" = 20% similar ❌ (allowed)

Adjust the threshold based on your needs:
- Higher (90%+) = Only blocks very similar entries
- Lower (70%) = More aggressive duplicate prevention

## Error Messages

The system provides localized German error messages:
- Exact match: `Der Geschmack "[name]" existiert bereits.`
- Fuzzy match: `Ähnlicher Geschmack "[name]" existiert bereits.`

## Best Practices

1. **Always debounce input** - Prevents excessive database queries
2. **Check all existing entries** - Not just currently selected ones
3. **Clear errors on cancel** - Reset state when user cancels
4. **Visual feedback** - Show red border and error text
5. **Prevent submission** - Block form submission when duplicate exists
