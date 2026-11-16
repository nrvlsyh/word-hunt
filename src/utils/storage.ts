/**
 * LocalStorage and Player Progression Engine
 * Tracks unlimited level progression, XP calculations, statistics, streaks, and settings.
 */

import { Difficulty, Language } from '../data/words';

export interface RecentGameRecord {
  id: string;
  date: string;
  themeId: string;
  language: Language;
  difficulty: Difficulty;
  score: number;
  wordsFound: number;
  totalWords: number;
  timeSeconds: number;
  mode: 'standard' | 'daily';
}

export interface PlayerStats {
  totalGamesPlayed: number;
  totalWordsFound: number;
  totalXP: number;
  highestScore: number;
  totalTimeSeconds: number;
  bestTimeByDifficulty: Record<Difficulty, number | null>;
  gamesByDifficulty: Record<Difficulty, number>;
  themePlayCounts: Record<string, number>;
  languageCounts: Record<Language, number>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
  lastDailyCompletedDate: string | null;
  dailyBestScores: Record<string, number>; // dateStr -> score
  recentGames: RecentGameRecord[];
}

export interface PlayerSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  preferredLanguage: Language;
}

const STATS_KEY = 'wordhunt_player_stats_v1';
const SETTINGS_KEY = 'wordhunt_player_settings_v1';

const DEFAULT_STATS: PlayerStats = {
  totalGamesPlayed: 0,
  totalWordsFound: 0,
  totalXP: 0,
  highestScore: 0,
  totalTimeSeconds: 0,
  bestTimeByDifficulty: {
    easy: null,
    medium: null,
    hard: null,
    expert: null,
  },
  gamesByDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  },
  themePlayCounts: {},
  languageCounts: {
    en: 0,
    ms: 0,
  },
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  lastDailyCompletedDate: null,
  dailyBestScores: {},
  recentGames: [],
};

const DEFAULT_SETTINGS: PlayerSettings = {
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  darkMode: false,
  preferredLanguage: 'ms', // Default to Bahasa Melayu, player can switch anytime
};

/**
 * Progression Formulas:
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * Level 4: 450 XP
 * Level 5: 700 XP
 * Level n: Total XP needed = (n-1)*100 + ((n-1)*(n-2)/2)*50
 */
export function getRequiredXpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return n * 100 + (n * (n - 1) * 25);
}

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
}

export function calculateLevelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  while (totalXp >= getRequiredXpForLevel(level + 1)) {
    level++;
  }

  const currentLevelBaseXp = getRequiredXpForLevel(level);
  const nextLevelBaseXp = getRequiredXpForLevel(level + 1);
  const xpNeeded = nextLevelBaseXp - currentLevelBaseXp;
  const xpInCurrentLevel = totalXp - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeeded) * 100)));

  return {
    level,
    currentLevelXp: xpInCurrentLevel,
    xpForNextLevel: xpNeeded,
    progressPercent,
    totalXp,
  };
}

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore quota issues
  }
}

export function loadSettings(): PlayerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PlayerSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore quota issues
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Record a game completion, calculate streaks, XP, best scores
 */
export function recordGameCompletion(params: {
  themeId: string;
  language: Language;
  difficulty: Difficulty;
  score: number;
  wordsFound: number;
  totalWords: number;
  timeSeconds: number;
  xpEarned: number;
  mode: 'standard' | 'daily';
  dailyDate?: string;
}): { updatedStats: PlayerStats; leveledUp: boolean; oldLevel: number; newLevel: number } {
  const stats = loadStats();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const oldLevelInfo = calculateLevelFromXp(stats.totalXP);
  const newTotalXp = stats.totalXP + params.xpEarned;
  const newLevelInfo = calculateLevelFromXp(newTotalXp);

  // Update streak
  let newCurrentStreak = stats.currentStreak;
  if (stats.lastPlayedDate === today) {
    // Already played today, streak maintained
  } else if (stats.lastPlayedDate === yesterday) {
    // Played yesterday, streak incremented
    newCurrentStreak += 1;
  } else {
    // Streak broken, reset to 1
    newCurrentStreak = 1;
  }
  const newLongestStreak = Math.max(stats.longestStreak, newCurrentStreak);

  // Best time for difficulty
  const prevBestTime = stats.bestTimeByDifficulty[params.difficulty];
  const newBestTime =
    prevBestTime === null
      ? params.timeSeconds
      : Math.min(prevBestTime, params.timeSeconds);

  // Games count by difficulty
  const updatedGamesByDiff = {
    ...stats.gamesByDifficulty,
    [params.difficulty]: (stats.gamesByDifficulty[params.difficulty] || 0) + 1,
  };

  // Theme play count
  const updatedThemeCounts = {
    ...stats.themePlayCounts,
    [params.themeId]: (stats.themePlayCounts[params.themeId] || 0) + 1,
  };

  // Language count
  const updatedLangCounts = {
    ...stats.languageCounts,
    [params.language]: (stats.languageCounts[params.language] || 0) + 1,
  };

  // Daily challenge score
  const updatedDailyScores = { ...stats.dailyBestScores };
  let updatedDailyCompletedDate = stats.lastDailyCompletedDate;
  if (params.mode === 'daily' && params.dailyDate) {
    const existing = updatedDailyScores[params.dailyDate] || 0;
    updatedDailyScores[params.dailyDate] = Math.max(existing, params.score);
    updatedDailyCompletedDate = params.dailyDate;
  }

  // Recent game item
  const newRecentItem: RecentGameRecord = {
    id: `game-${Date.now()}`,
    date: today,
    themeId: params.themeId,
    language: params.language,
    difficulty: params.difficulty,
    score: params.score,
    wordsFound: params.wordsFound,
    totalWords: params.totalWords,
    timeSeconds: params.timeSeconds,
    mode: params.mode,
  };

  const updatedRecentGames = [newRecentItem, ...stats.recentGames].slice(0, 20);

  const updatedStats: PlayerStats = {
    totalGamesPlayed: stats.totalGamesPlayed + 1,
    totalWordsFound: stats.totalWordsFound + params.wordsFound,
    totalXP: newTotalXp,
    highestScore: Math.max(stats.highestScore, params.score),
    totalTimeSeconds: stats.totalTimeSeconds + params.timeSeconds,
    bestTimeByDifficulty: {
      ...stats.bestTimeByDifficulty,
      [params.difficulty]: newBestTime,
    },
    gamesByDifficulty: updatedGamesByDiff,
    themePlayCounts: updatedThemeCounts,
    languageCounts: updatedLangCounts,
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastPlayedDate: today,
    lastDailyCompletedDate: updatedDailyCompletedDate,
    dailyBestScores: updatedDailyScores,
    recentGames: updatedRecentGames,
  };

  saveStats(updatedStats);

  return {
    updatedStats,
    leveledUp: newLevelInfo.level > oldLevelInfo.level,
    oldLevel: oldLevelInfo.level,
    newLevel: newLevelInfo.level,
  };
}

export function resetAllStats() {
  localStorage.removeItem(STATS_KEY);
}

/**
 * Deduct a dedication penalty when an active puzzle is abandoned early
 */
export function applyEarlyExitPenalty(penalty: number = 50): PlayerStats {
  const stats = loadStats();
  const updatedStats: PlayerStats = {
    ...stats,
    totalXP: Math.max(0, stats.totalXP - penalty),
  };
  saveStats(updatedStats);
  return updatedStats;
}
