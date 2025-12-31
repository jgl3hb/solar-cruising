/**
 * SolarSystem3D.js - 3D Solar System with Three.js
 * Creates realistic sun, planets, orbits, and asteroid belt
 */

class SolarSystem3D {
    constructor(scene) {
        this.scene = scene;
        this.sun = null;
        this.sunLight = null;
        this.sunGlow = null;
        this.planets = {};
        this.orbits = [];
        this.asteroids = null;

        // Planet data - SCALED UP for realistic close flyby exploration
        // Sizes are relative, distances spread out for exploration
        this.planetData = [
            { name: 'mercury', distance: 150, size: 12, color: 0x9e9e9e, orbitSpeed: 0.8, tilt: 0.03, segments: 64 },
            { name: 'venus', distance: 250, size: 20, color: 0xe8b86d, orbitSpeed: 0.6, tilt: 177.4, segments: 64 },
            { name: 'earth', distance: 380, size: 22, color: 0x4a90d9, orbitSpeed: 0.5, tilt: 23.5, hasMoon: true, segments: 64 },
            { name: 'mars', distance: 520, size: 16, color: 0xc1440e, orbitSpeed: 0.4, tilt: 25, segments: 64 },
            { name: 'jupiter', distance: 800, size: 80, color: 0xc4a35a, orbitSpeed: 0.2, tilt: 3, hasBands: true, segments: 96 },
            { name: 'saturn', distance: 1100, size: 70, color: 0xead6b8, orbitSpeed: 0.15, tilt: 27, hasRings: true, segments: 96 },
            { name: 'uranus', distance: 1450, size: 45, color: 0x5dade2, orbitSpeed: 0.1, tilt: 98, hasRings: true, ringSmall: true, segments: 64 },
            { name: 'neptune', distance: 1800, size: 42, color: 0x2e86de, orbitSpeed: 0.08, tilt: 28, segments: 64 }
        ];

        this.group = new THREE.Group();
    }

    init() {
        this.createSun();
        this.createOrbits();
        this.createPlanets();
        this.createAsteroidBelt();

        this.scene.add(this.group);

        return this;
    }

    createSun() {
        // Sun geometry - large and impressive
        const sunGeometry = new THREE.SphereGeometry(60, 96, 96);

        // Custom sun shader material for realistic glow
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffee88
        });

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

    createOrbits() {
        for (const planet of this.planetData) {
            const orbitGeometry = new THREE.RingGeometry(
                planet.distance - 0.5,
                planet.distance + 0.5,
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

    createPlanets() {
        for (const data of this.planetData) {
            const planetGroup = new THREE.Group();

            // Planet sphere - high detail for close-up viewing
            const segments = data.segments || 64;
            const geometry = new THREE.SphereGeometry(data.size, segments, segments);

            // Create planet texture
            const material = this.createPlanetMaterial(data);

            const planet = new THREE.Mesh(geometry, material);
            planet.rotation.z = THREE.MathUtils.degToRad(data.tilt);
            planetGroup.add(planet);

            // Add rings for Saturn and Uranus
            if (data.hasRings) {
                const rings = this.createRings(data);
                planetGroup.add(rings);
            }

            // Add moon for Earth
            if (data.hasMoon) {
                const moonGroup = new THREE.Group();
                const moonGeometry = new THREE.SphereGeometry(1.5, 16, 16);
                const moonMaterial = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    roughness: 0.9
                });
                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                moon.position.x = 15;
                moonGroup.add(moon);
                moonGroup.userData.orbitSpeed = 2;
                planetGroup.add(moonGroup);
                this.planets[data.name + '_moon'] = moonGroup;
            }

            // Add bands for Jupiter
            if (data.hasBands) {
                // Bands are part of the texture
            }

            // Position planet on orbit
            const angle = Math.random() * Math.PI * 2;
            planetGroup.position.x = Math.cos(angle) * data.distance;
            planetGroup.position.z = Math.sin(angle) * data.distance;

            // Store reference
            planetGroup.userData = {
                ...data,
                angle: angle,
                mesh: planet
            };

            this.planets[data.name] = planetGroup;
            this.group.add(planetGroup);
        }
    }

    createPlanetMaterial(data) {
        // Create HIGH RESOLUTION procedural planet texture for realistic close flyby
        const canvas = document.createElement('canvas');
        canvas.width = 1024;  // High res for close-up
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const color = new THREE.Color(data.color);
        const baseR = Math.floor(color.r * 255);
        const baseG = Math.floor(color.g * 255);
        const baseB = Math.floor(color.b * 255);

        // Fill with base color
        ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
        ctx.fillRect(0, 0, 1024, 512);

        // Per-planet detailed textures
        if (data.name === 'mercury') {
            // Mercury - cratered gray surface
            for (let i = 0; i < 500; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const radius = 2 + Math.random() * 20;
                const darkness = Math.floor(Math.random() * 40);
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness})`;
                ctx.fill();
                // Crater rim
                ctx.strokeStyle = `rgb(${baseR + 20}, ${baseG + 20}, ${baseB + 20})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        } else if (data.name === 'venus') {
            // Venus - thick swirled atmosphere
            for (let y = 0; y < 512; y += 3) {
                const wave = Math.sin(y * 0.02) * 30;
                ctx.fillStyle = `rgba(${baseR + 20}, ${baseG + 10}, ${baseB - 10}, 0.3)`;
                ctx.fillRect(0, y, 1024, 2);
            }
            // Atmospheric swirls
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                ctx.beginPath();
                ctx.ellipse(x, y, 30 + Math.random() * 60, 10 + Math.random() * 20, Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 240, 200, ${0.1 + Math.random() * 0.15})`;
                ctx.fill();
            }
        } else if (data.name === 'earth') {
            // Earth - detailed oceans, continents, clouds
            // Ocean base (already blue)
            // Deep ocean variation
            for (let i = 0; i < 2000; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                ctx.fillStyle = `rgba(0, ${40 + Math.random() * 60}, ${100 + Math.random() * 80}, 0.3)`;
                ctx.fillRect(x, y, 8, 5);
            }
            // Continents with detail
            const continents = [
                { x: 200, y: 150, rx: 120, ry: 80, rot: 0.2 }, // North America
                { x: 280, y: 300, rx: 60, ry: 100, rot: -0.3 }, // South America
                { x: 520, y: 120, rx: 150, ry: 70, rot: 0.1 }, // Europe/Asia
                { x: 550, y: 280, rx: 80, ry: 100, rot: 0 }, // Africa
                { x: 850, y: 350, rx: 100, ry: 60, rot: 0.4 }, // Australia
            ];
            for (const cont of continents) {
                // Land
                ctx.beginPath();
                ctx.ellipse(cont.x, cont.y, cont.rx, cont.ry, cont.rot, 0, Math.PI * 2);
                ctx.fillStyle = '#3d8c40';
                ctx.fill();
                // Mountains/highlands
                for (let i = 0; i < 30; i++) {
                    const mx = cont.x + (Math.random() - 0.5) * cont.rx * 1.5;
                    const my = cont.y + (Math.random() - 0.5) * cont.ry * 1.5;
                    ctx.beginPath();
                    ctx.arc(mx, my, 5 + Math.random() * 15, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${100 + Math.random() * 60}, ${80 + Math.random() * 40}, ${50}, 0.6)`;
                    ctx.fill();
                }
            }
            // Ice caps
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(0, 0, 1024, 30);
            ctx.fillRect(0, 482, 1024, 30);
            // Cloud layer
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            for (let i = 0; i < 80; i++) {
                ctx.beginPath();
                ctx.ellipse(Math.random() * 1024, Math.random() * 512, 20 + Math.random() * 60, 10 + Math.random() * 25, Math.random(), 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (data.name === 'mars') {
            // Mars - rust colored with canyons and ice cap
            for (let i = 0; i < 3000; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const variation = Math.random() * 50 - 25;
                ctx.fillStyle = `rgb(${Math.min(255, baseR + variation)}, ${Math.max(0, baseG + variation / 2)}, ${baseB})`;
                ctx.fillRect(x, y, 4, 4);
            }
            // Valles Marineris canyon
            ctx.strokeStyle = 'rgba(80, 30, 0, 0.6)';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(200, 256);
            ctx.bezierCurveTo(400, 240, 600, 270, 800, 256);
            ctx.stroke();
            // Olympus Mons
            ctx.beginPath();
            ctx.arc(150, 180, 50, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(160, 80, 40, 0.5)';
            ctx.fill();
            // Ice cap
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.ellipse(512, 20, 200, 30, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (data.name === 'jupiter') {
            // Jupiter - detailed turbulent bands
            const bandColors = ['#e8d5b5', '#d4a574', '#c4935a', '#8b6914', '#b89956', '#ddc896', '#c9a86c'];
            let y = 0;
            for (let band = 0; band < 20; band++) {
                const height = 20 + Math.random() * 30;
                const colorIdx = band % bandColors.length;
                ctx.fillStyle = bandColors[colorIdx];
                ctx.fillRect(0, y, 1024, height);
                // Add turbulence to band edge
                for (let x = 0; x < 1024; x += 5) {
                    const wave = Math.sin(x * 0.03 + band) * 5;
                    ctx.fillStyle = bandColors[(colorIdx + 1) % bandColors.length];
                    ctx.fillRect(x, y + height - 5 + wave, 5, 5);
                }
                y += height;
            }
            // Great Red Spot - detailed storm
            const grsX = 700, grsY = 280;
            for (let r = 60; r > 0; r -= 5) {
                ctx.beginPath();
                ctx.ellipse(grsX, grsY, r, r * 0.6, 0.1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${200 + (60 - r)}, ${80 + (60 - r) / 2}, ${50}, ${0.3 + (60 - r) / 100})`;
                ctx.fill();
            }
            // Storm swirls
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                ctx.beginPath();
                ctx.arc(x, y, 2 + Math.random() * 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.1})`;
                ctx.fill();
            }
        } else if (data.name === 'saturn') {
            // Saturn - subtle pale bands
            const bandColors = ['#f5e6d3', '#ead6b8', '#dfc9a8', '#e8d5be', '#f0dcc5'];
            let y = 0;
            for (let band = 0; band < 15; band++) {
                const height = 30 + Math.random() * 20;
                ctx.fillStyle = bandColors[band % bandColors.length];
                ctx.fillRect(0, y, 1024, height);
                y += height;
            }
        } else if (data.name === 'uranus' || data.name === 'neptune') {
            // Ice giants - smooth atmosphere with subtle features
            const gradient = ctx.createLinearGradient(0, 0, 0, 512);
            if (data.name === 'uranus') {
                gradient.addColorStop(0, '#7dd3e8');
                gradient.addColorStop(0.5, '#5dade2');
                gradient.addColorStop(1, '#4a9fd4');
            } else {
                gradient.addColorStop(0, '#4488dd');
                gradient.addColorStop(0.5, '#2e70cc');
                gradient.addColorStop(1, '#2058aa');
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1024, 512);
            // Subtle cloud bands
            for (let i = 0; i < 30; i++) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`;
                ctx.fillRect(0, Math.random() * 512, 1024, 5 + Math.random() * 15);
            }
            // Storm spots
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * 1024, Math.random() * 512, 10 + Math.random() * 30, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`;
                ctx.fill();
            }
        } else {
            // Default detailed texture
            for (let i = 0; i < 3000; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const variation = Math.random() * 40 - 20;
                ctx.fillStyle = `rgb(${Math.min(255, Math.max(0, baseR + variation))}, ${Math.min(255, Math.max(0, baseG + variation))}, ${Math.min(255, Math.max(0, baseB + variation))})`;
                ctx.fillRect(x, y, 4, 4);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = 16; // Better quality at angles

        return new THREE.MeshStandardMaterial({
            map: texture,
            roughness: data.name === 'earth' ? 0.6 : 0.85,
            metalness: 0.05,
            bumpScale: 0.02
        });
    }

    createRings(data) {
        const innerRadius = data.size * 1.4;
        const outerRadius = data.ringSmall ? data.size * 1.8 : data.size * 2.5;

        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

        // Create ring texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 256, 0);
        if (data.name === 'saturn') {
            gradient.addColorStop(0, 'rgba(200, 180, 140, 0.1)');
            gradient.addColorStop(0.2, 'rgba(210, 190, 150, 0.8)');
            gradient.addColorStop(0.4, 'rgba(180, 160, 120, 0.3)');
            gradient.addColorStop(0.5, 'rgba(200, 180, 140, 0.9)');
            gradient.addColorStop(0.7, 'rgba(170, 150, 110, 0.4)');
            gradient.addColorStop(0.9, 'rgba(190, 170, 130, 0.7)');
            gradient.addColorStop(1, 'rgba(160, 140, 100, 0.1)');
        } else {
            gradient.addColorStop(0, 'rgba(150, 200, 220, 0)');
            gradient.addColorStop(0.5, 'rgba(150, 200, 220, 0.5)');
            gradient.addColorStop(1, 'rgba(150, 200, 220, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 64);

        const ringTexture = new THREE.CanvasTexture(canvas);

        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2 + THREE.MathUtils.degToRad(data.tilt);

        return rings;
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

        // Orbit planets
        for (const [name, planetGroup] of Object.entries(this.planets)) {
            if (name.includes('_moon')) {
                // Moon orbit
                planetGroup.rotation.y += delta * planetGroup.userData.orbitSpeed;
            } else {
                // Planet orbit
                const data = planetGroup.userData;
                data.angle += delta * data.orbitSpeed * 0.1;
                planetGroup.position.x = Math.cos(data.angle) * data.distance;
                planetGroup.position.z = Math.sin(data.angle) * data.distance;

                // Planet rotation
                if (data.mesh) {
                    data.mesh.rotation.y += delta * 0.5;
                }
            }
        }

        // Rotate asteroid belt slowly
        if (this.asteroids) {
            this.asteroids.rotation.y += delta * 0.02;
        }
    }

    getPlanetPosition(planetName) {
        const planet = this.planets[planetName];
        if (planet) {
            return planet.position.clone();
        }
        return new THREE.Vector3();
    }

    getPlanetData(planetName) {
        const planet = this.planets[planetName];
        if (planet) {
            return planet.userData;
        }
        return null;
    }
}

// Make available globally
window.SolarSystem3D = SolarSystem3D;
