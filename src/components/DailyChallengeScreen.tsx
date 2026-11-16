import React from 'react';
import {
  Calendar,
  Flame,
  Trophy,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { Language, THEMES } from '../data/words';
import { getUIText } from '../utils/translations';
import {
  PlayerStats,
  getTodayDateString,
} from '../utils/storage';
import { getDailyChallengeSeed } from '../utils/wordSearchGenerator';
import { soundManager } from '../utils/sound';

interface DailyChallengeScreenProps {
  language: Language;
  stats: PlayerStats;
  onStartDaily: (themeId: string, seed: number, dateStr: string) => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  language,
  stats,
  onStartDaily,
}) => {
  const t = getUIText(language);
  const today = getTodayDateString();
  const isCompletedToday = stats.lastDailyCompletedDate === today;
  const bestScoreToday = stats.dailyBestScores[today] || null;

  // Determine daily theme deterministically from date hash
  const dailySeed = getDailyChallengeSeed(today, language);
  const themeIndex = dailySeed % (THEMES.length - 1); // exclude random for daily featured
  const dailyTheme = THEMES[themeIndex];

  // Friendly date label
  const formattedToday = new Intl.DateTimeFormat(
    language === 'ms' ? 'ms-MY' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(new Date());

  const handleLaunchDaily = () => {
    soundManager.playClick();
    onStartDaily(dailyTheme.id, dailySeed, today);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in pb-24 md:pb-12">
      {/* Title */}
      <div className="text-center max-w-lg mx-auto space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800 text-xs font-bold mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Synchronized Daily Word Search</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
          {t.dailyChallenge}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          One unique handcrafted puzzle every day. Test your skills and maintain your streak!
        </p>
      </div>

      {/* Featured Card */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 p-6 sm:p-8 border border-amber-200/60 dark:border-slate-700/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {formattedToday}
              </span>
              {isCompletedToday && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-display">
              {dailyTheme.name[language]}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {dailyTheme.description[language]} · Medium Difficulty · 10×10 Grid
            </p>

            {isCompletedToday && (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-rose-100 dark:border-slate-700">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>
                  {t.todayBestScore}: <strong className="tabular-nums font-mono text-rose-500">{bestScoreToday} pts</strong>
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLaunchDaily}
            className="self-start sm:self-center shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-200 dark:shadow-none flex items-center gap-2.5 transition-all"
          >
            {isCompletedToday ? (
              <>
                <RotateCcw className="w-5 h-5" />
                <span>Replay Daily</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>{t.playDailyNow}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Streak and Daily Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Streak details */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t.streak}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-slate-800 dark:text-white font-display tabular-nums">
                {stats.currentStreak}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{t.days}</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
              {t.longestStreak}: {stats.longestStreak} {t.days}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <Flame className="w-8 h-8 fill-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Total daily puzzles solved */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Daily Challenge History
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-slate-800 dark:text-white font-display tabular-nums">
                {Object.keys(stats.dailyBestScores).length}
              </span>
              <span className="text-xs text-slate-400 font-semibold">solved</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
              Keep playing every day to grow your streak!
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-slate-800 text-rose-500 flex items-center justify-center">
            <CalendarCheck className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The Daily Challenge resets at midnight every night. Every player around the world receives the exact same puzzle layout for their chosen language. You can replay as many times as you like to beat your personal best time and score!
        </p>
      </div>
    </div>
  );
};
