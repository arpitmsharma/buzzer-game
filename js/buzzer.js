/**
 * BUZZER GAME - ENHANCED BUZZER COMPONENT
 * Uses GSAP for professional animations and emoji support
 */

class BuzzerComponent {
    constructor() {
        this.buzzer = document.getElementById('buzzer');
        this.buzzerGlow = document.getElementById('buzzer-glow');
        this.buzzerStatus = document.getElementById('buzzer-status');
        this.buzzerEmoji = document.getElementById('buzzer-emoji');
        this.progressCircle = document.getElementById('progress-circle');
        this.progressText = document.getElementById('progress-text');
        this.buzzerContainer = document.getElementById('buzzer-container');

        this.currentColor = 'neutral';
        this.currentEmoji = null;
        this.isPulsing = false;

        this.colorChangeInterval = null;
        this.pulseInterval = null;
        this.emojiInterval = null;

        // Rule hint element
        this.ruleHint = null;
    }

    /**
     * Create sparkle effect on button
     */
    createSparkles(count = 8) {
        const rect = this.buzzer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const x = centerX + Math.cos(angle) * radius * 0.8;
            const y = centerY + Math.sin(angle) * radius * 0.8;

            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.position = 'fixed';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sparkle.style.animationDelay = `${i * 0.1}s`;

            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1500);
        }
    }

    /**
     * Create success wave effect
     */
    createSuccessWave() {
        const wave = document.createElement('div');
        wave.className = 'success-wave';
        this.buzzer.appendChild(wave);

        setTimeout(() => wave.remove(), 600);
    }

    /**
     * Show rule hint on button
     */
    showRuleHint(ruleText) {
        // Remove existing hint
        if (this.ruleHint) {
            this.ruleHint.remove();
        }

        // Create new hint
        this.ruleHint = document.createElement('div');
        this.ruleHint.className = 'rule-hint';
        this.ruleHint.textContent = ruleText;
        this.buzzerContainer.appendChild(this.ruleHint);

        // Animate in
        gsap.fromTo(this.ruleHint,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
        );
    }

    /**
     * Hide rule hint
     */
    hideRuleHint() {
        if (this.ruleHint) {
            gsap.to(this.ruleHint, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                onComplete: () => {
                    if (this.ruleHint) {
                        this.ruleHint.remove();
                        this.ruleHint = null;
                    }
                }
            });
        }
    }

    /**
     * Set buzzer color state with GSAP animation
     */
    setColor(color) {
        this.currentColor = color;

        // Remove all color classes
        this.buzzerGlow.classList.remove(
            'buzzer-glow-neutral',
            'buzzer-glow-green',
            'buzzer-glow-red',
            'buzzer-glow-yellow'
        );

        // Add new color class
        this.buzzerGlow.classList.add(`buzzer-glow-${color}`);

        // Update buzzer button classes for state
        this.buzzer.classList.remove('state-green', 'state-red', 'state-yellow');
        if (color !== 'neutral') {
            this.buzzer.classList.add(`state-${color}`);
        }

        // GSAP: Animate color transition
        gsap.to(this.buzzerGlow, {
            opacity: color === 'neutral' ? 0.5 : 0.9,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    /**
     * Set emoji on buzzer with enter/exit animations
     */
    setEmoji(emoji) {
        if (emoji === this.currentEmoji) return;

        if (emoji) {
            // Emoji entering
            this.currentEmoji = emoji;
            this.buzzerEmoji.textContent = emoji;

            // Play emoji appear sound
            if (window.soundManager) {
                window.soundManager.playEmojiAppear();
            }

            // Create sparkles for emoji appearance
            this.createSparkles(6);

            // GSAP: Bounce in animation
            gsap.fromTo(this.buzzerEmoji,
                {
                    scale: 0,
                    rotation: -180,
                    opacity: 0
                },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                }
            );

            // Hide status text when emoji is showing
            gsap.to(this.buzzerStatus, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2
            });
        } else {
            // Emoji exiting
            if (this.currentEmoji) {
                // GSAP: Bounce out animation
                gsap.to(this.buzzerEmoji, {
                    scale: 0,
                    rotation: 180,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'back.in(1.7)',
                    onComplete: () => {
                        this.buzzerEmoji.textContent = '';
                        this.currentEmoji = null;
                    }
                });

                // Show status text again
                gsap.to(this.buzzerStatus, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.2,
                    delay: 0.1
                });
            }
        }
    }

    /**
     * Update buzzer status text
     */
    setStatus(text) {
        this.buzzerStatus.textContent = text;
    }

    /**
     * Update progress ring with GSAP animation
     */
    updateProgress(current, total) {
        this.progressText.textContent = `${current}/${total}`;

        const percentage = total > 0 ? current / total : 0;
        const circumference = 565.48;
        const offset = circumference - (percentage * circumference);

        // GSAP: Animate progress ring
        gsap.to(this.progressCircle, {
            strokeDashoffset: offset,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Color change based on progress
        const progressColor = percentage < 0.3 ? '#00ff88' :
                            percentage < 0.7 ? '#ffaa00' : '#ff0055';

        gsap.to(this.progressCircle, {
            stroke: progressColor,
            duration: 0.3
        });
    }

    /**
     * Set pulsing state with GSAP
     */
    setPulsing(pulsing) {
        this.isPulsing = pulsing;

        if (pulsing) {
            // GSAP: Continuous pulse animation
            gsap.to(this.buzzer, {
                scale: 1.05,
                duration: 0.8,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1
            });

            gsap.to(this.buzzerGlow, {
                opacity: 1,
                duration: 0.8,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1
            });
        } else {
            // Stop pulsing
            gsap.killTweensOf(this.buzzer);
            gsap.to(this.buzzer, {
                scale: 1,
                duration: 0.3
            });
        }
    }

    /**
     * Start automatic color changing
     */
    startColorCycle(interval = 2000) {
        this.stopColorCycle();

        const colors = ['green', 'red', 'yellow'];
        let currentIndex = 0;

        this.colorChangeInterval = setInterval(() => {
            this.setColor(colors[currentIndex]);
            currentIndex = (currentIndex + 1) % colors.length;
        }, interval);
    }

    /**
     * Stop automatic color changing
     */
    stopColorCycle() {
        if (this.colorChangeInterval) {
            clearInterval(this.colorChangeInterval);
            this.colorChangeInterval = null;
        }
    }

    /**
     * Start pulse cycle
     */
    startPulseCycle(interval = 3000) {
        this.stopPulseCycle();

        let isPulse = true;

        this.pulseInterval = setInterval(() => {
            this.setPulsing(isPulse);
            isPulse = !isPulse;
        }, interval);
    }

    /**
     * Stop pulse cycle
     */
    stopPulseCycle() {
        if (this.pulseInterval) {
            clearInterval(this.pulseInterval);
            this.pulseInterval = null;
        }
        this.setPulsing(false);
    }

    /**
     * Start emoji cycle based on active emojis
     */
    startEmojiCycle(emojis, interval = 3000) {
        this.stopEmojiCycle();

        if (emojis.length === 0) return;

        let currentIndex = 0;

        // Show first emoji immediately
        this.setEmoji(emojis[currentIndex].emoji);

        this.emojiInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % emojis.length;
            this.setEmoji(emojis[currentIndex].emoji);
        }, interval);
    }

    /**
     * Stop emoji cycle
     */
    stopEmojiCycle() {
        if (this.emojiInterval) {
            clearInterval(this.emojiInterval);
            this.emojiInterval = null;
        }
        this.setEmoji(null);
    }

    /**
     * Flash buzzer briefly
     */
    flash(color, duration = 200) {
        const originalColor = this.currentColor;

        // GSAP: Quick flash
        gsap.to(this.buzzerGlow, {
            opacity: 1,
            duration: 0.1,
            onStart: () => {
                this.setColor(color);
            },
            onComplete: () => {
                setTimeout(() => {
                    this.setColor(originalColor);
                }, duration);
            }
        });
    }

    /**
     * Trigger explosion animation with GSAP
     */
    explode() {
        const explosionContainer = document.getElementById('explosion-container');
        const rect = this.buzzer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Play explosion sound
        if (window.soundManager) {
            window.soundManager.playExplosion();
        }

        // Create particles
        const particleCount = 60;
        const colors = ['#ff0055', '#ff3377', '#ff6699', '#ffaa00', '#ff5500', '#ff0000'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.width = '12px';
            particle.style.height = '12px';
            particle.style.borderRadius = '50%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.pointerEvents = 'none';

            explosionContainer.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 150 + Math.random() * 250;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            // GSAP: Particle explosion animation
            gsap.to(particle, {
                x: tx,
                y: ty,
                opacity: 0,
                scale: 0,
                duration: 0.8 + Math.random() * 0.4,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }

        // Screen shake with GSAP
        const gameContainer = document.getElementById('game-container');
        gsap.to(gameContainer, {
            x: -10,
            duration: 0.05,
            yoyo: true,
            repeat: 10,
            ease: 'power1.inOut',
            onComplete: () => {
                gsap.set(gameContainer, { x: 0 });
            }
        });

        // Buzzer shake and flash
        gsap.to(this.buzzer, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        this.setColor('red');
    }

    /**
     * Trigger level up celebration with GSAP
     */
    celebrateLevelUp() {
        const explosionContainer = document.getElementById('explosion-container');
        const rect = this.buzzer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Play level up sound
        if (window.soundManager) {
            window.soundManager.playLevelUp();
        }

        // Create sparkles
        this.createSparkles(12);

        // Create fireworks particles
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = '#00ff88';
            particle.style.boxShadow = '0 0 10px #00ff88';
            particle.style.pointerEvents = 'none';

            explosionContainer.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 180 + Math.random() * 120;
            const fx = Math.cos(angle) * distance;
            const fy = Math.sin(angle) * distance;

            // GSAP: Firework animation
            gsap.to(particle, {
                x: fx,
                y: fy,
                opacity: 0,
                scale: 0.5,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }

        // Buzzer level up animation
        gsap.timeline()
            .to(this.buzzer, {
                scale: 1.2,
                duration: 0.3,
                ease: 'back.out(1.7)'
            })
            .to(this.buzzer, {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });

        // Glow effect
        gsap.to(this.buzzerGlow, {
            opacity: 1,
            scale: 1.3,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }

    /**
     * Reset buzzer to initial state
     */
    reset() {
        gsap.killTweensOf(this.buzzer);
        gsap.killTweensOf(this.buzzerGlow);
        gsap.killTweensOf(this.buzzerEmoji);

        this.stopColorCycle();
        this.stopPulseCycle();
        this.stopEmojiCycle();
        this.hideRuleHint();

        this.setColor('neutral');
        this.setEmoji(null);
        this.setStatus('PRESS TO START');
        this.updateProgress(0, 0);

        gsap.set(this.buzzer, { scale: 1 });
        gsap.set(this.buzzerGlow, { opacity: 0.5 });
        gsap.set(this.buzzerStatus, { opacity: 1, scale: 1 });
    }

    /**
     * Enable/disable buzzer interaction
     */
    setEnabled(enabled) {
        this.buzzer.disabled = !enabled;

        if (!enabled) {
            gsap.to(this.buzzer, {
                opacity: 0.5,
                duration: 0.3
            });
            this.buzzer.classList.add('cursor-not-allowed');
        } else {
            gsap.to(this.buzzer, {
                opacity: 1,
                duration: 0.3
            });
            this.buzzer.classList.remove('cursor-not-allowed');
        }
    }

    /**
     * Get current state for rule validation
     */
    getState() {
        return {
            color: this.currentColor,
            emoji: this.currentEmoji,
            pulsing: this.isPulsing
        };
    }
}

// Make BuzzerComponent available globally
window.BuzzerComponent = BuzzerComponent;
