# Module Map - Quick Reference

This reference provides a complete mapping of features to modules for fast lookup.

## Feature → Module Mapping

### User Data & State
| Feature | Module | Lines |
|---------|--------|-------|
| Save/load preferences | `preferences.js` | 75 |
| User settings | `preferences.js` | 75 |
| localStorage operations | `preferences.js` | 75 |
| Total stars tracking | `preferences.js` | 75 |
| Sound mute state | `preferences.js` | 75 |

### Audio & Feedback
| Feature | Module | Lines |
|---------|--------|-------|
| Sound effects | `sound.js` | 125 |
| Correct answer sound | `sound.js` | 125 |
| Wrong answer sound | `sound.js` | 125 |
| Click sound | `sound.js` | 125 |
| Star collection sound | `sound.js` | 125 |
| Mute button | `sound.js` | 125 |
| Haptic feedback | `sound.js` | 125 |
| Vibration | `sound.js` | 125 |

### Chess Pieces
| Feature | Module | Lines |
|---------|--------|-------|
| Piece definitions | `constants.js` | 70 |
| Piece colors | `constants.js` | 70 |
| Piece icons | `constants.js` | 70 |
| Piece names | `constants.js` | 70 |
| Piece descriptions | `constants.js` | 70 |
| Move patterns | `constants.js` | 70 |
| King, Queen, Rook, etc. | `constants.js` | 70 |

### Navigation & UI
| Feature | Module | Lines |
|---------|--------|-------|
| Section switching | `navigation.js` | 30 |
| Nav button behavior | `navigation.js` | 30 |
| Active section state | `navigation.js` | 30 |
| Scroll on navigation | `navigation.js` | 30 |

### App Configuration
| Feature | Module | Lines |
|---------|--------|-------|
| Feature flags | `config.js` | 35 |
| Timing constants | `config.js` | 35 |
| Animation durations | `config.js` | 35 |
| Debounce delays | `config.js` | 35 |
| Auto-advance timing | `config.js` | 35 |
| Board size | `config.js` | 35 |
| Max stars per puzzle | `config.js` | 35 |

### Still in app.js (To Be Extracted)
| Feature | Current Location | Lines |
|---------|-----------------|-------|
| Board rendering | `app.js` | 1,644 |
| Move calculation | `app.js` | 1,644 |
| Learn section | `app.js` | 1,644 |
| Sandbox section | `app.js` | 1,644 |
| Save the King section | `app.js` | 1,644 |
| Setup section | `app.js` | 1,644 |

## Keyword → Module Lookup

### A-C
- **accent color** → `constants.js`
- **audio** → `sound.js`
- **auto-advance** → `config.js`

### D-F
- **debounce** → `config.js`
- **delay** → `config.js`
- **duration** → `config.js`
- **feature flag** → `config.js`
- **frequency** → `sound.js`

### G-M
- **haptic** → `sound.js`
- **icon** → `constants.js`
- **localStorage** → `preferences.js`
- **mute** → `sound.js`

### N-P
- **navigation** → `navigation.js`
- **piece** → `constants.js`
- **preference** → `preferences.js`

### Q-S
- **queen/king/rook/etc** → `constants.js`
- **save** → `preferences.js`
- **section** → `navigation.js`
- **sound** → `sound.js`
- **stars** → `preferences.js`

### T-Z
- **timing** → `config.js`
- **tone** → `sound.js`
- **vibrate** → `sound.js`

## File Sizes for Token Estimation

| File | Lines | Est. Tokens |
|------|-------|-------------|
| `preferences.js` | 75 | ~300 |
| `sound.js` | 125 | ~500 |
| `constants.js` | 70 | ~280 |
| `navigation.js` | 30 | ~120 |
| `config.js` | 35 | ~140 |
| `app.js` | 1,644 | ~6,500 |

## Decision Flowchart

```
User Request
    ↓
Is it about sounds/audio?
    YES → sound.js (500 tokens)
    NO ↓
Is it about saving/preferences?
    YES → preferences.js (300 tokens)
    NO ↓
Is it about pieces/colors?
    YES → constants.js (280 tokens)
    NO ↓
Is it about navigation/sections?
    YES → navigation.js (120 tokens)
    NO ↓
Is it about timing/config?
    YES → config.js (140 tokens)
    NO ↓
Check app.js (6,500 tokens)
```

## Common Scenarios

### Scenario: User wants to change a sound
**Module:** `sound.js`  
**Method:** Modify relevant method (`correct()`, `wrong()`, `click()`, `star()`)  
**Tokens:** ~500

### Scenario: User wants to add a preference
**Module:** `preferences.js`  
**Method:** Add to `defaults` object  
**Tokens:** ~300

### Scenario: User wants to change piece appearance
**Module:** `constants.js`  
**Method:** Modify `PIECES` object properties  
**Tokens:** ~280

### Scenario: User wants to adjust a timing
**Module:** `config.js`  
**Method:** Modify `timing` object in `CONFIG`  
**Tokens:** ~140

### Scenario: User wants to change navigation behavior
**Module:** `navigation.js`  
**Method:** Modify `showSection()` or `initNavigation()`  
**Tokens:** ~120
