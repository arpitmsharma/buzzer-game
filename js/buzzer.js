/**
 * BUZZER GAME - BUZZER COMPONENT
 * Manages buzzer visual states, animations, and interactions
 */

class BuzzerComponent {
    constructor() {
        this.buzzer = document.getElementById('buzzer');
        this.buzzerGlow = document.getElementById('buzzer-glow');
        this.buzzerStatus = document.getElementById('buzzer-status');
        this.progressCircle = document.getElementById('progress-circle');
        this.progressText = document.getElementById('progress-text');

        this.currentColor = 'neutral';
        this.isPulsing = false;
        this.isRotating = false;
        this.rotationDirection = null;

        this.colorChangeInterval = null;
        this.pulseInterval = null;
        this.rotationInterval = null;
    }

    /**
     * Set buzzer color state
     * @param {string} color - 'neutral', 'green', 'red', 'yellow'
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
    }

    /**
     * Update buzzer status text
     * @param {string} text - Status text to display
     */
    setStatus(text) {
        this.buzzerStatus.textContent = text;
    }

    /**
     * Update progress ring
     * @param {number} current - Current progress
     * @param {number} total - Total required
     */
    updateProgress(current, total) {
        this.progressText.textContent = `${current}/${total}`;

        // Calculate progress percentage
        const percentage = total > 0 ? current / total : 0;
        const circumference = 565.48; // 2 * PI * r (r=90)
        const offset = circumference - (percentage * circumference);

        this.progressCircle.style.strokeDashoffset = offset;
    }

    /**
     * Set pulsing state
     * @param {boolean} pulsing - Whether buzzer should pulse
     */
    setPulsing(pulsing) {
        this.isPulsing = pulsing;

        if (pulsing) {
            this.buzzer.classList.add('buzzer-pulse-green');
        } else {
            this.buzzer.classList.remove('buzzer-pulse-green');
        }
    }

    /**
     * Set rotation state
     * @param {string} direction - 'clockwise', 'counterclockwise', or null
     */
    setRotation(direction) {
        // Remove existing rotation classes
        this.buzzer.classList.remove('rotate-clockwise', 'rotate-counterclockwise');

        if (direction) {
            this.isRotating = true;
            this.rotationDirection = direction;
            this.buzzer.classList.add(`rotate-${direction}`);
        } else {
            this.isRotating = false;
            this.rotationDirection = null;
        }
    }

    /**
     * Start automatic color changing (for visual rules)
     * @param {number} interval - Time between color changes in ms
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
     * Start pulse cycle (for visual rules)
     * @param {number} interval - Time between pulses in ms
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
     * Flash buzzer briefly
     * @param {string} color - Color to flash
     * @param {number} duration - Flash duration in ms
     */
    flash(color, duration = 200) {
        const originalColor = this.currentColor;
        this.setColor(color);

        setTimeout(() => {
            this.setColor(originalColor);
        }, duration);
    }

    /**
     * Trigger explosion animation
     */
    explode() {
        const explosionContainer = document.getElementById('explosion-container');
        const rect = this.buzzer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create particles
        const particleCount = 50;
        const colors = ['#ff0055', '#ff3377', '#ff6699', '#ffaa00', '#ff5500'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            explosionContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => particle.remove(), 800);
        }

        // Screen shake
        document.getElementById('game-container').classList.add('screen-shake');
        setTimeout(() => {
            document.getElementById('game-container').classList.remove('screen-shake');
        }, 500);

        // Buzzer flash effect
        this.setColor('red');
    }

    /**
     * Trigger level up celebration
     */
    celebrateLevelUp() {
        const explosionContainer = document.getElementById('explosion-container');
        const rect = this.buzzer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create confetti/fireworks
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle');

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 150 + Math.random() * 100;
            const fx = Math.cos(angle) * distance;
            const fy = Math.sin(angle) * distance;

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.setProperty('--fx', `${fx}px`);
            particle.style.setProperty('--fy', `${fy}px`);
            particle.style.setProperty('--color', '#00ff88');

            explosionContainer.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }

        // Level up animation on buzzer
        this.buzzer.classList.add('level-up-animation');
        setTimeout(() => {
            this.buzzer.classList.remove('level-up-animation');
        }, 600);
    }

    /**
     * Reset buzzer to initial state
     */
    reset() {
        this.stopColorCycle();
        this.stopPulseCycle();
        this.setRotation(null);
        this.setColor('neutral');
        this.setStatus('PRESS TO START');
        this.updateProgress(0, 0);
        this.buzzer.classList.remove('screen-shake', 'level-up-animation');
    }

    /**
     * Enable/disable buzzer interaction
     * @param {boolean} enabled - Whether buzzer is enabled
     */
    setEnabled(enabled) {
        this.buzzer.disabled = !enabled;
        if (!enabled) {
            this.buzzer.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.buzzer.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    /**
     * Get current state for rule validation
     * @returns {Object} Current buzzer state
     */
    getState() {
        return {
            color: this.currentColor,
            pulsing: this.isPulsing,
            rotation: this.rotationDirection
        };
    }
}

// Make BuzzerComponent available globally
window.BuzzerComponent = BuzzerComponent;
