/**
 * PlanetInfo.js
 * Handles planet information panel display
 */

class PlanetInfo {
    constructor() {
        this.panel = document.getElementById('planet-info');
        this.closeBtn = document.getElementById('close-planet-info');
        this.planetIcon = document.getElementById('planet-icon');
        this.planetName = document.getElementById('planet-name');
        this.planetDistance = document.getElementById('planet-distance');
        this.planetDiameter = document.getElementById('planet-diameter');
        this.planetDay = document.getElementById('planet-day');
        this.planetYear = document.getElementById('planet-year');
        this.planetFact = document.getElementById('planet-fact');
        this.warpButton = document.getElementById('warp-to-planet');

        this.currentPlanet = null;

        // Planet colors for the icon
        this.planetColors = {
            mercury: 'radial-gradient(circle at 30% 30%, #d4d4d4, #b5b5b5)',
            venus: 'radial-gradient(circle at 30% 30%, #f5e6a3, #e6c87a)',
            earth: 'radial-gradient(circle at 30% 30%, #4a90d9, #2a5298)',
            mars: 'radial-gradient(circle at 30% 30%, #e07050, #cd5c5c)',
            jupiter: 'radial-gradient(circle at 30% 30%, #e8d5b5, #d4a574)',
            saturn: 'radial-gradient(circle at 30% 30%, #f8e8c8, #f4d59e)',
            uranus: 'radial-gradient(circle at 30% 30%, #a8e8f4, #7de3f4)',
            neptune: 'radial-gradient(circle at 30% 30%, #6a90e8, #4b70dd)'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }

        // Warp button
        if (this.warpButton) {
            this.warpButton.addEventListener('click', () => {
                if (this.currentPlanet && window.rocket) {
                    window.rocket.warpTo(this.currentPlanet);
                    this.hide();
                }
            });
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (this.panel?.classList.contains('active') &&
                !this.panel.contains(e.target) &&
                !e.target.closest('.planet')) {
                this.hide();
            }
        });
    }

    show(planetName) {
        if (!window.solarSystem) return;

        const data = window.solarSystem.getPlanetData(planetName);
        if (!data) return;

        this.currentPlanet = planetName;

        // Update panel content
        if (this.planetIcon) {
            this.planetIcon.style.background = this.planetColors[planetName.toLowerCase()];
        }

        if (this.planetName) {
            this.planetName.textContent = this.capitalize(planetName);
        }

        if (this.planetDistance) {
            this.planetDistance.textContent = `${data.distance} AU`;
        }

        if (this.planetDiameter) {
            this.planetDiameter.textContent = `${data.diameter.toLocaleString()} km`;
        }

        if (this.planetDay) {
            if (data.dayLength >= 24) {
                const days = Math.round(data.dayLength / 24);
                this.planetDay.textContent = `${days} Earth days`;
            } else {
                this.planetDay.textContent = `${data.dayLength} hours`;
            }
        }

        if (this.planetYear) {
            if (data.yearLength > 365) {
                const years = (data.yearLength / 365).toFixed(1);
                this.planetYear.textContent = `${years} Earth years`;
            } else {
                this.planetYear.textContent = `${data.yearLength} days`;
            }
        }

        if (this.planetFact) {
            this.planetFact.textContent = data.fact;
        }

        // Show panel
        if (this.panel) {
            this.panel.classList.add('active');
        }
    }

    hide() {
        if (this.panel) {
            this.panel.classList.remove('active');
        }
        this.currentPlanet = null;
    }

    toggle(planetName) {
        if (this.currentPlanet === planetName && this.panel?.classList.contains('active')) {
            this.hide();
        } else {
            this.show(planetName);
        }
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

// Export for use in main.js
window.PlanetInfo = PlanetInfo;
