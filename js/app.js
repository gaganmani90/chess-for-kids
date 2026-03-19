        // ===== PREFERENCES SYSTEM =====
        const PREFERENCES_KEY = 'chess-for-kids-preferences';
        
        const Preferences = {
            defaults: {
                soundMuted: false,
                totalStars: 0,
                // Add more preferences here in the future:
                // theme: 'dark',
                // difficulty: 'easy',
                // showHints: true,
            },
            
            data: {},
            
            // Load preferences from localStorage
            load() {
                try {
                    const saved = localStorage.getItem(PREFERENCES_KEY);
                    if (saved) {
                        this.data = JSON.parse(saved);
                    } else {
                        // Migrate from old storage keys if they exist
                        this.data = { ...this.defaults };
                        const oldMuted = localStorage.getItem('chess-for-kids-muted');
                        const oldStars = localStorage.getItem('chess-for-kids-stars');
                        if (oldMuted !== null) {
                            this.data.soundMuted = JSON.parse(oldMuted);
                        }
                        if (oldStars !== null) {
                            this.data.totalStars = parseInt(oldStars, 10) || 0;
                        }
                        // Save migrated data
                        this.save();
                    }
                    // Merge with defaults to ensure new preferences exist
                    this.data = { ...this.defaults, ...this.data };
                } catch (e) {
                    console.error('Failed to load preferences:', e);
                    this.data = { ...this.defaults };
                }
                return this;
            },
            
            // Save preferences to localStorage
            save() {
                try {
                    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.data));
                } catch (e) {
                    console.error('Failed to save preferences:', e);
                }
                return this;
            },
            
            // Get a preference value
            get(key) {
                return this.data[key] !== undefined ? this.data[key] : this.defaults[key];
            },
            
            // Set a preference value and save
            set(key, value) {
                this.data[key] = value;
                this.save();
                return this;
            },
            
        };
        
        // Initialize preferences
        Preferences.load();

        // ===== SOUND SYSTEM =====
        const PAGE_TITLE = 'Chess for Kids';
        let soundMuted = Preferences.get('soundMuted');

        const Sound = {
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

        // Text-to-Speech function
        function speak(text) {
            if (soundMuted) return;
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9; // Slightly slower for clarity
                utterance.pitch = 1.1; // Slightly higher pitch for friendliness
                utterance.volume = 1.0;
                
                window.speechSynthesis.speak(utterance);
            }
        }

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
            
            // Stop any ongoing speech when muting
            if (soundMuted && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        });

        // ===== PIECE DATA =====
        // White pieces use bright white with colored accents; black pieces use filled unicode
        const WHITE_COLOR = '#FFFFFF';
        const BLACK_COLOR = '#222222';
        const ENEMY_COLOR = '#E53935'; // bright red for enemy pieces

        const PIECES = {
            king: {
                icon: '♔', blackIcon: '♚',
                name: 'King',

                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: false,
                description: 'The King is the most important piece. It moves one square in any direction.'
            },
            queen: {
                icon: '♕', blackIcon: '♛',
                name: 'Queen',

                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: true,
                description: 'The Queen is the most powerful piece. It moves any number of squares in any direction.'
            },
            rook: {
                icon: '♖', blackIcon: '♜',
                name: 'Rook',

                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0]],
                slides: true,
                description: 'The Rook moves any number of squares horizontally or vertically.'
            },
            bishop: {
                icon: '♗', blackIcon: '♝',
                name: 'Bishop',

                offsets: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: true,
                description: 'The Bishop moves any number of squares diagonally.'
            },
            knight: {
                icon: '♘', blackIcon: '♞',
                name: 'Knight',

                offsets: [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]],
                slides: false,
                description: 'The Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular. It can jump over pieces!'
            },
            pawn: {
                icon: '♙', blackIcon: '♟',
                name: 'Pawn',

                offsets: [[0, -1]],
                slides: false,
                description: 'The Pawn moves forward one square (or two squares from its starting position).'
            }
        };

        // Helper: SVG text with stroke outline for visibility
        function svgPiece(x, y, icon, fill, fontSize, extra) {
            const stroke = fill === WHITE_COLOR ? '#333' : '#FFF';
            const strokeW = fill === WHITE_COLOR ? 1.5 : 0.8;
            return `<text x="${x}" y="${y}" font-size="${fontSize}" text-anchor="middle" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" paint-order="stroke" ${extra || ''}>${icon}</text>`;
        }

        // ===== LEARN SECTION SCENES =====
        const learnData = [
                {
                    piece: 'pawn',
                    title: 'The Brave Little Soldier',
                    svg: `<img src="images/pawn_march.png" alt="Pawns MARCH One Step at Time!" class="learn-puzzle-image" />`
                },
                {
                    piece: 'rook',
                    title: 'The Castle Tower',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="re-nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#0A0E27;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1B2845;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="re-towerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="re-lightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" style="stop-color:#FFFF99;stop-opacity:0.8" />
        <stop offset="50%" style="stop-color:#FFFF99;stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:#FFFF99;stop-opacity:0" />
      </linearGradient>
    </defs>
    <!-- Night sky -->
    <rect width="520" height="300" fill="url(#re-nightSky)"/>
    <!-- Stars -->
    <circle cx="50" cy="40" r="2" fill="#FFF"/>
    <circle cx="120" cy="30" r="1.5" fill="#FFF"/>
    <circle cx="200" cy="50" r="1" fill="#FFF"/>
    <circle cx="320" cy="35" r="1.5" fill="#FFF"/>
    <circle cx="420" cy="60" r="2" fill="#FFF"/>
    <circle cx="480" cy="25" r="1" fill="#FFF"/>
    <circle cx="100" cy="120" r="1" fill="#FFF"/>
    <circle cx="450" cy="100" r="1.5" fill="#FFF"/>
    <!-- Ground -->
    <rect x="0" y="240" width="520" height="60" fill="#0F1B3C"/>
    <!-- Castle tower -->
    <rect x="210" y="100" width="100" height="180" fill="url(#re-towerGradient)" stroke="#8B6914" stroke-width="2"/>
    <!-- Tower crenellations (top) -->
    <rect x="210" y="100" width="15" height="20" fill="url(#re-towerGradient)"/>
    <rect x="235" y="100" width="15" height="20" fill="url(#re-towerGradient)"/>
    <rect x="260" y="100" width="15" height="20" fill="url(#re-towerGradient)"/>
    <rect x="285" y="100" width="15" height="20" fill="url(#re-towerGradient)"/>
    <!-- Tower windows -->
    <rect x="230" y="140" width="12" height="12" fill="#000" opacity="0.6"/>
    <rect x="278" y="140" width="12" height="12" fill="#000" opacity="0.6"/>
    <rect x="230" y="190" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="278" y="190" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <!-- Light beams (4 cardinal directions) -->
    <!-- Up -->
    <polygon points="260,100 250,20 270,20" fill="url(#re-lightBeam)" opacity="0.7"/>
    <!-- Down -->
    <polygon points="250,280 240,240 280,240" fill="url(#re-lightBeam)" opacity="0.7"/>
    <!-- Left -->
    <polygon points="210,150 40,140 40,160" fill="url(#re-lightBeam)" opacity="0.7"/>
    <!-- Right -->
    <polygon points="310,150 480,140 480,160" fill="url(#re-lightBeam)" opacity="0.7"/>
    <!-- Guard on tower -->
    <!-- Head -->
    <circle cx="260" cy="115" r="8" fill="#FDBCB4"/>
    <!-- Helmet -->
    <path d="M 252 110 L 268 110 L 266 105 L 254 105 Z" fill="#C0C0C0"/>
    <!-- Body -->
    <rect x="256" y="125" width="8" height="12" fill="#FF6B6B"/>
    <!-- Arms -->
    <line x1="256" y1="130" x2="245" y2="128" stroke="#FDBCB4" stroke-width="2"/>
    <line x1="264" y1="130" x2="275" y2="128" stroke="#FDBCB4" stroke-width="2"/>
    <!-- Spear -->
    <line x1="275" y1="128" x2="285" y2="95" stroke="#DAA520" stroke-width="2"/>
    <polygon points="285,95 287,102 280,100" fill="#FFD700"/>
    <!-- Text at bottom -->
    <text x="260" y="285" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#FFFF99" stroke="#000" stroke-width="0.5">Straight Lines Everywhere</text>
  </svg>`
                },
                {
                    piece: 'knight',
                    title: 'The Magical Horse',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ne-skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="ne-horseBrown" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8B5A3C;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#5C3317;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="ne-sparkleGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.7" />
      </linearGradient>
    </defs>
    <!-- Sky -->
    <rect width="520" height="300" fill="url(#ne-skyGrad)"/>
    <!-- Clouds -->
    <ellipse cx="100" cy="80" rx="40" ry="20" fill="#FFFFFF" opacity="0.8"/>
    <ellipse cx="130" cy="75" rx="35" ry="18" fill="#FFFFFF" opacity="0.8"/>
    <ellipse cx="420" cy="90" rx="45" ry="22" fill="#FFFFFF" opacity="0.7"/>
    <!-- Ground/Meadow -->
    <rect x="0" y="200" width="520" height="100" fill="#6BA834"/>
    <!-- Grass details -->
    <ellipse cx="200" cy="220" rx="80" ry="25" fill="#5C9428"/>
    <!-- Fence -->
    <line x1="150" y1="200" x2="380" y2="200" stroke="#8B6F47" stroke-width="3"/>
    <line x1="160" y1="180" x2="160" y2="220" stroke="#8B6F47" stroke-width="2"/>
    <line x1="200" y1="175" x2="200" y2="225" stroke="#8B6F47" stroke-width="2"/>
    <line x1="240" y1="175" x2="240" y2="225" stroke="#8B6F47" stroke-width="2"/>
    <line x1="280" y1="175" x2="280" y2="225" stroke="#8B6F47" stroke-width="2"/>
    <line x1="320" y1="180" x2="320" y2="220" stroke="#8B6F47" stroke-width="2"/>
    <line x1="360" y1="185" x2="360" y2="215" stroke="#8B6F47" stroke-width="2"/>
    <!-- L-shaped sparkle trail -->
    <path d="M 320 240 L 320 100 L 420 100" stroke="url(#ne-sparkleGold)" stroke-width="8" fill="none" opacity="0.6" stroke-linecap="round"/>
    <!-- Sparkles on trail -->
    <circle cx="320" cy="160" r="4" fill="#FFD700" opacity="0.8"/>
    <circle cx="320" cy="120" r="3" fill="#FFA500" opacity="0.7"/>
    <circle cx="360" cy="100" r="4" fill="#FFD700" opacity="0.8"/>
    <circle cx="400" cy="100" r="3" fill="#FFA500" opacity="0.7"/>
    <!-- Horse character -->
    <!-- Body -->
    <ellipse cx="410" cy="90" rx="30" ry="25" fill="url(#ne-horseBrown)"/>
    <!-- Neck -->
    <path d="M 395 85 Q 385 70 380 50" stroke="url(#ne-horseBrown)" stroke-width="18" fill="none" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="378" cy="45" r="14" fill="url(#ne-horseBrown)"/>
    <!-- Ear -->
    <polygon points="380,28 375,18 382,25" fill="url(#ne-horseBrown)"/>
    <!-- Muzzle -->
    <ellipse cx="365" cy="48" rx="8" ry="6" fill="#A0714F"/>
    <!-- Eye -->
    <circle cx="375" cy="42" r="2" fill="#000"/>
    <!-- Flowing mane -->
    <path d="M 380 30 Q 375 35 375 45" stroke="#FFD700" stroke-width="4" fill="none" opacity="0.8" stroke-linecap="round"/>
    <path d="M 385 28 Q 382 38 380 50" stroke="#FFD700" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>
    <!-- Legs in jumping pose -->
    <line x1="400" y1="110" x2="395" y2="140" stroke="url(#ne-horseBrown)" stroke-width="6" stroke-linecap="round"/>
    <line x1="420" y1="115" x2="428" y2="145" stroke="url(#ne-horseBrown)" stroke-width="6" stroke-linecap="round"/>
    <!-- Tail -->
    <path d="M 440 95 Q 460 85 470 75" stroke="#FFD700" stroke-width="5" fill="none" opacity="0.8" stroke-linecap="round"/>
    <!-- Hooves -->
    <ellipse cx="395" cy="140" rx="3" ry="4" fill="#000"/>
    <ellipse cx="428" cy="145" rx="3" ry="4" fill="#000"/>
    <!-- Watching animals -->
    <!-- Small rabbit -->
    <circle cx="80" cy="240" r="8" fill="#A0714F"/>
    <circle cx="82" cy="238" r="6" fill="#8B5A3C"/>
    <ellipse cx="78" cy="230" rx="2" ry="5" fill="#A0714F"/>
    <ellipse cx="86" cy="230" rx="2" ry="5" fill="#A0714F"/>
    <!-- Butterfly -->
    <circle cx="120" cy="120" r="2" fill="#FFB6C1"/>
    <ellipse cx="110" cy="115" rx="5" ry="7" fill="#FF69B4" opacity="0.8"/>
    <ellipse cx="130" cy="115" rx="5" ry="7" fill="#FF69B4" opacity="0.8"/>
    <!-- Text at bottom -->
    <text x="260" y="285" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#FFFFFF" stroke="#000" stroke-width="0.5">Jump in an L-Shape</text>
  </svg>`
                },
                {
                    piece: 'bishop',
                    title: 'The Diagonal Explorer',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="be-snowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.95" />
        <stop offset="100%" style="stop-color:#E0F4FF;stop-opacity:0.9" />
      </linearGradient>
      <linearGradient id="be-skyWarm" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#FF8C42;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFE4B5;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="be-mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F0FFFF;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#E0F4FF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#B0E0E6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Sunset sky -->
    <rect width="520" height="300" fill="url(#be-skyWarm)"/>
    <!-- Sun -->
    <circle cx="460" cy="80" r="40" fill="#FFD700" opacity="0.9"/>
    <!-- Mountains -->
    <polygon points="0,180 150,80 280,200 520,120 520,300 0,300" fill="url(#be-mountainGrad)"/>
    <polygon points="100,180 220,60 340,190 520,140 520,300 0,300" fill="#D4E6F1" opacity="0.7"/>
    <!-- Snow patches -->
    <ellipse cx="150" cy="90" rx="25" ry="15" fill="#FFFFFF" opacity="0.9"/>
    <ellipse cx="320" cy="160" rx="35" ry="20" fill="#FFFFFF" opacity="0.85"/>
    <!-- Pine trees -->
    <polygon points="80,180 75,195 85,195" fill="#2D5016"/>
    <polygon points="80,185 72,200 88,200" fill="#2D5016"/>
    <polygon points="420,150 410,170 430,170" fill="#2D5016"/>
    <polygon points="420,155 405,180 435,180" fill="#2D5016"/>
    <!-- Diagonal ski tracks -->
    <line x1="380" y1="50" x2="240" y2="190" stroke="#4169E1" stroke-width="6" opacity="0.6" stroke-linecap="round"/>
    <line x1="390" y1="45" x2="250" y2="185" stroke="#6495ED" stroke-width="4" opacity="0.5" stroke-linecap="round"/>
    <line x1="370" y1="55" x2="230" y2="195" stroke="#6495ED" stroke-width="4" opacity="0.5" stroke-linecap="round"/>
    <!-- Another diagonal direction -->
    <line x1="250" y1="100" x2="130" y2="200" stroke="#4169E1" stroke-width="5" opacity="0.5" stroke-linecap="round"/>
    <!-- Bishop character (skier) -->
    <!-- Head -->
    <circle cx="235" cy="195" r="10" fill="#FDBCB4"/>
    <!-- Bishop's mitre (pointed hat) -->
    <polygon points="225,180 245,180 235,160" fill="#9932CC" opacity="0.9"/>
    <polygon points="235,160 245,180 250,175" fill="#BA55D3" opacity="0.8"/>
    <!-- Body/Winter coat -->
    <rect x="225" y="205" width="20" height="25" rx="3" fill="#4169E1"/>
    <!-- Arms holding ski poles -->
    <line x1="225" y1="210" x2="200" y2="205" stroke="#FDBCB4" stroke-width="3"/>
    <line x1="245" y1="210" x2="270" y2="205" stroke="#FDBCB4" stroke-width="3"/>
    <!-- Ski poles -->
    <line x1="200" y1="205" x2="195" y2="235" stroke="#FFD700" stroke-width="2"/>
    <line x1="270" y1="205" x2="275" y2="235" stroke="#FFD700" stroke-width="2"/>
    <!-- Legs/skis -->
    <ellipse cx="228" cy="232" rx="4" ry="8" fill="#FFFFFF" stroke="#000080" stroke-width="1"/>
    <ellipse cx="242" cy="232" rx="4" ry="8" fill="#FFFFFF" stroke="#000080" stroke-width="1"/>
    <!-- Text at bottom -->
    <text x="260" y="285" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#FFFFFF" stroke="#000" stroke-width="0.5">Diagonal Only</text>
  </svg>`
                },
                {
                    piece: 'queen',
                    title: 'The Powerful Queen',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="qe-queenBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a4d;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2d0d5e;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="qe-queenDress" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#9932CC;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6A0DAD;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="qe-crownGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0" />
      </radialGradient>
    </defs>
    <!-- Background -->
    <rect width="520" height="300" fill="url(#qe-queenBg)"/>
    <!-- Sparkles/stars background -->
    <circle cx="80" cy="60" r="2" fill="#FFD700" opacity="0.8"/>
    <circle cx="150" cy="40" r="1.5" fill="#FFD700" opacity="0.7"/>
    <circle cx="420" cy="80" r="2" fill="#FFD700" opacity="0.8"/>
    <circle cx="450" cy="50" r="1" fill="#FFD700" opacity="0.6"/>
    <circle cx="200" cy="140" r="1.5" fill="#FFD700" opacity="0.5"/>
    <circle cx="380" cy="180" r="1" fill="#FFD700" opacity="0.7"/>
    <!-- Magical light beams (8 directions) -->
    <!-- Up -->
    <polygon points="260,120 250,0 270,0" fill="#FFD700" opacity="0.3"/>
    <!-- Up-right -->
    <polygon points="310,110 450,-30 465,-15" fill="#FFD700" opacity="0.25"/>
    <!-- Right -->
    <polygon points="340,150 520,130 520,170" fill="#FFD700" opacity="0.3"/>
    <!-- Down-right -->
    <polygon points="310,190 450,350 435,335" fill="#FFD700" opacity="0.25"/>
    <!-- Down -->
    <polygon points="260,180 250,300 270,300" fill="#FFD700" opacity="0.3"/>
    <!-- Down-left -->
    <polygon points="210,190 70,350 85,335" fill="#FFD700" opacity="0.25"/>
    <!-- Left -->
    <polygon points="180,150 0,130 0,170" fill="#FFD700" opacity="0.3"/>
    <!-- Up-left -->
    <polygon points="210,110 70,-30 85,-15" fill="#FFD700" opacity="0.25"/>
    <!-- Hill/pedestal -->
    <ellipse cx="260" cy="200" rx="80" ry="35" fill="#4A4A6A" opacity="0.7"/>
    <ellipse cx="260" cy="195" rx="75" ry="30" fill="#6A6A8A" opacity="0.6"/>
    <!-- Queen character -->
    <!-- Body/Dress -->
    <polygon points="240,130 280,130 285,180 235,180" fill="url(#qe-queenDress)"/>
    <!-- Arms -->
    <line x1="240" y1="145" x2="215" y2="140" stroke="#FDBCB4" stroke-width="5" stroke-linecap="round"/>
    <line x1="280" y1="145" x2="305" y2="140" stroke="#FDBCB4" stroke-width="5" stroke-linecap="round"/>
    <!-- Hands -->
    <circle cx="215" cy="140" r="4" fill="#FDBCB4"/>
    <circle cx="305" cy="140" r="4" fill="#FDBCB4"/>
    <!-- Neck -->
    <rect x="255" y="120" width="10" height="10" fill="#FDBCB4"/>
    <!-- Head -->
    <circle cx="260" cy="115" r="12" fill="#FDBCB4"/>
    <!-- Eyes -->
    <circle cx="255" cy="112" r="1.5" fill="#000"/>
    <circle cx="265" cy="112" r="1.5" fill="#000"/>
    <!-- Crown with glow -->
    <circle cx="260" cy="85" r="35" fill="url(#qe-crownGlow)"/>
    <!-- Crown peaks -->
    <polygon points="245,95 240,70 250,90" fill="#FFD700"/>
    <polygon points="260,92 255,60 265,92" fill="#FFD700"/>
    <polygon points="275,95 280,70 270,90" fill="#FFD700"/>
    <!-- Crown band -->
    <ellipse cx="260" cy="102" rx="20" ry="8" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
    <!-- Jewels on crown -->
    <circle cx="250" cy="100" r="2" fill="#FF1493"/>
    <circle cx="260" cy="96" r="2" fill="#00BFFF"/>
    <circle cx="270" cy="100" r="2" fill="#FF1493"/>
    <!-- Magical aura -->
    <circle cx="260" cy="150" r="45" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.5" stroke-dasharray="5,5"/>
    <!-- Additional sparkles around queen -->
    <circle cx="290" cy="130" r="1.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="230" cy="140" r="1.5" fill="#FFD700" opacity="0.9"/>
    <circle cx="260" cy="100" r="1" fill="#FF1493" opacity="0.8"/>
    <!-- Text at bottom -->
    <text x="260" y="285" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#FFD700" stroke="#000" stroke-width="0.5">All Directions, Powerful</text>
  </svg>`
                },
                {
                    piece: 'king',
                    title: 'The Careful King',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ke-kingBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="ke-kingThrone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background sky -->
    <rect width="520" height="300" fill="url(#ke-kingBg)"/>
    <!-- Garden background -->
    <!-- Grass -->
    <rect x="0" y="160" width="520" height="140" fill="#6BA834"/>
    <!-- Flowers in garden -->
    <circle cx="100" cy="240" r="4" fill="#FF69B4"/>
    <circle cx="95" cy="235" r="2" fill="#FFB6C1"/>
    <circle cx="105" cy="235" r="2" fill="#FFB6C1"/>
    <circle cx="420" cy="250" r="4" fill="#FF1493"/>
    <circle cx="415" cy="245" r="2" fill="#FFB6C1"/>
    <circle cx="425" cy="245" r="2" fill="#FFB6C1"/>
    <circle cx="200" cy="260" r="3" fill="#00BFFF"/>
    <circle cx="195" cy="255" r="1.5" fill="#87CEEB"/>
    <circle cx="205" cy="255" r="1.5" fill="#87CEEB"/>
    <!-- Butterflies -->
    <ellipse cx="150" cy="120" rx="4" ry="6" fill="#FF69B4" opacity="0.8"/>
    <ellipse cx="160" cy="120" rx="4" ry="6" fill="#FF69B4" opacity="0.8"/>
    <!-- Garden fence circle around king -->
    <circle cx="260" cy="180" r="50" fill="none" stroke="#8B6F47" stroke-width="2" stroke-dasharray="3,3"/>
    <!-- Glowing circle showing limited reach -->
    <circle cx="260" cy="180" r="55" fill="none" stroke="#FFD700" stroke-width="3" opacity="0.4"/>
    <!-- Protective dome/shield above -->
    <ellipse cx="260" cy="140" rx="60" ry="45" fill="#87CEEB" opacity="0.2" stroke="#FFD700" stroke-width="2"/>
    <!-- Directional arrows (one step each direction) -->
    <!-- Up arrow -->
    <line x1="260" y1="180" x2="260" y2="145" stroke="#FFD700" stroke-width="2"/>
    <polygon points="260,140 255,150 265,150" fill="#FFD700"/>
    <!-- Down arrow -->
    <line x1="260" y1="180" x2="260" y2="215" stroke="#FFD700" stroke-width="2"/>
    <polygon points="260,220 255,210 265,210" fill="#FFD700"/>
    <!-- Left arrow -->
    <line x1="260" y1="180" x2="225" y2="180" stroke="#FFD700" stroke-width="2"/>
    <polygon points="220,180 230,175 230,185" fill="#FFD700"/>
    <!-- Right arrow -->
    <line x1="260" y1="180" x2="295" y2="180" stroke="#FFD700" stroke-width="2"/>
    <polygon points="300,180 290,175 290,185" fill="#FFD700"/>
    <!-- Diagonal arrows (subtle) -->
    <line x1="260" y1="180" x2="285" y2="155" stroke="#FFD700" stroke-width="1.5" opacity="0.7"/>
    <polygon points="289,151 281,161 285,153" fill="#FFD700" opacity="0.7"/>
    <line x1="260" y1="180" x2="235" y2="155" stroke="#FFD700" stroke-width="1.5" opacity="0.7"/>
    <polygon points="231,151 239,161 235,153" fill="#FFD700" opacity="0.7"/>
    <line x1="260" y1="180" x2="285" y2="205" stroke="#FFD700" stroke-width="1.5" opacity="0.7"/>
    <polygon points="289,209 281,199 285,207" fill="#FFD700" opacity="0.7"/>
    <line x1="260" y1="180" x2="235" y2="205" stroke="#FFD700" stroke-width="1.5" opacity="0.7"/>
    <polygon points="231,209 239,199 235,207" fill="#FFD700" opacity="0.7"/>
    <!-- King character -->
    <!-- Body/Robe -->
    <polygon points="245,190 275,190 280,220 240,220" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>
    <!-- Fur trim on robe -->
    <path d="M 240 220 Q 245 225 280 225 Q 275 220 280 220" fill="#FFFFFF" opacity="0.8"/>
    <!-- Arms -->
    <line x1="245" y1="200" x2="220" y2="200" stroke="#FDBCB4" stroke-width="4" stroke-linecap="round"/>
    <line x1="275" y1="200" x2="300" y2="200" stroke="#FDBCB4" stroke-width="4" stroke-linecap="round"/>
    <!-- Hands -->
    <circle cx="220" cy="200" r="3" fill="#FDBCB4"/>
    <circle cx="300" cy="200" r="3" fill="#FDBCB4"/>
    <!-- Neck -->
    <rect x="256" y="185" width="8" height="8" fill="#FDBCB4"/>
    <!-- Head -->
    <circle cx="260" cy="180" r="10" fill="#FDBCB4"/>
    <!-- Face details -->
    <circle cx="256" cy="178" r="1" fill="#000"/>
    <circle cx="264" cy="178" r="1" fill="#000"/>
    <path d="M 258 183 Q 260 185 262 183" stroke="#FF69B4" stroke-width="1" fill="none"/>
    <!-- Crown -->
    <ellipse cx="260" cy="165" rx="16" ry="10" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>
    <!-- Crown cross on top -->
    <line x1="260" y1="150" x2="260" y2="165" stroke="#FFD700" stroke-width="2"/>
    <line x1="250" y1="158" x2="270" y2="158" stroke="#FFD700" stroke-width="2"/>
    <!-- Crown jewels -->
    <circle cx="252" cy="168" r="2" fill="#FF1493"/>
    <circle cx="260" cy="166" r="2" fill="#00BFFF"/>
    <circle cx="268" cy="168" r="2" fill="#FF1493"/>
    <!-- Text at bottom -->
    <text x="260" y="285" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#FFFFFF" stroke="#000" stroke-width="0.5">One Step Careful</text>
  </svg>`
                }
        ];

        const savedStars = Preferences.get('totalStars');
        let learnState = {
            currentPuzzle: 0,
            attempts: [],
            scores: [0, 0, 0, 0, 0, 0],
            totalStars: Math.min(savedStars, 18)
        };

        function getMovesForPiece(piece, fromRow, fromCol, board = null) {
            const moves = [];
            const pieceData = PIECES[piece];

            if (pieceData.slides) {
                for (const [dRow, dCol] of pieceData.offsets) {
                    let r = fromRow + dRow;
                    let c = fromCol + dCol;
                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (board && board[r] && board[r][c]) {
                            break;
                        }
                        moves.push([r, c]);
                        r += dRow;
                        c += dCol;
                    }
                }
            } else {
                for (const [dRow, dCol] of pieceData.offsets) {
                    const r = fromRow + dRow;
                    const c = fromCol + dCol;
                    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        if (!board || !board[r] || !board[r][c]) {
                            moves.push([r, c]);
                        }
                    }
                }
            }

            return moves;
        }

        function createBoard(size = 8) {
            let svg = `<svg viewBox="0 0 ${size * 65} ${size * 65}" xmlns="http://www.w3.org/2000/svg">`;
            svg += Array.from({ length: size }).map((_, row) =>
                Array.from({ length: size }).map((_, col) => {
                    const isDark = (row + col) % 2 === 1;
                    const fill = isDark ? '#B58863' : '#E8D5B5';
                    const x = col * 65;
                    const y = row * 65;
                    return `<rect x="${x}" y="${y}" width="65" height="65" fill="${fill}" class="square" data-row="${row}" data-col="${col}"/>`;
                }).join('')
            ).join('') + `</svg>`;
            return svg;
        }

        function initLearn() {
            document.getElementById('total-stars').textContent = learnState.totalStars;
            const container = document.getElementById('quiz-container');
            const data = learnData;

            if (learnState.currentPuzzle >= data.length) {
                learnState.currentPuzzle = 0;
                learnState.attempts = [];
                document.title = PAGE_TITLE + ' – All done!';
                container.innerHTML = `
                    <div class="completion-screen">
                        <div class="confetti" aria-hidden="true">
                            <span></span><span></span><span></span><span></span><span></span>
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <h2>🌟 All pieces learned! 🌟</h2>
                        <div class="stars-big">${learnState.totalStars} ★</div>
                        <p style="color: #b0b0c0; margin-bottom: 24px;">You earned ${learnState.totalStars} stars!</p>
                        <button class="btn btn-primary" id="learn-play-again">Play Again</button>
                    </div>
                `;
                document.getElementById('learn-play-again').addEventListener('click', () => {
                    Sound.click();
                    document.title = PAGE_TITLE;
                    learnState.quizLocked = false;
                    learnState.totalStars = 0;
                    learnState.scores = [0, 0, 0, 0, 0, 0];
                    document.getElementById('total-stars').textContent = '0';
                    Preferences.set('totalStars', 0);
                    initLearn();
                });
                return;
            }

            const puzzle = data[learnState.currentPuzzle];

            container.innerHTML = `
                <div class="puzzle-number">Puzzle ${learnState.currentPuzzle + 1} / ${data.length}</div>
                <h3 style="text-align: center; color: #4ecdc4; margin-bottom: 20px;">${puzzle.title}</h3>
                ${puzzle.svg}
                <div class="piece-buttons">
                    ${Object.entries(PIECES).map(([key, piece]) => `
                        <button class="piece-btn" data-piece="${key}" title="${piece.name}">
                            <span class="piece-btn-icon">${piece.icon}</span>
                            <span class="piece-btn-label">${piece.name}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="feedback"></div>
                <button class="hint-btn" id="learn-hint" style="display: none;">Need a hint?</button>
                <div class="reveal-card">
                    <h3>${PIECES[puzzle.piece].name}</h3>
                    <svg class="mini-board" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                        ${Array.from({ length: 8 }).map((_, row) =>
                            Array.from({ length: 8 }).map((_, col) => {
                                const isDark = (row + col) % 2 === 1;
                                const fill = isDark ? '#B58863' : '#E8D5B5';
                                return `<rect x="${col * 30}" y="${row * 30}" width="30" height="30" fill="${fill}"/>`;
                            }).join('')
                        ).join('')}
                        ${svgPiece(75, 85, PIECES[puzzle.piece].icon, WHITE_COLOR, 34)}
                        ${Array.from(getMovesForPiece(puzzle.piece, 2, 2)).map(([r, c]) =>
                            `<circle cx="${c * 30 + 15}" cy="${r * 30 + 15}" r="4" fill="#FF0000" opacity="0.6"/>`
                        ).join('')}
                    </svg>
                    <p style="text-align: center; color: #b0b0c0; font-size: 14px; margin-top: 15px;">
                        ${PIECES[puzzle.piece].description}
                    </p>
                    <div class="learn-actions">
                        <button class="btn btn-primary" id="learn-next-btn">Next Puzzle</button>
                    </div>
                </div>
            `;

            document.querySelectorAll('.piece-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    Sound.click();
                    handleQuizAnswer(btn.dataset.piece, puzzle.piece, btn);
                });
            });

            document.getElementById('learn-next-btn').addEventListener('click', () => {
                Sound.click();
                if (learnState.autoAdvanceTimeout) {
                    clearTimeout(learnState.autoAdvanceTimeout);
                    learnState.autoAdvanceTimeout = null;
                }
                learnState.quizLocked = false;
                learnState.currentPuzzle++;
                learnState.attempts = [];
                initLearn();
            });

            document.getElementById('learn-hint').addEventListener('click', () => {
                Sound.click();
                handleQuizAnswer(puzzle.piece, puzzle.piece, document.querySelector(`.piece-btn[data-piece="${puzzle.piece}"]`));
            });
        }

        function handleQuizAnswer(selected, correct, btn) {
            if (learnState.quizLocked) return;
            const feedback = document.querySelector('.feedback');
            const reveal = document.querySelector('.reveal-card');
            const hintBtn = document.getElementById('learn-hint');
            const currentAttempt = learnState.attempts[learnState.currentPuzzle] || 0;

            if (selected === correct) {
                learnState.quizLocked = true;
                btn.classList.add('correct');
                feedback.textContent = '✓ Correct!';
                feedback.classList.add('correct');
                Sound.correct();
                
                // Speak the piece name
                const pieceName = PIECES[correct].name;
                setTimeout(() => speak(pieceName), 300);

                let stars = 3;
                if (currentAttempt === 1) stars = 2;
                if (currentAttempt >= 2) stars = 1;

                learnState.scores[learnState.currentPuzzle] = stars;
                learnState.totalStars = learnState.scores.reduce((a, b) => a + b, 0);
                document.getElementById('total-stars').textContent = learnState.totalStars;
                Preferences.set('totalStars', learnState.totalStars);

                feedback.innerHTML += ` <span class="stars">${Array(stars).fill('<span class="star">★</span>').join('')}</span>`;
                Sound.star();

                if (hintBtn) hintBtn.style.display = 'none';
                reveal.classList.add('show');
                learnState.autoAdvanceTimeout = setTimeout(() => {
                    learnState.quizLocked = false;
                    learnState.currentPuzzle++;
                    learnState.attempts = [];
                    initLearn();
                }, 2000);
            } else {
                btn.classList.add('incorrect');
                feedback.textContent = '✗ Not quite! Try again.';
                feedback.classList.add('incorrect');
                if (hintBtn) hintBtn.style.display = 'inline-block';
                Sound.wrong();

                learnState.attempts[learnState.currentPuzzle] = (currentAttempt || 0) + 1;

                setTimeout(() => {
                    btn.classList.remove('incorrect');
                    feedback.textContent = '';
                    feedback.classList.remove('incorrect');
                }, 800);
            }
        }

        // ===== SANDBOX SECTION =====
        let sandboxState = {
            selectedPiece: null,
            pieces: {},
            pickerReady: false,
            clearReady: false
        };

        function initSandbox() {
            const board = document.getElementById('sandbox-board');
            if (!board.querySelector('svg') && board.innerHTML.trim() === '') {
                const boardHtml = createBoard(8);
                board.innerHTML = boardHtml.match(/<rect[^>]*>/g).join('');
            }

            // Generate piece picker from PIECES data
            const picker = document.getElementById('piece-picker');
            if (!picker.hasChildNodes()) {
                picker.innerHTML = Object.entries(PIECES).map(([key, p]) =>
                    `<div class="piece-picker-item"><button class="piece-picker-btn" data-piece="${key}">${p.icon}</button><span>${p.name}</span></div>`
                ).join('');
            }

            document.getElementById('sandbox').classList.toggle('piece-selected', !!sandboxState.selectedPiece);
            document.querySelectorAll('.piece-picker-btn').forEach(b => b.classList.toggle('selected', b.dataset.piece === sandboxState.selectedPiece));

            if (!sandboxState.pickerReady) {
                sandboxState.pickerReady = true;
                document.querySelectorAll('.piece-picker-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.piece-picker-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        sandboxState.selectedPiece = btn.dataset.piece;
                        document.getElementById('sandbox').classList.add('piece-selected');
                        document.getElementById('sandbox-instruction').textContent =
                            `Click a square to place the ${PIECES[btn.dataset.piece].name}`;
                        Sound.click();
                    });
                });
            }

            if (!board.hasListener) {
                board.addEventListener('click', (e) => {
                    const square = e.target.closest('.square');
                    if (square && sandboxState.selectedPiece) {
                        const row = parseInt(square.dataset.row);
                        const col = parseInt(square.dataset.col);
                        placePieceOnBoard(row, col, sandboxState.selectedPiece);
                        Sound.click();
                    }
                });
                board.hasListener = true;
            }

            if (!sandboxState.clearReady) {
                sandboxState.clearReady = true;
                document.getElementById('sandbox-clear').addEventListener('click', () => {
                    sandboxState.pieces = {};
                    renderSandboxBoard();
                    Sound.click();
                });
            }
        }

        function placePieceOnBoard(row, col, piece) {
            const key = `${row},${col}`;
            if (sandboxState.pieces[key]) {
                delete sandboxState.pieces[key];
            } else {
                sandboxState.pieces[key] = piece;
            }
            renderSandboxBoard();
        }

        function renderSandboxBoard() {
            const board = document.getElementById('sandbox-board');
            if (!board.querySelector('svg')) {
                const boardHtml = createBoard(8);
                board.innerHTML = boardHtml;
            }

            document.querySelectorAll('#sandbox-board .piece-marker, #sandbox-board .move-highlight').forEach(el => el.remove());

            Object.entries(sandboxState.pieces).forEach(([key, piece]) => {
                const [row, col] = key.split(',').map(Number);
                const moves = getMovesForPiece(piece, row, col);

                moves.forEach(([r, c]) => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', c * 65 + 32.5);
                    circle.setAttribute('cy', r * 65 + 32.5);
                    circle.setAttribute('r', '12');
                    circle.setAttribute('fill', '#4ecdc4');
                    circle.setAttribute('opacity', '0.4');
                    circle.classList.add('move-highlight');
                    board.appendChild(circle);
                });

                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.innerHTML = svgPiece(col * 65 + 32.5, row * 65 + 52, PIECES[piece].icon, WHITE_COLOR, 50, 'class="piece-marker"');
                board.appendChild(g.firstChild);
            });
        }

        // ===== LESSONS SECTION (Rook) =====
        const L_CELL = 65;

        const rookChallenges = [
            {
                prompt: "Move the Rook to the star!",
                hint: "Rooks move in straight lines — up, down, left, or right.",
                rook: [4, 1],
                target: [4, 6],
                blockers: [],
                enemies: [],
                type: 'move' // simple straight-line move
            },
            {
                prompt: "Move the Rook up to the star!",
                hint: "Try going straight up!",
                rook: [6, 3],
                target: [1, 3],
                blockers: [],
                enemies: [],
                type: 'move'
            },
            {
                prompt: "Get the Rook to the star — but watch the wall!",
                hint: "The Rook can't jump over pieces. Go around!",
                rook: [4, 0],
                target: [4, 5],
                blockers: [{ pos: [4, 3], piece: 'pawn' }],
                enemies: [],
                type: 'navigate' // must go around a blocker
            },
            {
                prompt: "Capture the enemy Pawn!",
                hint: "Move the Rook onto the enemy piece to capture it!",
                rook: [5, 1],
                target: null, // target is the enemy
                blockers: [],
                enemies: [{ pos: [5, 6], piece: 'pawn' }],
                type: 'capture'
            },
            {
                prompt: "Capture the enemy Knight — don't get blocked!",
                hint: "You can't go through the pawn. Find another path!",
                rook: [6, 4],
                target: null,
                blockers: [{ pos: [3, 4], piece: 'pawn' }],
                enemies: [{ pos: [1, 4], piece: 'knight' }],
                type: 'capture'
            }
        ];

        let lessonState = {
            current: 0,
            stars: 0,
            attempts: 0,
            rookPos: null,
            moveCount: 0,
            maxMoves: 0,
            initialized: false,
            listening: false,
            completed: [],       // indexes of completed challenges
            starsPerChallenge: [] // stars earned per challenge
        };

        function lCellCenter(row, col) {
            return [col * L_CELL + L_CELL / 2, row * L_CELL + L_CELL / 2];
        }

        // Check if a rook move from A to B is valid (straight line, no blockers in the way)
        function isValidRookMove(from, to, blockers, enemies) {
            const [fr, fc] = from;
            const [tr, tc] = to;

            // Must be same row or same column
            if (fr !== tr && fc !== tc) return false;
            // Can't stay in place
            if (fr === tr && fc === tc) return false;

            // Check for blockers and enemies along the path
            const allPieces = [...blockers.map(b => b.pos), ...enemies.map(e => e.pos)];

            if (fr === tr) {
                // Horizontal move
                const minC = Math.min(fc, tc);
                const maxC = Math.max(fc, tc);
                for (const [pr, pc] of allPieces) {
                    if (pr === fr && pc > minC && pc < maxC) return false;
                }
            } else {
                // Vertical move
                const minR = Math.min(fr, tr);
                const maxR = Math.max(fr, tr);
                for (const [pr, pc] of allPieces) {
                    if (pc === fc && pr > minR && pr < maxR) return false;
                }
            }

            // Can't move onto a friendly blocker
            if (blockers.some(b => b.pos[0] === tr && b.pos[1] === tc)) return false;

            return true;
        }

        function lessonDrawBoard(svgEl, challenge, rookPos, options = {}) {
            let html = '';

            // Target position: star for move/navigate, enemy square for capture
            const targetPos = challenge.target || (challenge.enemies.length > 0 ? challenge.enemies[0].pos : null);
            const isTargetSquare = !!targetPos;

            // Draw 8x8 board
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const isDark = (r + c) % 2 === 1;
                    let fill = isDark ? '#B58863' : '#E8D5B5';

                    // Destination square: gold for move/navigate, red tint for capture
                    if (isTargetSquare && r === targetPos[0] && c === targetPos[1]) {
                        fill = challenge.type === 'capture'
                            ? 'rgba(255, 100, 100, 0.5)'
                            : 'rgba(255, 215, 0, 0.6)';
                    }
                    // Highlight other valid rook moves (teal)
                    else if (options.showMoves && rookPos) {
                        if (isValidRookMove(rookPos, [r, c], challenge.blockers, challenge.enemies)) {
                            fill = isDark ? 'rgba(78,205,196,0.4)' : 'rgba(78,205,196,0.25)';
                        }
                    }

                    html += `<rect x="${c * L_CELL}" y="${r * L_CELL}" width="${L_CELL}" height="${L_CELL}" fill="${fill}" class="square" data-row="${r}" data-col="${c}" style="cursor:pointer;"/>`;
                }
            }

            // Draw target star for move/navigate - static, large (pointer-events: none so clicks pass through)
            if (targetPos && challenge.type !== 'capture') {
                const [tx, ty] = lCellCenter(targetPos[0], targetPos[1]);
                html += `<text x="${tx}" y="${ty + 14}" font-size="48" text-anchor="middle" fill="#ffd700" class="star-target" style="pointer-events:none">⭐</text>`;
            }

            // Draw blockers (pointer-events: none so clicks pass through to square rect)
            for (const b of challenge.blockers) {
                const [bx, by] = lCellCenter(b.pos[0], b.pos[1]);
                html += `<text x="${bx}" y="${by + 18}" font-size="50" text-anchor="middle" fill="${WHITE_COLOR}" stroke="#333" stroke-width="1.5" paint-order="stroke" class="blocker-piece" style="pointer-events:none">${PIECES[b.piece].icon}</text>`;
            }

            // Draw enemies (pointer-events: none so clicks pass through to square rect for capture)
            for (const e of challenge.enemies) {
                const [ex, ey] = lCellCenter(e.pos[0], e.pos[1]);
                html += `<text x="${ex}" y="${ey + 18}" font-size="54" text-anchor="middle" fill="${ENEMY_COLOR}" stroke="#000" stroke-width="0.5" paint-order="stroke" class="enemy-target" style="pointer-events:none">${PIECES[e.piece].blackIcon}</text>`;
            }

            // Draw rook (pointer-events: none so clicks pass through to square rect)
            if (rookPos) {
                const [rx, ry] = lCellCenter(rookPos[0], rookPos[1]);
                html += svgPiece(rx, ry + 18, PIECES.rook.icon, WHITE_COLOR, 56, 'class="lesson-rook" id="lesson-rook" style="pointer-events:none"');
            }

            svgEl.innerHTML = html;
        }

        // Short labels for sidebar
        const challengeLabels = ['Move Right', 'Move Up', 'Go Around', 'Capture!', 'Blocked Capture'];

        function lessonUpdateContentPanel() {
            const bodyEl = document.getElementById('lesson-content-body');
            const headerEl = document.querySelector('.lesson-content-header');
            if (!bodyEl || !headerEl) return;

            const introVisible = document.getElementById('lesson-intro').style.display !== 'none';
            const completeVisible = document.getElementById('lesson-complete').style.display !== 'none';

            if (introVisible) {
                headerEl.textContent = '♖ Rook Basics';
                bodyEl.innerHTML = `
                    <div class="lesson-elephant-thumb">
                        <img src="images/rook_elephant.png" alt="Rook and Elephant" />
                    </div>
                    <p>Like an elephant, the Rook moves in <strong>straight lines</strong> — up, down, left, or right.</p>
                    <p>It can travel as far as it wants in one direction, but it <strong>can't jump</strong> over other pieces.</p>
                    <p>To capture, the Rook lands on the enemy square.</p>
                `;
            } else if (completeVisible) {
                headerEl.textContent = '♖ You Did It!';
                bodyEl.innerHTML = `
                    <p>You've mastered the Rook!</p>
                    <p>Remember: straight lines only, no jumping, and capture by landing on enemies.</p>
                `;
            } else {
                const ch = rookChallenges[lessonState.current];
                const label = challengeLabels[lessonState.current] || 'Challenge ' + (lessonState.current + 1);
                headerEl.textContent = label;
                bodyEl.innerHTML = `<p class="hint-text">💡 ${ch.hint}</p>`;
            }
        }

        function lessonBuildSidebar() {
            const list = document.getElementById('lesson-nav-list');
            list.innerHTML = rookChallenges.map((ch, i) => {
                const isCompleted = lessonState.completed.includes(i);
                const isActive = lessonState.current === i;
                const statusIcon = isCompleted ? '✓' : (i + 1);
                const starsText = lessonState.starsPerChallenge[i] ? '★'.repeat(lessonState.starsPerChallenge[i]) : '';

                let cls = 'lesson-nav-item';
                if (isActive) cls += ' active';
                if (isCompleted) cls += ' completed';

                return `<li class="${cls}" data-challenge="${i}">
                    <span class="lesson-nav-status">${statusIcon}</span>
                    <span class="lesson-nav-label">${challengeLabels[i] || 'Challenge ' + (i + 1)}</span>
                    ${starsText ? `<span class="lesson-nav-stars">${starsText}</span>` : ''}
                </li>`;
            }).join('');

            // Update total stars in sidebar
            document.getElementById('lesson-sidebar-stars').textContent = lessonState.stars;

            lessonUpdateContentPanel();

            // Click handlers for sidebar items
            list.querySelectorAll('.lesson-nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    const idx = parseInt(item.dataset.challenge);
                    if (idx === lessonState.current) return;
                    Sound.click();
                    lessonJumpTo(idx);
                });
            });
        }

        function lessonJumpTo(idx) {
            // Remove board listener if active
            const boardSvg = document.getElementById('lesson-board');
            boardSvg.removeEventListener('click', lessonBoardClick);
            lessonState.listening = false;

            lessonState.current = idx;

            // Make sure challenge screen is visible
            document.getElementById('lesson-intro').style.display = 'none';
            document.getElementById('lesson-complete').style.display = 'none';
            document.getElementById('lesson-challenge').style.display = 'block';

            lessonRenderChallenge();
        }

        function initLessons() {
            if (lessonState.initialized) return;
            lessonState.initialized = true;

            // Build sidebar and content panel
            lessonBuildSidebar();
            lessonUpdateContentPanel();

            document.getElementById('lesson-start').addEventListener('click', () => {
                Sound.click();
                lessonState.current = 0;
                lessonState.stars = 0;
                lessonState.completed = [];
                lessonState.starsPerChallenge = [];
                document.getElementById('lesson-intro').style.display = 'none';
                document.getElementById('lesson-challenge').style.display = 'block';
                lessonBuildSidebar();
                lessonUpdateContentPanel();
                lessonRenderChallenge();
            });

            document.getElementById('lesson-play-again').addEventListener('click', () => {
                Sound.click();
                lessonState.current = 0;
                lessonState.stars = 0;
                lessonState.completed = [];
                lessonState.starsPerChallenge = [];
                lessonState.initialized = false;
                document.getElementById('lesson-complete').style.display = 'none';
                document.getElementById('lesson-challenge').style.display = 'none';
                document.getElementById('lesson-intro').style.display = '';
                lessonUpdateContentPanel();
                initLessons();
            });
        }

        function lessonRenderChallenge() {
            const ch = rookChallenges[lessonState.current];
            lessonState.rookPos = [...ch.rook];
            lessonState.attempts = 0;
            lessonState.moveCount = 0;
            lessonState.listening = false;

            // For navigate/capture, allow more moves; for simple move, allow 1
            lessonState.maxMoves = (ch.type === 'navigate' || ch.type === 'capture') ? 3 : 1;

            // Update sidebar
            lessonBuildSidebar();

            document.getElementById('lesson-num').textContent = lessonState.current + 1;
            document.getElementById('lesson-total').textContent = rookChallenges.length;
            document.getElementById('lesson-stars').textContent = lessonState.stars;
            document.getElementById('lesson-prompt').textContent = ch.prompt;

            const feedbackEl = document.getElementById('lesson-feedback');
            feedbackEl.textContent = 'Tap a square to move the Rook!';
            feedbackEl.className = 'lesson-feedback hint';

            const boardSvg = document.getElementById('lesson-board');
            lessonDrawBoard(boardSvg, ch, lessonState.rookPos, { showMoves: true });

            // Set up click listener
            if (!lessonState.listening) {
                lessonState.listening = true;
                boardSvg.addEventListener('click', lessonBoardClick);
            }
        }

        function lessonBoardClick(e) {
            const rect = e.target.closest('.square');
            if (!rect) return;

            const r = parseInt(rect.dataset.row);
            const c = parseInt(rect.dataset.col);
            const ch = rookChallenges[lessonState.current];
            const feedbackEl = document.getElementById('lesson-feedback');
            const boardSvg = document.getElementById('lesson-board');

            // Check if it's a valid rook move
            if (!isValidRookMove(lessonState.rookPos, [r, c], ch.blockers, ch.enemies)) {
                lessonState.attempts++;
                Sound.wrong();

                // Give specific feedback
                const [fr, fc] = lessonState.rookPos;
                if (fr !== r && fc !== c) {
                    feedbackEl.textContent = "Rooks can only move in straight lines — not diagonally!";
                } else if (ch.blockers.some(b => b.pos[0] === r && b.pos[1] === c)) {
                    feedbackEl.textContent = "That square has a friendly piece on it!";
                } else {
                    feedbackEl.textContent = ch.hint;
                }
                feedbackEl.className = 'lesson-feedback wrong';

                setTimeout(() => {
                    feedbackEl.textContent = 'Tap a highlighted square!';
                    feedbackEl.className = 'lesson-feedback hint';
                }, 1500);
                return;
            }

            // Valid move!
            Sound.click();
            lessonState.rookPos = [r, c];
            lessonState.moveCount++;

            // Check if we reached the target
            let solved = false;

            if (ch.type === 'capture') {
                // Check if we landed on an enemy
                const capturedEnemy = ch.enemies.find(e => e.pos[0] === r && e.pos[1] === c);
                if (capturedEnemy) {
                    solved = true;
                }
            } else {
                // Check if we reached the target square
                if (ch.target && r === ch.target[0] && c === ch.target[1]) {
                    solved = true;
                }
            }

            if (solved) {
                lessonChallengeSolved(ch);
                return;
            }

            // Not solved yet — if navigate type, allow more moves
            if (lessonState.moveCount < lessonState.maxMoves) {
                // Redraw board with rook at new position, update remaining enemies
                const remainingEnemies = ch.enemies.filter(e => !(e.pos[0] === r && e.pos[1] === c));
                const updatedChallenge = { ...ch, enemies: remainingEnemies };
                lessonDrawBoard(boardSvg, updatedChallenge, lessonState.rookPos, { showMoves: true });
                feedbackEl.textContent = 'Good! Now move again!';
                feedbackEl.className = 'lesson-feedback correct';
            } else {
                // Out of moves without reaching target
                lessonState.attempts++;
                Sound.wrong();
                feedbackEl.textContent = "Not quite — let's try again!";
                feedbackEl.className = 'lesson-feedback wrong';

                // Reset rook position after a pause
                setTimeout(() => {
                    lessonState.rookPos = [...ch.rook];
                    lessonState.moveCount = 0;
                    lessonDrawBoard(boardSvg, ch, lessonState.rookPos, { showMoves: true });
                    feedbackEl.textContent = ch.hint;
                    feedbackEl.className = 'lesson-feedback hint';
                }, 1200);
            }
        }

        function lessonChallengeSolved(ch) {
            const boardSvg = document.getElementById('lesson-board');
            const feedbackEl = document.getElementById('lesson-feedback');

            // Remove click listener temporarily
            boardSvg.removeEventListener('click', lessonBoardClick);
            lessonState.listening = false;

            Sound.correct();

            // Award stars
            let earned = 3;
            if (lessonState.attempts === 1) earned = 2;
            if (lessonState.attempts >= 2) earned = 1;
            lessonState.stars += earned;
            document.getElementById('lesson-stars').textContent = lessonState.stars;

            // Redraw board clean (no move highlights)
            const remainingEnemies = ch.enemies.filter(e =>
                !(e.pos[0] === lessonState.rookPos[0] && e.pos[1] === lessonState.rookPos[1])
            );
            const updatedCh = { ...ch, enemies: remainingEnemies };
            lessonDrawBoard(boardSvg, updatedCh, lessonState.rookPos, { showMoves: false });

            // Show success
            if (ch.type === 'capture') {
                feedbackEl.innerHTML = `Captured! ${Array(earned).fill('<span class="star">★</span>').join('')}`;
            } else {
                feedbackEl.innerHTML = `Perfect! ${Array(earned).fill('<span class="star">★</span>').join('')}`;
            }
            feedbackEl.className = 'lesson-feedback correct';

            Sound.star();

            // Next challenge or completion
            setTimeout(() => {
                lessonState.current++;
                if (lessonState.current >= rookChallenges.length) {
                    // Show completion
                    document.getElementById('lesson-challenge').style.display = 'none';
                    document.getElementById('lesson-complete').style.display = 'block';
                    document.getElementById('lesson-final-stars').textContent = lessonState.stars + ' ★';
                    lessonBuildSidebar();
                    lessonUpdateContentPanel();
                    Sound.star();
                } else {
                    lessonRenderChallenge();
                }
            }, 1500);
        }

        // ===== SAVE THE KING SECTION =====
        const SK_CELL = 65;

        const skPuzzles = [
            {
                story: "The Rook is charging straight at the King!",
                // King at e1 (7,4), enemy Rook at e8 (0,4) — check along file
                king: [7, 4],
                attacker: { piece: 'rook', pos: [0, 4] },
                friends: [],
                solution: 'move',
                // Safe squares king can move to
                safeMoves: [[7, 3], [7, 5]],
                successText: "The King ran to safety!"
            },
            {
                story: "A sneaky Bishop attacks from the diagonal!",
                // King at e1 (7,4), enemy Bishop at b4 (4,1) — diagonal check
                // Diagonal: (4,1)→(5,2)→(6,3)→(7,4)
                // Rook at (5,5) can slide to (5,2) to block
                king: [7, 4],
                attacker: { piece: 'bishop', pos: [4, 1] },
                friends: [{ piece: 'rook', pos: [5, 5] }],
                solution: 'block',
                blockSquare: [5, 2],
                blockPiece: { piece: 'rook', pos: [5, 5] },
                successText: "The Rook blocked the attack!"
            },
            {
                story: "The enemy Queen is attacking! Can anyone capture her?",
                // King at g1 (7,6), enemy Queen at g5 (3,6) — file check
                // Knight at (5,5) can reach (3,6) via [-2,1]
                king: [7, 6],
                attacker: { piece: 'queen', pos: [3, 6] },
                friends: [{ piece: 'knight', pos: [5, 5] }],
                solution: 'capture',
                capturePiece: { piece: 'knight', pos: [5, 5] },
                successText: "The Knight captured the Queen!"
            },
            {
                story: "Surrounded! The King must find the ONE safe square!",
                // King at e1 (7,4), enemy Rook at a1 (7,0) — rank check
                // Enemy Bishop at (5,6): attacks (6,5),(7,4),(6,7)
                // Enemy Knight at (5,3): attacks (6,1),(6,5),(7,1),(7,5),(4,1),(4,5),(3,2),(3,4)
                // Wait knight also attacks (6,5) and (7,5).
                // Actually let me use a simpler approach: bishop at (5,2) covers (6,3) and a knight covers (6,4)
                // Bishop at (5,2): attacks (6,3),(7,4),(6,1),(4,3),(4,1)
                // Knight at (5,5): attacks (6,3)? No. Knight offsets from (5,5): (6,7),(6,3),(4,7),(4,3),(7,6),(7,4),(3,6),(3,4)
                // Knight at (5,5) attacks (6,3)! And (7,4) — double check from knight + rook.
                // King moves: (6,3)✗knight, (6,4), (6,5), (7,3)✗rook, (7,5)✗rook
                // Need to also cover (6,4). Bishop at (5,2) doesn't cover (6,4).
                // But bishop at (5,3) covers (6,4): from (5,3) going [1,1]=(6,4). Yes!
                // Bishop at (5,3): attacks (6,4),(7,5),(6,2),(7,1),(4,4),(4,2)
                // BUT (4,4) attacks king's current pos approach — bishop wouldn't give check since king is at (7,4)
                // King at (7,4) moves: (6,3)✗knight@(5,5)→(6,3), (6,4)✗bishop@(5,3)→(6,4), (6,5), (7,3)✗rook, (7,5)✗rook+bishop
                // Only (6,5) is safe!
                king: [7, 4],
                attacker: { piece: 'rook', pos: [7, 0] },
                friends: [],
                extraAttackers: [
                    { piece: 'knight', pos: [5, 5] },
                    { piece: 'bishop', pos: [5, 3] }
                ],
                solution: 'move',
                safeMoves: [[6, 5]],
                successText: "Found the only safe square!"
            },
            {
                story: "The King is in check! Two escapes work — pick one!",
                // King at e4 (4,4), enemy Rook at e8 (0,4) — file check
                king: [4, 4],
                attacker: { piece: 'rook', pos: [0, 4] },
                friends: [
                    { piece: 'knight', pos: [1, 3] }
                ],
                solution: 'any',
                // Knight at (1,3) can reach (3,4) via L-shape — interposing on file
                safeMoves: [[4, 3], [4, 5], [5, 3], [5, 5], [3, 3], [3, 5]],
                blockSquare: [3, 4],
                blockPiece: { piece: 'knight', pos: [1, 3] },
                capturePiece: null,
                successText: "Great choice!"
            },
            {
                story: "Oh no... the King is surrounded!",
                // Checkmate position: King at h1 (7,7), Rook at a1 (7,0), Queen at g2 (6,6)
                king: [7, 7],
                attacker: { piece: 'rook', pos: [7, 0] },
                extraAttackers: [{ piece: 'queen', pos: [6, 6] }],
                friends: [],
                solution: 'checkmate',
                successText: ""
            }
        ];

        let skState = {
            currentPuzzle: 0,
            stars: 0,
            attempts: 0,
            phase: 'intro', // intro, puzzle, action, board-tap, finale, complete
            selectedAction: null,
            locked: false,
            initialized: false
        };

        function skCellCenter(row, col) {
            return [col * SK_CELL + SK_CELL / 2, row * SK_CELL + SK_CELL / 2];
        }

        function skDrawBoard(svgEl, options) {
            const { king, attacker, friends, extraAttackers, showAttackLine, dangerSquares, safeSquares, highlightSquares } = options;
            let html = '';

            // Draw 8x8 board
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const isDark = (r + c) % 2 === 1;
                    let fill = isDark ? '#B58863' : '#E8D5B5';

                    // Danger squares
                    if (dangerSquares && dangerSquares.some(([dr, dc]) => dr === r && dc === c)) {
                        fill = isDark ? 'rgba(180,50,50,0.7)' : 'rgba(255,80,80,0.5)';
                    }

                    // Safe squares
                    if (safeSquares && safeSquares.some(([sr, sc]) => sr === r && sc === c)) {
                        fill = isDark ? 'rgba(50,180,80,0.6)' : 'rgba(80,255,120,0.45)';
                    }

                    // Highlight squares (for tap targets)
                    if (highlightSquares && highlightSquares.some(([hr, hc]) => hr === r && hc === c)) {
                        fill = isDark ? 'rgba(78,205,196,0.5)' : 'rgba(78,205,196,0.35)';
                    }

                    html += `<rect x="${c * SK_CELL}" y="${r * SK_CELL}" width="${SK_CELL}" height="${SK_CELL}" fill="${fill}" class="square" data-row="${r}" data-col="${c}" style="cursor:pointer;"/>`;
                }
            }

            // Attack line
            if (showAttackLine && attacker && king) {
                const [kx, ky] = skCellCenter(king[0], king[1]);
                const [ax, ay] = skCellCenter(attacker.pos[0], attacker.pos[1]);
                html += `<line x1="${ax}" y1="${ay}" x2="${kx}" y2="${ky}" stroke="#ff4444" stroke-width="4" stroke-dasharray="8,6" class="attack-line" opacity="0.7"/>`;
            }

            // Extra attacker lines
            if (showAttackLine && extraAttackers && king) {
                for (const ea of extraAttackers) {
                    const [kx, ky] = skCellCenter(king[0], king[1]);
                    const [eax, eay] = skCellCenter(ea.pos[0], ea.pos[1]);
                    html += `<line x1="${eax}" y1="${eay}" x2="${kx}" y2="${ky}" stroke="#ff4444" stroke-width="4" stroke-dasharray="8,6" class="attack-line" opacity="0.5"/>`;
                }
            }

            // Draw friends (white pieces — big, bright, outlined)
            if (friends) {
                for (const f of friends) {
                    const [fx, fy] = skCellCenter(f.pos[0], f.pos[1]);
                    html += svgPiece(fx, fy + 18, PIECES[f.piece].icon, WHITE_COLOR, 54, `class="sk-friend-piece" data-piece="${f.piece}" data-row="${f.pos[0]}" data-col="${f.pos[1]}"`);
                }
            }

            // Draw attacker (red/black — filled icons, bright red, big)
            if (attacker) {
                const [ax, ay] = skCellCenter(attacker.pos[0], attacker.pos[1]);
                html += `<text x="${ax}" y="${ay + 18}" font-size="54" text-anchor="middle" fill="${ENEMY_COLOR}" stroke="#000" stroke-width="0.5" paint-order="stroke" class="sk-attacker-piece" id="sk-attacker">${PIECES[attacker.piece].blackIcon}</text>`;
            }

            // Draw extra attackers (same red style)
            if (extraAttackers) {
                for (let i = 0; i < extraAttackers.length; i++) {
                    const ea = extraAttackers[i];
                    const [eax, eay] = skCellCenter(ea.pos[0], ea.pos[1]);
                    html += `<text x="${eax}" y="${eay + 18}" font-size="54" text-anchor="middle" fill="${ENEMY_COLOR}" stroke="#000" stroke-width="0.5" paint-order="stroke" class="sk-extra-attacker">${PIECES[ea.piece].blackIcon}</text>`;
                }
            }

            // Draw king (last so it's on top — biggest piece, white with blue glow)
            if (king) {
                const [kx, ky] = skCellCenter(king[0], king[1]);
                const kingClass = options.kingClass || '';
                html += `<g id="sk-king-group" class="${kingClass}"><text x="${kx}" y="${ky + 18}" font-size="58" text-anchor="middle" fill="${WHITE_COLOR}" stroke="#1565C0" stroke-width="2" paint-order="stroke" id="sk-king">${PIECES.king.icon}</text></g>`;
            }

            svgEl.innerHTML = html;
        }

        // Get all squares attacked by a piece
        function skGetAttackedSquares(piece, pos) {
            const pd = PIECES[piece];
            const squares = [];
            if (pd.slides) {
                for (const [dr, dc] of pd.offsets) {
                    let r = pos[0] + dr, c = pos[1] + dc;
                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        squares.push([r, c]);
                        r += dr;
                        c += dc;
                    }
                }
            } else {
                for (const [dr, dc] of pd.offsets) {
                    const r = pos[0] + dr, c = pos[1] + dc;
                    if (r >= 0 && r < 8 && c >= 0 && c < 8) squares.push([r, c]);
                }
            }
            return squares;
        }

        // Check if a square is attacked by any of the given attackers
        function skIsAttacked(row, col, attackers) {
            for (const atk of attackers) {
                const attacked = skGetAttackedSquares(atk.piece, atk.pos);
                if (attacked.some(([r, c]) => r === row && c === col)) return true;
            }
            return false;
        }

        function skGetDangerSquares(puzzle) {
            const allAttackers = [puzzle.attacker];
            if (puzzle.extraAttackers) allAttackers.push(...puzzle.extraAttackers);
            const kingMoves = PIECES.king.offsets.map(([dr, dc]) => [puzzle.king[0] + dr, puzzle.king[1] + dc])
                .filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);

            return kingMoves.filter(([r, c]) => skIsAttacked(r, c, allAttackers));
        }

        function initSaveKing() {
            if (skState.initialized) return;
            skState.initialized = true;

            // Draw intro board — King with an approaching Rook
            const introSvg = document.getElementById('sk-intro-svg');
            if (introSvg) {
                skDrawBoard(introSvg, {
                    king: [4, 4],
                    attacker: { piece: 'rook', pos: [4, 0] },
                    friends: [],
                    showAttackLine: true,
                    kingClass: 'king-in-check'
                });
            }

            // Start button
            document.getElementById('sk-start-btn').addEventListener('click', () => {
                Sound.click();
                skState.phase = 'puzzle';
                skState.currentPuzzle = 0;
                skState.stars = 0;
                skState.attempts = 0;
                document.getElementById('sk-intro').style.display = 'none';
                document.getElementById('sk-puzzle').style.display = 'block';
                skRenderPuzzle();
            });

            // Play again
            document.getElementById('sk-play-again').addEventListener('click', () => {
                Sound.click();
                skState.phase = 'intro';
                skState.currentPuzzle = 0;
                skState.stars = 0;
                skState.attempts = 0;
                skState.locked = false;
                skState.initialized = false;
                document.getElementById('sk-complete').style.display = 'none';
                document.getElementById('sk-finale').style.display = 'none';
                document.getElementById('sk-puzzle').style.display = 'none';
                document.getElementById('sk-intro').style.display = '';
                initSaveKing();
            });
        }

        function skRenderPuzzle() {
            const puzzle = skPuzzles[skState.currentPuzzle];
            skState.locked = false;
            skState.selectedAction = null;
            skState.attempts = 0;

            document.getElementById('sk-puzzle-num').textContent = skState.currentPuzzle + 1;
            document.getElementById('sk-puzzle-total').textContent = skPuzzles.length;
            document.getElementById('sk-stars').textContent = skState.stars;
            document.getElementById('sk-story-line').textContent = puzzle.story;

            const statusEl = document.getElementById('sk-status');
            const feedbackEl = document.getElementById('sk-feedback');
            feedbackEl.textContent = '';
            feedbackEl.className = 'sk-feedback';

            // Handle checkmate puzzle differently
            if (puzzle.solution === 'checkmate') {
                statusEl.textContent = '';
                skShowCheckmatePuzzle(puzzle);
                return;
            }

            statusEl.textContent = '⚡ CHECK!';
            statusEl.className = 'sk-status check';

            Sound._play(() => {
                Sound.init();
                const now = Sound.ctx.currentTime;
                // Danger sound: descending buzz
                const osc = Sound.ctx.createOscillator();
                const gain = Sound.ctx.createGain();
                osc.connect(gain);
                gain.connect(Sound.ctx.destination);
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            });

            // Draw board
            const boardSvg = document.getElementById('sk-board');
            const dangerSquares = skGetDangerSquares(puzzle);

            skDrawBoard(boardSvg, {
                king: puzzle.king,
                attacker: puzzle.attacker,
                friends: puzzle.friends,
                extraAttackers: puzzle.extraAttackers || [],
                showAttackLine: true,
                dangerSquares: dangerSquares,
                kingClass: 'king-in-check'
            });

            // Phase 1: Board is dimmed, show action buttons with prompt
            boardSvg.classList.add('dimmed');
            boardSvg.classList.remove('active-board');

            const actionsEl = document.getElementById('sk-actions');
            const actions = [];

            const canMove = puzzle.solution === 'move' || puzzle.solution === 'any';
            const canBlock = puzzle.solution === 'block' || (puzzle.solution === 'any' && puzzle.blockPiece);
            const canCapture = puzzle.solution === 'capture' || (puzzle.solution === 'any' && puzzle.capturePiece);

            actions.push({
                id: 'move', label: '👟 Move', icon: '👟',
                available: canMove,
                desc: 'Run the King to safety'
            });
            actions.push({
                id: 'block', label: '🛡️ Block', icon: '🛡️',
                available: canBlock,
                desc: 'Place a friend in the way'
            });
            actions.push({
                id: 'capture', label: '⚔️ Capture', icon: '⚔️',
                available: canCapture,
                desc: 'Take the attacker!'
            });

            actionsEl.innerHTML = `<div class="sk-action-prompt">↓ How will you save the King? ↓</div>` +
                actions.map(a =>
                `<button class="sk-action-btn entrance ${a.available ? 'available' : 'disabled'}" data-action="${a.id}" title="${a.desc}">${a.label}</button>`
            ).join('');

            // Handle action clicks
            actionsEl.querySelectorAll('.sk-action-btn.available').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (skState.locked) return;
                    Sound.click();
                    skState.selectedAction = btn.dataset.action;

                    // Highlight selected button
                    actionsEl.querySelectorAll('.sk-action-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');

                    skHandleAction(puzzle, btn.dataset.action);
                });
            });

            // Handle disabled action clicks (wrong choice feedback)
            actionsEl.querySelectorAll('.sk-action-btn.disabled').forEach(btn => {
                btn.style.pointerEvents = 'auto';
                btn.style.cursor = 'pointer';
                btn.addEventListener('click', () => {
                    if (skState.locked) return;
                    Sound.wrong();
                    skState.attempts++;
                    feedbackEl.textContent = "That won't work here! Try another way.";
                    feedbackEl.className = 'sk-feedback wrong';
                    btn.style.animation = 'shake 0.4s ease';
                    setTimeout(() => { btn.style.animation = ''; }, 400);
                    setTimeout(() => {
                        feedbackEl.textContent = '';
                        feedbackEl.className = 'sk-feedback';
                    }, 1200);
                });
            });
        }

        function skHandleAction(puzzle, action) {
            const boardSvg = document.getElementById('sk-board');
            const feedbackEl = document.getElementById('sk-feedback');

            // Phase 2: activate the board, remove prompt
            boardSvg.classList.remove('dimmed');
            boardSvg.classList.add('active-board');
            const prompt = document.querySelector('.sk-action-prompt');
            if (prompt) prompt.remove();

            if (action === 'move') {
                // Show safe squares and let kid tap
                feedbackEl.textContent = "Tap a green square to move the King!";
                feedbackEl.className = 'sk-feedback';

                const dangerSquares = skGetDangerSquares(puzzle);
                skDrawBoard(boardSvg, {
                    king: puzzle.king,
                    attacker: puzzle.attacker,
                    friends: puzzle.friends,
                    extraAttackers: puzzle.extraAttackers || [],
                    showAttackLine: true,
                    dangerSquares: dangerSquares,
                    safeSquares: puzzle.safeMoves,
                    kingClass: 'king-in-check'
                });

                // Listen for clicks on safe squares
                boardSvg.querySelectorAll('rect.square').forEach(rect => {
                    rect.addEventListener('click', function handler() {
                        if (skState.locked) return;
                        const r = parseInt(rect.dataset.row);
                        const c = parseInt(rect.dataset.col);

                        if (puzzle.safeMoves.some(([sr, sc]) => sr === r && sc === c)) {
                            skState.locked = true;
                            // Animate king moving
                            skAnimateKingMove(puzzle, [r, c], boardSvg);
                        } else {
                            skState.attempts++;
                            Sound.wrong();
                            feedbackEl.textContent = "Not safe there! Try a green square.";
                            feedbackEl.className = 'sk-feedback wrong';
                            setTimeout(() => {
                                feedbackEl.textContent = "Tap a green square to move the King!";
                                feedbackEl.className = 'sk-feedback';
                            }, 800);
                        }
                    });
                });

            } else if (action === 'block') {
                feedbackEl.textContent = "Tap the square to block the attack!";
                feedbackEl.className = 'sk-feedback';

                const dangerSquares = skGetDangerSquares(puzzle);
                skDrawBoard(boardSvg, {
                    king: puzzle.king,
                    attacker: puzzle.attacker,
                    friends: puzzle.friends,
                    extraAttackers: puzzle.extraAttackers || [],
                    showAttackLine: true,
                    dangerSquares: dangerSquares,
                    highlightSquares: [puzzle.blockSquare],
                    kingClass: 'king-in-check'
                });

                boardSvg.querySelectorAll('rect.square').forEach(rect => {
                    rect.addEventListener('click', function handler() {
                        if (skState.locked) return;
                        const r = parseInt(rect.dataset.row);
                        const c = parseInt(rect.dataset.col);

                        if (r === puzzle.blockSquare[0] && c === puzzle.blockSquare[1]) {
                            skState.locked = true;
                            skAnimateBlock(puzzle, boardSvg);
                        } else {
                            skState.attempts++;
                            Sound.wrong();
                            feedbackEl.textContent = "Not there! Find the highlighted square.";
                            feedbackEl.className = 'sk-feedback wrong';
                            setTimeout(() => {
                                feedbackEl.textContent = "Tap the square to block the attack!";
                                feedbackEl.className = 'sk-feedback';
                            }, 800);
                        }
                    });
                });

            } else if (action === 'capture') {
                feedbackEl.textContent = "Tap the attacker to capture it!";
                feedbackEl.className = 'sk-feedback';

                const dangerSquares = skGetDangerSquares(puzzle);
                skDrawBoard(boardSvg, {
                    king: puzzle.king,
                    attacker: puzzle.attacker,
                    friends: puzzle.friends,
                    extraAttackers: puzzle.extraAttackers || [],
                    showAttackLine: true,
                    dangerSquares: dangerSquares,
                    highlightSquares: [puzzle.attacker.pos],
                    kingClass: 'king-in-check'
                });

                // Click the attacker
                const attackerEl = boardSvg.querySelector('#sk-attacker');
                if (attackerEl) {
                    attackerEl.style.cursor = 'pointer';
                    attackerEl.addEventListener('click', function handler() {
                        if (skState.locked) return;
                        skState.locked = true;
                        skAnimateCapture(puzzle, boardSvg);
                    });
                }

                // Also listen for square click on attacker pos
                boardSvg.querySelectorAll('rect.square').forEach(rect => {
                    rect.addEventListener('click', function handler() {
                        if (skState.locked) return;
                        const r = parseInt(rect.dataset.row);
                        const c = parseInt(rect.dataset.col);
                        if (r === puzzle.attacker.pos[0] && c === puzzle.attacker.pos[1]) {
                            skState.locked = true;
                            skAnimateCapture(puzzle, boardSvg);
                        }
                    });
                });
            }
        }

        function skAnimateKingMove(puzzle, newPos, boardSvg) {
            // Redraw board with king at new position, no attack line, no danger
            setTimeout(() => {
                skDrawBoard(boardSvg, {
                    king: newPos,
                    attacker: puzzle.attacker,
                    friends: puzzle.friends,
                    extraAttackers: puzzle.extraAttackers || [],
                    showAttackLine: false,
                    kingClass: 'king-saved'
                });
                skPuzzleSolved(puzzle);
            }, 100);
        }

        function skAnimateBlock(puzzle, boardSvg) {
            // Redraw with blocking piece in new position
            const updatedFriends = puzzle.friends.map(f => {
                if (f.piece === puzzle.blockPiece.piece && f.pos[0] === puzzle.blockPiece.pos[0] && f.pos[1] === puzzle.blockPiece.pos[1]) {
                    return { ...f, pos: puzzle.blockSquare };
                }
                return f;
            });

            setTimeout(() => {
                skDrawBoard(boardSvg, {
                    king: puzzle.king,
                    attacker: puzzle.attacker,
                    friends: updatedFriends,
                    extraAttackers: puzzle.extraAttackers || [],
                    showAttackLine: false,
                    kingClass: 'king-saved'
                });

                // Flash shield icon
                const [bx, by] = skCellCenter(puzzle.blockSquare[0], puzzle.blockSquare[1]);
                const shield = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                shield.setAttribute('x', bx);
                shield.setAttribute('y', by - 20);
                shield.setAttribute('font-size', '30');
                shield.setAttribute('text-anchor', 'middle');
                shield.setAttribute('fill', '#4ecdc4');
                shield.textContent = '🛡️';
                shield.style.animation = 'shield-flash 0.8s ease forwards';
                boardSvg.appendChild(shield);

                skPuzzleSolved(puzzle);
            }, 100);
        }

        function skAnimateCapture(puzzle, boardSvg) {
            // Draw the capturing piece on the attacker's square, attacker gone
            const capPiece = puzzle.capturePiece;
            const updatedFriends = puzzle.friends.filter(f =>
                !(f.piece === capPiece.piece && f.pos[0] === capPiece.pos[0] && f.pos[1] === capPiece.pos[1])
            );
            updatedFriends.push({ piece: capPiece.piece, pos: puzzle.attacker.pos });

            setTimeout(() => {
                skDrawBoard(boardSvg, {
                    king: puzzle.king,
                    attacker: null,
                    friends: updatedFriends,
                    extraAttackers: puzzle.extraAttackers || [],
                    showAttackLine: false,
                    kingClass: 'king-saved'
                });

                // Poof on attacker's old position
                const [ax, ay] = skCellCenter(puzzle.attacker.pos[0], puzzle.attacker.pos[1]);
                const poof = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                poof.setAttribute('x', ax);
                poof.setAttribute('y', ay);
                poof.setAttribute('font-size', '36');
                poof.setAttribute('text-anchor', 'middle');
                poof.textContent = '💥';
                poof.style.animation = 'poof 0.6s ease forwards';
                boardSvg.appendChild(poof);

                skPuzzleSolved(puzzle);
            }, 100);
        }

        function skPuzzleSolved(puzzle) {
            Sound.correct();

            const statusEl = document.getElementById('sk-status');
            statusEl.textContent = '✓ King is safe!';
            statusEl.className = 'sk-status safe';

            const feedbackEl = document.getElementById('sk-feedback');
            feedbackEl.textContent = puzzle.successText;
            feedbackEl.className = 'sk-feedback correct';

            // Award stars
            let earned = 3;
            if (skState.attempts === 1) earned = 2;
            if (skState.attempts >= 2) earned = 1;
            skState.stars += earned;
            document.getElementById('sk-stars').textContent = skState.stars;
            Sound.star();

            // Show star animation
            feedbackEl.innerHTML += ` <span class="stars">${Array(earned).fill('<span class="star">★</span>').join('')}</span>`;

            // Add next button
            const actionsEl = document.getElementById('sk-actions');
            actionsEl.innerHTML = `<button class="btn btn-primary sk-next-btn" id="sk-next-puzzle">Next Puzzle →</button>`;

            document.getElementById('sk-next-puzzle').addEventListener('click', () => {
                Sound.click();
                skState.currentPuzzle++;
                if (skState.currentPuzzle >= skPuzzles.length) {
                    // Show completion
                    document.getElementById('sk-puzzle').style.display = 'none';
                    document.getElementById('sk-complete').style.display = 'block';
                    document.getElementById('sk-final-stars').textContent = skState.stars + ' ★';
                    Sound.star();
                } else {
                    skRenderPuzzle();
                }
            });
        }

        function skShowCheckmatePuzzle(puzzle) {
            const boardSvg = document.getElementById('sk-board');
            const feedbackEl = document.getElementById('sk-feedback');
            const statusEl = document.getElementById('sk-status');
            const actionsEl = document.getElementById('sk-actions');

            // Get all king moves
            const allAttackers = [puzzle.attacker, ...(puzzle.extraAttackers || [])];
            const kingMoves = PIECES.king.offsets
                .map(([dr, dc]) => [puzzle.king[0] + dr, puzzle.king[1] + dc])
                .filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);

            // All are dangerous
            const dangerSquares = kingMoves.filter(([r, c]) => skIsAttacked(r, c, allAttackers));

            // Also the king's own square
            const allDanger = [...dangerSquares, puzzle.king];

            skDrawBoard(boardSvg, {
                king: puzzle.king,
                attacker: puzzle.attacker,
                friends: puzzle.friends,
                extraAttackers: puzzle.extraAttackers || [],
                showAttackLine: true,
                dangerSquares: allDanger,
                kingClass: 'king-in-check'
            });

            // Danger sound
            Sound._play(() => {
                Sound.init();
                const now = Sound.ctx.currentTime;
                for (let i = 0; i < 3; i++) {
                    const osc = Sound.ctx.createOscillator();
                    const gain = Sound.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(Sound.ctx.destination);
                    osc.frequency.setValueAtTime(400 - i * 100, now + i * 0.15);
                    gain.gain.setValueAtTime(0.15, now + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.15);
                    osc.start(now + i * 0.15);
                    osc.stop(now + (i + 1) * 0.15);
                }
            });

            statusEl.textContent = '⚡ CHECK!';
            statusEl.className = 'sk-status check';
            feedbackEl.textContent = "Can the King escape? Try tapping any square...";
            feedbackEl.className = 'sk-feedback';

            // All actions disabled
            actionsEl.innerHTML = [
                '<button class="sk-action-btn disabled">👟 Move</button>',
                '<button class="sk-action-btn disabled">🛡️ Block</button>',
                '<button class="sk-action-btn disabled">⚔️ Capture</button>'
            ].join('');

            let tapCount = 0;
            boardSvg.querySelectorAll('rect.square').forEach(rect => {
                rect.addEventListener('click', function handler() {
                    if (skState.locked) return;
                    tapCount++;
                    Sound.wrong();

                    if (tapCount === 1) {
                        feedbackEl.textContent = "No! That square is also covered...";
                        feedbackEl.className = 'sk-feedback wrong';
                    } else if (tapCount === 2) {
                        feedbackEl.textContent = "Nowhere to go...";
                        feedbackEl.className = 'sk-feedback wrong';
                    } else {
                        // Trigger checkmate reveal
                        skState.locked = true;
                        skRevealCheckmate(puzzle, boardSvg);
                    }
                });
            });
        }

        function skRevealCheckmate(puzzle, boardSvg) {
            const statusEl = document.getElementById('sk-status');
            const feedbackEl = document.getElementById('sk-feedback');
            const actionsEl = document.getElementById('sk-actions');

            // King falls over
            const kingGroup = boardSvg.querySelector('#sk-king-group');
            if (kingGroup) {
                kingGroup.classList.remove('king-in-check');
                kingGroup.classList.add('king-fallen');
            }

            // Dramatic checkmate sound
            Sound._play(() => {
                Sound.init();
                const now = Sound.ctx.currentTime;
                // Low dramatic chord
                const freqs = [130.81, 155.56, 196.00];
                for (let i = 0; i < freqs.length; i++) {
                    const osc = Sound.ctx.createOscillator();
                    const gain = Sound.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(Sound.ctx.destination);
                    osc.frequency.value = freqs[i];
                    osc.type = 'sawtooth';
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
                    osc.start(now);
                    osc.stop(now + 1.2);
                }
            });

            setTimeout(() => {
                statusEl.textContent = '💀 CHECKMATE!';
                statusEl.className = 'sk-status checkmate';

                feedbackEl.innerHTML = '<span style="color: #ff6b6b; font-size: 18px;">No escape. No block. No capture.</span><br><span style="color: #ffd700;">That\'s the GOAL of chess — trap the King!</span>';
                feedbackEl.className = 'sk-feedback';

                actionsEl.innerHTML = `<button class="btn btn-primary sk-next-btn" id="sk-checkmate-done">I Understand! →</button>`;

                document.getElementById('sk-checkmate-done').addEventListener('click', () => {
                    Sound.click();
                    skState.currentPuzzle++;
                    document.getElementById('sk-puzzle').style.display = 'none';
                    document.getElementById('sk-complete').style.display = 'block';
                    document.getElementById('sk-final-stars').textContent = skState.stars + ' ★';
                    Sound.star();
                });
            }, 1500);
        }

        // ===== SETUP SECTION =====
        let setupState = {
            selectedPiece: null,
            selectedPos: null
        };

        function initSetup() {
            const board = document.getElementById('setup-board');
            if (!board.querySelector('svg') && board.innerHTML.trim() === '') {
                const boardHtml = createBoard(8);
                board.innerHTML = boardHtml;
            }

            renderSetupBoard();

            document.getElementById('setup-reset').addEventListener('click', () => {
                setupState.selectedPiece = null;
                setupState.selectedPos = null;
                updateSetupInfo();
                renderSetupBoard();
                Sound.click();
            });
        }

        function renderSetupBoard() {
            const board = document.getElementById('setup-board');
            if (!board.querySelector('svg')) {
                const boardHtml = createBoard(8);
                board.innerHTML = boardHtml;
            }

            document.querySelectorAll('#setup-board .piece-marker, #setup-board .move-highlight, #setup-board .selected-marker').forEach(el => el.remove());

            const startingPosition = {
                '0,0': 'rook', '0,1': 'knight', '0,2': 'bishop', '0,3': 'queen', '0,4': 'king', '0,5': 'bishop', '0,6': 'knight', '0,7': 'rook',
                '1,0': 'pawn', '1,1': 'pawn', '1,2': 'pawn', '1,3': 'pawn', '1,4': 'pawn', '1,5': 'pawn', '1,6': 'pawn', '1,7': 'pawn',
                '6,0': 'pawn', '6,1': 'pawn', '6,2': 'pawn', '6,3': 'pawn', '6,4': 'pawn', '6,5': 'pawn', '6,6': 'pawn', '6,7': 'pawn',
                '7,0': 'rook', '7,1': 'knight', '7,2': 'bishop', '7,3': 'queen', '7,4': 'king', '7,5': 'bishop', '7,6': 'knight', '7,7': 'rook'
            };

            Object.entries(startingPosition).forEach(([key, piece]) => {
                const [row, col] = key.split(',').map(Number);
                const isBlack = row < 2;
                const icon = isBlack ? PIECES[piece].blackIcon : PIECES[piece].icon;
                const fill = isBlack ? BLACK_COLOR : WHITE_COLOR;
                const stroke = isBlack ? '#FFF' : '#333';

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', col * 65 + 32.5);
                text.setAttribute('y', row * 65 + 52);
                text.setAttribute('font-size', '50');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', fill);
                text.setAttribute('stroke', stroke);
                text.setAttribute('stroke-width', isBlack ? '0.8' : '1.5');
                text.setAttribute('paint-order', 'stroke');
                text.setAttribute('class', `piece-marker setup-piece`);
                text.setAttribute('data-piece', piece);
                text.setAttribute('data-row', row);
                text.setAttribute('data-col', col);
                text.setAttribute('style', 'cursor: pointer;');
                text.textContent = icon;

                text.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setupState.selectedPiece = piece;
                    setupState.selectedPos = [row, col];
                    updateSetupInfo();
                    renderSetupBoard();
                    Sound.click();
                });

                board.appendChild(text);
            });

            if (setupState.selectedPiece && setupState.selectedPos) {
                const [row, col] = setupState.selectedPos;

                const selected = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                selected.setAttribute('cx', col * 65 + 32.5);
                selected.setAttribute('cy', row * 65 + 32.5);
                selected.setAttribute('r', '35');
                selected.setAttribute('fill', 'none');
                selected.setAttribute('stroke', '#4ecdc4');
                selected.setAttribute('stroke-width', '3');
                selected.classList.add('selected-marker');
                board.appendChild(selected);

                const boardState = {};
                Object.entries(startingPosition).forEach(([key, piece]) => {
                    const [r, c] = key.split(',').map(Number);
                    if (!boardState[r]) boardState[r] = {};
                    boardState[r][c] = piece;
                });

                const moves = getMovesForPiece(setupState.selectedPiece, row, col, boardState);
                const validMoves = new Set(moves.map(([r, c]) => `${r},${c}`));
                board.querySelectorAll('rect.square').forEach(rect => {
                    rect.classList.toggle('valid-move', validMoves.has(`${rect.dataset.row},${rect.dataset.col}`));
                });
                moves.forEach(([r, c]) => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', c * 65 + 32.5);
                    circle.setAttribute('cy', r * 65 + 32.5);
                    circle.setAttribute('r', '12');
                    circle.setAttribute('fill', '#4ecdc4');
                    circle.setAttribute('opacity', '0.6');
                    circle.classList.add('move-highlight');
                    board.appendChild(circle);
                });
            } else {
                board.querySelectorAll('rect.square').forEach(rect => rect.classList.remove('valid-move'));
            }
        }

        function updateSetupInfo() {
            const info = document.querySelector('.piece-info');
            if (setupState.selectedPiece) {
                const piece = PIECES[setupState.selectedPiece];
                info.innerHTML = `
                    <div class="piece-symbol">${piece.icon}</div>
                    <div class="piece-name">${piece.name}</div>
                    <div class="piece-description">${piece.description}</div>
                `;
                info.classList.remove('piece-info-empty');
            } else {
                info.innerHTML = '<div style="font-size: 14px;">Click a piece to learn about it</div>';
                info.classList.add('piece-info-empty');
            }
        }

        // ===== NAV =====
        function showSection(sectionId) {
            document.title = PAGE_TITLE;
            document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.section === sectionId);
            });

            if (sectionId === 'learn') initLearn();
            if (sectionId === 'lessons') initLessons();
            if (sectionId === 'sandbox') initSandbox();
            if (sectionId === 'save-king') initSaveKing();
            if (sectionId === 'setup') initSetup();
        }

        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.addEventListener('click', () => {
                Sound.click();
                showSection(btn.dataset.section);
            });
        });

        // Initialize
        initLearn();
