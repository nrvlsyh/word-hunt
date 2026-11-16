/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, Screen } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { GameSetupScreen } from './components/GameSetupScreen';
import { CoreGameScreen } from './components/CoreGameScreen';
import { DailyChallengeScreen } from './components/DailyChallengeScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Difficulty, Language } from './data/words';
import {
  PlayerSettings,
  PlayerStats,
  calculateLevelFromXp,
  loadSettings,
  loadStats,
  resetAllStats,
  saveSettings,
} from './utils/storage';
import { soundManager } from './utils/sound';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  // Global player state
  const [stats, setStats] = useState<PlayerStats>(() => loadStats());
  const [settings, setSettings] = useState<PlayerSettings>(() => loadSettings());
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Intercept navigation during active word hunt
  const [pendingExitScreen, setPendingExitScreen] = useState<Screen | null>(null);
  const [penaltyToast, setPenaltyToast] = useState<string | null>(null);

  // Game session parameters
  const [gameThemeId, setGameThemeId] = useState<string>('animals');
  const [gameLanguage, setGameLanguage] = useState<Language>(settings.preferredLanguage);
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>('medium');
  const [isDailySession, setIsDailySession] = useState<boolean>(false);
  const [dailySeed, setDailySeed] = useState<number | undefined>(undefined);
  const [dailyDate, setDailyDate] = useState<string | undefined>(undefined);

  // Sync settings with DOM and sound engine
  useEffect(() => {
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setMusicEnabled(settings.musicEnabled);

    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Refresh stats helper
  const handleRefreshStats = useCallback(() => {
    setStats(loadStats());
  }, []);

  // Update settings helper
  const handleUpdateSettings = (newPartial: Partial<PlayerSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      saveSettings(updated);
      return updated;
    });

    if (newPartial.preferredLanguage) {
      setGameLanguage(newPartial.preferredLanguage);
    }
  };

  // Reset player progress
  const handleResetProgress = () => {
    resetAllStats();
    setStats(loadStats());
  };

  // Intercept navigation if in active game session
  const handleNavigation = (targetScreen: Screen) => {
    if (currentScreen === 'game') {
      if (targetScreen === 'game') return;
      // In active game: pause and request confirmation
      setPendingExitScreen(targetScreen);
    } else {
      setCurrentScreen(targetScreen);
    }
  };

  // Launch custom game
  const handleStartCustomGame = (themeId: string, lang: Language, diff: Difficulty) => {
    setGameThemeId(themeId);
    setGameLanguage(lang);
    setGameDifficulty(diff);
    setIsDailySession(false);
    setDailySeed(undefined);
    setDailyDate(undefined);
    setPendingExitScreen(null);
    setCurrentScreen('game');
  };

  // Launch daily challenge
  const handleStartDailyChallenge = (themeId: string, seed: number, dateStr: string) => {
    setGameThemeId(themeId);
    setGameLanguage(settings.preferredLanguage);
    setGameDifficulty('medium'); // Daily challenge standard difficulty is Medium
    setIsDailySession(true);
    setDailySeed(seed);
    setDailyDate(dateStr);
    setPendingExitScreen(null);
    setCurrentScreen('game');
  };

  // Quick Play handler from Home Screen
  const handleQuickPlay = () => {
    handleNavigation('setup');
  };

  const handleCancelExitRequest = useCallback(() => {
    setPendingExitScreen(null);
  }, []);

  const handleDirectNavigate = useCallback((target: Screen) => {
    setPendingExitScreen(null);
    setCurrentScreen(target);
  }, []);

  const handleConfirmExit = useCallback((target: Screen) => {
    setPendingExitScreen(null);
    setPenaltyToast(
      settings.preferredLanguage === 'ms'
        ? 'Penalti dedikasi ditolak: -50 mata'
        : 'Dedication penalty applied: -50 pts'
    );
    setTimeout(() => setPenaltyToast(null), 3500);
    setCurrentScreen(target);
  }, [settings.preferredLanguage]);

  const levelInfo = calculateLevelFromXp(stats.totalXP);

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/30 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Dedication Penalty Toast Notification */}
      {penaltyToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className="px-4 py-2 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{penaltyToast}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
        language={settings.preferredLanguage}
        onLanguageChange={(lang) => handleUpdateSettings({ preferredLanguage: lang })}
        levelInfo={levelInfo}
        streak={stats.currentStreak}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
        }
        darkMode={settings.darkMode}
        onToggleDarkMode={() =>
          handleUpdateSettings({ darkMode: !settings.darkMode })
        }
      />

      {/* Main Screen Container */}
      <main className="flex-1 w-full">
        {currentScreen === 'home' && (
          <HomeScreen
            language={settings.preferredLanguage}
            stats={stats}
            levelInfo={levelInfo}
            onPlayNow={handleQuickPlay}
            onPlayDaily={() => handleNavigation('daily')}
            onNavigateToStats={() => handleNavigation('stats')}
          />
        )}

        {currentScreen === 'setup' && (
          <GameSetupScreen
            initialLanguage={settings.preferredLanguage}
            onStartGame={handleStartCustomGame}
            onCancel={() => handleNavigation('home')}
          />
        )}

        {currentScreen === 'game' && (
          <CoreGameScreen
            themeId={gameThemeId}
            language={gameLanguage}
            difficulty={gameDifficulty}
            isDaily={isDailySession}
            dailySeed={dailySeed}
            dailyDate={dailyDate}
            darkMode={settings.darkMode}
            onBackToHome={() => handleDirectNavigate('home')}
            onDirectNavigate={handleDirectNavigate}
            onRefreshStats={handleRefreshStats}
            exitRequestedScreen={pendingExitScreen}
            onCancelExitRequest={handleCancelExitRequest}
            onConfirmExit={handleConfirmExit}
          />
        )}

        {currentScreen === 'daily' && (
          <DailyChallengeScreen
            language={settings.preferredLanguage}
            stats={stats}
            onStartDaily={handleStartDailyChallenge}
          />
        )}

        {currentScreen === 'stats' && (
          <StatisticsScreen
            language={settings.preferredLanguage}
            stats={stats}
            levelInfo={levelInfo}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            language={settings.preferredLanguage}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-rose-100/60 dark:border-slate-800/60 pb-24 md:pb-6">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span>Made with</span>
          <span className="text-rose-500 animate-pulse">❤️</span>
          <span>by</span>
          <strong className="text-slate-800 dark:text-slate-200 font-bold tracking-wide">Evalia Syah</strong>
        </p>
      </footer>
    </div>
  );
}
