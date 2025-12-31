/**
 * SolarSystem.js
 * Manages the 3D solar system visualization with planets and orbits
 */

class SolarSystem {
    constructor() {
        this.container = document.getElementById('solar-system');
        this.solarSystem = this.container?.querySelector('.solar-system');
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.rotation = 0;

        // Planet data (distances in AU, sizes relative to Earth)
        this.planets = {
            mercury: {
                distance: 0.39,
                diameter: 4879,
                dayLength: 1408,
                yearLength: 88,
                fact: "Mercury is the smallest planet and closest to the Sun. Despite being so close, it's not the hottest planet - Venus is!"
            },
            venus: {
                distance: 0.72,
                diameter: 12104,
                dayLength: 5832,
                yearLength: 225,
                fact: "Venus rotates backwards compared to other planets. A day on Venus is longer than its year!"
            },
            earth: {
                distance: 1.0,
                diameter: 12742,
                dayLength: 24,
                yearLength: 365,
                fact: "Earth is the only planet known to support life. It's also the densest planet in our solar system."
            },
            mars: {
                distance: 1.52,
                diameter: 6779,
                dayLength: 25,
                yearLength: 687,
                fact: "Mars has the largest volcano in the solar system - Olympus Mons, which is about 3 times the height of Mt. Everest!"
            },
            jupiter: {
                distance: 5.2,
                diameter: 139820,
                dayLength: 10,
                yearLength: 4333,
                fact: "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth!"
            },
            saturn: {
                distance: 9.5,
                diameter: 116460,
                dayLength: 11,
                yearLength: 10759,
                fact: "Saturn's rings are made mostly of ice particles, with some rocky debris. If you could find a bathtub big enough, Saturn would float!"
            },
            uranus: {
                distance: 19.2,
                diameter: 50724,
                dayLength: 17,
                yearLength: 30687,
                fact: "Uranus rotates on its side like a rolling ball. It was the first planet discovered with a telescope."
            },
            neptune: {
                distance: 30.1,
                diameter: 49244,
                dayLength: 16,
                yearLength: 60190,
                fact: "Neptune has the strongest winds in the solar system, reaching speeds up to 2,100 km/h!"
            }
        };

        this.init();
    }

    init() {
        this.createAsteroidBelt();
        this.setupPlanetClicks();
    }

    createAsteroidBelt() {
        const belt = document.getElementById('asteroid-belt');
        if (!belt) return;

        // Create random asteroids
        const numAsteroids = 60;
        for (let i = 0; i < numAsteroids; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = 'asteroid';

            // Random position on the orbit
            const angle = (Math.PI * 2 * i) / numAsteroids + Math.random() * 0.3;
            const radius = 180 + Math.random() * 40; // Vary the radius slightly

            const x = Math.cos(angle) * radius + 220;
            const y = Math.sin(angle) * radius + 220;

            // Random size
            const size = 1 + Math.random() * 3;

            asteroid.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
            `;

            belt.appendChild(asteroid);
        }
    }

    setupPlanetClicks() {
        const planets = document.querySelectorAll('.planet');
        planets.forEach(planet => {
            planet.addEventListener('click', (e) => {
                e.stopPropagation();
                const planetName = planet.dataset.planet;
                if (planetName && window.planetInfo) {
                    window.planetInfo.show(planetName);
                }
            });
        });
    }

    getPlanetData(name) {
        return this.planets[name.toLowerCase()];
    }

    getPlanetPosition(name) {
        const planetElement = document.querySelector(`.planet.${name}`);
        if (!planetElement) return null;

        const rect = planetElement.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    // Get distance from sun based on visual position
    getDistanceFromSun(x, y) {
        if (!this.solarSystem) return 0;

        const rect = this.solarSystem.getBoundingClientRect();
        const sunX = rect.left + rect.width / 2;
        const sunY = rect.top + rect.height / 2;

        const dx = x - sunX;
        const dy = y - sunY;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);

        // Convert pixel distance to AU (approximate based on Neptune's orbit at ~520px = 30 AU)
        const auDistance = (pixelDistance / 520) * 30;
        return Math.max(0, auDistance);
    }

    // Find nearest planet to a point
    findNearestPlanet(x, y) {
        let nearest = { name: 'Sun', distance: Infinity };

        // Check distance to sun
        if (this.solarSystem) {
            const rect = this.solarSystem.getBoundingClientRect();
            const sunX = rect.left + rect.width / 2;
            const sunY = rect.top + rect.height / 2;
            const sunDist = Math.sqrt((x - sunX) ** 2 + (y - sunY) ** 2);
            nearest = { name: 'Sun', distance: sunDist };
        }

        // Check each planet
        Object.keys(this.planets).forEach(planetName => {
            const pos = this.getPlanetPosition(planetName);
            if (pos) {
                const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (dist < nearest.distance) {
                    nearest = {
                        name: planetName.charAt(0).toUpperCase() + planetName.slice(1),
                        distance: dist
                    };
                }
            }
        });

        return nearest.name;
    }

    // Zoom and pan controls
    setZoom(scale) {
        this.scale = Math.max(0.3, Math.min(3, scale));
        this.updateTransform();
    }

    zoom(delta) {
        this.setZoom(this.scale + delta);
    }

    pan(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
        this.updateTransform();
    }

    panTo(x, y) {
        this.offsetX = x;
        this.offsetY = y;
        this.updateTransform();
    }

    updateTransform() {
        if (this.container) {
            this.container.style.transform = `
                translate(-50%, -50%) 
                translate(${this.offsetX}px, ${this.offsetY}px) 
                scale(${this.scale})
            `;
        }
    }

    // Warp to a specific planet
    warpToPlanet(planetName) {
        const planetData = this.planets[planetName.toLowerCase()];
        if (!planetData) return;

        // Calculate offset to center the planet
        // This is a simplified version - in reality, you'd need to track orbital positions
        const orbitRadii = {
            mercury: 60,
            venus: 90,
            earth: 130,
            mars: 170,
            jupiter: 280,
            saturn: 360,
            uranus: 440,
            neptune: 520
        };

        const radius = orbitRadii[planetName.toLowerCase()] || 0;

        // Pan to center on the planet (approximate)
        this.panTo(-radius * 0.5, 0);
        this.setZoom(1.5);

        return planetData.distance;
    }

    // Reset view to default
    resetView() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateTransform();
    }
}

// Export for use in main.js
window.SolarSystem = SolarSystem;
