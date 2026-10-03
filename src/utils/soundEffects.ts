// Pure Web Audio API Sound Generator for StudyPulse

class SoundFX {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private isAmbientPlaying: boolean = false;
  private currentAmbientType: string = 'none';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Timer complete chime (pleasant chord)
  playTimerComplete() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (C Major chord)

    frequencies.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 1.5);
    });
  }

  // Card Flip Sound (soft click / swish)
  playCardFlip() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Quiz Correct Sound (Upbeat dual tone)
  playCorrect() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 880]; // D5 -> A5

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.12, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.3);
    });
  }

  // Quiz Wrong Sound (Gentle low tone)
  playWrong() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Level Up / Fanfare Sound
  playLevelUp() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major

    arpeggio.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.15, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.4);
    });
  }

  // Ambient Sound Machine (White noise / Rain / Binaural Beats synthesizer)
  startAmbient(type: 'rain' | 'waves' | 'binaural' | 'whiteNoise', volume: number = 0.3) {
    this.stopAmbient();
    this.initCtx();
    if (!this.ctx) return;

    this.currentAmbientType = type;
    this.isAmbientPlaying = true;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    if (type === 'rain' || type === 'whiteNoise' || type === 'waves') {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink noise filter for rain effect
          lastOut = (lastOut * 0.95) + (white * 0.05);
          data[i] = lastOut * 3;
        } else if (type === 'waves') {
          // Brown noise filter for deep ocean waves
          lastOut = (lastOut * 0.98) + (white * 0.02);
          data[i] = lastOut * 5;
        } else {
          // Pure white noise
          data[i] = white * 0.2;
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Add lowpass filter for smoother ambiance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'rain' ? 800 : type === 'waves' ? 400 : 3000;

      noiseSource.connect(filter);
      filter.connect(this.ambientGain);
      noiseSource.start();
      this.ambientSource = noiseSource;

    } else if (type === 'binaural') {
      // 432Hz Focus Binaural Beat (Base: 216Hz Left, 226Hz Right for 10Hz Alpha Waves)
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);

      oscL.frequency.value = 216; // Left ear
      oscR.frequency.value = 226; // Right ear (10Hz difference for focus)

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);

      merger.connect(this.ambientGain);

      oscL.start();
      oscR.start();

      this.ambientSource = oscL; // reference to stop
    }
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode | OscillatorNode).stop();
      } catch {
        // already stopped
      }
      this.ambientSource = null;
    }
    this.isAmbientPlaying = false;
    this.currentAmbientType = 'none';
  }

  getAmbientState() {
    return {
      isPlaying: this.isAmbientPlaying,
      type: this.currentAmbientType,
    };
  }
}

export const soundFX = new SoundFX();
