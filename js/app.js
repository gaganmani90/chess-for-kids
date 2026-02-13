        // ===== SOUND SYSTEM =====
        const STORAGE_KEY_MUTE = 'chess-for-kids-muted';
        const STORAGE_KEY_STARS = 'chess-for-kids-stars';
        const PAGE_TITLE = 'Chess for Kids';

        let soundMuted = JSON.parse(localStorage.getItem(STORAGE_KEY_MUTE) || 'false');

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

        const muteBtn = document.getElementById('mute-btn');
        muteBtn.textContent = soundMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('muted', soundMuted);
        muteBtn.addEventListener('click', () => {
            soundMuted = !soundMuted;
            localStorage.setItem(STORAGE_KEY_MUTE, JSON.stringify(soundMuted));
            muteBtn.textContent = soundMuted ? '🔇' : '🔊';
            muteBtn.classList.toggle('muted', soundMuted);
            muteBtn.setAttribute('aria-label', soundMuted ? 'Sound off - tap to unmute' : 'Sound on - tap to mute');
            muteBtn.setAttribute('title', soundMuted ? 'Sound off' : 'Sound on');
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
                color: WHITE_COLOR,
                accentColor: '#64B5F6',
                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: false,
                description: 'The King is the most important piece. It moves one square in any direction.'
            },
            queen: {
                icon: '♕', blackIcon: '♛',
                name: 'Queen',
                color: WHITE_COLOR,
                accentColor: '#FFD54F',
                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: true,
                description: 'The Queen is the most powerful piece. It moves any number of squares in any direction.'
            },
            rook: {
                icon: '♖', blackIcon: '♜',
                name: 'Rook',
                color: WHITE_COLOR,
                accentColor: '#EF5350',
                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0]],
                slides: true,
                description: 'The Rook moves any number of squares horizontally or vertically.'
            },
            bishop: {
                icon: '♗', blackIcon: '♝',
                name: 'Bishop',
                color: WHITE_COLOR,
                accentColor: '#66BB6A',
                offsets: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: true,
                description: 'The Bishop moves any number of squares diagonally.'
            },
            knight: {
                icon: '♘', blackIcon: '♞',
                name: 'Knight',
                color: WHITE_COLOR,
                accentColor: '#AB47BC',
                offsets: [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]],
                slides: false,
                description: 'The Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular. It can jump over pieces!'
            },
            pawn: {
                icon: '♙', blackIcon: '♟',
                name: 'Pawn',
                color: WHITE_COLOR,
                accentColor: '#90CAF9',
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
        const learnData = {
            easy: [
                {
                    piece: 'pawn',
                    title: 'A student walking to school',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#87CEEB"/>
                        <rect y="200" width="520" height="100" fill="#90EE90"/>
                        <circle cx="260" cy="100" r="20" fill="#FFB6C1"/>
                        <rect x="250" y="120" width="20" height="40" fill="#FFB6C1"/>
                        <rect x="240" y="160" width="10" height="30" fill="#FFB6C1"/>
                        <rect x="270" y="160" width="10" height="30" fill="#FFB6C1"/>
                        <line x1="260" y1="120" x2="240" y2="150" stroke="#FFB6C1" stroke-width="8"/>
                        <line x1="260" y1="120" x2="280" y2="150" stroke="#FFB6C1" stroke-width="8"/>
                        <line x1="100" y1="220" x2="420" y2="220" stroke="#8B4513" stroke-width="3"/>
                        <circle cx="100" cy="220" r="8" fill="#FFD700"/>
                        <circle cx="200" cy="220" r="8" fill="#FFD700"/>
                        <circle cx="300" cy="220" r="8" fill="#FFD700"/>
                        <circle cx="400" cy="220" r="8" fill="#FFD700"/>
                        <text x="260" y="260" font-size="20" text-anchor="middle" fill="#333">Moving straight ahead one step at a time</text>
                    </svg>`
                },
                {
                    piece: 'rook',
                    title: 'A student in a hallway',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#D3D3D3"/>
                        <rect x="50" y="50" width="400" height="200" fill="#C0C0C0" stroke="#999" stroke-width="2"/>
                        <circle cx="260" cy="150" r="20" fill="#FFB6C1"/>
                        <rect x="250" y="170" width="20" height="40" fill="#FFB6C1"/>
                        <line x1="260" y1="100" x2="260" y2="50" stroke="#FF0000" stroke-width="3"/>
                        <line x1="260" y1="200" x2="260" y2="250" stroke="#FF0000" stroke-width="3"/>
                        <line x1="100" y1="150" x2="50" y2="150" stroke="#FF0000" stroke-width="3"/>
                        <line x1="420" y1="150" x2="470" y2="150" stroke="#FF0000" stroke-width="3"/>
                        <text x="260" y="280" font-size="20" text-anchor="middle" fill="#333">Moving in 4 directions: up, down, left, right</text>
                    </svg>`
                },
                {
                    piece: 'knight',
                    title: 'A student jumping obstacles',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#87CEEB"/>
                        <circle cx="260" cy="120" r="20" fill="#FFB6C1"/>
                        <rect x="250" y="140" width="20" height="40" fill="#FFB6C1"/>
                        <rect x="100" y="180" width="40" height="40" fill="#8B4513"/>
                        <rect x="320" y="160" width="40" height="40" fill="#8B4513"/>
                        <rect x="200" y="220" width="40" height="30" fill="#8B4513"/>
                        <line x1="260" y1="140" x2="300" y2="160" stroke="#4169E1" stroke-width="3" stroke-dasharray="5,5"/>
                        <line x1="300" y1="160" x2="340" y2="140" stroke="#4169E1" stroke-width="3" stroke-dasharray="5,5"/>
                        <path d="M 260 140 Q 300 120 340 140" stroke="#FFD700" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
                        <text x="260" y="280" font-size="18" text-anchor="middle" fill="#333">Jumping in an L-shape: 2+1 squares</text>
                    </svg>`
                },
                {
                    piece: 'bishop',
                    title: 'A student exploring interests',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#F0E68C"/>
                        <circle cx="260" cy="150" r="20" fill="#FFB6C1"/>
                        <rect x="250" y="170" width="20" height="40" fill="#FFB6C1"/>
                        <circle cx="140" cy="80" r="15" fill="#4169E1"/>
                        <circle cx="380" cy="80" r="15" fill="#FF69B4"/>
                        <circle cx="140" cy="240" r="15" fill="#32CD32"/>
                        <circle cx="380" cy="240" r="15" fill="#FFD700"/>
                        <line x1="260" y1="150" x2="140" y2="80" stroke="#FF0000" stroke-width="2" stroke-dasharray="5,5"/>
                        <line x1="260" y1="150" x2="380" y2="80" stroke="#FF0000" stroke-width="2" stroke-dasharray="5,5"/>
                        <line x1="260" y1="150" x2="140" y2="240" stroke="#FF0000" stroke-width="2" stroke-dasharray="5,5"/>
                        <line x1="260" y1="150" x2="380" y2="240" stroke="#FF0000" stroke-width="2" stroke-dasharray="5,5"/>
                        <text x="260" y="280" font-size="18" text-anchor="middle" fill="#333">Moving diagonally in all directions</text>
                    </svg>`
                },
                {
                    piece: 'queen',
                    title: 'A student leader (the Queen)',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#FFE4E1"/>
                        <circle cx="260" cy="120" r="20" fill="#FFB6C1"/>
                        <polygon points="260,80 275,105 290,100 280,115 295,130 270,125 260,145 250,125 225,130 240,115 230,100 245,105" fill="#FFD700"/>
                        <rect x="250" y="140" width="20" height="40" fill="#FFB6C1"/>
                        <line x1="260" y1="100" x2="260" y2="50" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="380" y2="50" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="140" y2="50" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="380" y2="220" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="140" y2="220" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="100" y2="100" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="420" y2="100" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="100" x2="260" y2="250" stroke="#FF0000" stroke-width="2"/>
                        <text x="260" y="280" font-size="18" text-anchor="middle" fill="#333">Most powerful! Moves like Rook + Bishop</text>
                    </svg>`
                },
                {
                    piece: 'king',
                    title: 'A parent protecting their child',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#ADD8E6"/>
                        <circle cx="260" cy="100" r="25" fill="#FFD700"/>
                        <polygon points="260,65 270,75 280,70 275,85 290,95 270,90 260,105 250,90 230,95 245,85 240,70 250,75" fill="#FFD700"/>
                        <rect x="245" y="125" width="30" height="50" fill="#8B4513"/>
                        <rect x="200" y="175" width="15" height="60" fill="#FFB6C1"/>
                        <rect x="305" y="175" width="15" height="60" fill="#FFB6C1"/>
                        <circle cx="180" cy="160" r="15" fill="#FFB6C1"/>
                        <circle cx="340" cy="160" r="15" fill="#FFB6C1"/>
                        <line x1="260" y1="125" x2="200" y2="160" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="125" x2="320" y2="160" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="125" x2="260" y2="180" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="125" x2="220" y2="145" stroke="#FF0000" stroke-width="2"/>
                        <line x1="260" y1="125" x2="300" y2="145" stroke="#FF0000" stroke-width="2"/>
                        <circle cx="260" cy="150" r="30" fill="none" stroke="#FF0000" stroke-width="1" stroke-dasharray="5,5"/>
                        <text x="260" y="280" font-size="18" text-anchor="middle" fill="#333">Moves one square in any direction</text>
                    </svg>`
                }
            ],
            hard: [
                {
                    piece: 'pawn',
                    title: 'A tiny person taking careful steps',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#4B0082"/>
                        <circle cx="260" cy="80" r="12" fill="#FFB6C1"/>
                        <rect x="255" y="92" width="10" height="25" fill="#FFB6C1"/>
                        <rect x="250" y="117" width="5" height="20" fill="#FFB6C1"/>
                        <rect x="265" y="117" width="5" height="20" fill="#FFB6C1"/>
                        <line x1="260" y1="92" x2="245" y2="110" stroke="#FFB6C1" stroke-width="4"/>
                        <line x1="260" y1="92" x2="275" y2="110" stroke="#FFB6C1" stroke-width="4"/>
                        <rect x="50" y="200" width="420" height="15" fill="#8B7355" rx="7"/>
                        <circle cx="100" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="150" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="200" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="250" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="300" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="350" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="400" cy="207" r="3" fill="#FFD700"/>
                        <circle cx="450" cy="207" r="3" fill="#FFD700"/>
                        <text x="260" y="260" font-size="16" text-anchor="middle" fill="#FFF">Can you see it moving forward slowly?</text>
                    </svg>`
                },
                {
                    piece: 'rook',
                    title: 'A robot moving in a maze',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#696969"/>
                        <rect x="80" y="50" width="360" height="200" fill="#000" stroke="#666" stroke-width="3"/>
                        <rect x="100" y="70" width="320" height="30" fill="#555"/>
                        <rect x="100" y="130" width="320" height="30" fill="#555"/>
                        <rect x="100" y="190" width="320" height="30" fill="#555"/>
                        <rect x="100" y="70" width="30" height="150" fill="#555"/>
                        <rect x="390" y="70" width="30" height="150" fill="#555"/>
                        <rect x="240" y="50" width="40" height="200" fill="none" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                        <circle cx="260" cy="140" r="12" fill="#FFD700" stroke="#FFF" stroke-width="2"/>
                        <text x="260" y="285" font-size="16" text-anchor="middle" fill="#FFF">Straight lines only, not around corners</text>
                    </svg>`
                },
                {
                    piece: 'knight',
                    title: 'A bouncy ball with tricky movement',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#87CEEB"/>
                        <circle cx="260" cy="100" r="25" fill="#FFD700" stroke="#FFF" stroke-width="2"/>
                        <circle cx="140" cy="160" r="8" fill="#FF0000" opacity="0.3"/>
                        <circle cx="380" cy="140" r="8" fill="#FF0000" opacity="0.3"/>
                        <circle cx="200" cy="240" r="8" fill="#FF0000" opacity="0.3"/>
                        <circle cx="320" cy="250" r="8" fill="#FF0000" opacity="0.3"/>
                        <path d="M 260 100 Q 190 140 140 160" stroke="#FF0000" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
                        <path d="M 260 100 Q 330 120 380 140" stroke="#FF0000" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
                        <path d="M 260 100 Q 210 180 200 240" stroke="#FF0000" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
                        <path d="M 260 100 Q 310 190 320 250" stroke="#FF0000" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
                        <text x="260" y="285" font-size="16" text-anchor="middle" fill="#333">Can jump over other pieces!</text>
                    </svg>`
                },
                {
                    piece: 'bishop',
                    title: 'A diagonal dancer on a stage',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#4B0082"/>
                        <circle cx="100" cy="100" r="8" fill="#FFD700"/>
                        <circle cx="420" cy="100" r="8" fill="#FFD700"/>
                        <circle cx="100" cy="220" r="8" fill="#FFD700"/>
                        <circle cx="420" cy="220" r="8" fill="#FFD700"/>
                        <line x1="100" y1="100" x2="420" y2="220" stroke="#FFD700" stroke-width="2" stroke-dasharray="5,5"/>
                        <line x1="420" y1="100" x2="100" y2="220" stroke="#FFD700" stroke-width="2" stroke-dasharray="5,5"/>
                        <circle cx="260" cy="160" r="18" fill="#FF1493" stroke="#FFD700" stroke-width="2"/>
                        <text x="260" y="285" font-size="16" text-anchor="middle" fill="#FFF">Always moves corner to corner</text>
                    </svg>`
                },
                {
                    piece: 'queen',
                    title: 'A queen with magical power',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#1a1a2e"/>
                        <circle cx="260" cy="150" r="80" fill="#FFD700" opacity="0.15"/>
                        <circle cx="260" cy="100" r="22" fill="#FFD700" stroke="#FFF" stroke-width="2"/>
                        <polygon points="260,70 272,90 285,85 275,100 290,115 270,110 260,130 250,110 230,115 245,100 235,85 248,90" fill="#FFD700"/>
                        <rect x="245" y="122" width="30" height="45" fill="#FFD700" stroke="#FFF" stroke-width="1"/>
                        <line x1="260" y1="100" x2="260" y2="40" stroke="#FFF" stroke-width="2" stroke-dasharray="3,3"/>
                        <line x1="260" y1="100" x2="360" y2="100" stroke="#FFF" stroke-width="2" stroke-dasharray="3,3"/>
                        <line x1="260" y1="100" x2="330" y2="170" stroke="#FFF" stroke-width="2" stroke-dasharray="3,3"/>
                        <line x1="260" y1="100" x2="160" y2="100" stroke="#FFF" stroke-width="2" stroke-dasharray="3,3"/>
                        <text x="260" y="280" font-size="16" text-anchor="middle" fill="#FFF">All directions at once - super power!</text>
                    </svg>`
                },
                {
                    piece: 'king',
                    title: 'A throne with limited reach',
                    svg: `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="520" height="300" fill="#2F4F4F"/>
                        <rect x="200" y="80" width="120" height="100" fill="#8B4513" stroke="#DAA520" stroke-width="3"/>
                        <polygon points="260,60 275,80 290,75 280,95 295,110 270,105 260,130 250,105 225,110 240,95 230,75 245,80" fill="#FFD700"/>
                        <circle cx="200" cy="130" r="12" fill="#FFD700"/>
                        <circle cx="320" cy="130" r="12" fill="#FFD700"/>
                        <circle cx="200" cy="160" r="12" fill="#FFD700"/>
                        <circle cx="320" cy="160" r="12" fill="#FFD700"/>
                        <circle cx="260" cy="200" r="8" fill="#FFD700"/>
                        <circle cx="260" cy="130" r="50" fill="none" stroke="#FF0000" stroke-width="2" stroke-dasharray="5,5"/>
                        <text x="260" y="280" font-size="14" text-anchor="middle" fill="#FFF">Can only move one square - must be safe!</text>
                    </svg>`
                }
            ]
        };

        const savedStars = parseInt(localStorage.getItem(STORAGE_KEY_STARS) || '0', 10);
        let learnState = {
            difficulty: 'easy',
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
            const data = learnData[learnState.difficulty];

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
                    localStorage.setItem(STORAGE_KEY_STARS, '0');
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

                let stars = 3;
                if (currentAttempt === 1) stars = 2;
                if (currentAttempt >= 2) stars = 1;

                learnState.scores[learnState.currentPuzzle] = stars;
                learnState.totalStars = learnState.scores.reduce((a, b) => a + b, 0);
                document.getElementById('total-stars').textContent = learnState.totalStars;
                localStorage.setItem(STORAGE_KEY_STARS, String(learnState.totalStars));

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

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                learnState.difficulty = btn.dataset.difficulty;
                learnState.currentPuzzle = 0;
                learnState.attempts = [];
                initLearn();
                Sound.click();
            });
        });

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
