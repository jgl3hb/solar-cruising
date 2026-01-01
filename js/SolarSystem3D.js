/**
 * SolarSystem3D.js - 3D Solar System with Three.js
 * Uses modular planet components for individual rendering control
 */

class SolarSystem3D {
    constructor(scene) {
        this.scene = scene;
        this.sun = null;
        this.sunLight = null;
        this.sunGlow = null;
        this.planets = {};
        this.planetInstances = [];
        this.orbits = [];
        this.asteroids = null;

        // Planet classes to instantiate (including dwarf planets)
        this.planetClasses = [
            Mercury,
            Venus,
            Earth,
            Mars,
            Ceres,      // Dwarf planet in asteroid belt
            Jupiter,
            Saturn,
            Uranus,
            Neptune,
            Pluto,
            Eris,       // Trans-Neptunian dwarf planets
            Makemake,
            Haumea,
            Sedna       // Inner Oort Cloud
        ];

        this.group = new THREE.Group();
    }

    init() {
        this.createSun();
        this.createPlanets();
        this.createOrbits();
        this.createAsteroidBelt();

        this.scene.add(this.group);

        return this;
    }

    createSun() {
        // Sun geometry - large and impressive
        const sunGeometry = new THREE.SphereGeometry(60, 96, 96);

        // Create sun surface with gradient effect
        const sunCanvas = document.createElement('canvas');
        sunCanvas.width = 512;
        sunCanvas.height = 512;
        const ctx = sunCanvas.getContext('2d');

        // Create radial gradient for sun surface
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, '#fffef0');
        gradient.addColorStop(0.2, '#ffed4a');
        gradient.addColorStop(0.5, '#ff9f43');
        gradient.addColorStop(0.8, '#ee5a24');
        gradient.addColorStop(1, '#d35400');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Add some noise/texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const dist = Math.sqrt((x - 256) ** 2 + (y - 256) ** 2);
            if (dist < 250) {
                ctx.fillStyle = `rgba(255, 255, 200, ${Math.random() * 0.3})`;
                ctx.fillRect(x, y, 2, 2);
            }
        }

        const sunTexture = new THREE.CanvasTexture(sunCanvas);

        const texturedSunMaterial = new THREE.MeshBasicMaterial({
            map: sunTexture,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });

        this.sun = new THREE.Mesh(sunGeometry, texturedSunMaterial);
        this.group.add(this.sun);

        // Point light from sun - extended range for larger solar system
        this.sunLight = new THREE.PointLight(0xffffff, 2.5, 5000, 0.3);
        this.sunLight.position.set(0, 0, 0);
        this.group.add(this.sunLight);

        // Add secondary warm light
        const warmLight = new THREE.PointLight(0xffaa44, 1.5, 4000, 0.5);
        warmLight.position.set(0, 0, 0);
        this.group.add(warmLight);

        // Sun glow sprite
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 256;
        glowCanvas.height = 256;
        const glowCtx = glowCanvas.getContext('2d');

        const glowGradient = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
        glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
        glowGradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.4)');
        glowGradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.15)');
        glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');

        glowCtx.fillStyle = glowGradient;
        glowCtx.fillRect(0, 0, 256, 256);

        const glowTexture = new THREE.CanvasTexture(glowCanvas);
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.sunGlow = new THREE.Sprite(glowMaterial);
        this.sunGlow.scale.set(200, 200, 1);
        this.group.add(this.sunGlow);

        // Outer corona
        const coronaMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.3
        });

        const corona = new THREE.Sprite(coronaMaterial);
        corona.scale.set(350, 350, 1);
        this.group.add(corona);
    }

    createPlanets() {
        // Instantiate each planet component
        for (const PlanetClass of this.planetClasses) {
            const planet = new PlanetClass();
            planet.init();

            // Store by name for easy access
            this.planets[planet.name] = planet;
            this.planetInstances.push(planet);

            // Add to scene
            this.group.add(planet.getGroup());
        }
    }

    createOrbits() {
        for (const planet of this.planetInstances) {
            const distance = planet.distance;

            const orbitGeometry = new THREE.RingGeometry(
                distance - 0.5,
                distance + 0.5,
                128
            );

            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x4488ff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.15
            });

            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = -Math.PI / 2;
            this.group.add(orbit);
            this.orbits.push(orbit);
        }
    }

    createAsteroidBelt() {
        const asteroidCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(asteroidCount * 3);
        const sizes = new Float32Array(asteroidCount);

        const innerRadius = 620;  // Between Mars (520) and Jupiter (800)
        const outerRadius = 700;

        for (let i = 0; i < asteroidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const height = (Math.random() - 0.5) * 20;

            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;

            sizes[i] = 0.5 + Math.random() * 1.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0x888888,
            size: 2,
            sizeAttenuation: true
        });

        this.asteroids = new THREE.Points(geometry, material);
        this.group.add(this.asteroids);
    }

    update(delta, elapsed) {
        // Rotate sun
        if (this.sun) {
            this.sun.rotation.y += delta * 0.1;
        }

        // Pulse sun glow
        if (this.sunGlow) {
            const pulse = 1 + Math.sin(elapsed * 2) * 0.1;
            this.sunGlow.scale.set(200 * pulse, 200 * pulse, 1);
        }

        // Update all planets
        for (const planet of this.planetInstances) {
            planet.update(delta, elapsed);
        }

        // Rotate asteroid belt slowly
        if (this.asteroids) {
            this.asteroids.rotation.y += delta * 0.02;
        }
    }

    getPlanetPosition(planetName) {
        const planet = this.planets[planetName];
        if (planet) {
            return planet.getPosition();
        }
        return new THREE.Vector3();
    }

    getPlanetData(planetName) {
        const planet = this.planets[planetName];
        if (planet) {
            return planet.getData();
        }
        return null;
    }

    // Get planet instance by name
    getPlanet(planetName) {
        return this.planets[planetName] || null;
    }

    // Get all planet names
    getPlanetNames() {
        return this.planetInstances.map(p => p.name);
    }

    // Check for collision with any planet or the sun
    checkCollision(position) {
        // Check sun collision first
        const sunDist = position.distanceTo(new THREE.Vector3(0, 0, 0));
        if (sunDist < 65) {  // Sun radius is 60
            return {
                collision: true,
                body: 'Sun',
                type: 'star',
                fatal: true
            };
        }

        // Check all planets
        for (const planet of this.planetInstances) {
            const planetPos = planet.getPosition();
            const distance = position.distanceTo(planetPos);
            const planetRadius = planet.size * 1.2;  // Slight buffer

            if (distance < planetRadius) {
                return {
                    collision: true,
                    body: planet.name,
                    type: 'planet',
                    fatal: true,
                    position: planetPos
                };
            }
        }

        return { collision: false };
    }
}

// Make available globally
window.SolarSystem3D = SolarSystem3D;
