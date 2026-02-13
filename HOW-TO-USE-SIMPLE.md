# How to Use - Simple Guide

## ✅ You DON'T Need to Remember File Names!

Just tell AI what you want to change, and AI will figure out which file to modify.

---

## 🎯 How to Ask for Changes

### Just describe what you want:

✅ **"Change the sound that plays when I get a correct answer"**  
→ AI knows to look in sound module

✅ **"Add a new preference to save my favorite piece"**  
→ AI knows to look in preferences module

✅ **"Change the King piece to be gold colored"**  
→ AI knows to look in constants module

✅ **"Make the sound muted by default"**  
→ AI knows to look in preferences module

---

## 🤖 What AI Will Do Automatically

1. **Read your request**
2. **Figure out which module(s) to check** (sound, preferences, constants, etc.)
3. **Read only those files** (saves 95% tokens)
4. **Make the change**

**You do nothing extra!**

---

## 💡 Examples

### Example 1
**You say:** "Make the correct answer sound higher pitched"

**AI thinks:**  
- This is about sounds
- Checks sound.js (125 lines instead of 1,644)
- Makes the change
- Saves ~92% tokens

### Example 2
**You say:** "I want to save which difficulty the user prefers"

**AI thinks:**  
- This is about saving preferences
- Checks preferences.js (75 lines instead of 1,644)
- Adds the new preference
- Saves ~95% tokens

### Example 3
**You say:** "Change the Queen's color to pink"

**AI thinks:**  
- This is about piece data
- Checks constants.js (70 lines instead of 1,644)
- Updates the color
- Saves ~95% tokens

---

## 📋 Quick Reference (Optional - Only if You're Curious)

You don't need this, but here's what exists:

| What You're Changing | AI Looks At |
|---------------------|-------------|
| Sounds, audio | sound.js |
| Saved preferences | preferences.js |
| Piece data, colors | constants.js |
| Navigation, sections | navigation.js |
| App settings, timings | config.js |

**Again: You don't need to remember this!** Just ask naturally.

---

## ⚡ The Benefit

**Before:**
- You: "Change the sound"
- AI: Reads 1,644 lines
- Cost: 6,500 tokens
- You pay more

**After:**
- You: "Change the sound"
- AI: Automatically finds sound.js, reads 125 lines
- Cost: 500 tokens
- You save 92%

**You do the exact same thing. AI works smarter automatically.**

---

## 🎉 Summary

1. **Ask for what you want naturally**
2. **AI figures out the file**
3. **You save ~95% tokens automatically**
4. **Nothing extra to remember**

The modular structure helps AI be more efficient. You just keep asking for changes like always!

---

## 🚀 Start Now

Just ask for a change naturally:
- "Update the sound..."
- "Save a preference for..."
- "Change the piece color..."
- "Make the board..."

AI handles the rest! 🎯
