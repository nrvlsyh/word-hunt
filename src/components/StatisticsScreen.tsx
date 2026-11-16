import React from 'react';
import {
  BarChart2,
  Trophy,
  Clock,
  CheckCircle2,
  Flame,
  Zap,
  Globe,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Difficulty, Language, THEMES } from '../data/words';
import { getUIText } from '../utils/translations';
import { LevelInfo, PlayerStats } from '../utils/storage';
import { ThemeIcon } from './ThemeIcon';

interface StatisticsScreenProps {
  language: Language;
  stats: PlayerStats;
  levelInfo: LevelInfo;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  language,
  stats,
  levelInfo,
}) => {
  const t = getUIText(language);

  // Compute average time
  const averageSeconds =
    stats.totalGamesPlayed > 0
      ? Math.round(stats.totalTimeSeconds / stats.totalGamesPlayed)
      : 0;

  const formatTime = (secs: number | null) => {
    if (secs === null || secs === undefined) return '--:--';
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  // Determine favorite language
  const favLang =
    stats.languageCounts.ms >= stats.languageCounts.en ? 'Bahasa Melayu' : 'English';

  // Determine most played theme
  let mostPlayedThemeId: string = 'animals';
  let maxCount = -1;
  Object.entries(stats.themePlayCounts).forEach(([themeId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPlayedThemeId = themeId;
    }
  });
  const mostPlayedTheme = THEMES.find((th) => th.id === mostPlayedThemeId);

  // Calculate difficulty percentages for charts
  const diffs: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const totalGames = Math.max(1, stats.totalGamesPlayed);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in pb-24 md:pb-12">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
          {t.statistics}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your word hunting journey, progression milestones, and records
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.totalGames}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-display tabular-nums mt-1">
            {stats.totalGamesPlayed}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {stats.totalWordsFound} {t.wordsFound.toLowerCase()}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.highestScore}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-display tabular-nums mt-1">
            {stats.highestScore}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {stats.totalXP} {t.xp} earned
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.streak}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-display tabular-nums mt-1">
            {stats.currentStreak} <span className="text-xs font-medium text-slate-400">{t.days}</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {t.longestStreak}: {stats.longestStreak} {t.days}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.averageTime}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-display tabular-nums mt-1">
            {formatTime(averageSeconds)}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Total {Math.round(stats.totalTimeSeconds / 60)} mins played
          </span>
        </div>
      </div>

      {/* Level Progression Detail Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-rose-100 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Unlimited Level Progression
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every solved puzzle awards XP to increase your rank indefinitely!
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-rose-500">
              {t.level} {levelInfo.level}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Level {levelInfo.level}</span>
            <span className="tabular-nums font-mono text-slate-400">
              {levelInfo.currentLevelXp} / {levelInfo.xpForNextLevel} XP ({levelInfo.progressPercent}%)
            </span>
            <span>Level {levelInfo.level + 1}</span>
          </div>
          <div className="w-full h-3.5 bg-rose-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown & Best Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Games by Difficulty Chart */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 border border-rose-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {t.difficultyBreakdown}
            </h3>
          </div>

          <div className="space-y-3">
            {diffs.map((diff) => {
              const count = stats.gamesByDifficulty[diff] || 0;
              const percent = Math.round((count / totalGames) * 100);
              const label =
                diff === 'easy'
                  ? t.easy
                  : diff === 'medium'
                  ? t.medium
                  : diff === 'hard'
                  ? t.hard
                  : t.expert;

              return (
                <div key={diff} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 capitalize">
                      {label}
                    </span>
                    <span className="tabular-nums font-mono text-slate-400">
                      {count} games ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        diff === 'easy'
                          ? 'bg-emerald-400'
                          : diff === 'medium'
                          ? 'bg-sky-400'
                          : diff === 'hard'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${stats.totalGamesPlayed > 0 ? percent : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Completion Time by Difficulty */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 border border-rose-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {t.bestTime} (Speed Records)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {diffs.map((diff) => {
              const best = stats.bestTimeByDifficulty[diff];
              const label =
                diff === 'easy'
                  ? t.easy
                  : diff === 'medium'
                  ? t.medium
                  : diff === 'hard'
                  ? t.hard
                  : t.expert;
              return (
                <div
                  key={diff}
                  className="p-3 rounded-2xl bg-rose-50/50 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700/60"
                >
                  <span className="text-[11px] font-bold text-slate-400 capitalize block">
                    {label}
                  </span>
                  <span className="text-lg font-black text-slate-800 dark:text-white font-mono tabular-nums mt-0.5 block">
                    {formatTime(best)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preferences & Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Most Played Theme */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-slate-800 text-rose-500 flex items-center justify-center shrink-0">
            <ThemeIcon iconName={mostPlayedTheme?.icon || 'Sparkles'} className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.mostPlayedTheme}
            </span>
            <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">
              {mostPlayedTheme ? mostPlayedTheme.name[language] : 'None yet'}
            </h4>
          </div>
        </div>

        {/* Favorite Language */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.favouriteLanguage}
            </span>
            <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">
              {stats.totalGamesPlayed > 0 ? favLang : 'Bahasa Melayu & English'}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
