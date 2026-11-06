/**
 * Fisher-Yates array shuffling and text manipulation utilities.
 */

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Ensures an array of words is shuffled so that it does NOT match the original order.
 */
export function shuffleWordsStrictly(words: string[]): string[] {
  if (words.length <= 1) return [...words];
  let result = shuffleArray(words);

  // If accidentally identical to original, swap first two
  if (result.every((w, i) => w === words[i])) {
    const temp = result[0];
    result[0] = result[1];
    result[1] = temp;
  }
  return result;
}

/**
 * Scrambles the internal letters of a single word while keeping punctuation.
 */
export function scrambleLetters(word: string): string {
  // Strip punctuation
  const clean = word.replace(/[^a-zA-Z0-9]/g, '');
  const punctuation = word.replace(/[a-zA-Z0-9]/g, '');

  if (clean.length <= 2) return word;

  let letters = clean.split('');
  let shuffledLetters = shuffleArray(letters);

  // If identical, reverse it
  if (shuffledLetters.join('') === clean) {
    shuffledLetters = letters.reverse();
  }

  return shuffledLetters.join('') + punctuation;
}

/**
 * Returns contextual grammatical decoy words based on sentence keywords
 * to add high-difficulty challenge to Word Train drills.
 */
export function getContextualDecoyWords(correctSentence: string): string[] {
  const s = correctSentence.toLowerCase();
  const decoys: string[] = [];

  if (s.includes(' is ') || s.includes(' are ') || s.includes(' am ')) {
    if (s.includes(' is ')) decoys.push('are', 'were');
    else if (s.includes(' are ')) decoys.push('is', 'was');
  }

  if (s.includes(' have ') || s.includes(' has ')) {
    if (s.includes(' have ')) decoys.push('has', 'having');
    else decoys.push('have', 'had');
  }

  if (s.includes(' was ') || s.includes(' were ')) {
    if (s.includes(' was ')) decoys.push('were', 'is');
    else decoys.push('was', 'are');
  }

  if (s.includes(' much ') || s.includes(' many ')) {
    if (s.includes(' much ')) decoys.push('many');
    else decoys.push('much');
  }

  if (s.includes(' will ') || s.includes(' going to ')) {
    decoys.push('would', 'shall');
  }

  if (s.includes(' do ') || s.includes(' does ') || s.includes(" don't ") || s.includes(" doesn't ")) {
    if (s.includes(' do ') || s.includes(" don't ")) decoys.push("doesn't", "did");
    else decoys.push("don't", "does");
  }

  if (s.includes(' although ') || s.includes(' because ')) {
    decoys.push('but', 'therefore');
  }

  if (s.includes(' carefully ') || s.includes(' slowly ') || s.includes(' quickly ')) {
    decoys.push('careful', 'quick');
  }

  // Fallback grammatical traps
  if (decoys.length === 0) {
    decoys.push('always', 'very', 'not');
  }

  // Return at most 1-2 distinct decoy words
  return Array.from(new Set(decoys)).slice(0, 2);
}
