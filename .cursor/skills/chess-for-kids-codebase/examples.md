# Usage Examples

Real-world examples of using the Chess for Kids codebase skill.

## Example 1: Add a New Sound Effect

**User Request:**
> "Add a 'checkmate' sound that plays three dramatic descending notes"

**AI Process:**
1. **Identify module:** Sound-related → `sound.js`
2. **Read:** Only `js/modules/sound.js` (125 lines, ~500 tokens)
3. **Modify:** Add new method to Sound object

**Implementation:**
```javascript
// In sound.js, add:
checkmate() {
    this._play(() => {
        this.init();
        const now = this.ctx.currentTime;
        const notes = [800, 600, 400]; // Descending
        
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.frequency.value = notes[i];
            gain.gain.setValueAtTime(0.3, now + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.2);
            osc.start(now + i * 0.2);
            osc.stop(now + (i + 1) * 0.2);
        }
    });
}
```

**Token Savings:** 6,000 tokens (92%)

---

## Example 2: Add User Preference

**User Request:**
> "Remember which difficulty the user prefers (easy or hard)"

**AI Process:**
1. **Identify module:** Saving preferences → `preferences.js`
2. **Read:** Only `js/modules/preferences.js` (75 lines, ~300 tokens)
3. **Modify:** Add to defaults object

**Implementation:**
```javascript
// In preferences.js, update defaults:
defaults: {
    soundMuted: false,
    totalStars: 0,
    preferredDifficulty: 'easy', // ← Add this
}
```

**Usage in app:**
```javascript
// Get the preference
const difficulty = Preferences.get('preferredDifficulty');

// Set the preference
Preferences.set('preferredDifficulty', 'hard');
```

**Token Savings:** 6,200 tokens (95%)

---

## Example 3: Change Piece Color

**User Request:**
> "Make the Rook red instead of its current accent color"

**AI Process:**
1. **Identify module:** Piece data → `constants.js`
2. **Read:** Only `js/modules/constants.js` (70 lines, ~280 tokens)
3. **Modify:** Update rook's accentColor

**Implementation:**
```javascript
// In constants.js, find rook and update:
rook: {
    icon: '♖', blackIcon: '♜',
    name: 'Rook',
    color: WHITE_COLOR,
    accentColor: '#FF0000', // ← Change to red
    offsets: [[0, 1], [0, -1], [1, 0], [-1, 0]],
    slides: true,
    description: 'The Rook moves any number of squares horizontally or vertically.'
}
```

**Token Savings:** 6,220 tokens (95%)

---

## Example 4: Adjust Timing

**User Request:**
> "Make the auto-advance in Learn mode wait 3 seconds instead of 2"

**AI Process:**
1. **Identify module:** Timing configuration → `config.js`
2. **Read:** Only `js/modules/config.js` (35 lines, ~140 tokens)
3. **Modify:** Update timing constant

**Implementation:**
```javascript
// In config.js, update timing:
timing: {
    autoAdvanceDelay: 3000, // ← Change from 2000 to 3000
    animationDuration: 300,
    debounceDelay: 300,
}
```

**Token Savings:** 6,360 tokens (97%)

---

## Example 5: Modify Navigation

**User Request:**
> "Don't scroll to top when switching sections"

**AI Process:**
1. **Identify module:** Navigation behavior → `navigation.js`
2. **Read:** Only `js/modules/navigation.js` (30 lines, ~120 tokens)
3. **Modify:** Update showSection function

**Implementation:**
```javascript
// In navigation.js, remove or comment out:
export function showSection(sectionId, sectionInitFunctions) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    // window.scrollTo({ top: 0, behavior: 'smooth' }); // ← Remove this

    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    if (sectionInitFunctions[sectionId]) {
        sectionInitFunctions[sectionId]();
    }
}
```

**Token Savings:** 6,380 tokens (98%)

---

## Example 6: Multiple Modules

**User Request:**
> "Add a 'victory' sound and save how many times the user has won"

**AI Process:**
1. **Identify modules:** Sound + Preferences (2 modules)
2. **Read:** `sound.js` (125 lines) + `preferences.js` (75 lines) = ~800 tokens total
3. **Modify:** Both modules

**Implementation:**

**In sound.js:**
```javascript
victory() {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
    this._play(() => {
        this.init();
        const now = this.ctx.currentTime;
        const melody = [523, 659, 784, 1047]; // C, E, G, C (major chord)
        
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.15);
            osc.start(now + i * 0.15);
            osc.stop(now + (i + 1) * 0.15);
        });
    });
}
```

**In preferences.js:**
```javascript
defaults: {
    soundMuted: false,
    totalStars: 0,
    totalVictories: 0, // ← Add this
}
```

**Usage:**
```javascript
Sound.victory();
const wins = Preferences.get('totalVictories');
Preferences.set('totalVictories', wins + 1);
```

**Token Savings:** 5,700 tokens (87% - still huge savings even with 2 modules)

---

## Example 7: Feature Not Yet Modularized

**User Request:**
> "Change how the board renders squares"

**AI Process:**
1. **Identify module:** Board rendering → Not yet extracted
2. **Read:** `app.js` (1,644 lines, ~6,500 tokens)
3. **Modify:** Board rendering functions in app.js

**Note:** This still requires reading app.js because board utilities haven't been extracted yet. However, the structure makes it clear what needs to be extracted in the future.

**Future State:** When `board-utils.js` is extracted, this would only require ~300 tokens instead.

---

## Token Comparison Summary

| Example | Old Method | New Method | Savings |
|---------|-----------|------------|---------|
| Add sound | 6,500 | 500 | 92% |
| Add preference | 6,500 | 300 | 95% |
| Change color | 6,500 | 280 | 95% |
| Adjust timing | 6,500 | 140 | 97% |
| Modify nav | 6,500 | 120 | 98% |
| Multi-module | 6,500 | 800 | 87% |
| **Average** | **6,500** | **357** | **~94%** |

---

## Best Practices from Examples

1. **Start with keyword identification:** "sound" → sound.js, "save" → preferences.js
2. **Read only what you need:** Don't open app.js unless necessary
3. **Follow existing patterns:** Match the coding style in each module
4. **Test incrementally:** Verify each change works before moving on
5. **Consider multi-module changes:** Some features span multiple modules

---

## Common Patterns

### Pattern: Adding to Existing Objects
Most modules define objects (Sound, Preferences, PIECES, CONFIG). Add new properties/methods following the same structure.

### Pattern: Configuration Changes
Simple value updates in config.js or constants.js - just change the value.

### Pattern: Behavioral Changes
Function modifications in sound.js or navigation.js - follow existing function patterns.

### Pattern: State Management
All persistent state goes through preferences.js using get/set methods.
