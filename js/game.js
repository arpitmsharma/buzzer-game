/**
 * BUZZER GAME - ENHANCED MAIN GAME CONTROLLER
 * Shows only current rule, forcing players to remember past rules
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
            buzzerEmoji: null,
            buzzerEmojiTime: null,
            buzzerPulsing: false,
        };

        // Level configuration
        this.levelConfig = {
            1: 5, 2: 7, 3: 10, 4: 12, 5: 15,
            6: 18, 7: 22, 8: 25, 9: 30, 10: 35,
            11: 40, 12: 45, 13: 50, 14: 55, 15: 60,
            16: 65, 17: 70, 18: 75, 19: 80, 20: 100
        };

        // DOM Elements
        this.levelDisplay = document.getElementById('level-number');
        this.scoreDisplay = document.getElementById('score-number');
        this.currentRuleDisplay = document.getElementById('current-rule-display');
        this.rulesHistoryList = document.getElementById('rules-history-list');
        this.rulesHistoryModal = document.getElementById('rules-history-modal');
        this.ruleCountDisplay = document.getElementById('rule-count');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.timerDisplay = document.getElementById('timer-display');
        this.timerValue = document.getElementById('timer-value');

        // Intervals
        this.gameLoopInterval = null;

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

        // Rules history toggle
        document.getElementById('toggle-rules-history').addEventListener('click', () => {
            this.toggleRulesHistory();
        });

        document.getElementById('close-history').addEventListener('click', () => {
            this.toggleRulesHistory();
        });

        // Prevent accidental double-tap zoom on mobile
        this.buzzerComponent.buzzer.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });

        this.updateUI();
    }

    /**
     * Toggle rules history modal
     */
    toggleRulesHistory() {
        this.rulesHistoryModal.classList.toggle('hidden');
        this.updateRulesHistory();
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
            this.showCurrentRule(firstRule);
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

        // GSAP: Quick press feedback
        gsap.to(this.buzzerComponent.buzzer, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

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
        this.gameState.buzzerEmoji = buzzerState.emoji;
        this.gameState.buzzerPulsing = buzzerState.pulsing;
    }

    /**
     * Level up - add new rule and reset level progress
     */
    levelUp() {
        this.gameState.currentLevel++;
        this.gameState.pressesThisLevel = 0;
        this.gameState.pressesRequiredForLevel = this.levelConfig[this.gameState.currentLevel] || 100;

        // Add new rule for this level
        const newRule = this.ruleSystem.addRuleForLevel(this.gameState.currentLevel);
        if (newRule) {
            this.showCurrentRule(newRule);
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

        // Level 2+: Start emoji cycling
        const activeEmojis = this.ruleSystem.getActiveEmojis();
        if (activeEmojis.length > 0) {
            this.buzzerComponent.startEmojiCycle(activeEmojis, 3500);
        }

        // Level 3+: Start color cycling
        if (level >= 3) {
            this.buzzerComponent.startColorCycle(2500);
        }

        // Level 10+: Start pulse cycling
        if (level >= 10) {
            this.buzzerComponent.startPulseCycle(3000);
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

            // Track when emoji changes (for reaction time rules)
            const buzzerState = this.buzzerComponent.getState();
            if (buzzerState.emoji !== this.gameState.buzzerEmoji) {
                this.gameState.buzzerEmojiTime = Date.now();
            }

            // Update state
            this.updateGameState();

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
    }

    /**
     * Game over - show explosion and game over screen
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

            // GSAP: Fade in game over screen
            gsap.fromTo(this.gameOverScreen,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    onStart: () => {
                        this.gameOverScreen.classList.remove('pointer-events-none');
                    }
                }
            );
        }, 800);
    }

    /**
     * Restart the game
     */
    restart() {
        // GSAP: Fade out game over screen
        gsap.to(this.gameOverScreen, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.gameOverScreen.classList.add('hidden', 'pointer-events-none');
            }
        });

        // Reset rule system
        this.ruleSystem.reset();

        // Reset buzzer component
        this.buzzerComponent.reset();
        this.buzzerComponent.setEnabled(true);

        // Clear current rule display
        this.currentRuleDisplay.innerHTML = '<p class="text-gray-400 italic text-center">Press the buzzer to begin...</p>';

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

        const activeRules = this.ruleSystem.getActiveRules();
        this.ruleCountDisplay.textContent = activeRules.length;

        if (this.gameState.status === 'playing') {
            this.buzzerComponent.updateProgress(
                this.gameState.pressesThisLevel,
                this.gameState.pressesRequiredForLevel
            );
        }
    }

    /**
     * Show only the current/latest rule
     */
    showCurrentRule(rule) {
        // Clear current rule display
        this.currentRuleDisplay.innerHTML = '';

        // Create rule element
        const ruleElement = document.createElement('div');
        ruleElement.className = 'flex items-center gap-4 p-4 bg-game-primary/10 rounded-xl border-2 border-game-primary';

        ruleElement.innerHTML = `
            <div class="text-4xl flex-shrink-0">${rule.icon}</div>
            <div class="flex-1">
                <div class="text-sm text-gray-400 uppercase tracking-wide mb-1">Level ${rule.level} Rule</div>
                <div class="text-base md:text-lg font-semibold leading-relaxed text-white">${rule.description}</div>
            </div>
        `;

        this.currentRuleDisplay.appendChild(ruleElement);

        // GSAP: Animate rule entry
        gsap.fromTo(ruleElement,
            {
                x: -100,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'back.out(1.2)'
            }
        );

        // Fade out after a few seconds
        gsap.to(ruleElement, {
            opacity: 0.6,
            duration: 1,
            delay: 4,
            ease: 'power2.out'
        });
    }

    /**
     * Update rules history in modal
     */
    updateRulesHistory() {
        this.rulesHistoryList.innerHTML = '';

        const activeRules = this.ruleSystem.getActiveRules();

        if (activeRules.length === 0) {
            this.rulesHistoryList.innerHTML = '<p class="text-gray-400 italic text-center py-4">No rules yet</p>';
            return;
        }

        activeRules.forEach((rule, index) => {
            const ruleElement = document.createElement('div');
            ruleElement.className = 'flex items-center gap-3 p-3 bg-white/5 rounded-xl border-l-4 border-game-primary/50';

            ruleElement.innerHTML = `
                <div class="text-2xl flex-shrink-0">${rule.icon}</div>
                <div class="flex-1">
                    <div class="text-xs text-gray-400 mb-1">Level ${rule.level}</div>
                    <div class="text-sm leading-relaxed">${rule.description}</div>
                </div>
            `;

            this.rulesHistoryList.appendChild(ruleElement);

            // GSAP: Stagger animation
            gsap.fromTo(ruleElement,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    delay: index * 0.05
                }
            );
        });
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BuzzerGame();
});
