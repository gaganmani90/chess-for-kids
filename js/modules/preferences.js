// ===== PREFERENCES SYSTEM =====
// Centralized storage for all user preferences using localStorage

const PREFERENCES_KEY = 'chess-for-kids-preferences';

export const Preferences = {
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
    
    // Reset all preferences to defaults
    reset() {
        this.data = { ...this.defaults };
        this.save();
        return this;
    }
};
