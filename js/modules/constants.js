// ===== CONSTANTS & PIECE DATA =====
// Chess piece definitions, colors, and game constants

export const PAGE_TITLE = 'Chess for Kids';

export const WHITE_COLOR = '#FFFFFF';
export const BLACK_COLOR = '#222222';
export const ENEMY_COLOR = '#E53935';

export const PIECES = {
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
