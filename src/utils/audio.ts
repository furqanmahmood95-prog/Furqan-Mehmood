/**
 * Cyberpunk Procedural Web Audio API Synthesizer
 * Zero external audio assets required, zero latency, guaranteed browser support.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.4;

  constructor() {
    const savedMute = localStorage.getItem('block_overload_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('block_overload_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public playPickup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

      gain.gain.setValueAtTime(this.masterVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // AudioContext policy fallback
    }
  }

  public playPlace() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Sub thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(this.masterVolume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);

      // Cyber click
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(800, now);
      click.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      clickGain.gain.setValueAtTime(this.masterVolume * 0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      click.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      click.start(now);
      click.stop(now + 0.05);
    } catch {
      // AudioContext policy fallback
    }
  }

  public playInvalid() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.setValueAtTime(90, now + 0.08);

      gain.gain.setValueAtTime(this.masterVolume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // AudioContext policy fallback
    }
  }

  public playLineClear(lines: number = 1, combo: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      const rootIndex = Math.min((lines - 1) + Math.min(combo - 1, 4), baseFreqs.length - 3);

      // Play rapid arpeggio chord
      for (let i = 0; i < 3 + lines; i++) {
        const chordOsc = this.ctx.createOscillator();
        const chordGain = this.ctx.createGain();
        const delay = i * 0.045;
        const freqIndex = (rootIndex + i) % baseFreqs.length;
        const freq = baseFreqs[freqIndex] * (lines > 2 ? 1.5 : 1);

        chordOsc.type = lines > 1 ? 'sawtooth' : 'sine';
        chordOsc.frequency.setValueAtTime(freq, now + delay);

        const chordVol = Math.min(0.35, this.masterVolume * (0.2 + lines * 0.05));
        chordGain.gain.setValueAtTime(chordVol, now + delay);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

        chordOsc.connect(chordGain);
        chordGain.connect(this.ctx.destination);
        chordOsc.start(now + delay);
        chordOsc.stop(now + delay + 0.38);
      }

      // Noise explosion burst for heavy line clears
      if (lines >= 2) {
        this.playNoiseBurst(now + 0.02, 0.18 + lines * 0.05);
      }
    } catch {
      // AudioContext policy fallback
    }
  }

  private playNoiseBurst(startTime: number, duration: number) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, startTime);
      filter.Q.setValueAtTime(1.5, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.masterVolume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(startTime);
      noise.stop(startTime + duration);
    } catch {
      // Noise buffer fallback
    }
  }

  public playEmp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.45);

      gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);

      this.playNoiseBurst(now + 0.1, 0.35);
    } catch {
      // AudioContext policy fallback
    }
  }

  public playReroll() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(500 + i * 150, t);

        gain.gain.setValueAtTime(this.masterVolume * 0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      }
    } catch {
      // AudioContext policy fallback
    }
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [330, 293, 246, 196, 146];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.12;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.18);

        gain.gain.setValueAtTime(this.masterVolume * 0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch {
      // AudioContext policy fallback
    }
  }

  public playHighScore() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(this.masterVolume * 0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {
      // AudioContext policy fallback
    }
  }
}

export const sound = new SoundController();
