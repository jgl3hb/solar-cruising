/**
 * LaunchPad.js
 * Handles the Cape Canaveral launch sequence
 */

class LaunchPad {
    constructor() {
        this.launchScene = document.getElementById('launch-scene');
        this.spaceScene = document.getElementById('space-scene');
        this.launchBtn = document.getElementById('launch-btn');
        this.countdownDisplay = document.getElementById('countdown');
        this.rocketOnPad = document.getElementById('rocket-on-pad');
        this.launchFlame = document.getElementById('launch-flame');
        this.smokeContainer = document.getElementById('smoke-container');
        this.towerArm = document.querySelector('.tower-arm');

        this.isLaunching = false;
        this.countdownValue = 10;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Launch button click
        if (this.launchBtn) {
            this.launchBtn.addEventListener('click', () => this.startLaunch());
        }

        // Space bar to launch
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isLaunching &&
                this.launchScene?.classList.contains('active')) {
                e.preventDefault();
                this.startLaunch();
            }
        });
    }

    async startLaunch() {
        if (this.isLaunching) return;
        this.isLaunching = true;

        // Disable button
        if (this.launchBtn) {
            this.launchBtn.disabled = true;
        }

        // Start countdown
        await this.countdown();

        // Retract tower arm
        if (this.towerArm) {
            this.towerArm.classList.add('retracted');
        }

        // Wait for arm retraction
        await this.sleep(500);

        // Ignition!
        await this.ignition();

        // Liftoff!
        await this.liftoff();

        // Transition to space
        await this.transitionToSpace();
    }

    async countdown() {
        this.countdownValue = 10;

        for (let i = 10; i >= 0; i--) {
            this.countdownValue = i;

            if (this.countdownDisplay) {
                if (i === 0) {
                    this.countdownDisplay.textContent = 'LIFTOFF!';
                    this.countdownDisplay.classList.add('go');
                } else {
                    this.countdownDisplay.textContent = `T-${i}`;
                }
            }

            // Add shake effect at lower counts
            if (i <= 3 && i > 0) {
                this.launchScene?.classList.add('shake');
                setTimeout(() => this.launchScene?.classList.remove('shake'), 300);
            }

            // Play beep sound effect (simulated with console for now)
            this.playCountdownBeep(i);

            await this.sleep(1000);
        }
    }

    playCountdownBeep(count) {
        // Create audio context for beep sounds
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.frequency.value = count === 0 ? 880 : 440;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            // Audio not supported, continue silently
        }
    }

    async ignition() {
        // Show flame
        if (this.launchFlame) {
            this.launchFlame.classList.add('active');
        }

        // Start smoke generation
        this.startSmoke();

        // Add screen shake
        document.body.classList.add('shake');

        await this.sleep(1500);

        document.body.classList.remove('shake');
    }

    startSmoke() {
        if (!this.smokeContainer) return;

        let smokeInterval = setInterval(() => {
            if (!this.isLaunching) {
                clearInterval(smokeInterval);
                return;
            }

            // Create smoke particle
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'smoke-particle';

                const size = 20 + Math.random() * 40;
                const xOffset = (Math.random() - 0.5) * 100;

                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: calc(50% + ${xOffset}px);
                    animation-duration: ${1.5 + Math.random()}s;
                `;

                this.smokeContainer.appendChild(particle);

                // Remove after animation
                setTimeout(() => particle.remove(), 2000);
            }
        }, 100);

        // Stop smoke after a few seconds
        setTimeout(() => clearInterval(smokeInterval), 3000);
    }

    async liftoff() {
        // Animate rocket rising
        if (this.rocketOnPad) {
            this.rocketOnPad.classList.add('launching');
        }

        // Intense flame
        if (this.launchFlame) {
            this.launchFlame.style.transform = 'scale(1.5)';
        }

        await this.sleep(2500);
    }

    async transitionToSpace() {
        // Fade out launch scene
        if (this.launchScene) {
            this.launchScene.classList.remove('active');
        }

        await this.sleep(500);

        // Show space scene
        if (this.spaceScene) {
            this.spaceScene.classList.add('active');
        }

        // Notify rocket to start
        if (window.rocket) {
            window.rocket.launch();
        }

        // Start the game loop
        if (window.gameLoop) {
            window.gameLoop.start();
        }

        // Hide controls hint after a few seconds
        setTimeout(() => {
            const hint = document.getElementById('controls-hint');
            if (hint) {
                hint.style.opacity = '0.3';
            }
        }, 10000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        this.isLaunching = false;
        this.countdownValue = 10;

        if (this.launchBtn) {
            this.launchBtn.disabled = false;
        }

        if (this.countdownDisplay) {
            this.countdownDisplay.textContent = 'T-10';
            this.countdownDisplay.classList.remove('go');
        }

        if (this.rocketOnPad) {
            this.rocketOnPad.classList.remove('launching');
        }

        if (this.launchFlame) {
            this.launchFlame.classList.remove('active');
            this.launchFlame.style.transform = '';
        }

        if (this.towerArm) {
            this.towerArm.classList.remove('retracted');
        }
    }
}

// Export for use in main.js
window.LaunchPad = LaunchPad;
