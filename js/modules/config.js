// ===== CONFIGURATION =====
// App-wide configuration and settings

export const CONFIG = {
    appName: 'Chess for Kids',
    version: '1.0.0',
    
    // Feature flags (easy to toggle features on/off)
    features: {
        sound: true,
        haptics: true,
        animations: true,
        localStorage: true,
    },
    
    // Timing constants
    timing: {
        autoAdvanceDelay: 2000,        // ms to wait before auto-advance in Learn
        animationDuration: 300,         // ms for standard animations
        debounceDelay: 300,            // ms for debouncing Learn taps
    },
    
    // Game settings
    game: {
        boardSize: 8,
        maxStarsPerPuzzle: 3,
        totalLearnPuzzles: 6,
    },
    
    // Responsive breakpoints (matching CSS)
    breakpoints: {
        tablet: 768,
        phone: 480,
    }
};
