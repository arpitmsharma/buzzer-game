# 🔴 Buzzer Game - Press at Your Own Risk

An exhilarating and immersive web-based buzzer game with progressively complex and **compounding rules**. Features creative visual emoji-based rules that test your memory, reflexes, and pattern recognition. How many levels can you survive?

## 🎮 Gameplay Overview

### The Ultimate Challenge
- **Press the buzzer** to start the game
- Each level introduces a **new rule** - but you only see it ONCE!
- **You must REMEMBER all previous rules** - they compound!
- **Multiple presses required** to advance to the next level (5 → 7 → 10 → 12...)
- **One mistake** and the buzzer explodes - GAME OVER!

### Memory Challenge
Unlike typical games, **you only see the current rule**. Previous rules disappear, forcing you to remember everything! Can you juggle 10+ rules in your head?

> **Pro Tip**: Click "Show History" to peek at all active rules... but that's cheating! 😉

### Level Progression
```
Level 1: 1 rule  → 5 successful presses to advance
Level 2: 2 rules → 7 successful presses to advance
Level 3: 3 rules → 10 successful presses to advance
Level 4: 4 rules → 12 successful presses to advance
...and so on
```

The difficulty increases exponentially as you juggle more and more rules simultaneously!

## ✨ Features

### Game Features
- **Memory-Based Gameplay**: Only shows current rule - you must remember all previous rules!
- **20 Unique Rules**: Creative mix of timing, visual, pattern, and reaction-based challenges
- **Emoji-Based Rules**: Visual cues with emojis (🦆 🚀 ⭐ 🔥 💣 👻 and more!)
- **Compounding Complexity**: ALL rules stay active as new ones are added
- **Rules History Toggle**: Peek at all active rules if you need a reminder

### Technical Features
- **Web Compatible**: Runs in any modern browser
- **Mobile Optimized**: Touch-friendly interface with haptic feedback
- **GSAP Animations**: Professional-grade animations library for smooth effects
- **Responsive Design**: Built with Tailwind CSS
- **PWA Support**: Install on your mobile device
- **GPU-Accelerated**: Smooth 60fps animations

## 🎯 Creative Rules (Spoilers!)

<details>
<summary>Click to reveal all 20 rules</summary>

### Timing Rules
1. **Level 1**: Wait at least 1 second between presses ⏱️
2. **Level 6**: Don't press more than once every 2 seconds 🚫

### Visual Rules
3. **Level 2**: Press TWICE quickly when you see 🦆
4. **Level 3**: Press only when buzzer is GREEN 🟢
5. **Level 5**: DON'T press when you see 🚀
6. **Level 7**: Press THREE times rapidly when you see ⭐
7. **Level 9**: NEVER press when you see 🔥
8. **Level 10**: Press only when buzzer is PULSING 💫
9. **Level 11**: DON'T press when you see 🐱
10. **Level 13**: Press EXACTLY ONCE when 💎 appears
11. **Level 14**: NEVER press when 💀 appears
12. **Level 15**: Press only when buzzer is RED or YELLOW 🌈
13. **Level 18**: Press ONCE only when 👽 appears

### Pattern Rules
14. **Level 4**: Press only when timer shows an ODD number 🔢
15. **Level 8**: Press only when timer shows EVEN numbers 2️⃣

### Reaction Rules
16. **Level 12**: Press within 0.6s of seeing ⚡
17. **Level 16**: Press within 0.5s when 💣 appears

### Timing-Visual Combos
18. **Level 17**: When 👑 shows, wait at least 3 seconds before pressing
19. **Level 19**: Press 🌙 only when timer is divisible by 5

### Chaos Rules
20. **Level 20**: 👻 reverses ALL rules temporarily!

</details>

## 🚀 Technology Stack

- **Animation**: GSAP (GreenSock Animation Platform) 3.12.5
- **Styling**: Tailwind CSS (via CDN)
- **JavaScript**: ES6+ with class-based architecture
- **PWA**: Web App Manifest for mobile installation
- **Architecture**: Component-based design pattern
  - `RuleSystem`: Manages 20 creative rules and validation
  - `BuzzerComponent`: GSAP-powered buzzer visuals with emoji support
  - `BuzzerGame`: Main controller with memory-challenge gameplay

## 📱 Installation

### Play in Browser
1. Clone this repository
2. Open `index.html` in your browser
3. Start pressing!

### Install as Mobile App
1. Open the game in your mobile browser
2. Tap "Add to Home Screen" (iOS Safari) or "Install" (Chrome Android)
3. Launch from your home screen

### Local Development
```bash
git clone <repository-url>
cd buzzer-game
# Open index.html in your browser or use a local server
python3 -m http.server 8000
# Navigate to http://localhost:8000
```

## 🎨 Project Structure

```
buzzer-game/
├── index.html          # Main game page
├── manifest.json       # PWA manifest
├── css/
│   └── animations.css  # Custom CSS animations
├── js/
│   ├── game.js        # Enhanced game controller (memory challenge)
│   ├── rules.js       # 20 creative rules with emoji support
│   └── buzzer.js      # GSAP-powered buzzer component
└── README.md
```

## 🎯 How to Play

1. **Start**: Press the buzzer to begin
2. **Read Carefully**: You'll see ONE new rule - remember it!
3. **Progress**: Successfully press the required number of times per level
4. **Remember**: All previous rules are STILL ACTIVE (but hidden!)
5. **Level Up**: Each level adds a new rule - can you remember them all?
6. **Survive**: One mistake and you explode!

### Game Tips
- **Pay attention** when emojis appear on the buzzer - they trigger special rules!
- **Watch the timer** for odd/even number rules
- **Observe buzzer colors** (green, red, yellow) - some rules depend on them
- **Listen for the pulse** - some rules only allow presses when pulsing
- **Use "Show History"** if you forget a rule (but try to remember!)

## 🏆 Success Metrics

- **Beginner**: Reach Level 3 (remembering 3 rules)
- **Intermediate**: Reach Level 5 (remembering 5 rules)
- **Advanced**: Reach Level 8 (remembering 8 rules)
- **Expert**: Reach Level 12+ (remembering 12+ rules!)
- **Master**: Reach Level 20 (👻 chaos mode!)

## 💡 Rule Inspiration Sources

Want to add your own rules? Here are some creative directions:

### Visual-Based Rules
- Emoji patterns (animals, objects, symbols)
- Color combinations
- Animation states (rotating, pulsing, shaking)
- Size changes (big/small buzzer)

### Timing-Based Rules
- Specific second intervals
- Mathematical patterns (primes, fibonacci)
- Rhythm patterns
- Quick reactions

### Pattern-Based Rules
- Press sequences (double, triple, alternating)
- Conditional logic (if X then Y)
- Memory challenges (remember previous emoji)
- Counting rules (multiples, divisibility)

### Creative Combos
- "Press only when you see 🐶 AND buzzer is green"
- "Don't press if timer is prime AND emoji is 🔥"
- "Press twice when 🦆 appears on even seconds"

## 🎨 Customization

### Adding New Rules

Edit `js/rules.js` and add to the `initializeRules()` method:

```javascript
{
    id: 21,
    level: 21,
    description: "Your creative rule description",
    icon: "🎯",
    category: "visual-pattern", // or "timing", "reaction", "visual-avoidance", etc.
    emoji: "🎯", // Optional: emoji to display on buzzer
    requiresDoublePress: true, // Optional: special handling flags
    validator: (gameState) => {
        // Return true if rule is satisfied, false if violated
        // Access gameState.buzzerEmoji, gameState.buzzerColor, etc.
        return true;
    },
    violationMessage: "Custom violation message to show on game over"
}
```

### Adjusting Difficulty

Edit the `levelConfig` in `js/game.js`:

```javascript
this.levelConfig = {
    1: 5,    // Change number of presses required per level
    2: 7,    // Make it easier (lower) or harder (higher)
    // ...
};
```

### Customizing Animations

The game uses GSAP for all animations. Check `js/buzzer.js` for examples:

```javascript
// Example: Custom explosion
gsap.to(particle, {
    x: tx,
    y: ty,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
});
```

## 🐛 Known Issues

- None at this time! Report issues on GitHub.

## 🤝 Contributing

Suggestions and creative rule ideas are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created with passion for engaging gameplay, memory challenges, and professional animations.

### Technologies Used
- **GSAP**: Industry-standard animation library
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Clean, modern ES6+ code
- **PWA**: Progressive Web App capabilities

---

**Ready to test your memory, reflexes, and sanity?**

Press the buzzer... if you dare! 💥

*Remember: You can only see ONE rule at a time. Can you remember them all?*
