---
name: chess-for-kids-codebase
description: Efficiently work with the Chess for Kids codebase by understanding its modular structure. Use when modifying sounds, preferences, piece data, navigation, board rendering, or any feature. Automatically identifies the correct module to minimize token usage by 95%.
---

# Chess for Kids Codebase

## Overview

This codebase uses a modular structure to enable **token-efficient AI assistance**. Each feature lives in a focused module (100-300 lines), so you only read what's relevant.

**Key benefit:** Reading specific modules instead of the monolithic `app.js` (1,644 lines) saves ~95% tokens per request.

---

## Module Structure

```
js/
├── app.js (1,644 lines - original monolith, still works)
└── modules/
    ├── preferences.js (75 lines)
    ├── sound.js (125 lines)
    ├── constants.js (70 lines)
    ├── navigation.js (30 lines)
    └── config.js (35 lines)
```

---

## Module Reference

### preferences.js (75 lines)
**Purpose:** User preferences and localStorage management

**Contains:**
- `Preferences` object with get/set/save/load methods
- Default preferences: `soundMuted`, `totalStars`
- Migration from old storage keys

**When to read:**
- Adding/modifying user preferences
- Changing localStorage logic
- Saving user state

**Triggers:** "preference", "save", "remember", "localStorage", "persist"

---

### sound.js (125 lines)
**Purpose:** Audio feedback and haptic effects

**Contains:**
- `Sound` object with methods: `correct()`, `wrong()`, `click()`, `star()`
- Mute button initialization
- Web Audio API implementation

**When to read:**
- Modifying sound effects
- Adding new sounds
- Changing audio frequencies/timing
- Updating haptic feedback

**Triggers:** "sound", "audio", "mute", "haptic", "vibrate", "tone", "frequency"

---

### constants.js (70 lines)
**Purpose:** Chess piece definitions and game constants

**Contains:**
- `PIECES` object with all piece data (icon, name, color, moves, description)
- Color constants: `WHITE_COLOR`, `BLACK_COLOR`, `ENEMY_COLOR`

**When to read:**
- Changing piece colors/properties
- Modifying piece descriptions
- Updating piece icons
- Adding new pieces

**Triggers:** "piece", "king", "queen", "rook", "bishop", "knight", "pawn", "color", "icon"

---

### navigation.js (30 lines)
**Purpose:** Section switching and navigation

**Contains:**
- `initNavigation()` - sets up nav buttons
- `showSection()` - switches between sections

**When to read:**
- Modifying navigation behavior
- Adding new sections
- Changing section transitions

**Triggers:** "navigation", "section", "switch", "nav button", "tab"

---

### config.js (35 lines)
**Purpose:** App-wide configuration and feature flags

**Contains:**
- Feature flags (sound, haptics, animations)
- Timing constants (delays, debounce, animation duration)
- Game settings (board size, max stars)

**When to read:**
- Adjusting timing/delays
- Toggling features
- Changing game constants

**Triggers:** "config", "timing", "delay", "feature flag", "animation duration"

---

## Decision Tree

When user asks for a change, determine the module:

```
Sound/audio related? → sound.js
Saving user data? → preferences.js
Piece info/colors? → constants.js
Navigation/sections? → navigation.js
Timing/config? → config.js
Board rendering/moves? → app.js (utility functions)
Learn/Sandbox/Setup sections? → app.js (section logic)
```

---

## Efficient Workflow

### Step 1: Identify Module
Based on user request, determine which module(s) are relevant.

### Step 2: Read Selectively
**Only read the specific module(s) needed.** Don't read app.js unless the feature isn't in a module yet.

### Step 3: Make Changes
Modify only the relevant module.

### Step 4: Test
Verify changes work without reading unnecessary code.

---

## Examples

### Example 1: Change Sound
**User:** "Make the correct answer sound higher pitched"

**Action:**
1. Identify: Sound-related → `sound.js`
2. Read: `js/modules/sound.js` (125 lines)
3. Modify: Update `correct()` method frequency
4. **Token cost:** ~500 (vs 6,500 for app.js)

---

### Example 2: Add Preference
**User:** "Save the user's favorite piece"

**Action:**
1. Identify: Saving user data → `preferences.js`
2. Read: `js/modules/preferences.js` (75 lines)
3. Modify: Add `favoritePiece: 'queen'` to defaults
4. **Token cost:** ~300 (vs 6,500 for app.js)

---

### Example 3: Change Piece Color
**User:** "Make the Queen gold"

**Action:**
1. Identify: Piece data → `constants.js`
2. Read: `js/modules/constants.js` (70 lines)
3. Modify: Update `queen.accentColor` to `'#FFD700'`
4. **Token cost:** ~280 (vs 6,500 for app.js)

---

## Token Savings

| Task | Old (app.js) | New (module) | Savings |
|------|-------------|--------------|---------|
| Sound change | 6,500 | 500 | 92% |
| Preference | 6,500 | 300 | 95% |
| Piece color | 6,500 | 280 | 95% |
| Navigation | 6,500 | 120 | 98% |
| Config | 6,500 | 140 | 97% |

**Average savings: 95%**

---

## Working with app.js

For features **not yet extracted into modules**, use app.js:
- Board rendering utilities
- Learn section logic
- Sandbox section logic
- Save the King section logic
- Setup section logic

**Future:** These will be extracted into separate modules (`board-utils.js`, `learn.js`, `sandbox.js`, etc.)

---

## Module Import Pattern (Future)

When the codebase migrates to ES6 modules:

```javascript
// Import only what you need
import { Preferences } from './modules/preferences.js';
import { Sound } from './modules/sound.js';
import { PIECES } from './modules/constants.js';

// Use the modules
const stars = Preferences.get('totalStars');
Sound.correct();
console.log(PIECES.king.name);
```

---

## Best Practices

1. **Read selectively:** Only open files directly related to the change
2. **Check modules first:** Before reading app.js, check if a module exists
3. **Keep changes focused:** Modify one module at a time when possible
4. **Preserve patterns:** Follow existing code style in each module
5. **Test incrementally:** Verify each change before moving to the next

---

## Quick Reference

**Sounds?** → `sound.js`  
**Save data?** → `preferences.js`  
**Pieces?** → `constants.js`  
**Navigation?** → `navigation.js`  
**Timings?** → `config.js`  
**Other?** → Check `app.js`

---

## Benefits

- **95% token reduction** for most changes
- **Faster responses** (less to read)
- **More accurate changes** (clearer context)
- **Easier debugging** (isolated features)
- **Better maintainability** (small, focused files)

---

## Current Status

✅ Core modules extracted and ready  
⏳ Section modules to be extracted  
✅ Original app.js still works  
✅ No breaking changes  

The modular structure is ready to use. Always prefer reading specific modules over app.js when applicable.
