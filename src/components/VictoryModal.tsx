import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, CheckCircle2, Zap, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Language } from '../data/words';
import { getUIText } from '../utils/translations';
import { LevelInfo } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface VictoryModalProps {
  score: number;
  timeSeconds: number;
  wordsFound: number;
  totalWords: number;
  xpEarned: number;
  levelInfo: LevelInfo;
  leveledUp: boolean;
  language: Language;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  timeSeconds,
  wordsFound,
  totalWords,
  xpEarned,
  levelInfo,
  leveledUp,
  language,
  onPlayAgain,
  onBackToHome,
}) => {
  const t = getUIText(language);

  // Trigger celebratory confetti on mount
  useEffect(() => {
    soundManager.playVictory();
    if (leveledUp) {
      setTimeout(() => {
        soundManager.playLevelUp();
      }, 700);
    }

    try {
      // Pastel confetti burst
      const colors = ['#FDA4AF', '#C4B5FD', '#7DD3FC', '#6EE7B7', '#FDE68A', '#FDBA74'];
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 300);

      return () => clearTimeout(timer);
    } catch {
      // Confetti fallback
    }
  }, [leveledUp]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  const accuracy = Math.round((wordsFound / Math.max(1, totalWords)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-slate-800 text-center relative overflow-hidden transition-all scale-100">
        {/* Decorative pastel gradient top banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-rose-400 via-pink-400 via-purple-400 to-amber-300" />

        {/* Level Up Banner if leveled up */}
        {leveledUp && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold text-xs shadow-md animate-bounce">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>
              {t.levelUp} {t.level} {levelInfo.level}!
            </span>
          </div>
        )}

        {/* Victory Icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-none">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
          {t.puzzleCompleted}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 mb-5">
          {t.congratulations}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.scoreEarned}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white tabular-nums mt-0.5 font-display">
              +{score}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.timeTaken}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white tabular-nums mt-0.5 font-display">
              {formatTime(timeSeconds)}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.wordsFound}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white tabular-nums mt-0.5 font-display">
              {wordsFound}/{totalWords}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.xpGained}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white tabular-nums mt-0.5 font-display">
              +{xpEarned} {t.xp}
            </p>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>
              {t.level} {levelInfo.level}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium tabular-nums">
              {levelInfo.currentLevelXp} / {levelInfo.xpForNextLevel} XP
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-rose-200 dark:shadow-none flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.playAgain}</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToHome();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
