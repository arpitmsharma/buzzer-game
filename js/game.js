/**
 * BUZZER GAME - MAIN GAME CONTROLLER
 * Manages game state, level progression, and compounding rules
 */

class BuzzerGame {
    constructor() {
        // Initialize components
        this.ruleSystem = new RuleSystem();
        this.buzzerComponent = new BuzzerComponent();

        // Game state
        this.gameState = {
            status: 'idle', // 'idle', 'playing', 'gameOver'
            currentLevel: 1,
            totalPresses: 0,
            pressesThisLevel: 0,
            pressesRequiredForLevel: 0,
            lastPressTime: null,
            elapsedTime: 0,
            buzzerColor: 'neutral',
            buzzerPulsing: false,
            buzzerRotation: null,
            buzzerGreenTime: null,
            buzzerFlashing: null,
        };

        // Level configuration
        this.levelConfig = {
            1: 5,    // Level 1 requires 5 presses
            2: 7,    // Level 2 requires 7 presses
            3: 10,   // Level 3 requires 10 presses
            4: 12,
            5: 15,
            6: 18,
            7: 22,
            8: 25,
            9: 30,
            10: 35,
            11: 40,
            12: 45,
        };

        // DOM Elements
        this.levelDisplay = document.getElementById('level-number');
        this.scoreDisplay = document.getElementById('score-number');
        this.rulesListContainer = document.getElementById('rules-list');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.timerDisplay = document.getElementById('timer-display');
        this.timerValue = document.getElementById('timer-value');

        // Intervals
        this.gameLoopInterval = null;
        this.colorCycleInterval = null;

        this.init();
    }

    /**
     * Initialize game event listeners
     */
    init() {
        // Buzzer click handler
        this.buzzerComponent.buzzer.addEventListener('click', () => this.handleBuzzerPress());

        // Restart button handler
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());

        // Prevent accidental double-tap zoom on mobile
        this.buzzerComponent.buzzer.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });

        this.updateUI();
    }

    /**
     * Start the game
     */
    startGame() {
        this.gameState.status = 'playing';
        this.gameState.currentLevel = 1;
        this.gameState.totalPresses = 0;
        this.gameState.pressesThisLevel = 0;
        this.gameState.pressesRequiredForLevel = this.levelConfig[1];
        this.gameState.lastPressTime = null;
        this.gameState.elapsedTime = 0;

        // Add first rule
        const firstRule = this.ruleSystem.addRuleForLevel(1);
        if (firstRule) {
            this.addRuleToUI(firstRule);
        }

        this.buzzerComponent.setStatus('GO!');
        this.buzzerComponent.updateProgress(0, this.gameState.pressesRequiredForLevel);

        // Start game loop
        this.startGameLoop();

        this.updateUI();
    }

    /**
     * Handle buzzer press
     */
    handleBuzzerPress() {
        if (this.gameState.status === 'idle') {
            this.startGame();
            return;
        }

        if (this.gameState.status !== 'playing') {
            return;
        }

        // Update game state before validation
        this.updateGameState();

        // Validate all active rules
        const validation = this.ruleSystem.validateAll(this.gameState);

        if (!validation.valid) {
            // Rule violated - explode!
            this.gameOver(validation.violatedRule);
            return;
        }

        // Valid press!
        this.gameState.totalPresses++;
        this.gameState.pressesThisLevel++;
        this.gameState.lastPressTime = Date.now();

        // Update UI
        this.updateUI();

        // Check for level up
        if (this.gameState.pressesThisLevel >= this.gameState.pressesRequiredForLevel) {
            this.levelUp();
        }

        // Add haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    /**
     * Update game state with current values
     */
    updateGameState() {
        const buzzerState = this.buzzerComponent.getState();
        this.gameState.buzzerColor = buzzerState.color;
        this.gameState.buzzerPulsing = buzzerState.pulsing;
        this.gameState.buzzerRotation = buzzerState.rotation;
    }

    /**
     * Level up - add new rule and reset level progress
     */
    levelUp() {
        this.gameState.currentLevel++;
        this.gameState.pressesThisLevel = 0;
        this.gameState.pressesRequiredForLevel = this.levelConfig[this.gameState.currentLevel] || 50;

        // Add new rule for this level
        const newRule = this.ruleSystem.addRuleForLevel(this.gameState.currentLevel);
        if (newRule) {
            this.addRuleToUI(newRule);
        }

        // Celebration!
        this.buzzerComponent.celebrateLevelUp();

        // Activate visual rules based on level
        this.activateLevelFeatures();

        // Update UI
        this.updateUI();
    }

    /**
     * Activate visual features based on current level
     */
    activateLevelFeatures() {
        const level = this.gameState.currentLevel;

        // Level 2+: Start color cycling
        if (level >= 2) {
            this.buzzerComponent.startColorCycle(2500);
        }

        // Level 6+: Start pulse cycling
        if (level >= 6) {
            this.buzzerComponent.startPulseCycle(3000);
        }

        // Level 12+: Start rotation
        if (level >= 12) {
            // Alternate rotation direction
            const direction = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
            this.buzzerComponent.setRotation(direction);
            this.gameState.buzzerRotation = direction;

            // Change rotation occasionally
            if (this.rotationInterval) {
                clearInterval(this.rotationInterval);
            }

            this.rotationInterval = setInterval(() => {
                const newDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
                this.buzzerComponent.setRotation(newDirection);
                this.gameState.buzzerRotation = newDirection;
            }, 5000);
        }
    }

    /**
     * Start game loop (updates timer, etc.)
     */
    startGameLoop() {
        const startTime = Date.now();

        this.gameLoopInterval = setInterval(() => {
            this.gameState.elapsedTime = Date.now() - startTime;

            // Update timer display
            const seconds = (this.gameState.elapsedTime / 1000).toFixed(1);
            this.timerValue.textContent = seconds;

            // Show timer for levels with time-based rules
            if (this.gameState.currentLevel >= 4) {
                this.timerDisplay.classList.remove('hidden');
            }

            // Track when buzzer turns green (for reaction time rule)
            const buzzerState = this.buzzerComponent.getState();
            if (buzzerState.color === 'green' && this.gameState.buzzerColor !== 'green') {
                this.gameState.buzzerGreenTime = Date.now();
            }
            this.gameState.buzzerColor = buzzerState.color;

            // Update rule warnings
            this.updateRuleWarnings();

        }, 100); // Update 10 times per second
    }

    /**
     * Stop game loop
     */
    stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }

        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }

    /**
     * Update visual warnings for rules about to be violated
     */
    updateRuleWarnings() {
        const warnings = this.ruleSystem.getWarningRules(this.gameState);
        const ruleElements = this.rulesListContainer.querySelectorAll('.rule-item');

        ruleElements.forEach(el => {
            el.classList.remove('rule-warning', 'rule-danger', 'animate-shake');
        });

        warnings.forEach(({ rule, level }) => {
            const ruleElement = this.rulesListContainer.querySelector(`[data-rule-id="${rule.id}"]`);
            if (ruleElement) {
                if (level === 'danger') {
                    ruleElement.classList.add('rule-danger', 'animate-shake');
                } else if (level === 'warning') {
                    ruleElement.classList.add('rule-warning');
                }
            }
        });
    }

    /**
     * Game over - show explosion and game over screen
     * @param {Object} violatedRule - The rule that was violated
     */
    gameOver(violatedRule) {
        this.gameState.status = 'gameOver';

        // Stop game loop
        this.stopGameLoop();

        // Explosion!
        this.buzzerComponent.explode();

        // Disable buzzer
        this.buzzerComponent.setEnabled(false);

        // Show game over screen
        setTimeout(() => {
            document.getElementById('final-score').textContent = this.gameState.totalPresses;
            document.getElementById('final-level').textContent = this.gameState.currentLevel;
            document.getElementById('violation-message').textContent = violatedRule.violationMessage;

            this.gameOverScreen.classList.remove('hidden');
            setTimeout(() => {
                this.gameOverScreen.classList.remove('opacity-0', 'pointer-events-none');
                this.gameOverScreen.classList.add('opacity-100');
            }, 10);
        }, 500);
    }

    /**
     * Restart the game
     */
    restart() {
        // Hide game over screen
        this.gameOverScreen.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            this.gameOverScreen.classList.add('hidden');
        }, 500);

        // Reset rule system
        this.ruleSystem.reset();

        // Reset buzzer component
        this.buzzerComponent.reset();
        this.buzzerComponent.setEnabled(true);

        // Clear rules UI
        this.rulesListContainer.innerHTML = '<p class="text-gray-400 italic text-center py-4">Press the buzzer to begin...</p>';

        // Hide timer
        this.timerDisplay.classList.add('hidden');

        // Reset game state
        this.gameState.status = 'idle';
        this.gameState.currentLevel = 1;
        this.gameState.totalPresses = 0;
        this.gameState.pressesThisLevel = 0;
        this.gameState.pressesRequiredForLevel = 0;
        this.gameState.lastPressTime = null;
        this.gameState.elapsedTime = 0;

        // Update UI
        this.updateUI();
    }

    /**
     * Update UI displays
     */
    updateUI() {
        this.levelDisplay.textContent = this.gameState.currentLevel;
        this.scoreDisplay.textContent = this.gameState.totalPresses;

        if (this.gameState.status === 'playing') {
            this.buzzerComponent.updateProgress(
                this.gameState.pressesThisLevel,
                this.gameState.pressesRequiredForLevel
            );
        }
    }

    /**
     * Add rule to UI
     * @param {Object} rule - Rule to add
     */
    addRuleToUI(rule) {
        // Remove "no rules" message if present
        const noRulesMsg = this.rulesListContainer.querySelector('.text-gray-400');
        if (noRulesMsg) {
            noRulesMsg.remove();
        }

        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-item flex items-center gap-3 p-3 bg-white/5 rounded-xl border-l-4 border-game-primary transition-all duration-300 animate-slide-in';
        ruleElement.dataset.ruleId = rule.id;

        ruleElement.innerHTML = `
            <div class="rule-icon text-xl flex-shrink-0">${rule.icon}</div>
            <div class="rule-text flex-1 text-sm leading-relaxed">${rule.description}</div>
            <div class="rule-level text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full flex-shrink-0">
                Lvl ${rule.level}
            </div>
        `;

        this.rulesListContainer.appendChild(ruleElement);

        // Scroll to show new rule
        setTimeout(() => {
            ruleElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BuzzerGame();
});
