import React, { useState } from 'react';
import {
  Play,
  Globe,
  Sliders,
  Sparkles,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Difficulty, Language, THEMES, WORD_DATABASE } from '../data/words';
import { getUIText } from '../utils/translations';
import { ThemeIcon } from './ThemeIcon';
import { soundManager } from '../utils/sound';

interface GameSetupScreenProps {
  initialLanguage: Language;
  onStartGame: (themeId: string, language: Language, difficulty: Difficulty) => void;
  onCancel: () => void;
}

export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  initialLanguage,
  onStartGame,
  onCancel,
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [selectedTheme, setSelectedTheme] = useState<string>('animals');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const t = getUIText(language);

  const difficulties: {
    id: Difficulty;
    name: string;
    sizeDesc: string;
    directionsDesc: string;
    badgeColor: string;
  }[] = [
    {
      id: 'easy',
      name: t.easy,
      sizeDesc: '8 × 8 Grid',
      directionsDesc: t.easyDesc,
      badgeColor: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'medium',
      name: t.medium,
      sizeDesc: '10 × 10 Grid',
      directionsDesc: t.mediumDesc,
      badgeColor: 'border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300',
    },
    {
      id: 'hard',
      name: t.hard,
      sizeDesc: '12 × 12 Grid',
      directionsDesc: t.hardDesc,
      badgeColor: 'border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'expert',
      name: t.expert,
      sizeDesc: '15 × 15 Grid',
      directionsDesc: t.expertDesc,
      badgeColor: 'border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
    },
  ];

  const handleLaunch = () => {
    soundManager.playClick();
    onStartGame(selectedTheme, language, selectedDifficulty);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in pb-24 md:pb-12">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
          {t.customGame}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pick your language, favorite theme, and difficulty level
        </p>
      </div>

      {/* 1. Language Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-rose-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            1. {t.selectLanguage}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          {/* Bahasa Melayu */}
          <button
            onClick={() => {
              soundManager.playClick();
              setLanguage('ms');
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              language === 'ms'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-rose-200'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase">Bahasa</span>
              <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">
                Bahasa Melayu
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Kosa kata tempatan & unik</p>
            </div>
            {language === 'ms' && (
              <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* English */}
          <button
            onClick={() => {
              soundManager.playClick();
              setLanguage('en');
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              language === 'en'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-rose-200'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase">Language</span>
              <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">
                English
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Global vocabulary</p>
            </div>
            {language === 'en' && (
              <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Theme Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-rose-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              2. {t.selectTheme}
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            15 Curated Themes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            const wordCount = WORD_DATABASE[language][theme.id]?.length || 30;

            return (
              <button
                key={theme.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedTheme(theme.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative group ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 shadow-xs ring-2 ring-rose-400/20'
                    : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-rose-200 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-rose-500'
                    }`}
                  >
                    <ThemeIcon iconName={theme.icon} className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                    {theme.name[language]}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    {wordCount} words
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Difficulty Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-rose-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            3. {t.selectDifficulty}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedDifficulty(diff.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? `${diff.badgeColor} ring-2 ring-rose-400/20 shadow-xs`
                    : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {diff.sizeDesc}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white font-display mt-0.5">
                    {diff.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {diff.directionsDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onCancel();
          }}
          className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          {t.backToHome}
        </button>

        <button
          onClick={handleLaunch}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-300/50 dark:shadow-none transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{t.startGame}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
