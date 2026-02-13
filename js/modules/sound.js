// ===== SOUND SYSTEM =====
// Audio feedback and haptic effects

import { Preferences } from './preferences.js';

export let soundMuted = false;

export const Sound = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    _play(fn) {
        if (soundMuted) return;
        fn();
    },

    correct() {
        if (navigator.vibrate) navigator.vibrate(30);
        this._play(() => {
            this.init();
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63];

            for (let i = 0; i < 2; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.frequency.value = notes[i];
                gain.gain.setValueAtTime(0.3, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.1);
                osc.start(now + i * 0.1);
                osc.stop(now + (i + 1) * 0.1);
            }
        });
    },

    wrong() {
        if (navigator.vibrate) navigator.vibrate([50, 50]);
        this._play(() => {
            this.init();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.frequency.value = 100;
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        });
    },

    click() {
        this._play(() => {
            this.init();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        });
    },

    star() {
        this._play(() => {
            this.init();
            const now = this.ctx.currentTime;
            for (let i = 0; i < 3; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.frequency.setValueAtTime(800 + i * 300, now + i * 0.05);
                osc.frequency.exponentialRampToValueAtTime(1200 + i * 300, now + (i + 1) * 0.05);
                gain.gain.setValueAtTime(0.15, now + i * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.05);
                osc.start(now + i * 0.05);
                osc.stop(now + (i + 1) * 0.05);
            }
        });
    }
};

// Initialize and setup mute button
export function initSound() {
    soundMuted = Preferences.get('soundMuted');
    
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.textContent = soundMuted ? '🔇' : '🔊';
    muteBtn.classList.toggle('muted', soundMuted);
    muteBtn.addEventListener('click', () => {
        soundMuted = !soundMuted;
        Preferences.set('soundMuted', soundMuted);
        muteBtn.textContent = soundMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('muted', soundMuted);
        muteBtn.setAttribute('aria-label', soundMuted ? 'Sound off - tap to unmute' : 'Sound on - tap to mute');
        muteBtn.setAttribute('title', soundMuted ? 'Sound off' : 'Sound on');
    });
}

// Export a way to update the muted state (used by sound.js internally)
export function setSoundMuted(muted) {
    soundMuted = muted;
}
