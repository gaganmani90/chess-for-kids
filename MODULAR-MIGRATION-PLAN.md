# Modular Code Organization - Migration Plan

## Goal
Reorganize code for better AI efficiency and maintainability. Reduce token usage when AI makes changes.

## Current Structure
```
chess-for-kids/
├── index.html (199 lines)
├── css/styles.css (1,444 lines)
└── js/
    └── app.js (1,644 lines) ⚠️ TOO LARGE
```

## New Modular Structure
```
chess-for-kids/
├── index.html
├── css/styles.css
└── js/
    ├── app.js (current monolithic file - keep for compatibility)
    ├── main.js (new modular entry point)
    └── modules/
        ├── README.md
        ├── preferences.js (~75 lines) ✅ DONE
        ├── sound.js (~125 lines) ✅ DONE
        ├── constants.js (~70 lines) ✅ DONE
        ├── navigation.js (~30 lines) ✅ DONE
        ├── board-utils.js (~200 lines) - Board rendering & move logic
        ├── learn-data.js (~300 lines) - Learn section SVG scenes
        ├── learn.js (~350 lines) - Learn section logic
        ├── sandbox.js (~150 lines) - Sandbox section logic
        ├── save-king.js (~400 lines) - Save the King section logic
        └── setup.js (~150 lines) - Setup section logic
```

## Benefits

### Token Savings Example
**Before (Monolithic):**
- AI task: "Update the sound effect for correct answers"
- AI reads: `app.js` (1,644 lines) = ~6,500 tokens
- Total: ~6,500 tokens

**After (Modular):**
- AI task: "Update the sound effect for correct answers"  
- AI reads: `sound.js` (125 lines) = ~500 tokens
- Total: ~500 tokens
- **Savings: 92% fewer tokens** 🎉

### Other Benefits
1. **Faster AI comprehension** - Smaller, focused files
2. **Precise changes** - Modify only what's needed
3. **Easier debugging** - Clear file boundaries
4. **Better collaboration** - Multiple people can work on different modules
5. **Reusability** - Import only what you need

## Migration Strategy

### Phase 1: ✅ COMPLETE
- [x] Create module structure
- [x] Extract `preferences.js`
- [x] Extract `sound.js`
- [x] Extract `constants.js`
- [x] Extract `navigation.js`

### Phase 2: NEXT STEPS
- [ ] Extract `board-utils.js` (board rendering, move calculation)
- [ ] Extract `learn-data.js` (SVG scenes and puzzle data)
- [ ] Create `main.js` entry point
- [ ] Test with modular imports

### Phase 3: SECTION MIGRATION
- [ ] Extract `learn.js`
- [ ] Extract `sandbox.js`
- [ ] Extract `save-king.js`
- [ ] Extract `setup.js`

### Phase 4: CLEANUP
- [ ] Update `index.html` to use `main.js` with `type="module"`
- [ ] Archive or remove old `app.js`
- [ ] Test all features
- [ ] Update documentation

## How to Use Modular Code (When Ready)

### In HTML:
```html
<!-- OLD: -->
<script src="js/app.js"></script>

<!-- NEW: -->
<script type="module" src="js/main.js"></script>
```

### In JavaScript:
```javascript
// Import only what you need
import { Preferences } from './modules/preferences.js';
import { Sound } from './modules/sound.js';
import { PIECES, PAGE_TITLE } from './modules/constants.js';

// Use the modules
const muted = Preferences.get('soundMuted');
Sound.click();
console.log(PIECES.queen.name);
```

## AI Usage Tips

### When AI Needs to Make Changes:
**Tell the AI which module to focus on:**

✅ Good: "Update the sound.js module to add a new 'checkmate' sound effect"
- AI reads only `sound.js` (~125 lines)

❌ Less efficient: "Update app.js to add a new sound effect"
- AI reads entire `app.js` (1,644 lines)

### Common AI Tasks by Module:
- **Sound changes** → `sound.js`
- **Add/modify preferences** → `preferences.js`
- **Change piece data** → `constants.js`
- **Update Learn puzzles** → `learn-data.js` (when extracted)
- **Sandbox features** → `sandbox.js` (when extracted)
- **Board rendering** → `board-utils.js` (when extracted)

## Status

**Current:** Phase 1 complete ✅  
**Next:** Extract board utilities and create main.js coordinator
**Timeline:** Incremental migration - old code still works while new structure is built

## Notes for Future Development

1. **Keep modules small** - Aim for <300 lines per file
2. **Single responsibility** - Each module does one thing well
3. **Clear exports** - Export only what's needed
4. **Good names** - File and function names should be self-documenting
5. **Comments** - Add module-level comments explaining purpose
