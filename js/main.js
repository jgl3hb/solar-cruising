/**
 * main.js
 * Application orchestrator - initializes all components and runs the game loop
 * Now with Three.js 3D graphics integration
 */

// Game state
let isRunning = false;
let lastTime = 0;
let use3D = true; // Enable 3D mode
let achievements = {
    firstLight: false,
    halfLight: false,
    lightSpeed: false
};

// Components (2D)
window.solarSystem = null;
window.rocket = null;
window.launchPad = null;
window.hud = null;
window.planetInfo = null;

// 3D Components
window.threeScene = null;
window.solarSystem3D = null;
window.rocket3D = null;

// Planet info for 3D mode
const planetInfo3D = {
    mercury: { name: 'Mercury', distance: 0.39, diameter: 4879, day: 1407.6, year: 88 },
    venus: { name: 'Venus', distance: 0.72, diameter: 12104, day: 5832.5, year: 225 },
    earth: { name: 'Earth', distance: 1.0, diameter: 12756, day: 24, year: 365 },
    mars: { name: 'Mars', distance: 1.52, diameter: 6792, day: 24.7, year: 687 },
    jupiter: { name: 'Jupiter', distance: 5.2, diameter: 142984, day: 9.9, year: 4333 },
    saturn: { name: 'Saturn', distance: 9.58, diameter: 120536, day: 10.7, year: 10759 },
    uranus: { name: 'Uranus', distance: 19.22, diameter: 51118, day: 17.2, year: 30687 },
    neptune: { name: 'Neptune', distance: 30.05, diameter: 49528, day: 16.1, year: 60190 },
    pluto: { name: 'Pluto', distance: 39.5, diameter: 2377, day: 153.3, year: 90560 }
};

// Game loop object
window.gameLoop = {
    start: function () {
        if (!isRunning) {
            isRunning = true;
            lastTime = performance.now();
            window.hud?.startMissionTimer();

            if (use3D && window.threeScene) {
                window.threeScene.start();
            } else {
                requestAnimationFrame(update);
            }
        }
    },
    stop: function () {
        isRunning = false;
        if (window.threeScene) {
            window.threeScene.stop();
        }
    }
};

// Main update loop (2D fallback)
function update(currentTime) {
    if (!isRunning) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update rocket physics
    if (window.rocket) {
        window.rocket.update(deltaTime);

        // Update HUD with rocket data
        if (window.hud) {
            window.hud.update({
                speed: window.rocket.getSpeed(),
                speedPercent: window.rocket.getSpeedPercent(),
                throttle: window.rocket.getThrottle(),
                distanceAU: window.rocket.getDistanceFromSun(),
                nearestPlanet: window.rocket.getNearestPlanet()
            });
        }

        // Check for achievements
        checkAchievements(window.rocket.getSpeedPercent());
    }

    // Continue the loop
    requestAnimationFrame(update);
}

// 3D Update loop callback
function update3D(delta, elapsed) {
    // Update solar system
    if (window.solarSystem3D) {
        window.solarSystem3D.update(delta, elapsed);
    }

    // Update rocket
    if (window.rocket3D) {
        window.rocket3D.update(delta);

        // Camera follow
        window.threeScene.updateCameraFollow(
            window.rocket3D.getPosition(),
            window.rocket3D.getLookAhead()
        );

        // Update HUD
        if (window.hud) {
            const speed = window.rocket3D.getSpeed();
            const maxSpeed = 500;
            const speedPercent = (speed / maxSpeed) * 100;
            const position = window.rocket3D.getPosition();
            const distanceFromCenter = Math.sqrt(position.x ** 2 + position.z ** 2);
            const distanceAU = distanceFromCenter / 170; // Earth orbit = 1 AU

            // Find nearest planet
            let nearestPlanet = 'Sun';
            let nearestDist = distanceFromCenter;

            for (const [name, planet] of Object.entries(window.solarSystem3D.planets)) {
                const planetPos = planet.getPosition();
                const dist = position.distanceTo(planetPos);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestPlanet = name.charAt(0).toUpperCase() + name.slice(1);
                }
            }

            window.hud.update({
                speed: speed * 599, // Scale to km/s equivalent
                speedPercent: speedPercent,
                throttle: window.rocket3D.getThrottle() * 100,
                distanceAU: distanceAU.toFixed(2),
                nearestPlanet: nearestPlanet
            });

            checkAchievements(speedPercent);
        }
    }
}

// Check and trigger achievements
function checkAchievements(speedPercent) {
    if (!window.hud) return;

    if (!achievements.firstLight && speedPercent >= 10) {
        achievements.firstLight = true;
        window.hud.showAchievement(
            "Breaking Barriers",
            "Reached 10% of the speed of light!"
        );
    }

    if (!achievements.halfLight && speedPercent >= 50) {
        achievements.halfLight = true;
        window.hud.showAchievement(
            "Halfway There",
            "Reached 50% of the speed of light!"
        );
    }

    if (!achievements.lightSpeed && speedPercent >= 99) {
        achievements.lightSpeed = true;
        window.hud.showAchievement(
            "Light Speed!",
            "You've reached the cosmic speed limit!"
        );
    }
}

// Initialize 3D scene (called after launch)
function init3DScene() {
    console.log('🌌 Initializing 3D scene...');

    const container = document.getElementById('three-container');
    if (!container) {
        console.error('Three.js container not found!');
        return false;
    }

    // Show container
    container.style.display = 'block';

    // Create Three.js scene
    window.threeScene = new ThreeScene();
    window.threeScene.init(container);

    // Create 3D solar system
    window.solarSystem3D = new SolarSystem3D(window.threeScene.scene);
    window.solarSystem3D.init();

    // Create 3D rocket
    window.rocket3D = new Rocket3D(window.threeScene.scene);
    window.rocket3D.init();

    // Add update callbacks
    window.threeScene.addUpdateCallback(update3D);

    // Setup planet warp keys (1-9)
    const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    document.addEventListener('keydown', (e) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9 && window.rocket3D && window.solarSystem3D) {
            const planetName = planets[num - 1];
            const pos = window.solarSystem3D.getPlanetPosition(planetName);
            window.rocket3D.warpTo(pos);
            console.log(`🚀 Warped to ${planetName.charAt(0).toUpperCase() + planetName.slice(1)}!`);
        }
    });

    console.log('✅ 3D scene initialized!');
    return true;
}

// Override launch pad to use 3D
function hookLaunchPad() {
    const originalTransition = window.launchPad?.transitionToSpace?.bind(window.launchPad);

    if (window.launchPad && use3D) {
        window.launchPad.transitionToSpace = function () {
            // Hide 2D space scene elements
            const spaceScene = document.getElementById('space-scene');
            const solarSystem = document.getElementById('solar-system');
            const spaceRocket = document.getElementById('space-rocket');

            if (solarSystem) solarSystem.style.display = 'none';
            if (spaceRocket) spaceRocket.style.display = 'none';

            // Initialize 3D
            if (init3DScene()) {
                // Show space scene (for HUD)
                if (spaceScene) {
                    spaceScene.classList.add('active');
                }

                // Start 3D game loop
                window.gameLoop.start();
            }
        };
    }
}

// Initialization
function init() {
    console.log('🚀 Solar System Explorer initializing...');
    console.log('🎮 3D Mode: ' + (use3D ? 'ENABLED' : 'DISABLED'));

    // Create 2D components (for launch scene)
    window.solarSystem = new SolarSystem();
    window.rocket = new Rocket();
    window.launchPad = new LaunchPad();
    window.hud = new HUD();
    window.planetInfo = new PlanetInfo();

    // Hook launch pad for 3D transition
    hookLaunchPad();

    console.log('✅ All systems initialized!');
    console.log('📍 Location: Cape Canaveral, Florida');
    console.log('🎯 Mission: Explore the Solar System in 3D!');
    console.log('⚡ Max Speed: 299,792 km/s (Speed of Light)');
    console.log('');
    console.log('Press SPACE or click "INITIATE LAUNCH" to begin!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Prevent context menu on right-click (optional, for immersion)
document.addEventListener('contextmenu', (e) => {
    // Allow right-click for debugging
    // e.preventDefault();
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Optionally pause the game
        // window.gameLoop.stop();
    } else {
        // Resume
        if (window.rocket3D || window.rocket?.isLaunched) {
            lastTime = performance.now();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any size-dependent values
    if (window.solarSystem) {
        window.solarSystem.updateTransform();
    }
});

// Debug helper (can be called from console)
window.debug = {
    warpTo: (planet) => {
        if (use3D && window.rocket3D && window.solarSystem3D) {
            const pos = window.solarSystem3D.getPlanetPosition(planet);
            window.rocket3D.warpTo(pos);
        } else {
            window.rocket?.warpTo(planet);
        }
    },
    setSpeed: (speed) => {
        if (use3D && window.rocket3D) {
            window.rocket3D.speed = speed;
        } else if (window.rocket) {
            window.rocket.speed = speed;
            window.rocket.velocityX = speed;
        }
    },
    resetAchievements: () => {
        achievements = { firstLight: false, halfLight: false, lightSpeed: false };
        console.log('Achievements reset');
    },
    getState: () => ({
        speed: use3D ? window.rocket3D?.getSpeed() : window.rocket?.getSpeed(),
        speedPercent: use3D ? (window.rocket3D?.getSpeed() / 500) * 100 : window.rocket?.getSpeedPercent(),
        position: use3D ? window.rocket3D?.getPosition() : window.rocket?.getPosition(),
        throttle: use3D ? window.rocket3D?.getThrottle() : window.rocket?.getThrottle()
    }),
    toggle3D: () => {
        use3D = !use3D;
        console.log('3D Mode:', use3D ? 'ENABLED' : 'DISABLED');
        console.log('Refresh the page to apply changes.');
    }
};
