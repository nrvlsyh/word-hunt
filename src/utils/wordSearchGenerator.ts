/**
 * Procedural Word Search Puzzle Generator
 * Generates reliable, deterministic, overlapping word search grids
 * according to difficulty and language rules.
 */

import { Difficulty, Language, LETTER_FREQUENCIES, WORD_DATABASE } from '../data/words';

export interface GridCell {
  row: number;
  col: number;
  letter: string;
}

export interface PlacedWord {
  word: string;
  originalWord: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  direction: [number, number];
  cells: { row: number; col: number }[];
  colorIndex: number;
  found: boolean;
}

export interface GeneratedPuzzle {
  grid: string[][];
  size: number;
  placedWords: PlacedWord[];
  themeId: string;
  language: Language;
  difficulty: Difficulty;
  seed: number;
}

// Direction vectors [dRow, dCol]
export const DIRECTIONS = {
  RIGHT: [0, 1] as [number, number],
  LEFT: [0, -1] as [number, number],
  DOWN: [1, 0] as [number, number],
  UP: [-1, 0] as [number, number],
  DOWN_RIGHT: [1, 1] as [number, number],
  UP_LEFT: [-1, -1] as [number, number],
  DOWN_LEFT: [1, -1] as [number, number],
  UP_RIGHT: [-1, 1] as [number, number],
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    size: number;
    wordCount: number;
    minLength: number;
    maxLength: number;
    directions: [number, number][];
    pointsPerWord: number;
    baseXP: number;
  }
> = {
  easy: {
    size: 8,
    wordCount: 6,
    minLength: 3,
    maxLength: 6,
    // Horizontal and vertical forward only
    directions: [DIRECTIONS.RIGHT, DIRECTIONS.DOWN],
    pointsPerWord: 10,
    baseXP: 40,
  },
  medium: {
    size: 10,
    wordCount: 8,
    minLength: 3,
    maxLength: 8,
    // Horizontal, vertical, diagonal forward
    directions: [DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.DOWN_RIGHT],
    pointsPerWord: 20,
    baseXP: 75,
  },
  hard: {
    size: 12,
    wordCount: 10,
    minLength: 4,
    maxLength: 10,
    // All 8 directions including backwards
    directions: [
      DIRECTIONS.RIGHT,
      DIRECTIONS.LEFT,
      DIRECTIONS.DOWN,
      DIRECTIONS.UP,
      DIRECTIONS.DOWN_RIGHT,
      DIRECTIONS.UP_LEFT,
      DIRECTIONS.DOWN_LEFT,
      DIRECTIONS.UP_RIGHT,
    ],
    pointsPerWord: 30,
    baseXP: 120,
  },
  expert: {
    size: 15,
    wordCount: 14,
    minLength: 4,
    maxLength: 12,
    // All 8 directions, more words, dense overlap
    directions: [
      DIRECTIONS.RIGHT,
      DIRECTIONS.LEFT,
      DIRECTIONS.DOWN,
      DIRECTIONS.UP,
      DIRECTIONS.DOWN_RIGHT,
      DIRECTIONS.UP_LEFT,
      DIRECTIONS.DOWN_LEFT,
      DIRECTIONS.UP_RIGHT,
    ],
    pointsPerWord: 50,
    baseXP: 200,
  },
};

/**
 * Seeded PRNG (Mulberry32) for reproducible daily puzzles
 */
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle array using PRNG
 */
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a full puzzle guaranteed to contain all target words
 */
export function generatePuzzle(
  themeId: string,
  language: Language,
  difficulty: Difficulty,
  customSeed?: number
): GeneratedPuzzle {
  const seed = customSeed !== undefined ? customSeed : Math.floor(Math.random() * 10000000);
  const random = createPRNG(seed);
  const config = DIFFICULTY_CONFIG[difficulty];
  const size = config.size;

  // Retrieve words for this theme and language
  const themeWords = WORD_DATABASE[language][themeId] || WORD_DATABASE[language].animals;

  // Filter words by length
  const eligibleWords = themeWords.filter(
    (w) => w.length >= config.minLength && w.length <= Math.min(config.maxLength, size)
  );

  // Maximum attempts to generate full grid
  const MAX_PUZZLE_ATTEMPTS = 50;

  for (let attempt = 0; attempt < MAX_PUZZLE_ATTEMPTS; attempt++) {
    // Pick candidate words
    const shuffledPool = shuffleArray(eligibleWords, random);
    // Take candidate words up to config.wordCount
    const candidateWords = shuffledPool.slice(0, config.wordCount);

    // Sort descending by length for optimal placement packing
    candidateWords.sort((a, b) => b.length - a.length);

    // Initialize empty grid
    const grid: (string | null)[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => null)
    );

    const placedWords: PlacedWord[] = [];
    let allPlaced = true;

    for (let wIndex = 0; wIndex < candidateWords.length; wIndex++) {
      const word = candidateWords[wIndex];
      const wordLen = word.length;
      let placed = false;

      // Create list of all possible (row, col, direction) tuples and shuffle
      const possiblePlacements: { r: number; c: number; dir: [number, number] }[] = [];

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          for (const dir of config.directions) {
            const [dr, dc] = dir;
            const endR = r + (wordLen - 1) * dr;
            const endC = c + (wordLen - 1) * dc;

            // Check grid boundary
            if (endR >= 0 && endR < size && endC >= 0 && endC < size) {
              possiblePlacements.push({ r, c, dir });
            }
          }
        }
      }

      const shuffledPlacements = shuffleArray(possiblePlacements, random);

      for (const placement of shuffledPlacements) {
        const { r, c, dir } = placement;
        const [dr, dc] = dir;
        let canPlace = true;
        const cells: { row: number; col: number }[] = [];

        for (let i = 0; i < wordLen; i++) {
          const currR = r + i * dr;
          const currC = c + i * dc;
          const existingChar = grid[currR][currC];
          const targetChar = word[i];

          // Can place if cell is empty or has matching letter (overlapping letters!)
          if (existingChar !== null && existingChar !== targetChar) {
            canPlace = false;
            break;
          }
          cells.push({ row: currR, col: currC });
        }

        if (canPlace) {
          // Commit word to grid
          for (let i = 0; i < wordLen; i++) {
            grid[cells[i].row][cells[i].col] = word[i];
          }

          placedWords.push({
            word,
            originalWord: word,
            startRow: r,
            startCol: c,
            endRow: r + (wordLen - 1) * dr,
            endCol: c + (wordLen - 1) * dc,
            direction: dir,
            cells,
            colorIndex: wIndex,
            found: false,
          });

          placed = true;
          break;
        }
      }

      if (!placed) {
        allPlaced = false;
        break; // Retry full generation with new shuffle
      }
    }

    if (allPlaced && placedWords.length >= Math.min(candidateWords.length, 5)) {
      // Fill remaining empty cells with random letters matching language frequency
      const freqLetters = LETTER_FREQUENCIES[language];
      const finalGrid: string[][] = [];

      for (let r = 0; r < size; r++) {
        finalGrid[r] = [];
        for (let c = 0; c < size; c++) {
          if (grid[r][c] !== null) {
            finalGrid[r][c] = grid[r][c]!;
          } else {
            const randIndex = Math.floor(random() * freqLetters.length);
            finalGrid[r][c] = freqLetters[randIndex];
          }
        }
      }

      // Sort placedWords alphabetically for neat presentation in the word list
      placedWords.sort((a, b) => a.word.localeCompare(b.word));
      // Re-index color indices to be 0..N-1
      placedWords.forEach((pw, idx) => {
        pw.colorIndex = idx;
      });

      return {
        grid: finalGrid,
        size,
        placedWords,
        themeId,
        language,
        difficulty,
        seed,
      };
    }
  }

  // Graceful fallback: basic grid with simplest words
  return fallbackPuzzle(themeId, language, difficulty, seed);
}

/**
 * Fallback generator that places words strictly horizontally and vertically to guarantee success
 */
function fallbackPuzzle(
  themeId: string,
  language: Language,
  difficulty: Difficulty,
  seed: number
): GeneratedPuzzle {
  const random = createPRNG(seed);
  const config = DIFFICULTY_CONFIG[difficulty];
  const size = config.size;
  const themeWords = WORD_DATABASE[language][themeId] || WORD_DATABASE[language].animals;
  const filtered = themeWords.filter((w) => w.length <= size);
  const selected = shuffleArray(filtered, random).slice(0, Math.min(config.wordCount, size));

  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 'A')
  );
  const freqLetters = LETTER_FREQUENCIES[language];

  // Fill grid with random letters first
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      grid[r][c] = freqLetters[Math.floor(random() * freqLetters.length)];
    }
  }

  const placedWords: PlacedWord[] = [];

  selected.forEach((word, index) => {
    const row = index % size;
    const maxCol = size - word.length;
    const startCol = Math.max(0, Math.floor(random() * (maxCol + 1)));

    const cells: { row: number; col: number }[] = [];
    for (let i = 0; i < word.length; i++) {
      grid[row][startCol + i] = word[i];
      cells.push({ row, col: startCol + i });
    }

    placedWords.push({
      word,
      originalWord: word,
      startRow: row,
      startCol,
      endRow: row,
      endCol: startCol + word.length - 1,
      direction: DIRECTIONS.RIGHT,
      cells,
      colorIndex: index,
      found: false,
    });
  });

  placedWords.sort((a, b) => a.word.localeCompare(b.word));
  placedWords.forEach((pw, idx) => {
    pw.colorIndex = idx;
  });

  return {
    grid,
    size,
    placedWords,
    themeId,
    language,
    difficulty,
    seed,
  };
}

/**
 * Generate Daily Challenge Seed from date string YYYY-MM-DD and language
 */
export function getDailyChallengeSeed(dateStr: string, language: Language): number {
  let hash = 0;
  const combined = `wordhunt-${dateStr}-${language}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
