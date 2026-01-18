import { calculateSimilarity, isSimilar, levenshteinDistance } from "./fuzzyMatch";

describe("levenshteinDistance", () => {
  test("should return 0 for identical strings", () => {
    expect(levenshteinDistance("hello", "hello")).toBe(0);
    expect(levenshteinDistance("", "")).toBe(0);
    expect(levenshteinDistance("test", "test")).toBe(0);
  });

  test("should return the length when comparing with empty string", () => {
    expect(levenshteinDistance("hello", "")).toBe(5);
    expect(levenshteinDistance("", "world")).toBe(5);
  });

  test("should calculate correct distance for single character difference", () => {
    expect(levenshteinDistance("cat", "hat")).toBe(1); // substitution
    expect(levenshteinDistance("cat", "cats")).toBe(1); // insertion
    expect(levenshteinDistance("cats", "cat")).toBe(1); // deletion
  });

  test("should calculate correct distance for multiple differences", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3);
    expect(levenshteinDistance("saturday", "sunday")).toBe(3);
  });

  test("should be case-sensitive", () => {
    expect(levenshteinDistance("Hello", "hello")).toBe(1);
    expect(levenshteinDistance("HELLO", "hello")).toBe(5);
  });

  test("should handle German characters", () => {
    expect(levenshteinDistance("Schokolade", "Schokolate")).toBe(1);
    expect(levenshteinDistance("Kaffee", "Kaffe")).toBe(1);
  });
});

describe("calculateSimilarity", () => {
  test("should return 100 for identical strings", () => {
    expect(calculateSimilarity("hello", "hello")).toBe(100);
    expect(calculateSimilarity("Schokolade", "Schokolade")).toBe(100);
  });

  test("should return 100 for empty strings", () => {
    expect(calculateSimilarity("", "")).toBe(100);
  });

  test("should be case-insensitive", () => {
    expect(calculateSimilarity("Hello", "hello")).toBe(100);
    expect(calculateSimilarity("SCHOKOLADE", "schokolade")).toBe(100);
  });

  test("should calculate similarity percentage correctly", () => {
    // "hello" vs "hallo" - 1 difference out of 5 = 80%
    expect(calculateSimilarity("hello", "hallo")).toBe(80);

    // "cat" vs "hat" - 1 difference out of 3 = ~66.67%
    expect(calculateSimilarity("cat", "hat")).toBeCloseTo(66.67, 1);

    // "kitten" vs "sitting" - 3 differences out of 7 = ~57.14%
    expect(calculateSimilarity("kitten", "sitting")).toBeCloseTo(57.14, 1);
  });

  test("should return 0 for completely different strings of same length", () => {
    const result = calculateSimilarity("abc", "xyz");
    expect(result).toBe(0);
  });

  test("should handle German taste names", () => {
    // Very similar tastes should have high similarity
    expect(calculateSimilarity("Schokolade", "Schokolate")).toBeGreaterThanOrEqual(90);
    expect(calculateSimilarity("Karamell", "Karamel")).toBeGreaterThan(85);
    expect(calculateSimilarity("Nuss", "Nüss")).toBeGreaterThanOrEqual(75);

    // Different tastes should have low similarity
    expect(calculateSimilarity("Schokolade", "Vanille")).toBeLessThan(50);
    expect(calculateSimilarity("Kaffee", "Honig")).toBeLessThan(30);
  });
});

describe("isSimilar", () => {
  test("should return true for identical strings", () => {
    expect(isSimilar("hello", "hello")).toBe(true);
    expect(isSimilar("Schokolade", "Schokolade")).toBe(true);
  });

  test("should use 80% threshold by default", () => {
    expect(isSimilar("hello", "hallo")).toBe(true); // 80% similarity
    expect(isSimilar("kitten", "sitting")).toBe(false); // ~57% similarity
  });

  test("should accept custom threshold", () => {
    expect(isSimilar("kitten", "sitting", 50)).toBe(true); // 50% threshold
    expect(isSimilar("kitten", "sitting", 60)).toBe(false); // 60% threshold
    expect(isSimilar("hello", "hallo", 90)).toBe(false); // 90% threshold
  });

  test("should be case-insensitive", () => {
    expect(isSimilar("Hello", "HELLO")).toBe(true);
    expect(isSimilar("Schokolade", "SCHOKOLADE")).toBe(true);
  });

  test("should detect typos in taste names", () => {
    expect(isSimilar("Schokolade", "Schokolate")).toBe(true);
    expect(isSimilar("Karamell", "Karamel")).toBe(true);
    expect(isSimilar("Vanille", "Vanile")).toBe(true);
  });

  test("should not match completely different tastes", () => {
    expect(isSimilar("Schokolade", "Vanille")).toBe(false);
    expect(isSimilar("Kaffee", "Honig")).toBe(false);
    expect(isSimilar("Nuss", "Frucht")).toBe(false);
  });
});
