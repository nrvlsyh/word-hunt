/**
 * Web Audio API Sound and Music Engine
 * Pure synthesized sound effects and gentle ambient music.
 * Zero external audio assets, works completely offline with zero latency.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private musicInterval: number | null = null;
  private musicGainNode: GainNode | null = null;

  constructor() {
    // Sound settings are loaded from storage in App
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  public setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (val) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public getSoundEnabled() {
    return this.soundEnabled;
  }

  public getMusicEnabled() {
    return this.musicEnabled;
  }

  /**
   * Soft UI click
   */
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Sound played when dragging across a letter cell (ascending pitch based on length)
   */
  public playCellHover(index: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Pentatonic scale frequencies starting around C5
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];
    const freq = pentatonic[Math.min(index, pentatonic.length - 1)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Celebratory ascending chime when a word is successfully found
   */
  public playWordFound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // C6 - E6 - G6 - C7 arpeggio
    const notes = [1046.5, 1318.51, 1567.98, 2093.0];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.36);
    });
  }

  /**
   * Hint bell ping
   */
  public playHintSound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now); // A6
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  /**
   * Soft invalid selection boop
   */
  public playInvalid() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Victory fanfare on completing a puzzle
   */
  public playVictory() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },
      { notes: [587.33, 739.99, 880.0], time: 0.2, dur: 0.2 },
      { notes: [659.25, 830.61, 987.77], time: 0.4, dur: 0.2 },
      { notes: [783.99, 1046.5, 1318.51], time: 0.65, dur: 0.7 },
    ];

    chords.forEach((chord) => {
      chord.notes.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + chord.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.09, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + chord.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + chord.dur + 0.05);
      });
    });
  }

  /**
   * Level up fanfare
   */
  public playLevelUp() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.42);
    });
  }

  /**
   * Gentle, relaxing music box ambient melody loop
   */
  private startMusic() {
    this.initContext();
    if (!this.ctx || this.musicInterval !== null) return;

    // A pleasant 8-chord lullaby/music-box pattern in C Major & F Major
    const pattern = [
      523.25, 659.25, 783.99, 1046.5,
      587.33, 698.46, 880.0, 1174.66,
      659.25, 783.99, 987.77, 1318.51,
      698.46, 880.0, 1046.5, 1396.91,
    ];

    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;

      const freq = pattern[step % pattern.length];
      step++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    }, 450);
  }

  private stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  /**
   * Trigger haptic vibration if supported and enabled
   */
  public triggerVibrate(pattern: number | number[] = 30) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore devices with restricted vibration
      }
    }
  }
}

export const soundManager = new SoundEngine();
