import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Pause,
  Play,
  RotateCcw,
  Lightbulb,
  Clock,
  Trophy,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  LogOut,
  Flame,
} from 'lucide-react';
import { Difficulty, Language, THEMES } from '../data/words';
import {
  GeneratedPuzzle,
  PlacedWord,
  generatePuzzle,
  DIFFICULTY_CONFIG,
} from '../utils/wordSearchGenerator';
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { VictoryModal } from './VictoryModal';
import { ThemeIcon } from './ThemeIcon';
import { getUIText } from '../utils/translations';
import {
  LevelInfo,
  calculateLevelFromXp,
  recordGameCompletion,
  applyEarlyExitPenalty,
} from '../utils/storage';
import { soundManager } from '../utils/sound';
import { Screen } from './Navbar';

interface CoreGameScreenProps {
  themeId: string;
  language: Language;
  difficulty: Difficulty;
  isDaily: boolean;
  dailySeed?: number;
  dailyDate?: string;
  darkMode: boolean;
  onBackToHome: () => void;
  onRefreshStats: () => void;
  exitRequestedScreen?: Screen | null;
  onCancelExitRequest?: () => void;
  onConfirmExit?: (targetScreen: Screen) => void;
  onDirectNavigate?: (targetScreen: Screen) => void;
}

export const CoreGameScreen: React.FC<CoreGameScreenProps> = ({
  themeId,
  language,
  difficulty,
  isDaily,
  dailySeed,
  dailyDate,
  darkMode,
  onBackToHome,
  onRefreshStats,
  exitRequestedScreen = null,
  onCancelExitRequest,
  onConfirmExit,
  onDirectNavigate,
}) => {
  const t = getUIText(language);

  // Puzzle state
  const [puzzle, setPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAwayPaused, setIsAwayPaused] = useState<boolean>(false);
  const [localExitTarget, setLocalExitTarget] = useState<Screen | null>(null);
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);
  const [revealedWordHints, setRevealedWordHints] = useState<Set<string>>(new Set());
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [showConfirmNew, setShowConfirmNew] = useState<boolean>(false);

  // Mobile words list collapsible state
  const [isMobileWordListOpen, setIsMobileWordListOpen] = useState<boolean>(false);

  // Completion state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(0);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    level: 1,
    currentLevelXp: 0,
    xpForNextLevel: 100,
    progressPercent: 0,
    totalXp: 0,
  });
  const [leveledUp, setLeveledUp] = useState<boolean>(false);

  // Active dedication modal is shown ONLY if game is NOT completed and user went away or attempted navigation
  const showDedicationModal = Boolean(
    !isCompleted && (isAwayPaused || exitRequestedScreen !== null || localExitTarget !== null)
  );

  const onCancelExitRequestRef = useRef(onCancelExitRequest);
  useEffect(() => {
    onCancelExitRequestRef.current = onCancelExitRequest;
  }, [onCancelExitRequest]);

  // Initialize or re-generate puzzle
  const initPuzzle = useCallback(
    (customSeed?: number) => {
      const generated = generatePuzzle(themeId, language, difficulty, customSeed);
      setPuzzle(generated);
      setScore(0);
      setTimeSeconds(0);
      setIsPaused(false);
      setIsAwayPaused(false);
      setLocalExitTarget(null);
      setHintCell(null);
      setRevealedWordHints(new Set());
      setEncouragement(null);
      setIsCompleted(false);
      setShowConfirmNew(false);
      setIsMobileWordListOpen(false);
      onCancelExitRequestRef.current?.();
    },
    [themeId, language, difficulty]
  );

  // Run initial puzzle generation on mount or when core session parameters change
  useEffect(() => {
    initPuzzle(dailySeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId, language, difficulty, dailySeed]);

  // When exitRequestedScreen prop arrives, pause immediately only if game is still active
  useEffect(() => {
    if (exitRequestedScreen && !isCompleted) {
      setIsPaused(true);
    }
  }, [exitRequestedScreen, isCompleted]);

  // Intercept tab switching, minimizing, or switching apps
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (!isCompleted) {
          setIsPaused(true);
          setIsAwayPaused(true);
        }
      }
    };

    const handleWindowBlur = () => {
      if (!isCompleted) {
        setIsPaused(true);
        setIsAwayPaused(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isCompleted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isCompleted]);

  // Timer loop
  useEffect(() => {
    if (isPaused || isAwayPaused || showDedicationModal || isCompleted || !puzzle) return;

    const timer = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isAwayPaused, showDedicationModal, isCompleted, puzzle]);

  // Handle word found
  const handleWordFound = (wordText: string) => {
    if (!puzzle || isCompleted) return;

    soundManager.playWordFound();
    soundManager.triggerVibrate([50, 40, 80]);

    // Points calculation for word
    const config = DIFFICULTY_CONFIG[difficulty];
    const pointsForWord = config.pointsPerWord;
    setScore((prev) => prev + pointsForWord);

    // Random encouraging message
    const msg =
      t.encouragements[Math.floor(Math.random() * t.encouragements.length)];
    setEncouragement(msg);
    setTimeout(() => {
      setEncouragement(null);
    }, 1800);

    // Clear active hint if this word had the hint cell
    setHintCell(null);

    // Update placed words state
    const updatedPlacedWords = puzzle.placedWords.map((pw) => {
      if (pw.word === wordText) {
        return { ...pw, found: true };
      }
      return pw;
    });

    const updatedPuzzle = {
      ...puzzle,
      placedWords: updatedPlacedWords,
    };
    setPuzzle(updatedPuzzle);

    // Check if all words found
    const remaining = updatedPlacedWords.filter((pw) => !pw.found);
    if (remaining.length === 0) {
      handleCompleteGame(updatedPuzzle);
    }
  };

  // Complete game handler
  const handleCompleteGame = (completedPuzzle: GeneratedPuzzle) => {
    setIsCompleted(true);
    setIsPaused(false);
    setIsAwayPaused(false);
    setLocalExitTarget(null);
    setIsMobileWordListOpen(false);
    if (onCancelExitRequest) {
      onCancelExitRequest();
    }

    const config = DIFFICULTY_CONFIG[difficulty];

    const completionBonus = 100;
    const speedBonus = Math.max(0, 100 - Math.floor(Math.max(0, timeSeconds - 30) / 4));
    const totalFinalScore = score + config.pointsPerWord + completionBonus + speedBonus;
    setFinalScore(totalFinalScore);
    setFinalTime(timeSeconds);

    const totalXp = config.baseXP + Math.floor(speedBonus / 2);
    setXpEarned(totalXp);

    const result = recordGameCompletion({
      themeId,
      language,
      difficulty,
      score: totalFinalScore,
      wordsFound: completedPuzzle.placedWords.length,
      totalWords: completedPuzzle.placedWords.length,
      timeSeconds,
      xpEarned: totalXp,
      mode: isDaily ? 'daily' : 'standard',
      dailyDate,
    });

    const latestLevel = calculateLevelFromXp(result.updatedStats.totalXP);
    setLevelInfo(latestLevel);
    setLeveledUp(result.leveledUp);
    onRefreshStats();
  };

  // Resume game from dedication modal
  const handleResumeGame = () => {
    soundManager.playClick();
    setIsPaused(false);
    setIsAwayPaused(false);
    setLocalExitTarget(null);
    if (onCancelExitRequest) {
      onCancelExitRequest();
    }
  };

  // End session manually with penalty deduction (-50 pts)
  const handleEndSessionWithPenalty = () => {
    soundManager.playClick();
    applyEarlyExitPenalty(50);
    onRefreshStats();

    const target = exitRequestedScreen || localExitTarget || 'home';
    if (onConfirmExit) {
      onConfirmExit(target);
    } else if (onDirectNavigate) {
      onDirectNavigate(target);
    } else {
      onBackToHome();
    }
  };

  // User clicked top HUD back button
  const handleTriggerBack = () => {
    soundManager.playClick();
    if (isCompleted) {
      // Completed puzzle: directly go home without penalty
      if (onDirectNavigate) {
        onDirectNavigate('home');
      } else {
        onBackToHome();
      }
    } else {
      // Active puzzle: trigger dedication pause
      setIsPaused(true);
      setLocalExitTarget('home');
    }
  };

  // Victory modal: Replay puzzle cleanly
  const handlePlayAgainFromVictory = () => {
    soundManager.playClick();
    setIsCompleted(false);
    setIsPaused(false);
    setIsAwayPaused(false);
    setLocalExitTarget(null);
    if (onCancelExitRequest) {
      onCancelExitRequest();
    }
    initPuzzle();
  };

  // Victory modal: Direct back to home cleanly
  const handleBackToHomeFromVictory = () => {
    soundManager.playClick();
    setIsCompleted(false);
    setIsPaused(false);
    setIsAwayPaused(false);
    setLocalExitTarget(null);
    if (onCancelExitRequest) {
      onCancelExitRequest();
    }
    if (onDirectNavigate) {
      onDirectNavigate('home');
    } else {
      onBackToHome();
    }
  };

  // Hint button clicked
  const handleUseHint = () => {
    if (!puzzle || isCompleted || isPaused) return;

    const unfoundWords = puzzle.placedWords.filter((pw) => !pw.found);
    if (unfoundWords.length === 0) return;

    soundManager.playHintSound();
    soundManager.triggerVibrate(30);

    setScore((prev) => Math.max(0, prev - 20));

    const targetWord = unfoundWords[0];
    setHintCell({ row: targetWord.startRow, col: targetWord.startCol });

    setRevealedWordHints((prev) => {
      const next = new Set(prev);
      next.add(targetWord.word);
      return next;
    });

    setTimeout(() => {
      setHintCell(null);
    }, 6000);
  };

  // Word orientation reveal clicked directly on word pill
  const handleRevealWordHint = (word: PlacedWord) => {
    if (!revealedWordHints.has(word.word)) {
      setRevealedWordHints((prev) => {
        const next = new Set(prev);
        next.add(word.word);
        return next;
      });
      soundManager.playHintSound();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${String(rem).padStart(2, '0')}`;
  };

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
      </div>
    );
  }

  const currentTheme = THEMES.find((th) => th.id === themeId);
  const foundCount = puzzle.placedWords.filter((w) => w.found).length;
  const totalCount = puzzle.placedWords.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 animate-fade-in pb-28 lg:pb-10 relative">
      {/* Top Game Bar HUD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-rose-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors">
        {/* Row 1 on Mobile / Zone 1 & 2 on Desktop */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
          {/* Back Button & Theme Info */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={handleTriggerBack}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors shrink-0"
              title={t.backToHome}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-500 flex items-center justify-center shrink-0">
              <ThemeIcon
                iconName={currentTheme?.icon || 'Sparkles'}
                className="w-4 h-4"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                {currentTheme?.name[language]}
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <span className="uppercase">{language}</span>
                <span>·</span>
                <span className="capitalize">{difficulty}</span>
              </div>
            </div>
          </div>

          {/* Timer & Score on Mobile (Right of Row 1) */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-100 dark:border-sky-900/50">
              <Clock className="w-3 h-3" />
              <span className="tabular-nums font-mono">{formatTime(timeSeconds)}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-100 dark:border-amber-900/50">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span className="tabular-nums">{score}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Progress (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-100 dark:border-sky-900/50">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums font-mono">{formatTime(timeSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-100 dark:border-amber-900/50">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums">{score}</span>
          </div>
        </div>

        {/* Desktop Controls (Hint, Pause, New) */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleUseHint}
            className="p-2 rounded-xl text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition-colors flex items-center gap-1"
            title={`${t.hint} (-20 pts)`}
          >
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold hidden md:inline">{t.hint}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsPaused((prev) => !prev);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={isPaused ? t.resume : t.pause}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowConfirmNew(true);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={t.newPuzzle}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Row 2: Prominent, Thumb-Friendly Action Bar */}
        <div className="flex sm:hidden items-center gap-2 pt-2 border-t border-rose-100/60 dark:border-slate-800 w-full">
          {/* Mobile Big Pause Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsPaused((prev) => !prev);
            }}
            className="flex-1 min-h-[42px] px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200/80 dark:border-slate-700 active:scale-95 transition-all shadow-xs"
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{t.resume}</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>{t.pause}</span>
              </>
            )}
          </button>

          {/* Mobile Hint Button */}
          <button
            onClick={handleUseHint}
            className="flex-1 min-h-[42px] px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-200/80 dark:border-amber-800/60 active:scale-95 transition-all shadow-xs"
            title={`${t.hint} (-20 pts)`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{t.hint} (-20)</span>
          </button>

          {/* Mobile New Puzzle Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowConfirmNew(true);
            }}
            className="min-h-[42px] w-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center active:scale-95 transition-all shadow-xs shrink-0"
            title={t.newPuzzle}
            aria-label="Generate new puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Encouragement Toast */}
      {encouragement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-scale-in">
          <div className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-sm shadow-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>{encouragement}</span>
          </div>
        </div>
      )}

      {/* Main Game Arena: Grid and Word List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Interactive Grid (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <WordGrid
            grid={puzzle.grid}
            size={puzzle.size}
            placedWords={puzzle.placedWords}
            onWordFound={handleWordFound}
            hintCell={hintCell}
            darkMode={darkMode}
            onGridTouch={() => setIsMobileWordListOpen(false)}
            language={language}
          />
        </div>

        {/* Right Column: Words to Find List (4 cols on desktop) */}
        <div className="lg:col-span-4 w-full">
          <WordList
            placedWords={puzzle.placedWords}
            language={language}
            darkMode={darkMode}
            onRevealWordHint={handleRevealWordHint}
            revealedWordHints={revealedWordHints}
            isMobileOpen={isMobileWordListOpen}
            onToggleMobileOpen={() => setIsMobileWordListOpen((prev) => !prev)}
            onCloseMobile={() => setIsMobileWordListOpen(false)}
          />
        </div>
      </div>

      {/* 1. Dedicated Active Session Pause & Penalty Modal (When user navigates away or switches apps) */}
      {showDedicationModal && !isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-200 dark:border-slate-800 text-center space-y-4 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500" />

            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center shadow-xs">
              <Flame className="w-7 h-7 fill-amber-500 animate-pulse" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-display">
                {isAwayPaused ? t.gamePausedAwayTitle : t.activeHuntTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {t.activeHuntDesc}
              </p>
            </div>

            {/* Dedication Penalty Alert Box */}
            <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-left flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {t.penaltyNotice}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Finish this puzzle to preserve your streak and gain XP.
                </p>
              </div>
            </div>

            {/* Session Snapshot Stats */}
            <div className="grid grid-cols-3 gap-2 py-1 text-left">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t.wordsFound}
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white tabular-nums">
                  {foundCount}/{totalCount}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t.time}
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white font-mono tabular-nums">
                  {formatTime(timeSeconds)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <span className="text-[10px] font-bold text-rose-500 block uppercase">
                  Penalty
                </span>
                <span className="text-sm font-black text-rose-500 tabular-nums">
                  -50 pts
                </span>
              </div>
            </div>

            {/* Actions: Resume (Dedicated) vs End Session (Penalized) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleResumeGame}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-pink-600 active:scale-98 text-white font-black text-sm shadow-lg shadow-rose-200 dark:shadow-none flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.resumeHunt}</span>
              </button>

              <button
                type="button"
                onClick={handleEndSessionWithPenalty}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.endSessionPenalty}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Simple Pause Overlay (When player manually tapped Pause in HUD and hasn't completed or navigated away) */}
      {isPaused && !showDedicationModal && !isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-rose-100 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-slate-800 text-rose-500 mx-auto flex items-center justify-center">
              <Pause className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white font-display">
                {t.gamePaused}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.tapToResume}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.resume}</span>
              </button>
              <button
                onClick={handleEndSessionWithPenalty}
                className="w-full py-2 px-3 rounded-2xl text-slate-500 hover:text-rose-600 text-xs font-semibold"
              >
                {t.endSessionPenalty}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Confirm New Puzzle Modal */}
      {showConfirmNew && !isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-rose-100 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white font-display">
                {t.newPuzzle}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Abandoning this hunt to start a new one will apply a 50 points dedication penalty.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  applyEarlyExitPenalty(50);
                  onRefreshStats();
                  initPuzzle();
                }}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md"
              >
                Yes, New (-50 pts)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowConfirmNew(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Victory Modal */}
      {isCompleted && (
        <VictoryModal
          score={finalScore}
          timeSeconds={finalTime}
          wordsFound={totalCount}
          totalWords={totalCount}
          xpEarned={xpEarned}
          levelInfo={levelInfo}
          leveledUp={leveledUp}
          language={language}
          onPlayAgain={handlePlayAgainFromVictory}
          onBackToHome={handleBackToHomeFromVictory}
        />
      )}
    </div>
  );
};
