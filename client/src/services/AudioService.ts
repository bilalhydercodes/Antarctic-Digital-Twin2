/**
 * AudioService.ts
 * Synthetic Web Audio API alarm sound generator & FrostByte Web Speech API TTS Looping Engine
 */

export interface AudioAlarmState {
  isAlarmLoopActive: boolean;
  currentAlarmText: string;
  currentAlertId: string | null;
  repeatCount: number;
}

type AudioListener = (state: AudioAlarmState) => void;

class AudioService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Critical Voice Alarm Looping State
  private isAlarmLoopActive: boolean = false;
  private currentAlarmText: string = '';
  private currentAlertId: string | null = null;
  private repeatCount: number = 0;
  private loopTimer: any = null;
  private speechWatchdog: any = null;
  private silencedAlertIds: Set<string> = new Set();
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    // Keep speech synthesis active in modern browsers
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    // Emit current state immediately
    listener(this.getAlarmState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const state = this.getAlarmState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('Error in AudioService listener:', err);
      }
    });
  }

  public getAlarmState(): AudioAlarmState {
    return {
      isAlarmLoopActive: this.isAlarmLoopActive,
      currentAlarmText: this.currentAlarmText,
      currentAlertId: this.currentAlertId,
      repeatCount: this.repeatCount
    };
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCriticalAlarmLoop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /** Play UI click feedback sound */
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio click failed', e);
    }
  }

  /** Play warning alert chime */
  public playWarning(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio warning failed', e);
    }
  }

  /** Play critical emergency siren tone */
  public playEmergencySiren(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.25);
      osc.frequency.linearRampToValueAtTime(600, now + 0.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.55);
    } catch (e) {
      console.warn('Audio siren failed', e);
    }
  }

  /**
   * Start AI Voice alarm loop. Repeats continuously until stopCriticalAlarmLoop() is clicked.
   */
  public startCriticalAlarmLoop(text: string, alertId?: string): void {
    if (this.isMuted) return;
    const id = alertId || `alarm-${Date.now()}`;

    // If operator already clicked stop on this exact alarm ID, do not re-trigger
    if (this.silencedAlertIds.has(id)) return;

    // If already looping this exact alert, continue existing loop
    if (this.isAlarmLoopActive && this.currentAlertId === id) return;

    this.isAlarmLoopActive = true;
    this.currentAlarmText = text;
    this.currentAlertId = id;
    this.repeatCount = 0;

    this.clearTimers();
    this.notifyListeners();

    // Start repeating speech cycle
    this.runAlarmCycle();
  }

  private runAlarmCycle(): void {
    if (!this.isAlarmLoopActive || this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // First, play siren chime
    this.playEmergencySiren();

    // Cancel any previous utterance to avoid queuing lag
    window.speechSynthesis.cancel();

    // Format spoken phrase
    const spokenMessage = `Attention! Critical issue detected: ${this.currentAlarmText}. Immediate operator action required.`;
    const utterance = new SpeechSynthesisUtterance(spokenMessage);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Zira') || v.name.includes('Samantha'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      if (!this.isAlarmLoopActive) return;
      this.repeatCount++;
      this.notifyListeners();

      // Pause for 3.5 seconds before saying it again
      this.loopTimer = setTimeout(() => {
        if (this.isAlarmLoopActive) {
          this.runAlarmCycle();
        }
      }, 3500);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis utterance event:', e);
      if (!this.isAlarmLoopActive) return;
      // Retry in 4 seconds if interrupted
      this.loopTimer = setTimeout(() => {
        if (this.isAlarmLoopActive) {
          this.runAlarmCycle();
        }
      }, 4000);
    };

    // Watchdog to prevent Chrome TTS silence freeze
    this.startWatchdog();

    window.speechSynthesis.speak(utterance);
  }

  private startWatchdog(): void {
    if (this.speechWatchdog) clearInterval(this.speechWatchdog);
    this.speechWatchdog = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 1000);
  }

  /**
   * STOP VOICE ALARM. Instantly cuts off current speech and stops repeating.
   */
  public stopCriticalAlarmLoop(): void {
    this.isAlarmLoopActive = false;
    if (this.currentAlertId) {
      this.silencedAlertIds.add(this.currentAlertId);
    }
    this.clearTimers();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.currentAlarmText = '';
    this.currentAlertId = null;
    this.repeatCount = 0;
    this.notifyListeners();
  }

  public resetSilencedAlerts(): void {
    this.silencedAlertIds.clear();
  }

  private clearTimers(): void {
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.speechWatchdog) {
      clearInterval(this.speechWatchdog);
      this.speechWatchdog = null;
    }
  }

  /** Speak one-off SITREP briefing aloud */
  public speakSITREP(text: string): void {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.stopCriticalAlarmLoop();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech(): void {
    this.stopCriticalAlarmLoop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioService = new AudioService();
