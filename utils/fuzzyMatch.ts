/**
 * Calculates the Levenshtein distance between two strings.
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into another.
 *
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @returns The Levenshtein distance between the two strings
 *
 * @example
 * levenshteinDistance('kitten', 'sitting') // returns 3
 * levenshteinDistance('hello', 'hello') // returns 0
 */
export const levenshteinDistance = (str1: string, str2: string): number => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j++) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return track[str2.length][str1.length];
};

/**
 * Calculates the similarity percentage between two strings based on Levenshtein distance.
 * Returns a value between 0 and 100, where 100 means the strings are identical.
 *
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @returns Similarity percentage (0-100)
 *
 * @example
 * calculateSimilarity('hello', 'hello') // returns 100
 * calculateSimilarity('hello', 'hallo') // returns 80
 * calculateSimilarity('hello', 'world') // returns 20
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return ((maxLength - distance) / maxLength) * 100;
};

/**
 * Checks if two strings are similar based on a given threshold.
 *
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @param threshold - Minimum similarity percentage required (0-100), defaults to 80
 * @returns True if the strings are similar enough, false otherwise
 *
 * @example
 * isSimilar('Schokolade', 'Schokolate') // returns true (with default 80% threshold)
 * isSimilar('hello', 'world') // returns false
 * isSimilar('hello', 'hallo', 70) // returns true (with 70% threshold)
 */
export const isSimilar = (str1: string, str2: string, threshold: number = 80): boolean => {
  return calculateSimilarity(str1, str2) >= threshold;
};
