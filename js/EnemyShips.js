/**
 * EnemyShips.js - Enemy ships for combat
 * Pirates and MCRN patrols that can be targeted and destroyed
 */

class EnemyShips {
    constructor(scene, rocinante) {
        this.scene = scene;
        this.rocinante = rocinante;
        this.group = new THREE.Group();
        this.enemies = [];

        // Enemy types
        this.shipTypes = {
            pirate: {
                color: 0x8b4513,
                accentColor: 0xff4400,
                size: 0.8,
                health: 50,
                speed: 80,
                aggressiveRange: 300,
                name: 'Pirate Raider'
            },
            mcrn: {
                color: 0x8b0000,
                accentColor: 0xffaa00,
                size: 1.2,
                health: 100,
                speed: 120,
                aggressiveRange: 400,
                name: 'MCRN Patrol'
            },
            opa: {
                color: 0x333344,
                accentColor: 0x00aaff,
                size: 0.6,
                health: 30,
                speed: 150,
                aggressiveRange: 200,
                name: 'OPA Skiff'
            }
        };
    }

    init() {
        // Spawn initial enemies
        this.spawnEnemyWave();
        this.scene.add(this.group);
        return this;
    }

    spawnEnemyWave() {
        // Spawn pirates in the Belt
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy('pirate', this.getRandomBeltPosition());
        }

        // Spawn MCRN near Mars
        for (let i = 0; i < 2; i++) {
            this.spawnEnemy('mcrn', this.getRandomPosition(400, 500));
        }

        // Spawn OPA near Ceres
        for (let i = 0; i < 3; i++) {
            this.spawnEnemy('opa', this.getRandomPosition(550, 650));
        }
    }

    getRandomBeltPosition() {
        const angle = Math.random() * Math.PI * 2;
        const radius = 550 + Math.random() * 200;
        return new THREE.Vector3(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 50,
            Math.sin(angle) * radius
        );
    }

    getRandomPosition(minRadius, maxRadius) {
        const angle = Math.random() * Math.PI * 2;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        return new THREE.Vector3(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 30,
            Math.sin(angle) * radius
        );
    }

    spawnEnemy(type, position) {
        const config = this.shipTypes[type];
        const enemy = this.createEnemyShip(type, config);

        enemy.mesh.position.copy(position);
        enemy.position = position.clone();
        enemy.velocity = new THREE.Vector3();
        enemy.targetRotation = Math.random() * Math.PI * 2;
        enemy.rotation = enemy.targetRotation;
        enemy.health = config.health;
        enemy.maxHealth = config.health;
        enemy.type = type;
        enemy.config = config;
        enemy.state = 'patrol';  // patrol, chase, attack, flee
        enemy.patrolCenter = position.clone();
        enemy.patrolAngle = Math.random() * Math.PI * 2;
        enemy.destroyed = false;
        enemy.fireTimer = 0;

        this.enemies.push(enemy);
        this.group.add(enemy.mesh);

        return enemy;
    }

    createEnemyShip(type, config) {
        const shipGroup = new THREE.Group();

        // Hull
        const hullGeom = new THREE.BoxGeometry(8 * config.size, 4 * config.size, 20 * config.size);
        const hullMat = new THREE.MeshStandardMaterial({
            color: config.color,
            metalness: 0.6,
            roughness: 0.4
        });
        const hull = new THREE.Mesh(hullGeom, hullMat);
        shipGroup.add(hull);

        // Nose
        const noseGeom = new THREE.ConeGeometry(4 * config.size, 10 * config.size, 4);
        noseGeom.rotateX(-Math.PI / 2);
        const nose = new THREE.Mesh(noseGeom, hullMat);
        nose.position.z = -15 * config.size;
        shipGroup.add(nose);

        // Engine glow
        const engineGeom = new THREE.CircleGeometry(2 * config.size, 16);
        const engineMat = new THREE.MeshBasicMaterial({
            color: config.accentColor,
            transparent: true,
            opacity: 0.8
        });
        const engine = new THREE.Mesh(engineGeom, engineMat);
        engine.position.z = 10 * config.size;
        shipGroup.add(engine);

        // Engine light
        const engineLight = new THREE.PointLight(config.accentColor, 1, 30);
        engineLight.position.z = 12 * config.size;
        shipGroup.add(engineLight);

        // Accent stripe
        const stripeGeom = new THREE.BoxGeometry(9 * config.size, 0.5, 5 * config.size);
        const stripeMat = new THREE.MeshStandardMaterial({
            color: config.accentColor,
            emissive: config.accentColor,
            emissiveIntensity: 0.3
        });
        const stripe = new THREE.Mesh(stripeGeom, stripeMat);
        stripe.position.y = 2.1 * config.size;
        shipGroup.add(stripe);

        // Health bar (above ship)
        const healthBarBg = new THREE.Mesh(
            new THREE.PlaneGeometry(15, 2),
            new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.7 })
        );
        healthBarBg.position.y = 10 * config.size;
        healthBarBg.rotation.x = -Math.PI / 4;
        shipGroup.add(healthBarBg);

        const healthBar = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 1.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        healthBar.position.y = 10 * config.size;
        healthBar.position.z = -0.1;
        healthBar.rotation.x = -Math.PI / 4;
        shipGroup.add(healthBar);

        return {
            mesh: shipGroup,
            engineLight,
            engine,
            healthBar
        };
    }

    update(delta) {
        const playerPos = this.rocinante.getPosition();

        for (const enemy of this.enemies) {
            if (enemy.destroyed) continue;

            this.updateEnemyAI(enemy, playerPos, delta);
            this.updateEnemyPhysics(enemy, delta);
            this.updateEnemyVisuals(enemy);
        }
    }

    updateEnemyAI(enemy, playerPos, delta) {
        const distToPlayer = enemy.position.distanceTo(playerPos);

        // State machine
        switch (enemy.state) {
            case 'patrol':
                // Patrol around center point
                enemy.patrolAngle += delta * 0.2;
                const patrolRadius = 50;
                const targetPos = new THREE.Vector3(
                    enemy.patrolCenter.x + Math.cos(enemy.patrolAngle) * patrolRadius,
                    enemy.patrolCenter.y,
                    enemy.patrolCenter.z + Math.sin(enemy.patrolAngle) * patrolRadius
                );
                this.moveToward(enemy, targetPos, delta);

                // Switch to chase if player is close
                if (distToPlayer < enemy.config.aggressiveRange) {
                    enemy.state = 'chase';
                }
                break;

            case 'chase':
                // Move toward player
                this.moveToward(enemy, playerPos, delta);

                // Attack if close enough
                if (distToPlayer < 150) {
                    enemy.state = 'attack';
                }
                // Return to patrol if player fled
                if (distToPlayer > enemy.config.aggressiveRange * 1.5) {
                    enemy.state = 'patrol';
                }
                break;

            case 'attack':
                // Face player and fire
                this.faceTarget(enemy, playerPos, delta);
                this.moveToward(enemy, playerPos, delta, 0.3);  // Slow approach

                // Flee if low health
                if (enemy.health < enemy.maxHealth * 0.2) {
                    enemy.state = 'flee';
                }
                // Return to chase if player moved away
                if (distToPlayer > 200) {
                    enemy.state = 'chase';
                }
                break;

            case 'flee':
                // Run away from player
                const fleeDir = enemy.position.clone().sub(playerPos).normalize();
                const fleeTarget = enemy.position.clone().add(fleeDir.multiplyScalar(100));
                this.moveToward(enemy, fleeTarget, delta, 1.5);

                // Resume patrol if far enough
                if (distToPlayer > enemy.config.aggressiveRange * 2) {
                    enemy.state = 'patrol';
                    enemy.patrolCenter = enemy.position.clone();
                }
                break;
        }
    }

    moveToward(enemy, target, delta, speedMult = 1) {
        const direction = target.clone().sub(enemy.position).normalize();
        const speed = enemy.config.speed * speedMult * delta;

        enemy.velocity.lerp(direction.multiplyScalar(speed), 0.1);

        // Face movement direction
        this.faceTarget(enemy, target, delta);
    }

    faceTarget(enemy, target, delta) {
        const direction = target.clone().sub(enemy.position);
        enemy.targetRotation = Math.atan2(-direction.x, -direction.z);

        // Smooth rotation
        let diff = enemy.targetRotation - enemy.rotation;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        enemy.rotation += diff * delta * 3;
    }

    updateEnemyPhysics(enemy, delta) {
        enemy.position.add(enemy.velocity);
        enemy.mesh.position.copy(enemy.position);
        enemy.mesh.rotation.y = enemy.rotation;

        // Friction
        enemy.velocity.multiplyScalar(0.95);
    }

    updateEnemyVisuals(enemy) {
        // Update health bar
        const healthPercent = enemy.health / enemy.maxHealth;
        enemy.healthBar.scale.x = healthPercent;
        enemy.healthBar.position.x = -(1 - healthPercent) * 7;

        // Color based on health
        if (healthPercent > 0.5) {
            enemy.healthBar.material.color.setHex(0x00ff00);
        } else if (healthPercent > 0.25) {
            enemy.healthBar.material.color.setHex(0xffaa00);
        } else {
            enemy.healthBar.material.color.setHex(0xff0000);
        }

        // Engine pulse
        enemy.engineLight.intensity = 0.8 + Math.random() * 0.4;
    }

    damageEnemy(enemy, damage) {
        enemy.health -= damage;

        // Flash red
        const originalColors = [];
        enemy.mesh.traverse(child => {
            if (child.material && child.material.color) {
                originalColors.push({ mesh: child, color: child.material.color.clone() });
                child.material.color.setHex(0xff0000);
            }
        });

        setTimeout(() => {
            originalColors.forEach(item => {
                item.mesh.material.color.copy(item.color);
            });
        }, 100);

        if (enemy.health <= 0) {
            this.destroyEnemy(enemy);
            return true;
        }
        return false;
    }

    destroyEnemy(enemy) {
        enemy.destroyed = true;

        // Create explosion
        this.createExplosion(enemy.position, enemy.config.size);

        // Remove from scene
        this.group.remove(enemy.mesh);

        // Respawn after delay
        setTimeout(() => {
            const newEnemy = this.spawnEnemy(
                enemy.type,
                this.getRandomBeltPosition()
            );
        }, 15000);
    }

    createExplosion(position, size) {
        const particleCount = 30;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const geom = new THREE.SphereGeometry(1 + Math.random() * size, 4, 4);
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 1, 0.5),
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(geom, mat);
            particle.position.copy(position);

            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 20 * size,
                    (Math.random() - 0.5) * 20 * size,
                    (Math.random() - 0.5) * 20 * size
                ),
                life: 1
            };

            this.scene.add(particle);
            particles.push(particle);
        }

        // Add big flash
        const flash = new THREE.PointLight(0xff6600, 10, 100 * size);
        flash.position.copy(position);
        this.scene.add(flash);

        const animate = () => {
            let alive = false;
            for (const p of particles) {
                p.userData.life -= 0.03;
                if (p.userData.life > 0) {
                    alive = true;
                    p.position.add(p.userData.velocity.clone().multiplyScalar(0.016));
                    p.userData.velocity.multiplyScalar(0.95);
                    p.material.opacity = p.userData.life;
                } else {
                    this.scene.remove(p);
                }
            }
            flash.intensity *= 0.9;
            if (flash.intensity < 0.1) this.scene.remove(flash);
            if (alive) requestAnimationFrame(animate);
        };
        animate();
    }

    checkCollision(projectilePosition, projectileType) {
        const hitRadius = projectileType === 'railgun' ? 8 : 25;
        const damage = projectileType === 'railgun' ? 25 : 80;

        for (const enemy of this.enemies) {
            if (enemy.destroyed) continue;

            const distance = projectilePosition.distanceTo(enemy.position);
            const enemyRadius = 15 * enemy.config.size;

            if (distance < enemyRadius + hitRadius) {
                const destroyed = this.damageEnemy(enemy, damage);
                return {
                    hit: true,
                    destroyed: destroyed,
                    enemy: enemy,
                    position: enemy.position.clone()
                };
            }
        }
        return { hit: false };
    }

    getEnemies() {
        return this.enemies.filter(e => !e.destroyed);
    }

    getNearestEnemy(position, maxRange = Infinity) {
        let nearest = null;
        let nearestDist = maxRange;

        for (const enemy of this.enemies) {
            if (enemy.destroyed) continue;
            const dist = position.distanceTo(enemy.position);
            if (dist < nearestDist) {
                nearest = enemy;
                nearestDist = dist;
            }
        }

        return nearest ? { enemy: nearest, distance: nearestDist } : null;
    }
}

// Make available globally
window.EnemyShips = EnemyShips;
