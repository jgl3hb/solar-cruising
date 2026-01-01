/**
 * AsteroidField.js - The Belt and shootable asteroids
 * Asteroids can be destroyed by railguns and torpedoes
 */

class AsteroidField {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.asteroids = [];
        this.beltAsteroids = [];

        // Belt parameters (between Mars and Jupiter)
        this.beltInnerRadius = 550;  // Just past Mars
        this.beltOuterRadius = 750;  // Before Jupiter
        this.beltAsteroidCount = 500;

        // Shootable asteroid parameters
        this.shootableCount = 50;
    }

    init() {
        this.createBelt();
        this.createShootableAsteroids();
        this.scene.add(this.group);
        return this;
    }

    createBelt() {
        // Create the asteroid belt visual
        const asteroidGeometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.DodecahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0)
        ];

        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.9,
            metalness: 0.1
        });

        for (let i = 0; i < this.beltAsteroidCount; i++) {
            const geom = asteroidGeometries[Math.floor(Math.random() * asteroidGeometries.length)];
            const asteroid = new THREE.Mesh(geom.clone(), asteroidMaterial.clone());

            // Random position in the belt
            const angle = Math.random() * Math.PI * 2;
            const radius = this.beltInnerRadius + Math.random() * (this.beltOuterRadius - this.beltInnerRadius);
            const height = (Math.random() - 0.5) * 30;

            asteroid.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );

            // Random size (tiny background asteroids)
            const scale = 0.05 + Math.random() * 0.2;
            asteroid.scale.setScalar(scale);

            // Random rotation
            asteroid.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Store orbital data
            asteroid.userData = {
                angle: angle,
                radius: radius,
                height: height,
                rotationSpeed: (Math.random() - 0.5) * 0.5,
                orbitSpeed: 0.00001 + Math.random() * 0.00002
            };

            this.beltAsteroids.push(asteroid);
            this.group.add(asteroid);
        }
    }

    createShootableAsteroids() {
        // Create larger, targetable asteroids throughout the system
        const asteroidTexture = this.createAsteroidTexture();

        for (let i = 0; i < this.shootableCount; i++) {
            const asteroid = this.createShootableAsteroid(asteroidTexture);
            this.asteroids.push(asteroid);
            this.group.add(asteroid.mesh);
        }
    }

    createAsteroidTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Base rocky color
        ctx.fillStyle = '#555555';
        ctx.fillRect(0, 0, 256, 256);

        // Add craters and texture
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const r = 3 + Math.random() * 15;

            // Crater shadow
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + Math.random() * 0.3})`;
            ctx.fill();

            // Crater highlight
            ctx.beginPath();
            ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 100, 100, ${0.2 + Math.random() * 0.2})`;
            ctx.fill();
        }

        // Add some bright spots (ice or metal)
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            ctx.beginPath();
            ctx.arc(x, y, 2 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 200, 200, ${0.3 + Math.random() * 0.4})`;
            ctx.fill();
        }

        return new THREE.CanvasTexture(canvas);
    }

    createShootableAsteroid(texture) {
        // Create irregular asteroid geometry
        const geometry = new THREE.IcosahedronGeometry(1, 1);

        // Deform vertices for irregular shape
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const noise = 0.7 + Math.random() * 0.6;
            positions.setXYZ(i, x * noise, y * noise, z * noise);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.95,
            metalness: 0.05,
            bumpScale: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Random position throughout the system
        const angle = Math.random() * Math.PI * 2;
        const radius = 200 + Math.random() * 1500;
        const height = (Math.random() - 0.5) * 100;

        mesh.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );

        // Random size (small asteroids)
        const scale = 0.3 + Math.random() * 1.5;
        mesh.scale.setScalar(scale);

        // Random rotation
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        const asteroidData = {
            mesh: mesh,
            health: scale * 10,  // Bigger = more health
            maxHealth: scale * 10,
            size: scale,
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                0,
                (Math.random() - 0.5) * 0.5
            ),
            destroyed: false
        };

        return asteroidData;
    }

    update(delta) {
        // Update belt asteroids (slow orbit)
        for (const asteroid of this.beltAsteroids) {
            asteroid.userData.angle += asteroid.userData.orbitSpeed;
            asteroid.position.x = Math.cos(asteroid.userData.angle) * asteroid.userData.radius;
            asteroid.position.z = Math.sin(asteroid.userData.angle) * asteroid.userData.radius;
            asteroid.rotation.x += asteroid.userData.rotationSpeed * delta;
            asteroid.rotation.y += asteroid.userData.rotationSpeed * delta * 0.5;
        }

        // Update shootable asteroids
        for (const asteroid of this.asteroids) {
            if (asteroid.destroyed) continue;

            // Rotate
            asteroid.mesh.rotation.x += asteroid.rotationSpeed.x * delta;
            asteroid.mesh.rotation.y += asteroid.rotationSpeed.y * delta;
            asteroid.mesh.rotation.z += asteroid.rotationSpeed.z * delta;

            // Slow drift
            asteroid.mesh.position.add(asteroid.velocity.clone().multiplyScalar(delta));
        }
    }

    checkCollision(projectilePosition, projectileType) {
        const hitRadius = projectileType === 'railgun' ? 5 : 15;  // Torpedoes have bigger blast
        const damage = projectileType === 'railgun' ? 30 : 100;

        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            if (asteroid.destroyed) continue;

            const distance = projectilePosition.distanceTo(asteroid.mesh.position);
            const asteroidRadius = asteroid.size * 1;

            if (distance < asteroidRadius + hitRadius) {
                asteroid.health -= damage;

                if (asteroid.health <= 0) {
                    this.destroyAsteroid(asteroid, i);
                    return { hit: true, destroyed: true, position: asteroid.mesh.position.clone() };
                } else {
                    this.damageAsteroid(asteroid);
                    return { hit: true, destroyed: false, position: asteroid.mesh.position.clone() };
                }
            }
        }
        return { hit: false };
    }

    damageAsteroid(asteroid) {
        // Flash the asteroid red briefly
        const originalColor = asteroid.mesh.material.color.clone();
        asteroid.mesh.material.color.setHex(0xff4444);
        asteroid.mesh.material.emissive = new THREE.Color(0x440000);
        asteroid.mesh.material.emissiveIntensity = 0.5;

        setTimeout(() => {
            asteroid.mesh.material.color.copy(originalColor);
            asteroid.mesh.material.emissive = new THREE.Color(0x000000);
        }, 100);
    }

    destroyAsteroid(asteroid, index) {
        // Create explosion effect
        this.createExplosion(asteroid.mesh.position, asteroid.size);

        // Remove from scene
        this.group.remove(asteroid.mesh);
        asteroid.destroyed = true;

        // Respawn after delay
        setTimeout(() => {
            this.respawnAsteroid(index);
        }, 10000);
    }

    createExplosion(position, size) {
        const particleCount = 50;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.5 + Math.random() * size * 0.3, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.08, 1, 0.5 + Math.random() * 0.3),
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);

            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * size * 10,
                    (Math.random() - 0.5) * size * 10,
                    (Math.random() - 0.5) * size * 10
                ),
                life: 1
            };

            this.scene.add(particle);
            particles.push(particle);
        }

        // Animate explosion
        const animate = () => {
            let alive = false;
            for (const p of particles) {
                p.userData.life -= 0.02;
                if (p.userData.life > 0) {
                    alive = true;
                    p.position.add(p.userData.velocity.clone().multiplyScalar(0.016));
                    p.userData.velocity.multiplyScalar(0.95);
                    p.material.opacity = p.userData.life;
                    p.scale.multiplyScalar(0.98);
                } else {
                    this.scene.remove(p);
                }
            }
            if (alive) requestAnimationFrame(animate);
        };
        animate();

        // Add flash
        const flash = new THREE.PointLight(0xffaa00, 5, size * 20);
        flash.position.copy(position);
        this.scene.add(flash);

        let intensity = 5;
        const fadeFlash = () => {
            intensity *= 0.9;
            flash.intensity = intensity;
            if (intensity > 0.1) {
                requestAnimationFrame(fadeFlash);
            } else {
                this.scene.remove(flash);
            }
        };
        fadeFlash();
    }

    respawnAsteroid(index) {
        const texture = this.createAsteroidTexture();
        const newAsteroid = this.createShootableAsteroid(texture);
        this.asteroids[index] = newAsteroid;
        this.group.add(newAsteroid.mesh);
    }

    getAsteroids() {
        return this.asteroids.filter(a => !a.destroyed);
    }
}

// Make available globally
window.AsteroidField = AsteroidField;
