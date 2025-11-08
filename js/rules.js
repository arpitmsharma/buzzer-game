/**
 * BUZZER GAME - ENHANCED RULE SYSTEM
 * Creative visual and pattern-based rules with emojis and icons
 */

class RuleSystem {
    constructor() {
        this.allRules = this.initializeRules();
        this.activeRules = [];
    }

    /**
     * Initialize all game rules with creative visual elements
     */
    initializeRules() {
        return [
            // LEVEL 1: Simple timing rule
            {
                id: 1,
                level: 1,
                description: "Wait at least 1 second between presses",
                icon: "⏱️",
                category: "timing",
                validator: (gameState) => {
                    if (!gameState.lastPressTime) return true;
                    const timeSinceLastPress = Date.now() - gameState.lastPressTime;
                    return timeSinceLastPress >= 1000;
                },
                violationMessage: "Too quick! You must wait at least 1 second between presses."
            },

            // LEVEL 2: Duck rule - press TWICE when you see a duck
            {
                id: 2,
                level: 2,
                description: "Press TWICE quickly (within 1s) when you see 🦆",
                icon: "🦆",
                category: "visual-pattern",
                emoji: "🦆",
                requiresDoublePress: true,
                validator: (gameState) => {
                    // If duck is showing, must be a quick double press
                    if (gameState.buzzerEmoji === '🦆') {
                        // Check if this is the second press of a double press
                        if (gameState.lastPressTime) {
                            const timeSinceLastPress = Date.now() - gameState.lastPressTime;
                            // If less than 1 second, it's part of a valid double press sequence
                            if (timeSinceLastPress < 1000) {
                                return true;
                            }
                        }
                        // First press when duck shows - this is valid (waiting for second press)
                        return true;
                    }
                    // If duck is not showing, can press normally
                    return true;
                },
                violationMessage: "Duck alert! You must press TWICE quickly when 🦆 appears!"
            },

            // LEVEL 3: Color-based rule - only green
            {
                id: 3,
                level: 3,
                description: "Press only when buzzer is GREEN",
                icon: "🟢",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerColor === 'green';
                },
                violationMessage: "Wrong color! Buzzer must be GREEN when you press."
            },

            // LEVEL 4: Odd second rule
            {
                id: 4,
                level: 4,
                description: "Press only when the timer shows an ODD number",
                icon: "🔢",
                category: "timing-pattern",
                validator: (gameState) => {
                    const currentSecond = Math.floor(gameState.elapsedTime / 1000);
                    return currentSecond % 2 === 1;
                },
                violationMessage: "Wrong timing! Press only during odd seconds (1, 3, 5, 7...)."
            },

            // LEVEL 5: Rocket rule - press when you see rocket
            {
                id: 5,
                level: 5,
                description: "DON'T press when you see 🚀",
                icon: "🚀",
                category: "visual-avoidance",
                emoji: "🚀",
                validator: (gameState) => {
                    return gameState.buzzerEmoji !== '🚀';
                },
                violationMessage: "Rocket alert! Never press when 🚀 is showing!"
            },

            // LEVEL 6: Maximum frequency rule
            {
                id: 6,
                level: 6,
                description: "Don't press more than once every 2 seconds",
                icon: "🚫",
                category: "timing",
                validator: (gameState) => {
                    if (!gameState.lastPressTime) return true;
                    const timeSinceLastPress = Date.now() - gameState.lastPressTime;
                    return timeSinceLastPress >= 2000;
                },
                violationMessage: "Too fast! You must wait at least 2 seconds between presses."
            },

            // LEVEL 7: Star rule - press THREE times when you see stars
            {
                id: 7,
                level: 7,
                description: "Press THREE times rapidly when you see ⭐",
                icon: "⭐",
                category: "visual-pattern",
                emoji: "⭐",
                requiresTriplePress: true,
                validator: (gameState) => {
                    if (gameState.buzzerEmoji === '⭐') {
                        return true; // Allow presses when star is showing
                    }
                    return true;
                },
                violationMessage: "Star power! Press THREE times quickly when ⭐ appears!"
            },

            // LEVEL 8: Even seconds rule
            {
                id: 8,
                level: 8,
                description: "Press only when timer shows EVEN numbers",
                icon: "2️⃣",
                category: "timing-pattern",
                validator: (gameState) => {
                    const currentSecond = Math.floor(gameState.elapsedTime / 1000);
                    return currentSecond % 2 === 0;
                },
                violationMessage: "Wrong timing! Press only during even seconds (0, 2, 4, 6...)."
            },

            // LEVEL 9: Fire rule - dangerous!
            {
                id: 9,
                level: 9,
                description: "NEVER press when you see 🔥",
                icon: "🔥",
                category: "visual-avoidance",
                emoji: "🔥",
                validator: (gameState) => {
                    return gameState.buzzerEmoji !== '🔥';
                },
                violationMessage: "Too hot! Never press when 🔥 is burning!"
            },

            // LEVEL 10: Pulsing buzzer rule
            {
                id: 10,
                level: 10,
                description: "Press only when buzzer is PULSING",
                icon: "💫",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerPulsing === true;
                },
                violationMessage: "Wait for the pulse! Buzzer must be pulsing when you press."
            },

            // LEVEL 11: Cat rule - never press with cats
            {
                id: 11,
                level: 11,
                description: "DON'T press when you see 🐱",
                icon: "🐱",
                category: "visual-avoidance",
                emoji: "🐱",
                validator: (gameState) => {
                    return gameState.buzzerEmoji !== '🐱';
                },
                violationMessage: "Cat crossing! Don't press when 🐱 appears!"
            },

            // LEVEL 12: Lightning rule - quick reaction
            {
                id: 12,
                level: 12,
                description: "Press within 0.6 seconds of seeing ⚡",
                icon: "⚡",
                category: "reaction",
                emoji: "⚡",
                validator: (gameState) => {
                    if (!gameState.buzzerEmojiTime) return false;
                    if (gameState.buzzerEmoji !== '⚡') return false;
                    const reactionTime = Date.now() - gameState.buzzerEmojiTime;
                    return reactionTime <= 600;
                },
                violationMessage: "Too slow! Press within 0.6s of seeing ⚡!"
            },

            // LEVEL 13: Diamond rule - press exactly once
            {
                id: 13,
                level: 13,
                description: "Press EXACTLY ONCE when 💎 appears (then wait for it to disappear)",
                icon: "💎",
                category: "visual-pattern",
                emoji: "💎",
                requiresSinglePress: true,
                validator: (gameState) => {
                    // This is handled in game logic
                    return true;
                },
                violationMessage: "One diamond, one press! Don't press 💎 multiple times!"
            },

            // LEVEL 14: Skull danger rule
            {
                id: 14,
                level: 14,
                description: "NEVER press when 💀 appears",
                icon: "💀",
                category: "visual-avoidance",
                emoji: "💀",
                validator: (gameState) => {
                    return gameState.buzzerEmoji !== '💀';
                },
                violationMessage: "Deadly mistake! Never press when 💀 is showing!"
            },

            // LEVEL 15: Rainbow rule - only when color matches
            {
                id: 15,
                level: 15,
                description: "Press only when buzzer is RED or YELLOW",
                icon: "🌈",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerColor === 'red' || gameState.buzzerColor === 'yellow';
                },
                violationMessage: "Wrong color! Must be RED or YELLOW only!"
            },

            // LEVEL 16: Bomb rule - timing critical
            {
                id: 16,
                level: 16,
                description: "Press within 0.5s when 💣 appears",
                icon: "💣",
                category: "reaction",
                emoji: "💣",
                validator: (gameState) => {
                    if (!gameState.buzzerEmojiTime) return false;
                    if (gameState.buzzerEmoji !== '💣') return false;
                    const reactionTime = Date.now() - gameState.buzzerEmojiTime;
                    return reactionTime <= 500;
                },
                violationMessage: "Bomb exploded! Press within 0.5s of seeing 💣!"
            },

            // LEVEL 17: Crown rule - slow and steady
            {
                id: 17,
                level: 17,
                description: "When 👑 shows, wait at least 3 seconds before pressing",
                icon: "👑",
                category: "visual-timing",
                emoji: "👑",
                validator: (gameState) => {
                    if (gameState.buzzerEmoji === '👑' && gameState.buzzerEmojiTime) {
                        const timeSinceEmoji = Date.now() - gameState.buzzerEmojiTime;
                        return timeSinceEmoji >= 3000;
                    }
                    return true;
                },
                violationMessage: "Royal patience! Wait 3 seconds after 👑 appears!"
            },

            // LEVEL 18: Alien rule - double press avoidance
            {
                id: 18,
                level: 18,
                description: "Press ONCE only when 👽 appears (no double presses)",
                icon: "👽",
                category: "visual-pattern",
                emoji: "👽",
                validator: (gameState) => {
                    // Handled in game logic
                    return true;
                },
                violationMessage: "Alien confusion! Press 👽 only once!"
            },

            // LEVEL 19: Moon rule - nighttime only
            {
                id: 19,
                level: 19,
                description: "Press 🌙 only when timer is divisible by 5",
                icon: "🌙",
                category: "visual-timing",
                emoji: "🌙",
                validator: (gameState) => {
                    const currentSecond = Math.floor(gameState.elapsedTime / 1000);
                    if (gameState.buzzerEmoji === '🌙') {
                        return currentSecond % 5 === 0;
                    }
                    return true;
                },
                violationMessage: "Moon phase! Press 🌙 only at 5-second intervals!"
            },

            // LEVEL 20: Ultimate chaos - ghost rule
            {
                id: 20,
                level: 20,
                description: "👻 reverses ALL rules temporarily!",
                icon: "👻",
                category: "chaos",
                emoji: "👻",
                reversesRules: true,
                validator: (gameState) => {
                    // This fundamentally changes game behavior
                    return true;
                },
                violationMessage: "Ghost chaos! Everything is reversed with 👻!"
            }
        ];
    }

    /**
     * Get all possible emojis for random selection
     */
    getAllEmojis() {
        return this.allRules
            .filter(rule => rule.emoji)
            .map(rule => ({
                emoji: rule.emoji,
                ruleId: rule.id,
                category: rule.category
            }));
    }

    /**
     * Get active emojis based on active rules
     */
    getActiveEmojis() {
        return this.activeRules
            .filter(rule => rule.emoji)
            .map(rule => ({
                emoji: rule.emoji,
                ruleId: rule.id,
                category: rule.category,
                requiresDoublePress: rule.requiresDoublePress,
                requiresTriplePress: rule.requiresTriplePress,
                requiresSinglePress: rule.requiresSinglePress
            }));
    }

    /**
     * Add a new rule when leveling up
     */
    addRuleForLevel(level) {
        const rule = this.allRules.find(r => r.level === level);
        if (rule && !this.activeRules.find(r => r.id === rule.id)) {
            this.activeRules.push(rule);
            return rule;
        }
        return null;
    }

    /**
     * Validate all active rules against current game state
     */
    validateAll(gameState) {
        for (const rule of this.activeRules) {
            try {
                if (!rule.validator(gameState)) {
                    return { valid: false, violatedRule: rule };
                }
            } catch (error) {
                console.error(`Error validating rule ${rule.id}:`, error);
                return { valid: false, violatedRule: rule };
            }
        }
        return { valid: true, violatedRule: null };
    }

    /**
     * Reset all active rules
     */
    reset() {
        this.activeRules = [];
    }

    /**
     * Get all active rules
     */
    getActiveRules() {
        return this.activeRules;
    }

    /**
     * Get latest rule
     */
    getLatestRule() {
        return this.activeRules[this.activeRules.length - 1] || null;
    }
}

// Make RuleSystem available globally
window.RuleSystem = RuleSystem;
