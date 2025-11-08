/**
 * BUZZER GAME - SOUND MANAGER
 * Web Audio API powered sound effects
 */

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;

        // Initialize on user interaction (required by browsers)
        this.initialized = false;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('🔊 Sound system initialized');
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.enabled = false;
        }
    }

    /**
     * Play buzzer press sound
     */
    playPress() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Oscillator for the main tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Deep, satisfying click
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Play success sound
     */
    playSuccess() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Two-tone success chime
        [440, 554.37].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            osc.type = 'sine';

            gain.gain.setValueAtTime(this.volume * 0.3, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    }

    /**
     * Play level up fanfare
     */
    playLevelUp() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Ascending fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (octave up)

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            osc.type = 'square';

            gain.gain.setValueAtTime(this.volume * 0.2, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.4);
        });

        // Add some sparkle
        setTimeout(() => this.playSparkle(), 400);
    }

    /**
     * Play explosion sound
     */
    playExplosion() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // White noise explosion
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5000, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + 0.5);

        gain.gain.setValueAtTime(this.volume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        noise.start(now);
        noise.stop(now + 0.5);

        // Add bass thump
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();

        bass.connect(bassGain);
        bassGain.connect(ctx.destination);

        bass.frequency.setValueAtTime(60, now);
        bass.frequency.exponentialRampToValueAtTime(20, now + 0.3);

        bassGain.gain.setValueAtTime(this.volume * 0.8, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        bass.start(now);
        bass.stop(now + 0.3);
    }

    /**
     * Play error/wrong sound
     */
    playError() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Descending error tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        osc.type = 'sawtooth';

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Play emoji appear sound
     */
    playEmojiAppear() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        osc.type = 'sine';

        gain.gain.setValueAtTime(this.volume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    /**
     * Play sparkle effect
     */
    playSparkle() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // High pitched sparkle
        [1200, 1600, 2000].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, now + i * 0.03);
            osc.type = 'sine';

            gain.gain.setValueAtTime(this.volume * 0.1, now + i * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.03 + 0.2);

            osc.start(now + i * 0.03);
            osc.stop(now + i * 0.03 + 0.2);
        });
    }

    /**
     * Play tick sound for timer
     */
    playTick() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(1000, now);
        osc.type = 'sine';

        gain.gain.setValueAtTime(this.volume * 0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    /**
     * Play combo sound
     */
    playCombo(comboCount) {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Higher pitch for higher combos
        const basePitch = 600 + (comboCount * 50);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(basePitch, now);
        osc.type = 'triangle';

        gain.gain.setValueAtTime(this.volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Set volume (0-1)
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Make SoundManager available globally
window.SoundManager = SoundManager;
