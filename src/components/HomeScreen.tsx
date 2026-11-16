import React from 'react';
import {
  Sparkles,
  Play,
  Calendar,
  Flame,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Infinity as InfinityIcon,
  HelpCircle,
} from 'lucide-react';
import { Language, THEMES } from '../data/words';
import { getUIText } from '../utils/translations';
import { LevelInfo, PlayerStats, getTodayDateString } from '../utils/storage';
import { ThemeIcon } from './ThemeIcon';
import { soundManager } from '../utils/sound';

interface HomeScreenProps {
  language: Language;
  stats: PlayerStats;
  levelInfo: LevelInfo;
  onPlayNow: () => void;
  onPlayDaily: () => void;
  onNavigateToStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  stats,
  levelInfo,
  onPlayNow,
  onPlayDaily,
  onNavigateToStats,
}) => {
  const t = getUIText(language);
  const today = getTodayDateString();
  const isDailyCompletedToday = stats.lastDailyCompletedDate === today;
  const todayBestScore = stats.dailyBestScores[today] || null;

  // Format today's date in friendly string
  const formattedToday = new Intl.DateTimeFormat(
    language === 'ms' ? 'ms-MY' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(new Date());

  const getThemeName = (themeId: string) => {
    const found = THEMES.find((th) => th.id === themeId);
    return found ? found.name[language] : themeId;
  };

  const getThemeIcon = (themeId: string) => {
    const found = THEMES.find((th) => th.id === themeId);
    return found ? found.icon : 'Sparkles';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in pb-20 md:pb-10">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-rose-200/60 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm">
        {/* Soft background glow circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-200/50 dark:bg-rose-900/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-200/50 dark:bg-amber-900/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-rose-200/80 dark:border-slate-700 text-rose-600 dark:text-rose-400 text-xs font-bold shadow-xs">
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>{t.freeUnlimitedNotice}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight font-display">
              {t.readyToHunt}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {t.tagline}
            </p>
          </div>

          {/* Big Play CTA Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayNow();
            }}
            className="group shrink-0 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base shadow-lg shadow-rose-300/60 dark:shadow-none transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>{t.playNow}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick Player Progress Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Level & XP */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span>{t.level}</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-display tabular-nums">
              Lv.{levelInfo.level}
            </span>
            <div className="mt-1.5 w-full h-1.5 bg-rose-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tabular-nums mt-1 block">
              {levelInfo.currentLevelXp}/{levelInfo.xpForNextLevel} XP
            </span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span>{t.streak}</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white font-display tabular-nums">
                {stats.currentStreak}
              </span>
              <span className="text-xs text-slate-400 font-medium">{t.days}</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mt-1">
              {t.longestStreak}: {stats.longestStreak}
            </span>
          </div>
        </div>

        {/* Puzzles Solved */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span>{t.puzzlesSolved}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-display tabular-nums">
              {stats.totalGamesPlayed}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mt-1">
              {stats.totalWordsFound} {t.wordsFound.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Total XP / High Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span>{t.highestScore}</span>
            <Trophy className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-display tabular-nums">
              {stats.highestScore}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mt-1">
              {stats.totalXP} {t.xp} Total
            </span>
          </div>
        </div>
      </div>

      {/* Featured Daily Challenge Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t.dailyChallenge}
              </span>
              {isDailyCompletedToday && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display mt-0.5">
              {formattedToday}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDailyCompletedToday
                ? `${t.todayBestScore}: ${todayBestScore} pts`
                : 'A daily handcrafted puzzle synced for all players! Keep your streak burning.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onPlayDaily();
          }}
          className="self-start sm:self-center shrink-0 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-200 dark:shadow-none flex items-center gap-2 transition-all"
        >
          <span>{isDailyCompletedToday ? 'Replay Daily' : t.playDailyNow}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recently Played Games & Quick Start */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-rose-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white font-display">
            {t.recentlyPlayed}
          </h3>
          {stats.recentGames.length > 0 && (
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigateToStats();
              }}
              className="text-xs font-semibold text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>{t.statistics}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {stats.recentGames.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-rose-50/40 dark:bg-slate-800/40 border border-dashed border-rose-200 dark:border-slate-700">
            <Sparkles className="w-8 h-8 text-rose-400 mx-auto mb-2 opacity-70" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {t.noRecentGames}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Select your favorite theme and difficulty to start hunting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.recentGames.slice(0, 3).map((game) => (
              <div
                key={game.id}
                className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-slate-800/50 border border-rose-100/70 dark:border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-rose-500 shadow-xs">
                    <ThemeIcon iconName={getThemeIcon(game.themeId)} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                      {getThemeName(game.themeId)}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                      {game.language.toUpperCase()} · {game.difficulty}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-rose-500 tabular-nums">
                    +{game.score} pts
                  </span>
                  <p className="text-[10px] text-slate-400 tabular-nums">
                    {Math.floor(game.timeSeconds / 60)}:
                    {String(game.timeSeconds % 60).padStart(2, '0')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to Play Friendly Tips */}
      <div className="rounded-3xl bg-rose-50/50 dark:bg-slate-850 p-5 border border-rose-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-rose-500" />
          <span>How to Play Word Hunt</span>
        </h4>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
          <li>
            <strong>Select Letters:</strong> Drag across straight lines (horizontal, vertical, or diagonal).
          </li>
          <li>
            <strong>Pastel Highlights:</strong> Found words light up in soft pastel colors and cross off your word list.
          </li>
          <li>
            <strong>Need Clues?</strong> Tap any word in the list or use the Hint button for orientation tips.
          </li>
          <li>
            <strong>Unlimited Play:</strong> No energy, no timers, no waiting. Relax and play as many puzzles as you like!
          </li>
        </ul>
      </div>
    </div>
  );
};
