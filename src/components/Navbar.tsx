import React from 'react';
import {
  Home,
  Play,
  Calendar,
  BarChart2,
  Settings,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import { Language } from '../data/words';
import { getUIText } from '../utils/translations';
import { LevelInfo } from '../utils/storage';
import { soundManager } from '../utils/sound';

export type Screen = 'home' | 'setup' | 'game' | 'daily' | 'stats' | 'settings';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  levelInfo: LevelInfo;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  language,
  onLanguageChange,
  levelInfo,
  streak,
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleDarkMode,
}) => {
  const t = getUIText(language);

  const navItems: { id: Screen; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'setup', label: t.play, icon: Play },
    { id: 'daily', label: t.dailyChallenge, icon: Calendar },
    { id: 'stats', label: t.statistics, icon: BarChart2 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Wordmark */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-xl px-2 py-1 -ml-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white shadow-sm shadow-rose-200 dark:shadow-none">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Word Hunt
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium -mt-1 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-rose-50/70 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-rose-100/80 dark:border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentScreen === item.id ||
                (item.id === 'setup' && currentScreen === 'game');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-100 dark:shadow-none scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-rose-100/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Player Level, Streak & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Streak Indicator */}
            <div
              title={`${streak} ${t.days} ${t.streak}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
              <span className="tabular-nums">{streak}</span>
            </div>

            {/* Level & XP Mini Badge */}
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('stats');
              }}
              title={`${t.level} ${levelInfo.level} · ${levelInfo.currentLevelXp}/${levelInfo.xpForNextLevel} XP`}
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-50 dark:bg-slate-800 border border-rose-200/70 dark:border-slate-700 hover:bg-rose-100/60 dark:hover:bg-slate-700/60 transition-colors"
            >
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Lv.{levelInfo.level}
              </span>
              <div className="w-12 h-2 bg-rose-200/70 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onLanguageChange(language === 'en' ? 'ms' : 'en');
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{language === 'en' ? 'BM' : 'EN'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
              }}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-rose-500" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleDarkMode();
              }}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (thumb friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-rose-100 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'setup' && currentScreen === 'game');
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-transform active:scale-90 ${
                isActive
                  ? 'text-rose-500 dark:text-rose-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-rose-50 dark:bg-slate-800'
                    : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
