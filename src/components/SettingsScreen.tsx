import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  Moon,
  Sun,
  Globe,
  Trash2,
  Info,
  Check,
  AlertTriangle,
  Heart,
  Sparkles,
} from 'lucide-react';
import { Language } from '../data/words';
import { getUIText } from '../utils/translations';
import { PlayerSettings } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface SettingsScreenProps {
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  onResetProgress: () => void;
  language: Language;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  language,
}) => {
  const t = getUIText(language);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    soundManager.setSoundEnabled(next);
    if (next) soundManager.playClick();
    onUpdateSettings({ soundEnabled: next });
  };

  const handleToggleMusic = () => {
    const next = !settings.musicEnabled;
    soundManager.setMusicEnabled(next);
    soundManager.playClick();
    onUpdateSettings({ musicEnabled: next });
  };

  const handleToggleVibration = () => {
    const next = !settings.vibrationEnabled;
    if (next) soundManager.triggerVibrate(40);
    soundManager.playClick();
    onUpdateSettings({ vibrationEnabled: next });
  };

  const handleToggleDarkMode = () => {
    soundManager.playClick();
    onUpdateSettings({ darkMode: !settings.darkMode });
  };

  const handleLanguageSelect = (lang: Language) => {
    soundManager.playClick();
    onUpdateSettings({ preferredLanguage: lang });
  };

  const confirmReset = () => {
    soundManager.playClick();
    onResetProgress();
    setShowConfirmReset(false);
    setResetDone(true);
    setTimeout(() => {
      setResetDone(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in pb-24 md:pb-12">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
          {t.settings}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize audio, appearance, language, and game preferences
        </p>
      </div>

      {resetDone && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{t.resetSuccess}</span>
        </div>
      )}

      {/* Language Preference Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-rose-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t.selectLanguage}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleLanguageSelect('ms')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
              language === 'ms'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/20'
                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                Bahasa Melayu
              </h4>
              <span className="text-[10px] text-slate-400">Kosa kata Melayu</span>
            </div>
            {language === 'ms' && (
              <Check className="w-4 h-4 text-rose-500 stroke-[3]" />
            )}
          </button>

          <button
            onClick={() => handleLanguageSelect('en')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
              language === 'en'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/20'
                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                English
              </h4>
              <span className="text-[10px] text-slate-400">English vocabulary</span>
            </div>
            {language === 'en' && (
              <Check className="w-4 h-4 text-rose-500 stroke-[3]" />
            )}
          </button>
        </div>
      </div>

      {/* Audio & Haptic Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-rose-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Audio & Feedback
        </h3>

        {/* Sound Effects */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-500 flex items-center justify-center">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {t.soundEffects}
              </h4>
              <p className="text-[11px] text-slate-400">Chimes, bells, and letter touches</p>
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.soundEnabled ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Ambient Music */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-500 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {t.ambientMusic}
              </h4>
              <p className="text-[11px] text-slate-400">Gentle relaxing background melody</p>
            </div>
          </div>
          <button
            onClick={handleToggleMusic}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.musicEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Vibration / Haptics */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-500 flex items-center justify-center">
              <Vibrate className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {t.vibration}
              </h4>
              <p className="text-[11px] text-slate-400">Haptic feedback on supported mobile devices</p>
            </div>
          </div>
          <button
            onClick={handleToggleVibration}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.vibrationEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Visual Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-rose-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {t.appearance}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => settings.darkMode && handleToggleDarkMode()}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              !settings.darkMode
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                {t.lightMode}
              </h4>
              <span className="text-[10px] text-slate-400">Soft pastel tones</span>
            </div>
          </button>

          <button
            onClick={() => !settings.darkMode && handleToggleDarkMode()}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              settings.darkMode
                ? 'bg-slate-800 border-rose-400 ring-2 ring-rose-400/20'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                {t.darkMode}
              </h4>
              <span className="text-[10px] text-slate-400">Gentle night theme</span>
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-rose-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">
              {t.resetProgress}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Clear all player XP, levels, and puzzle history
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              setShowConfirmReset(true);
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-3xl bg-rose-50/50 dark:bg-slate-800/40 p-5 border border-rose-100 dark:border-slate-800 text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-300 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">
          Word Hunt
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {t.aboutText}
        </p>
        <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>by Evalia Syah for word lovers everywhere.</span>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-rose-100 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white font-display">
                {t.resetProgress}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.resetConfirm}
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={confirmReset}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
