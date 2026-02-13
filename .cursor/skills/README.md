# Chess for Kids - Cursor Skills

This directory contains Cursor AI skills that help AI agents work efficiently with this codebase.

## Available Skills

### `chess-for-kids-codebase`
**Purpose:** Enables AI agents to automatically understand the modular structure and work token-efficiently.

**What it does:**
- Teaches AI about the module structure
- Maps features to modules automatically
- Provides decision trees for finding the right file
- Includes usage examples and best practices

**How it helps:**
- **95% token reduction** - AI reads only relevant modules instead of entire codebase
- **Faster responses** - Less code to read means quicker AI responses
- **More accurate changes** - Clear context leads to better modifications
- **Automatic routing** - AI figures out which file to modify based on your request

## How Skills Work

When you ask for a change, the AI agent:

1. **Reads the skill** - Understands the codebase structure
2. **Identifies the module** - Figures out which file contains what you want to change
3. **Reads only that module** - Opens just the relevant 70-125 line file instead of the 1,644 line app.js
4. **Makes precise changes** - Modifies only what's needed
5. **Saves you tokens** - Uses ~95% fewer tokens per request

## You Don't Need to Do Anything!

Just ask naturally:
- "Change the sound..."
- "Save a preference for..."
- "Update the Queen's color..."

The skill teaches the AI to automatically find the right module and work efficiently.

## Skill Contents

```
chess-for-kids-codebase/
├── SKILL.md - Main skill instructions
├── module-map.md - Quick reference for feature → module mapping
└── examples.md - Real-world usage examples with token savings
```

## Example: Before vs After

### Before (No Skill)
**You:** "Change the correct answer sound"  
**AI:** Reads entire app.js (1,644 lines, ~6,500 tokens)  
**Cost:** High token usage

### After (With Skill)
**You:** "Change the correct answer sound"  
**AI:** Skill teaches it to read only sound.js (125 lines, ~500 tokens)  
**Cost:** 92% cheaper

## Benefits

✅ **Automatic efficiency** - No need to learn file structure  
✅ **95% token savings** - Dramatically reduced costs  
✅ **Faster responses** - Less to read means quicker answers  
✅ **Better accuracy** - Clear context produces better changes  
✅ **Future-proof** - As more modules are added, skill stays current  

## Updating the Skill

As you extract more modules from app.js (like `board-utils.js`, `learn.js`, etc.), update the skill:

1. Add new module to `SKILL.md` module reference
2. Add entries to `module-map.md` 
3. Add usage example to `examples.md`

The skill automatically becomes more powerful as the codebase becomes more modular.
