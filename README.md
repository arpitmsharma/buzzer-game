# 🔴 Buzzer Game - Press at Your Own Risk

An exhilarating and immersive web-based buzzer game with progressively complex and **compounding rules**. How many levels can you survive?

## 🎮 Gameplay Overview

### The Challenge
- **Press the buzzer** to start the game
- Each level introduces a **new rule** that you must follow
- **ALL previous rules remain active** - they compound!
- **Multiple presses required** to advance to the next level
- **One mistake** and the buzzer explodes - GAME OVER!

### Level Progression
```
Level 1: 1 rule  → 5 successful presses to advance
Level 2: 2 rules → 7 successful presses to advance
Level 3: 3 rules → 10 successful presses to advance
...and so on
```

The difficulty increases exponentially as you juggle more and more rules simultaneously!

## 🎯 Game Rules (Spoilers!)

<details>
<summary>Click to reveal all rules</summary>

1. **Level 1**: Wait at least 1 second between presses
2. **Level 2**: Press only when buzzer is GREEN
3. **Level 3**: Don't press more than once every 2 seconds
4. **Level 4**: Press only when the timer shows an ODD number
5. **Level 5**: Wait between 1.5 and 3 seconds between presses
6. **Level 6**: Press only when buzzer is PULSING
7. **Level 7**: Never press twice in the same second
8. **Level 8**: Press within 0.5 seconds of buzzer turning green
9. **Level 9**: Don't press when buzzer shows a RED flash
10. **Level 10**: Total presses must be divisible by 3
11. **Level 11**: Alternate: fast press (<2s), then slow press (>2.5s)
12. **Level 12**: Press only when buzzer rotates CLOCKWISE

</details>

## 🚀 Features

- **Web Compatible**: Runs in any modern browser
- **Mobile Optimized**: Touch-friendly interface with haptic feedback
- **Progressive Web App (PWA)**: Install on your mobile device
- **Responsive Design**: Built with Tailwind CSS
- **Smooth Animations**: GPU-accelerated CSS animations
- **Visual Feedback**: Color changes, pulses, rotations, and explosions
- **No Backend Required**: Fully client-side game

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+) with class-based architecture
- **Styling**: Tailwind CSS (via CDN)
- **Animations**: Custom CSS animations
- **PWA**: Web App Manifest for mobile installation
- **Architecture**: Component-based design pattern
  - `RuleSystem`: Manages game rules and validation
  - `BuzzerComponent`: Handles buzzer visuals and interactions
  - `BuzzerGame`: Main game controller and state management

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
│   └── animations.css  # Custom animations
├── js/
│   ├── game.js        # Main game controller
│   ├── rules.js       # Rule system & validation
│   └── buzzer.js      # Buzzer component
├── assets/
│   ├── sounds/        # Sound effects (future)
│   └── images/        # Icons & images
└── README.md
```

## 🎯 How to Play

1. **Start**: Press the buzzer to begin
2. **Read Rules**: Watch the active rules panel at the bottom
3. **Progress**: Successfully press the required number of times per level
4. **Level Up**: Each level adds a new rule (all previous rules stay active!)
5. **Survive**: One mistake and you explode!

## 🏆 Success Metrics

- **Beginner**: Reach Level 3 (juggling 3 rules)
- **Intermediate**: Reach Level 5 (juggling 5 rules)
- **Advanced**: Reach Level 7 (juggling 7 rules)
- **Expert**: Reach Level 10+ (juggling 10+ rules)

## 🎨 Customization

### Adding New Rules

Edit `js/rules.js` and add a new rule to the `initializeRules()` method:

```javascript
{
    id: 13,
    level: 13,
    description: "Your custom rule description",
    icon: "🎯",
    category: "timing", // or "visual", "pattern", "reaction"
    validator: (gameState) => {
        // Return true if rule is satisfied, false if violated
        return true;
    },
    violationMessage: "Custom violation message"
}
```

### Adjusting Difficulty

Edit the `levelConfig` in `js/game.js`:

```javascript
this.levelConfig = {
    1: 5,    // Change number of presses required per level
    2: 7,
    // ...
};
```

## 🐛 Known Issues

- None at this time! Report issues on GitHub.

## 🤝 Contributing

This is a personal game project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created with passion for engaging gameplay and clean code architecture.

---

**Ready to test your reflexes and memory?**

Press the buzzer... if you dare! 💥
