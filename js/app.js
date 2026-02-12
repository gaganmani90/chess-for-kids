        // ===== SOUND SYSTEM =====
        let soundMuted = false;

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

        document.getElementById('mute-btn').addEventListener('click', () => {
            soundMuted = !soundMuted;
            const btn = document.getElementById('mute-btn');
            btn.textContent = soundMuted ? '🔇' : '🔊';
            btn.classList.toggle('muted', soundMuted);
            btn.setAttribute('aria-label', soundMuted ? 'Sound off - tap to unmute' : 'Sound on - tap to mute');
            btn.setAttribute('title', soundMuted ? 'Sound off' : 'Sound on');
        });

        // ===== PIECE DATA =====
        const PIECES = {
            king: {
                icon: '♔',
                name: 'King',
                color: '#1E88E5',
                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: false,
                description: 'The King is the most important piece. It moves one square in any direction.'
            },
            queen: {
                icon: '♕',
                name: 'Queen',
                color: '#F57F17',
                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: true,
                description: 'The Queen is the most powerful piece. It moves any number of squares in any direction.'
            },
            rook: {
                icon: '♖',
                name: 'Rook',
                color: '#E91E63',
                offsets: [[0, 1], [0, -1], [1, 0], [-1, 0]],
                slides: true,
                description: 'The Rook moves any number of squares horizontally or vertically.'
            },
            bishop: {
                icon: '♗',
                name: 'Bishop',
                color: '#26A69A',
                offsets: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
                slides: true,
                description: 'The Bishop moves any number of squares diagonally.'
            },
            knight: {
                icon: '♘',
                name: 'Knight',
                color: '#AB47BC',
                offsets: [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]],
                slides: false,
                description: 'The Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular. It can jump over pieces!'
            },
            pawn: {
                icon: '♙',
                name: 'Pawn',
                color: '#42A5F5',
                offsets: [[0, -1]],
                slides: false,
                description: 'The Pawn moves forward one square (or two squares from its starting position).'
            }
        };

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

        let learnState = {
            difficulty: 'easy',
            currentPuzzle: 0,
            attempts: [],
            scores: [0, 0, 0, 0, 0, 0],
            totalStars: 0
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
            const container = document.getElementById('quiz-container');
            const data = learnData[learnState.difficulty];

            if (learnState.currentPuzzle >= data.length) {
                learnState.currentPuzzle = 0;
                learnState.attempts = [];
                container.innerHTML = `
                    <div class="completion-screen">
                        <h2>🌟 All pieces learned! 🌟</h2>
                        <div class="stars-big">${'★'.repeat(learnState.totalStars)}</div>
                        <p style="color: #b0b0c0; margin-bottom: 24px;">You earned ${learnState.totalStars} stars!</p>
                        <button class="btn btn-primary" id="learn-play-again">Play Again</button>
                    </div>
                `;
                document.getElementById('learn-play-again').addEventListener('click', () => {
                    Sound.click();
                    learnState.totalStars = 0;
                    learnState.scores = [0, 0, 0, 0, 0, 0];
                    document.getElementById('total-stars').textContent = '0';
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
                            ${piece.icon}
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
                        <text x="60" y="75" font-size="28" fill="${PIECES[puzzle.piece].color}">${PIECES[puzzle.piece].icon}</text>
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
            const feedback = document.querySelector('.feedback');
            const reveal = document.querySelector('.reveal-card');
            const hintBtn = document.getElementById('learn-hint');
            const currentAttempt = learnState.attempts[learnState.currentPuzzle] || 0;

            if (selected === correct) {
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

                feedback.innerHTML += ` <span class="stars">${'★'.repeat(stars)}</span>`;
                Sound.star();

                if (hintBtn) hintBtn.style.display = 'none';
                reveal.classList.add('show');
                learnState.autoAdvanceTimeout = setTimeout(() => {
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
            pieces: {}
        };

        function initSandbox() {
            const board = document.getElementById('sandbox-board');
            if (!board.querySelector('svg') && board.innerHTML.trim() === '') {
                const boardHtml = createBoard(8);
                board.innerHTML = boardHtml.match(/<rect[^>]*>/g).join('');
            }

            document.querySelectorAll('.piece-picker-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.piece-picker-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    sandboxState.selectedPiece = btn.dataset.piece;
                    document.getElementById('sandbox-instruction').textContent =
                        `Click a square to place the ${PIECES[btn.dataset.piece].name}`;
                    Sound.click();
                });
            });

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

            document.getElementById('sandbox-clear').addEventListener('click', () => {
                sandboxState.pieces = {};
                renderSandboxBoard();
                Sound.click();
            });
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

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', col * 65 + 32.5);
                text.setAttribute('y', row * 65 + 50);
                text.setAttribute('font-size', '40');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', PIECES[piece].color);
                text.textContent = PIECES[piece].icon;
                text.classList.add('piece-marker');
                board.appendChild(text);
            });
        }

        // ===== RACE SECTION =====
        let raceState = {
            round: 0,
            pieces: [null, null],
            targetPos: null,
            answered: false,
            minMoves: [Infinity, Infinity]
        };

        function bfsMinMoves(piece, startRow, startCol, targetRow, targetCol) {
            const queue = [[startRow, startCol, 0]];
            const visited = new Set();
            visited.add(`${startRow},${startCol}`);

            while (queue.length > 0) {
                const [row, col, dist] = queue.shift();

                if (row === targetRow && col === targetCol) {
                    return dist;
                }

                const moves = getMovesForPiece(piece, row, col);
                for (const [nextRow, nextCol] of moves) {
                    const key = `${nextRow},${nextCol}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push([nextRow, nextCol, dist + 1]);
                    }
                }
            }

            return Infinity;
        }

        function initRace() {
            if (raceState.round === 0) {
                generateRaceRound();
            }
            renderRaceRound();

            document.querySelectorAll('.race-btn').forEach(btn => {
                btn.onclick = null;
                btn.addEventListener('click', () => {
                    if (!raceState.answered) {
                        const choice = parseInt(btn.dataset.choice);
                        handleRaceAnswer(choice);
                    }
                });
            });

            const nextBtn = document.getElementById('race-next-btn');
            nextBtn.onclick = null;
            nextBtn.addEventListener('click', () => {
                raceState.round++;
                if (raceState.round >= 5) {
                    raceState.round = 0;
                    raceState.answered = false;
                    generateRaceRound();
                } else {
                    generateRaceRound();
                    raceState.answered = false;
                }
                renderRaceRound();
            });
        }

        function generateRaceRound() {
            const pieceTypes = Object.keys(PIECES);
            const start1 = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
            const start2 = [Math.floor(Math.random() * 3) + 3, Math.floor(Math.random() * 3) + 3];

            raceState.pieces = [
                pieceTypes[Math.floor(Math.random() * pieceTypes.length)],
                pieceTypes[Math.floor(Math.random() * pieceTypes.length)]
            ];

            let targetRow, targetCol;
            do {
                targetRow = Math.floor(Math.random() * 6);
                targetCol = Math.floor(Math.random() * 6);
            } while (targetRow < 2 && targetCol < 2);

            raceState.targetPos = [targetRow, targetCol];
            raceState.minMoves = [
                bfsMinMoves(raceState.pieces[0], start1[0], start1[1], targetRow, targetCol),
                bfsMinMoves(raceState.pieces[1], start2[0], start2[1], targetRow, targetCol)
            ];
        }

        function renderRaceRound() {
            document.getElementById('race-round-number').textContent = raceState.round + 1;

            for (let boardIdx = 0; boardIdx < 2; boardIdx++) {
                const boardSvg = document.getElementById(`race-board-${boardIdx + 1}`);
                const piece = raceState.pieces[boardIdx];
                const startRow = Math.floor(Math.random() * 3);
                const startCol = Math.floor(Math.random() * 3);
                const [targetRow, targetCol] = raceState.targetPos;

                boardSvg.innerHTML = `
                    ${Array.from({ length: 6 }).map((_, row) =>
                        Array.from({ length: 6 }).map((_, col) => {
                            const isDark = (row + col) % 2 === 1;
                            const fill = isDark ? '#B58863' : '#E8D5B5';
                            const isTarget = row === targetRow && col === targetCol;
                            const startBg = isTarget ? 'rgba(255, 0, 0, 0.3)' : fill;
                            return `<rect x="${col * 53.33}" y="${row * 53.33}" width="53.33" height="53.33" fill="${startBg}"/>`;
                        }).join('')
                    ).join('')}
                    <text x="${targetCol * 53.33 + 26.67}" y="${targetRow * 53.33 + 40}" font-size="20" text-anchor="middle" fill="#FF0000">🎯</text>
                    <text x="${startCol * 53.33 + 26.67}" y="${startRow * 53.33 + 40}" font-size="24" text-anchor="middle" fill="${PIECES[piece].color}">${PIECES[piece].icon}</text>
                `;
            }

            document.getElementById('race-piece-1-name').textContent = PIECES[raceState.pieces[0]].name;
            document.getElementById('race-piece-2-name').textContent = PIECES[raceState.pieces[1]].name;
            document.getElementById('race-btn-0-name').textContent = PIECES[raceState.pieces[0]].name;
            document.getElementById('race-btn-1-name').textContent = PIECES[raceState.pieces[1]].name;

            document.getElementById('race-result').textContent = '';
            document.getElementById('race-result').className = 'race-result';
            document.getElementById('race-next-btn').style.display = 'none';
        }

        function handleRaceAnswer(choice) {
            raceState.answered = true;
            const result = document.getElementById('race-result');
            const faster = raceState.minMoves[0] < raceState.minMoves[1] ? 0 : 1;

            if (choice === faster) {
                result.textContent = '✓ Correct! ' + PIECES[raceState.pieces[faster]].name + ' is faster!';
                result.classList.add('correct');
                Sound.correct();
            } else {
                result.textContent = '✗ Not quite! ' + PIECES[raceState.pieces[faster]].name + ' reaches in ' + raceState.minMoves[faster] + ' moves vs ' + raceState.minMoves[1 - faster] + ' moves.';
                result.classList.add('incorrect');
                Sound.wrong();
            }

            document.getElementById('race-next-btn').style.display = 'inline-block';
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
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', col * 65 + 32.5);
                text.setAttribute('y', row * 65 + 50);
                text.setAttribute('font-size', '40');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', row < 2 ? '#000' : '#FFF');
                text.setAttribute('class', `piece-marker setup-piece`);
                text.setAttribute('data-piece', piece);
                text.setAttribute('data-row', row);
                text.setAttribute('data-col', col);
                text.setAttribute('style', 'cursor: pointer;');
                text.textContent = PIECES[piece].icon;

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
            document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');

            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.section === sectionId);
            });

            if (sectionId === 'learn') initLearn();
            if (sectionId === 'sandbox') initSandbox();
            if (sectionId === 'race') initRace();
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
