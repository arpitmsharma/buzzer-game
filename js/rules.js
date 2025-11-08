/**
 * BUZZER GAME - RULE SYSTEM
 * Manages game rules with compounding complexity
 * Each level adds a new rule while keeping all previous rules active
 */

class RuleSystem {
    constructor() {
        this.allRules = this.initializeRules();
        this.activeRules = [];
    }

    /**
     * Initialize all game rules
     * Rules are added progressively as player advances through levels
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
                violationMessage: "You pressed too quickly! Must wait 1 second."
            },

            // LEVEL 2: Color-based rule
            {
                id: 2,
                level: 2,
                description: "Press only when buzzer is GREEN",
                icon: "🟢",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerColor === 'green';
                },
                violationMessage: "Wrong color! Buzzer must be GREEN."
            },

            // LEVEL 3: Maximum frequency rule
            {
                id: 3,
                level: 3,
                description: "Don't press more than once every 2 seconds",
                icon: "🚫",
                category: "timing",
                validator: (gameState) => {
                    if (!gameState.lastPressTime) return true;
                    const timeSinceLastPress = Date.now() - gameState.lastPressTime;
                    return timeSinceLastPress >= 2000;
                },
                violationMessage: "Too fast! Wait at least 2 seconds between presses."
            },

            // LEVEL 4: Odd second rule
            {
                id: 4,
                level: 4,
                description: "Press only when the timer shows an ODD number",
                icon: "🔢",
                category: "timing",
                validator: (gameState) => {
                    const currentSecond = Math.floor(gameState.elapsedTime / 1000);
                    return currentSecond % 2 === 1;
                },
                violationMessage: "Wrong timing! Press only on odd seconds."
            },

            // LEVEL 5: Timing window rule
            {
                id: 5,
                level: 5,
                description: "Wait between 1.5 and 3 seconds between presses",
                icon: "⏰",
                category: "timing",
                validator: (gameState) => {
                    if (!gameState.lastPressTime) return true;
                    const timeSinceLastPress = Date.now() - gameState.lastPressTime;
                    return timeSinceLastPress >= 1500 && timeSinceLastPress <= 3000;
                },
                violationMessage: "Wrong timing window! Wait 1.5-3 seconds."
            },

            // LEVEL 6: Pulsing buzzer rule
            {
                id: 6,
                level: 6,
                description: "Press only when buzzer is PULSING",
                icon: "💫",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerPulsing === true;
                },
                violationMessage: "Buzzer wasn't pulsing! Wait for the pulse."
            },

            // LEVEL 7: Same-second restriction
            {
                id: 7,
                level: 7,
                description: "Never press twice in the same second",
                icon: "⛔",
                category: "timing",
                validator: (gameState) => {
                    if (!gameState.lastPressTime) return true;
                    const lastSecond = Math.floor(gameState.lastPressTime / 1000);
                    const currentSecond = Math.floor(Date.now() / 1000);
                    return lastSecond !== currentSecond;
                },
                violationMessage: "Too quick! Don't press twice in the same second."
            },

            // LEVEL 8: Quick reaction rule
            {
                id: 8,
                level: 8,
                description: "Press within 0.5 seconds of buzzer turning green",
                icon: "⚡",
                category: "reaction",
                validator: (gameState) => {
                    if (!gameState.buzzerGreenTime) return false;
                    const reactionTime = Date.now() - gameState.buzzerGreenTime;
                    return reactionTime <= 500;
                },
                violationMessage: "Too slow! Press within 0.5s of green."
            },

            // LEVEL 9: Red flash avoidance
            {
                id: 9,
                level: 9,
                description: "Don't press when buzzer shows a RED flash",
                icon: "🔴",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerFlashing !== 'red';
                },
                violationMessage: "Red flash! You should have waited."
            },

            // LEVEL 10: Divisibility rule
            {
                id: 10,
                level: 10,
                description: "Total presses must be divisible by 3",
                icon: "➗",
                category: "pattern",
                validator: (gameState) => {
                    // This rule checks after the press would be counted
                    const nextTotal = gameState.totalPresses + 1;
                    return nextTotal % 3 === 0;
                },
                violationMessage: "Wrong count! Total presses must be divisible by 3."
            },

            // LEVEL 11: Alternating speed
            {
                id: 11,
                level: 11,
                description: "Alternate: fast press (<2s), then slow press (>2.5s)",
                icon: "🔄",
                category: "pattern",
                validator: (gameState) => {
                    if (!gameState.lastPressTime) return true;
                    const timeSinceLastPress = Date.now() - gameState.lastPressTime;
                    const shouldBeFast = gameState.totalPresses % 2 === 0;

                    if (shouldBeFast) {
                        return timeSinceLastPress < 2000;
                    } else {
                        return timeSinceLastPress > 2500;
                    }
                },
                violationMessage: "Wrong pattern! Alternate fast/slow presses."
            },

            // LEVEL 12: Rotation rule
            {
                id: 12,
                level: 12,
                description: "Press only when buzzer rotates CLOCKWISE",
                icon: "↻",
                category: "visual",
                validator: (gameState) => {
                    return gameState.buzzerRotation === 'clockwise';
                },
                violationMessage: "Wrong rotation! Press only during clockwise rotation."
            }
        ];
    }

    /**
     * Add a new rule when leveling up
     * @param {number} level - The level reaching
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
     * @param {Object} gameState - Current game state
     * @returns {Object} { valid: boolean, violatedRule: Rule|null }
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
     * Get warning status for rules (for visual feedback)
     * @param {Object} gameState - Current game state
     * @returns {Array} Rules that are close to being violated
     */
    getWarningRules(gameState) {
        const warnings = [];

        for (const rule of this.activeRules) {
            // Check timing-based rules for warnings
            if (rule.category === 'timing' && gameState.lastPressTime) {
                const timeSinceLastPress = Date.now() - gameState.lastPressTime;

                // Warning if approaching timing limits
                if (rule.id === 1 && timeSinceLastPress < 800) {
                    warnings.push({ rule, level: 'danger' });
                } else if (rule.id === 3 && timeSinceLastPress < 1800) {
                    warnings.push({ rule, level: 'warning' });
                }
            }

            // Visual warnings
            if (rule.category === 'visual') {
                if (rule.id === 2 && gameState.buzzerColor !== 'green') {
                    warnings.push({ rule, level: 'warning' });
                }
            }
        }

        return warnings;
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
}

// Make RuleSystem available globally
window.RuleSystem = RuleSystem;
