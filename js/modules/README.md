# Chess for Kids - Module Structure

This directory contains modular JavaScript files for better code organization and AI-friendliness.

## Module Files

### Core System Modules
- **`preferences.js`** - User preferences and localStorage management
- **`sound.js`** - Sound effects and haptic feedback
- **`constants.js`** - Chess piece data, colors, and game constants
- **`navigation.js`** - Section switching and navigation

### Utility Modules
- **`board-utils.js`** - Board rendering and move calculation utilities
- **`learn-data.js`** - Learn section puzzle data and SVG scenes

### Feature Modules (to be extracted from app.js)
- **`learn.js`** - Learn section logic
- **`sandbox.js`** - Sandbox section logic
- **`save-king.js`** - Save the King section logic
- **`setup.js`** - Setup section logic

### Main Entry Point
- **`main.js`** - Coordinates all modules and initializes the app

## Benefits of This Structure

1. **Token Efficiency**: AI only needs to read relevant files when making changes
2. **Clear Separation**: Each file has a single, well-defined responsibility
3. **Easy Maintenance**: Find and modify specific features quickly
4. **Reusability**: Modules can be imported where needed
5. **Better Understanding**: Smaller files are easier to comprehend

## Usage

```javascript
// Import what you need
import { Preferences } from './modules/preferences.js';
import { Sound } from './modules/sound.js';
import { PIECES } from './modules/constants.js';

// Use the modules
const stars = Preferences.get('totalStars');
Sound.correct();
console.log(PIECES.king.name);
```

## Migration Status

✅ preferences.js - Complete
✅ sound.js - Complete  
✅ constants.js - Complete
✅ navigation.js - Complete
⏳ board-utils.js - To be extracted
⏳ learn-data.js - To be extracted
⏳ learn.js - To be extracted
⏳ sandbox.js - To be extracted
⏳ save-king.js - To be extracted
⏳ setup.js - To be extracted
⏳ main.js - To be created
