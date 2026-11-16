import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeft,
  ArrowUp,
  ArrowDownLeft,
  ArrowUpLeft,
  List,
  X,
} from 'lucide-react';
import { PlacedWord } from '../utils/wordSearchGenerator';
import { getWordColor } from '../utils/pastelColors';
import { Language } from '../data/words';
import { getUIText } from '../utils/translations';
import { soundManager } from '../utils/sound';

interface WordListProps {
  placedWords: PlacedWord[];
  language: Language;
  darkMode: boolean;
  onRevealWordHint: (word: PlacedWord) => void;
  revealedWordHints: Set<string>;
  isMobileOpen?: boolean;
  onToggleMobileOpen?: () => void;
  onCloseMobile?: () => void;
}

export const WordList: React.FC<WordListProps> = ({
  placedWords,
  language,
  darkMode,
  onRevealWordHint,
  revealedWordHints,
  isMobileOpen: externalIsMobileOpen,
  onToggleMobileOpen: externalToggle,
  onCloseMobile: externalClose,
}) => {
  const t = getUIText(language);
  const [internalIsMobileOpen, setInternalIsMobileOpen] = useState(false);
  const stationaryCardRef = useRef<HTMLDivElement>(null);
  const [isStationaryVisible, setIsStationaryVisible] = useState(false);

  // Monitor when the stationary bottom card enters/leaves the mobile viewport
  useEffect(() => {
    const el = stationaryCardRef.current;
    if (!el) return;

    const checkVisibility = () => {
      if (!stationaryCardRef.current) return;
      const rect = stationaryCardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // When the top of stationary card is within viewport (with a 50px buffer) and bottom > 0
      const inView = rect.top < windowHeight - 50 && rect.bottom > 20;
      setIsStationaryVisible(inView);
      if (inView) {
        if (externalClose) {
          externalClose();
        } else {
          setInternalIsMobileOpen(false);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        setIsStationaryVisible(isVisible);
        if (isVisible) {
          if (externalClose) {
            externalClose();
          } else {
            setInternalIsMobileOpen(false);
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.05, 0.1, 0.25],
      }
    );

    observer.observe(el);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [externalClose]);

  // Support controlled or uncontrolled mobile open state
  const isMobileOpen =
    externalIsMobileOpen !== undefined ? externalIsMobileOpen : internalIsMobileOpen;
  const toggleMobileOpen = () => {
    soundManager.playClick();
    if (externalToggle) {
      externalToggle();
    } else {
      setInternalIsMobileOpen((prev) => !prev);
    }
  };
  const closeMobile = () => {
    soundManager.playClick();
    if (externalClose) {
      externalClose();
    } else {
      setInternalIsMobileOpen(false);
    }
  };

  const foundCount = placedWords.filter((w) => w.found).length;
  const totalCount = placedWords.length;
  const remainingCount = totalCount - foundCount;

  const getDirectionIcon = (dir: [number, number]) => {
    const [dr, dc] = dir;
    if (dr === 0 && dc === 1) return <ArrowRight className="w-3.5 h-3.5" />;
    if (dr === 0 && dc === -1) return <ArrowLeft className="w-3.5 h-3.5" />;
    if (dr === 1 && dc === 0) return <ArrowDown className="w-3.5 h-3.5" />;
    if (dr === -1 && dc === 0) return <ArrowUp className="w-3.5 h-3.5" />;
    if (dr === 1 && dc === 1) return <ArrowDownRight className="w-3.5 h-3.5" />;
    if (dr === -1 && dc === -1) return <ArrowUpLeft className="w-3.5 h-3.5" />;
    if (dr === 1 && dc === -1) return <ArrowDownLeft className="w-3.5 h-3.5" />;
    if (dr === -1 && dc === 1) return <ArrowUpRight className="w-3.5 h-3.5" />;
    return null;
  };

  const renderWordPills = (isTransparentMobile = false) => (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {placedWords.map((pw) => {
        const palette = getWordColor(pw.colorIndex);
        const isRevealedHint = revealedWordHints.has(pw.word);

        if (pw.found) {
          return (
            <div
              key={pw.word}
              style={{
                backgroundColor: darkMode
                  ? isTransparentMobile ? 'rgba(131, 24, 67, 0.5)' : palette.bgDark
                  : isTransparentMobile ? 'rgba(255, 228, 232, 0.65)' : palette.bgLight,
                borderColor: darkMode ? palette.borderDark : palette.borderLight,
                color: darkMode ? palette.textDark : palette.textLight,
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold tracking-wider line-through opacity-85 scale-[0.98] transition-all"
            >
              <Check className="w-3 h-3 shrink-0 stroke-[3]" />
              <span>{pw.word}</span>
            </div>
          );
        }

        return (
          <button
            key={pw.word}
            onClick={() => {
              soundManager.playClick();
              onRevealWordHint(pw);
            }}
            className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold tracking-wide transition-all ${
              isRevealedHint
                ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : isTransparentMobile
                ? 'bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:bg-white/80 active:scale-95'
                : 'bg-rose-50/50 dark:bg-slate-800/80 border-rose-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-rose-100/60 dark:hover:bg-slate-700 active:scale-95'
            }`}
            title="Tap for word direction clue"
          >
            <span>{pw.word}</span>
            {isRevealedHint ? (
              <span className="text-amber-500 dark:text-amber-400" title="Direction clue">
                {getDirectionIcon(pw.direction)}
              </span>
            ) : (
              <HelpCircle className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-rose-500 transition-colors" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 1. MOBILE ONLY: Transparent Floating Round Icon Button & Collapsible Word Hunt */}
      <div className="lg:hidden">
        {/* Floating icon button container: disappears when scrolled down to the stationary list, reappears when back at crossword */}
        <div
          className={`fixed right-3 bottom-20 z-30 transition-all duration-300 ease-in-out ${
            isStationaryVisible
              ? 'opacity-0 pointer-events-none scale-75 translate-y-3'
              : 'opacity-100 pointer-events-auto scale-100 translate-y-0'
          }`}
        >
          <button
            type="button"
            onClick={toggleMobileOpen}
            className="w-11 h-11 rounded-full bg-white/20 dark:bg-slate-900/30 backdrop-blur-xs border border-rose-300/40 dark:border-slate-700/40 shadow-sm flex items-center justify-center text-rose-500 dark:text-rose-400 hover:scale-105 active:scale-90 transition-all"
            aria-label="View words to find"
            title="View words to find"
          >
            <List className="w-5 h-5" />
            {remainingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {remainingCount}
              </span>
            )}
          </button>
        </div>

        {/* Transparent Floating Words Hunt Card (No opaque background, auto-collapses on crossword touch or scroll) */}
        {isMobileOpen && !isStationaryVisible && (
          <div className="fixed right-3 bottom-32 max-w-[270px] sm:max-w-xs z-30 bg-white/35 dark:bg-slate-900/45 backdrop-blur-md border border-white/40 dark:border-slate-700/40 rounded-3xl p-3 shadow-xl flex flex-col transition-all duration-200 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-rose-200/40 dark:border-slate-700/40 mb-2">
              <div className="flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {t.wordsToFind}
                </h4>
                <span className="text-[10px] font-bold text-rose-500 bg-white/50 dark:bg-slate-800/60 px-1.5 py-0.2 rounded-full tabular-nums">
                  {foundCount}/{totalCount}
                </span>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                aria-label="Close words popup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Transparent Word Pills */}
            <div className="max-h-48 overflow-y-auto pr-1">
              {renderWordPills(true)}
            </div>

            <p className="text-[9px] text-slate-500 dark:text-slate-400 text-center mt-2 pt-1 border-t border-rose-200/30 dark:border-slate-700/30">
              Swiping the crossword automatically closes this
            </p>
          </div>
        )}
      </div>

      {/* 2. STATIONARY CARD: Stays permanently at the bottom on mobile (in document flow) and on the right column on desktop */}
      <div
        id="stationary-word-list"
        ref={stationaryCardRef}
        className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-rose-100 dark:border-slate-800 shadow-sm transition-colors mt-3 lg:mt-0"
      >
        {/* Mobile Quick Jump Back to Crossword Button */}
        <div className="block lg:hidden mb-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2 px-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{t.jumpToGrid || 'Back to Crossword'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-rose-500 shrink-0" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.wordsToFind}
            </h3>
          </div>
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-rose-100 dark:border-slate-700 tabular-nums">
            {foundCount}/{totalCount}
          </span>
        </div>

        {renderWordPills(false)}

        {/* Mobile helper indicator with one-tap return */}
        <div className="block lg:hidden mt-4 pt-3 text-center border-t border-rose-100/60 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 flex items-center justify-center gap-1.5 mx-auto active:scale-95 transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{t.jumpToGrid || 'Back to Crossword'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
