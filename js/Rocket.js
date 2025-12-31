/**
 * Rocket.js
 * Handles rocket physics, movement, and speed calculations
 */

class Rocket {
    constructor() {
        this.spaceRocket = document.getElementById('space-rocket');
        this.speedBlur = document.getElementById('speed-blur');
        this.flame = document.getElementById('space-flame');

        // Physics constants
        this.LIGHT_SPEED = 299792; // km/s
        this.MAX_ACCELERATION = 5000; // km/s² (fictional for gameplay)
        this.DRAG = 0.99; // Space drag for smooth deceleration

        // State
        this.x = 0;
        this.y = 0;
        this.rotation = 0; // degrees
        this.speed = 0; // km/s
        this.throttle = 0; // 0-100%
        this.velocityX = 0;
        this.velocityY = 0;

        // Input state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            boost: false
        };

        this.isLaunched = false;
        this.init();
    }

    init() {
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isLaunched) return;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.up = true;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.down = true;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = true;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = true;
                    break;
                case ' ':
                    this.keys.boost = true;
                    e.preventDefault();
                    break;
                case 'q':
                    if (window.solarSystem) window.solarSystem.zoom(0.1);
                    break;
                case 'e':
                    if (window.solarSystem) window.solarSystem.zoom(-0.1);
                    break;
                // Number keys for quick warp
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    this.warpToNumber(parseInt(e.key));
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.up = false;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.down = false;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = false;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = false;
                    break;
                case ' ':
                    this.keys.boost = false;
                    break;
            }
        });
    }

    warpToNumber(num) {
        const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        if (num >= 1 && num <= 8) {
            this.warpTo(planets[num - 1]);
        }
    }

    warpTo(planetName) {
        if (window.solarSystem) {
            const distance = window.solarSystem.warpToPlanet(planetName);
            if (distance !== undefined) {
                // Update position based on planet distance
                this.x = 0;
                this.y = 0;
                this.speed = 0;
                this.velocityX = 0;
                this.velocityY = 0;

                // Flash effect
                this.createWarpEffect();
            }
        }
    }

    createWarpEffect() {
        const warpFlash = document.createElement('div');
        warpFlash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, 
                rgba(0, 255, 255, 0.5) 0%, 
                transparent 70%);
            z-index: 400;
            pointer-events: none;
            animation: warpFade 0.5s ease-out forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes warpFade {
                from { opacity: 1; transform: scale(0.5); }
                to { opacity: 0; transform: scale(2); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(warpFlash);

        setTimeout(() => {
            warpFlash.remove();
            style.remove();
        }, 500);
    }

    launch() {
        this.isLaunched = true;
        this.speed = 0;
        this.throttle = 50;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;

        // Start at Earth's position
        if (this.spaceRocket) {
            this.spaceRocket.style.display = 'block';
        }
    }

    update(deltaTime) {
        if (!this.isLaunched) return;

        const dt = deltaTime / 1000; // Convert to seconds

        // Handle rotation
        if (this.keys.left) {
            this.rotation -= 180 * dt; // degrees per second
        }
        if (this.keys.right) {
            this.rotation += 180 * dt;
        }

        // Handle thrust
        if (this.keys.up || this.keys.boost) {
            const boostMultiplier = this.keys.boost ? 3 : 1;
            this.throttle = Math.min(100, this.throttle + 50 * dt * boostMultiplier);
        } else if (this.keys.down) {
            this.throttle = Math.max(0, this.throttle - 80 * dt);
        } else {
            // Gradual throttle decrease when no input
            this.throttle = Math.max(0, this.throttle - 10 * dt);
        }

        // Calculate acceleration based on throttle
        const acceleration = (this.throttle / 100) * this.MAX_ACCELERATION;

        // Convert rotation to radians for velocity calculation
        const radians = (this.rotation - 90) * (Math.PI / 180);

        // Apply acceleration
        this.velocityX += Math.cos(radians) * acceleration * dt;
        this.velocityY += Math.sin(radians) * acceleration * dt;

        // Calculate current speed
        this.speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);

        // Cap at light speed
        if (this.speed > this.LIGHT_SPEED) {
            const scale = this.LIGHT_SPEED / this.speed;
            this.velocityX *= scale;
            this.velocityY *= scale;
            this.speed = this.LIGHT_SPEED;
        }

        // Apply drag (very slight in space)
        if (this.throttle === 0) {
            this.velocityX *= this.DRAG;
            this.velocityY *= this.DRAG;
            this.speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
        }

        // Update position (scaled down for visual)
        const positionScale = 0.0001; // Scale factor for visible movement
        this.x += this.velocityX * dt * positionScale;
        this.y += this.velocityY * dt * positionScale;

        // Update visual
        this.updateVisual();

        // Move the solar system (inverse of rocket movement for parallax effect)
        if (window.solarSystem) {
            window.solarSystem.pan(-this.velocityX * dt * positionScale, -this.velocityY * dt * positionScale);
        }
    }

    updateVisual() {
        if (!this.spaceRocket) return;

        // Update rocket rotation
        const rocketElement = this.spaceRocket.querySelector('.rocket');
        if (rocketElement) {
            rocketElement.style.transform = `rotate(${this.rotation - 90}deg)`;
        }

        // Update flame visibility and intensity
        if (this.flame) {
            if (this.throttle > 5) {
                this.flame.classList.add('active');
                const flameScale = 0.5 + (this.throttle / 100) * 1.5;
                this.flame.style.transform = `rotate(-90deg) scale(${flameScale})`;
            } else {
                this.flame.classList.remove('active');
            }
        }

        // Update speed blur
        if (this.speedBlur) {
            const blurLength = (this.speed / this.LIGHT_SPEED) * 200;
            this.speedBlur.style.width = `${blurLength}px`;

            if (this.speed > this.LIGHT_SPEED * 0.1) {
                this.speedBlur.classList.add('active');
            } else {
                this.speedBlur.classList.remove('active');
            }
        }
    }

    getSpeed() {
        return this.speed;
    }

    getSpeedPercent() {
        return (this.speed / this.LIGHT_SPEED) * 100;
    }

    getThrottle() {
        return this.throttle;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    // Get distance from sun in AU (approximate based on visual position)
    getDistanceFromSun() {
        if (window.solarSystem) {
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;
            return window.solarSystem.getDistanceFromSun(screenCenterX, screenCenterY);
        }
        return 1.0; // Default to Earth's distance
    }

    getNearestPlanet() {
        if (window.solarSystem) {
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;
            return window.solarSystem.findNearestPlanet(screenCenterX, screenCenterY);
        }
        return 'Earth';
    }
}

// Export for use in main.js
window.Rocket = Rocket;
