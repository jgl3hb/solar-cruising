/**
 * Rocinante3D.js - The Rocinante (formerly MCRN Tachi) from The Expanse
 * Corvette-class light frigate with railguns and torpedoes
 * "Legitimate salvage"
 */

class Rocinante3D {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.mesh = null;

        // Physics - warship is faster and more maneuverable
        this.position = new THREE.Vector3(0, 0, 450);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.speed = 0;
        this.maxSpeed = 1200;  // Faster - Epstein drive
        this.acceleration = 200;
        this.friction = 0.99;  // Less friction in space
        this.rotationSpeed = 2.5;

        // Controls state
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            boost: false,
            fireRailgun: false,
            fireMissile: false,
            flipAndBurn: false
        };

        // Flip and burn state
        this.isFlipping = false;
        this.flipProgress = 0;
        this.flipStartRotation = 0;

        // Weapons systems
        this.railgunCooldown = 0;
        this.missileCooldown = 0;
        this.railgunReloadTime = 0.5;  // 500ms between shots
        this.missileReloadTime = 3;    // 3 seconds between missiles
        this.projectiles = [];
        this.missiles = [];
        this.maxMissiles = 12;
        this.currentMissiles = 12;

        // Thrust particles
        this.particleCount = 300;
        this.particles = [];

        // PDC turrets
        this.pdcTurrets = [];
    }

    init() {
        this.createAnubis();
        this.createThrustParticles();
        this.setupControls();
        this.createWeaponSystems();

        this.group.position.copy(this.position);
        this.scene.add(this.group);

        return this;
    }

    createAnubis() {
        const shipGroup = new THREE.Group();

        // Main hull - angular, stealthy design
        // Forward section (wedge-shaped bow)
        const bowGeometry = new THREE.ConeGeometry(8, 25, 4);
        const hullMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,  // Dark navy/black - stealth coating
            metalness: 0.7,
            roughness: 0.3
        });
        const bow = new THREE.Mesh(bowGeometry, hullMaterial);
        bow.rotation.x = -Math.PI / 2;
        bow.position.z = -20;
        shipGroup.add(bow);

        // Main body - angular box
        const bodyGeometry = new THREE.BoxGeometry(16, 10, 35);
        const body = new THREE.Mesh(bodyGeometry, hullMaterial);
        body.position.z = 5;
        shipGroup.add(body);

        // Engine section - wider
        const engineSectionGeometry = new THREE.BoxGeometry(22, 12, 20);
        const engineSection = new THREE.Mesh(engineSectionGeometry, hullMaterial);
        engineSection.position.z = 28;
        shipGroup.add(engineSection);

        // Accent panels (MCRN red)
        const accentMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b0000,  // Dark red - MCRN colors
            metalness: 0.6,
            roughness: 0.4,
            emissive: 0x330000,
            emissiveIntensity: 0.2
        });

        // Red accent stripes
        const stripe1 = new THREE.Mesh(
            new THREE.BoxGeometry(17, 0.5, 15),
            accentMaterial
        );
        stripe1.position.set(0, 5.3, 5);
        shipGroup.add(stripe1);

        // Bridge/command section
        const bridgeGeometry = new THREE.BoxGeometry(8, 4, 10);
        const bridgeMaterial = new THREE.MeshStandardMaterial({
            color: 0x0f0f1a,
            metalness: 0.8,
            roughness: 0.2
        });
        const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        bridge.position.set(0, 7, -5);
        shipGroup.add(bridge);

        // Bridge windows - blue glow
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0066aa,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });

        for (let i = 0; i < 3; i++) {
            const window = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 1, 0.5),
                windowMaterial
            );
            window.position.set(-3 + i * 3, 7, -10.3);
            shipGroup.add(window);
        }

        // Railgun mounts (2 forward-facing)
        this.createRailguns(shipGroup);

        // Missile tubes
        this.createMissileTubes(shipGroup);

        // PDC turrets (Point Defense Cannons)
        this.createPDCTurrets(shipGroup);

        // Epstein drive engines (main thrusters)
        this.createEngines(shipGroup);

        // Maneuvering thrusters
        this.createRCSThruster(shipGroup, 8, 0, -15, 'right');
        this.createRCSThruster(shipGroup, -8, 0, -15, 'left');
        this.createRCSThruster(shipGroup, 8, 0, 30, 'right');
        this.createRCSThruster(shipGroup, -8, 0, 30, 'left');

        // Running lights
        this.createRunningLights(shipGroup);

        // Scale down the ship (Corvette is smaller than it was)
        shipGroup.scale.setScalar(0.4);

        this.mesh = shipGroup;
        this.group.add(shipGroup);
    }

    createRailguns(parent) {
        const railgunMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3a,
            metalness: 0.9,
            roughness: 0.2
        });

        // Two railguns mounted on sides
        for (let side = -1; side <= 1; side += 2) {
            const railgun = new THREE.Group();

            // Base
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 2, 3, 8),
                railgunMaterial
            );
            base.rotation.x = Math.PI / 2;
            railgun.add(base);

            // Barrel
            const barrel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.8, 0.8, 20, 8),
                railgunMaterial
            );
            barrel.rotation.x = Math.PI / 2;
            barrel.position.z = -11;
            railgun.add(barrel);

            // Magnetic accelerator coils
            for (let i = 0; i < 5; i++) {
                const coil = new THREE.Mesh(
                    new THREE.TorusGeometry(1.2, 0.2, 8, 16),
                    new THREE.MeshStandardMaterial({
                        color: 0x4444ff,
                        emissive: 0x2222aa,
                        emissiveIntensity: 0.3
                    })
                );
                coil.position.z = -5 - i * 3;
                railgun.add(coil);
            }

            railgun.position.set(side * 10, 2, -10);
            parent.add(railgun);
        }
    }

    createMissileTubes(parent) {
        const tubeMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.7,
            roughness: 0.4
        });

        // 6 missile tubes on each side (12 total)
        for (let side = -1; side <= 1; side += 2) {
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 3; col++) {
                    const tube = new THREE.Mesh(
                        new THREE.CylinderGeometry(1, 1, 4, 8),
                        tubeMaterial
                    );
                    tube.rotation.x = Math.PI / 2;
                    tube.position.set(
                        side * 9,
                        -2 + row * 3,
                        -5 + col * 4
                    );
                    parent.add(tube);

                    // Tube cap with warning stripe
                    const cap = new THREE.Mesh(
                        new THREE.CircleGeometry(1, 8),
                        new THREE.MeshStandardMaterial({
                            color: 0xffaa00,
                            emissive: 0x553300,
                            emissiveIntensity: 0.3
                        })
                    );
                    cap.rotation.y = side * Math.PI / 2;
                    cap.position.set(
                        side * 9.1,
                        -2 + row * 3,
                        -5 + col * 4
                    );
                    parent.add(cap);
                }
            }
        }
    }

    createPDCTurrets(parent) {
        const turretMaterial = new THREE.MeshStandardMaterial({
            color: 0x333344,
            metalness: 0.8,
            roughness: 0.3
        });

        const pdcPositions = [
            { x: 0, y: 6, z: 15 },   // Top rear
            { x: 0, y: -6, z: 15 },  // Bottom rear
            { x: 0, y: 6, z: -5 },   // Top forward
            { x: 0, y: -6, z: -5 },  // Bottom forward
        ];

        for (const pos of pdcPositions) {
            const turret = new THREE.Group();

            // Turret base
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 2, 1.5, 8),
                turretMaterial
            );
            turret.add(base);

            // Barrels (twin-barrel gatling style)
            for (let i = -1; i <= 1; i += 2) {
                const barrel = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.3, 0.3, 4, 8),
                    turretMaterial
                );
                barrel.rotation.x = Math.PI / 2;
                barrel.position.set(i * 0.5, 0.5, -2);
                turret.add(barrel);
            }

            turret.position.set(pos.x, pos.y, pos.z);
            parent.add(turret);
            this.pdcTurrets.push(turret);
        }
    }

    createEngines(parent) {
        const engineMaterial = new THREE.MeshStandardMaterial({
            color: 0x222233,
            metalness: 0.8,
            roughness: 0.2
        });

        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0088ff,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.9
        });

        // Main Epstein drive (center)
        const mainEngine = new THREE.Mesh(
            new THREE.CylinderGeometry(4, 5, 6, 16),
            engineMaterial
        );
        mainEngine.rotation.x = Math.PI / 2;
        mainEngine.position.z = 38;
        parent.add(mainEngine);

        // Engine glow
        const mainGlow = new THREE.Mesh(
            new THREE.CircleGeometry(4, 16),
            glowMaterial
        );
        mainGlow.position.z = 41;
        parent.add(mainGlow);
        this.mainEngineGlow = mainGlow;

        // Secondary engines (2 smaller)
        for (let side = -1; side <= 1; side += 2) {
            const engine = new THREE.Mesh(
                new THREE.CylinderGeometry(2, 2.5, 4, 16),
                engineMaterial
            );
            engine.rotation.x = Math.PI / 2;
            engine.position.set(side * 8, 0, 38);
            parent.add(engine);

            const glow = new THREE.Mesh(
                new THREE.CircleGeometry(2, 16),
                glowMaterial
            );
            glow.position.set(side * 8, 0, 40);
            parent.add(glow);
        }

        // Engine light
        this.engineLight = new THREE.PointLight(0x00aaff, 2, 100);
        this.engineLight.position.z = 45;
        parent.add(this.engineLight);
    }

    createRCSThruster(parent, x, y, z, side) {
        const thruster = new THREE.Mesh(
            new THREE.ConeGeometry(0.5, 1.5, 8),
            new THREE.MeshStandardMaterial({
                color: 0x333344,
                metalness: 0.7,
                roughness: 0.3
            })
        );
        thruster.rotation.z = side === 'right' ? -Math.PI / 2 : Math.PI / 2;
        thruster.position.set(x, y, z);
        parent.add(thruster);
    }

    createRunningLights(parent) {
        // Red port light
        const portLight = new THREE.PointLight(0xff0000, 0.5, 30);
        portLight.position.set(-12, 0, 0);
        parent.add(portLight);

        // Green starboard light
        const starboardLight = new THREE.PointLight(0x00ff00, 0.5, 30);
        starboardLight.position.set(12, 0, 0);
        parent.add(starboardLight);

        // White forward light
        const forwardLight = new THREE.PointLight(0xffffff, 0.3, 40);
        forwardLight.position.set(0, 0, -35);
        parent.add(forwardLight);
    }

    createWeaponSystems() {
        // Projectile container group
        this.projectileGroup = new THREE.Group();
        this.scene.add(this.projectileGroup);
    }

    createThrustParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const lifetimes = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 40;

            // Blue Epstein drive exhaust
            colors[i * 3] = 0.2;
            colors[i * 3 + 1] = 0.6;
            colors[i * 3 + 2] = 1;

            lifetimes[i] = Math.random();
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.particleLifetimes = lifetimes;

        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.thrustParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.group.add(this.thrustParticles);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': case 'arrowup': this.controls.forward = true; break;
                case 's': case 'arrowdown': this.controls.backward = true; break;
                case 'a': case 'arrowleft': this.controls.left = true; break;
                case 'd': case 'arrowright': this.controls.right = true; break;
                case ' ': this.controls.boost = true; e.preventDefault(); break;
                case 'f': this.controls.fireRailgun = true; break;
                case 'r': this.controls.fireMissile = true; break;
                case 'h': this.toggleControlsPanel(); break;
                case 'x': this.initiateFlipAndBurn(); break;
                case 'q': this.togglePDC(); break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': case 'arrowup': this.controls.forward = false; break;
                case 's': case 'arrowdown': this.controls.backward = false; break;
                case 'a': case 'arrowleft': this.controls.left = false; break;
                case 'd': case 'arrowright': this.controls.right = false; break;
                case ' ': this.controls.boost = false; break;
                case 'f': this.controls.fireRailgun = false; break;
                case 'r': this.controls.fireMissile = false; break;
            }
        });
    }

    toggleControlsPanel() {
        const panel = document.getElementById('controls-panel');
        if (panel) {
            panel.classList.toggle('hidden');
        }
    }

    initiateFlipAndBurn() {
        if (this.isFlipping || this.speed < 50) return;  // Need some speed to flip

        this.isFlipping = true;
        this.flipProgress = 0;
        this.flipStartRotation = this.rotation;

        // Show notification
        this.showFlipNotification();
    }

    showFlipNotification() {
        const notif = document.createElement('div');
        notif.innerHTML = '🔄 FLIP AND BURN';
        notif.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Orbitron', sans-serif;
            font-size: 1.8rem;
            font-weight: bold;
            color: #00aaff;
            text-shadow: 0 0 30px rgba(0, 170, 255, 0.8);
            letter-spacing: 5px;
            pointer-events: none;
            z-index: 500;
            animation: flipNotif 1.5s ease-out forwards;
        `;

        if (!document.getElementById('flip-notif-style')) {
            const style = document.createElement('style');
            style.id = 'flip-notif-style';
            style.textContent = `
                @keyframes flipNotif {
                    0% { opacity: 1; transform: translateX(-50%) scale(1); }
                    50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
                    100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 1500);
    }

    updateFlipAndBurn(delta) {
        if (!this.isFlipping) return;

        // Flip takes about 1 second
        this.flipProgress += delta;
        const flipDuration = 1.0;

        if (this.flipProgress >= flipDuration) {
            // Flip complete
            this.isFlipping = false;
            this.rotation = this.flipStartRotation + Math.PI;
            // Normalize rotation
            while (this.rotation > Math.PI) this.rotation -= Math.PI * 2;
            while (this.rotation < -Math.PI) this.rotation += Math.PI * 2;
        } else {
            // Smooth flip animation
            const t = this.flipProgress / flipDuration;
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;  // Ease in-out
            this.rotation = this.flipStartRotation + (Math.PI * eased);
        }
    }

    togglePDC() {
        // Toggle PDC via combat system if available
        if (window.combatSystem) {
            window.combatSystem.togglePDC();
        }

        const pdcStatus = document.getElementById('pdc-status');
        if (pdcStatus) {
            const isActive = pdcStatus.textContent === 'ACTIVE';
            pdcStatus.textContent = isActive ? 'OFFLINE' : 'ACTIVE';
            pdcStatus.className = isActive ? 'pdc-inactive' : 'pdc-active';
        }
    }

    update(delta) {
        // Handle flip and burn maneuver
        this.updateFlipAndBurn(delta);

        // Rotation (skip if flipping)
        if (!this.isFlipping) {
            if (this.controls.left) {
                this.rotation += this.rotationSpeed * delta;
            }
            if (this.controls.right) {
                this.rotation -= this.rotationSpeed * delta;
            }
        }

        // Acceleration - "Flip and burn" style
        const boostMultiplier = this.controls.boost ? 3 : 1;

        if (this.controls.forward) {
            this.speed = Math.min(this.maxSpeed * boostMultiplier, this.speed + this.acceleration * delta * boostMultiplier);
        } else if (this.controls.backward) {
            this.speed = Math.max(-this.maxSpeed * 0.5, this.speed - this.acceleration * delta);
        }

        // Apply friction (minimal in space)
        this.speed *= this.friction;

        // Update velocity
        this.velocity.x = -Math.sin(this.rotation) * this.speed * delta;
        this.velocity.z = -Math.cos(this.rotation) * this.speed * delta;

        // Update position
        this.position.add(this.velocity);
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotation;

        // Update weapons
        this.updateWeapons(delta);

        // Update particles
        this.updateParticles(delta);

        // Update engine glow
        this.updateEngineGlow();
    }

    updateWeapons(delta) {
        // Cooldowns
        this.railgunCooldown = Math.max(0, this.railgunCooldown - delta);
        this.missileCooldown = Math.max(0, this.missileCooldown - delta);

        // Fire railgun
        if (this.controls.fireRailgun && this.railgunCooldown <= 0) {
            this.fireRailgun();
            this.railgunCooldown = this.railgunReloadTime;
        }

        // Fire missile
        if (this.controls.fireMissile && this.missileCooldown <= 0 && this.currentMissiles > 0) {
            this.fireMissile();
            this.missileCooldown = this.missileReloadTime;
            this.currentMissiles--;
        }

        // Update projectiles
        this.updateProjectiles(delta);
    }

    fireRailgun() {
        // Create railgun projectile
        const projectile = new THREE.Group();

        // Tungsten rod (kinetic penetrator) - larger and more visible
        const rodGeometry = new THREE.CylinderGeometry(0.5, 0.5, 15, 8);
        const rodMaterial = new THREE.MeshBasicMaterial({
            color: 0x88aaff
        });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.rotation.x = Math.PI / 2;
        projectile.add(rod);

        // Glowing trail
        const trailGeometry = new THREE.CylinderGeometry(0.3, 0.8, 30, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0x4466ff,
            transparent: true,
            opacity: 0.6
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.rotation.x = Math.PI / 2;
        trail.position.z = 20;
        projectile.add(trail);

        // Bright muzzle flash
        const flash = new THREE.PointLight(0x6666ff, 10, 100);
        projectile.add(flash);

        // Position at front of ship
        const forward = new THREE.Vector3(
            -Math.sin(this.rotation),
            0,
            -Math.cos(this.rotation)
        );

        projectile.position.copy(this.position);
        projectile.position.add(forward.clone().multiplyScalar(50));
        projectile.rotation.y = this.rotation;

        // Projectile data
        projectile.userData = {
            velocity: forward.multiplyScalar(3000),  // Extremely fast
            lifetime: 3,
            type: 'railgun',
            flash: flash,
            trail: trail
        };

        this.projectiles.push(projectile);
        this.scene.add(projectile);

        // Screen flash effect (DOM)
        this.createRailgunFlash();

        // Update HUD
        this.updateWeaponsHUD();

        // Screen shake effect
        this.triggerScreenShake();

        console.log('🔫 RAILGUN FIRED!');
    }

    fireMissile() {
        const missile = new THREE.Group();

        // Missile body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.6,
            roughness: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        missile.add(body);

        // Warhead (nuclear - yellow warning)
        const warheadGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
        const warheadMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            emissive: 0xaa8800,
            emissiveIntensity: 0.5
        });
        const warhead = new THREE.Mesh(warheadGeometry, warheadMaterial);
        warhead.rotation.x = -Math.PI / 2;
        warhead.position.z = -3;
        missile.add(warhead);

        // Engine glow
        const engineGlow = new THREE.PointLight(0xff4400, 2, 20);
        engineGlow.position.z = 3;
        missile.add(engineGlow);

        // Position and direction
        const forward = new THREE.Vector3(
            -Math.sin(this.rotation),
            0,
            -Math.cos(this.rotation)
        );

        missile.position.copy(this.position);
        missile.position.add(forward.clone().multiplyScalar(20));
        missile.rotation.y = this.rotation;

        missile.userData = {
            velocity: forward.multiplyScalar(300),
            lifetime: 15,
            type: 'missile',
            engineGlow: engineGlow,
            trail: []
        };

        this.missiles.push(missile);
        this.scene.add(missile);

        console.log(`🚀 Nuclear missile launched! (${this.currentMissiles} remaining)`);
    }

    updateProjectiles(delta) {
        // Update railgun projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.position.add(proj.userData.velocity.clone().multiplyScalar(delta));
            proj.userData.lifetime -= delta;

            // Fade flash
            if (proj.userData.flash) {
                proj.userData.flash.intensity *= 0.9;
            }

            if (proj.userData.lifetime <= 0) {
                this.scene.remove(proj);
                this.projectiles.splice(i, 1);
            }
        }

        // Update missiles
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.position.add(missile.userData.velocity.clone().multiplyScalar(delta));
            missile.userData.lifetime -= delta;

            // Add trail particles (simplified)
            if (missile.userData.engineGlow) {
                missile.userData.engineGlow.intensity = 1.5 + Math.random() * 0.5;
            }

            if (missile.userData.lifetime <= 0) {
                this.createExplosion(missile.position);
                this.scene.remove(missile);
                this.missiles.splice(i, 1);
            }
        }
    }

    createExplosion(position) {
        // Nuclear explosion effect!
        const explosion = new THREE.Group();

        // Bright flash
        const flash = new THREE.PointLight(0xffffaa, 10, 500);
        flash.position.copy(position);
        explosion.add(flash);

        // Expanding sphere
        const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(position);
        explosion.add(sphere);

        this.scene.add(explosion);

        // Animate explosion
        let scale = 1;
        const expandExplosion = () => {
            scale += 0.5;
            sphere.scale.setScalar(scale);
            sphereMaterial.opacity -= 0.02;
            flash.intensity *= 0.95;

            if (sphereMaterial.opacity > 0) {
                requestAnimationFrame(expandExplosion);
            } else {
                this.scene.remove(explosion);
            }
        };
        expandExplosion();

        console.log('💥 NUCLEAR DETONATION!');
    }

    triggerScreenShake() {
        // Simple screen shake by moving camera temporarily
        if (window.threeScene && window.threeScene.camera) {
            const camera = window.threeScene.camera;
            const originalPos = camera.position.clone();

            let shakeTime = 0;
            const shake = () => {
                shakeTime += 0.05;
                camera.position.x = originalPos.x + (Math.random() - 0.5) * 3;
                camera.position.y = originalPos.y + (Math.random() - 0.5) * 3;

                if (shakeTime < 0.25) {
                    requestAnimationFrame(shake);
                } else {
                    camera.position.copy(originalPos);
                }
            };
            shake();
        }
    }

    createRailgunFlash() {
        // Create a blue screen flash overlay
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, rgba(100, 150, 255, 0.5), rgba(50, 100, 200, 0.3) 50%, transparent 70%);
            pointer-events: none;
            z-index: 1000;
            animation: railgunFlash 0.2s ease-out forwards;
        `;

        // Add keyframe animation if not exists
        if (!document.getElementById('railgun-flash-style')) {
            const style = document.createElement('style');
            style.id = 'railgun-flash-style';
            style.textContent = `
                @keyframes railgunFlash {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(flash);

        // Show "RAILGUN" text
        const text = document.createElement('div');
        text.textContent = '🔫 RAILGUN';
        text.style.cssText = `
            position: fixed;
            bottom: 25%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5rem;
            font-weight: bold;
            color: #88aaff;
            text-shadow: 0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(100, 150, 255, 0.5);
            letter-spacing: 5px;
            pointer-events: none;
            z-index: 1001;
            animation: railgunText 0.5s ease-out forwards;
        `;

        if (!document.getElementById('railgun-text-style')) {
            const textStyle = document.createElement('style');
            textStyle.id = 'railgun-text-style';
            textStyle.textContent = `
                @keyframes railgunText {
                    0% { opacity: 1; transform: translateX(-50%) scale(1); }
                    100% { opacity: 0; transform: translateX(-50%) scale(1.2); }
                }
            `;
            document.head.appendChild(textStyle);
        }

        document.body.appendChild(text);

        // Remove elements after animation
        setTimeout(() => {
            flash.remove();
            text.remove();
        }, 500);
    }

    updateWeaponsHUD() {
        // Update the HUD weapons display
        const railgunStatus = document.getElementById('railgun-status');
        const missileCount = document.getElementById('missile-count');

        if (railgunStatus) {
            railgunStatus.textContent = 'FIRING';
            railgunStatus.style.color = '#ff4444';
            setTimeout(() => {
                railgunStatus.textContent = 'READY';
                railgunStatus.style.color = '#00ff88';
            }, this.railgunReloadTime * 1000);
        }

        if (missileCount) {
            missileCount.textContent = this.currentMissiles;
        }
    }

    updateParticles(delta) {
        if (!this.thrustParticles) return;

        const positions = this.thrustParticles.geometry.attributes.position.array;
        const colors = this.thrustParticles.geometry.attributes.color.array;
        const isThrusting = this.controls.forward || this.controls.boost;

        for (let i = 0; i < this.particleCount; i++) {
            this.particleLifetimes[i] -= delta * 3;

            if (this.particleLifetimes[i] <= 0) {
                this.particleLifetimes[i] = 1;
                positions[i * 3] = (Math.random() - 0.5) * 8;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
                positions[i * 3 + 2] = 40;
            } else if (isThrusting) {
                positions[i * 3 + 2] += delta * 80;
                positions[i * 3] += (Math.random() - 0.5) * 3;
                positions[i * 3 + 1] += (Math.random() - 0.5) * 3;

                // Blue Epstein drive exhaust color
                const life = this.particleLifetimes[i];
                colors[i * 3] = 0.2 + (1 - life) * 0.3;
                colors[i * 3 + 1] = 0.5 + life * 0.3;
                colors[i * 3 + 2] = 1;
            }
        }

        this.thrustParticles.geometry.attributes.position.needsUpdate = true;
        this.thrustParticles.geometry.attributes.color.needsUpdate = true;
        this.thrustParticles.visible = isThrusting || this.speed > 20;
    }

    updateEngineGlow() {
        if (this.mainEngineGlow) {
            const isThrusting = this.controls.forward || this.controls.boost;
            this.mainEngineGlow.visible = isThrusting || this.speed > 10;

            if (this.engineLight) {
                this.engineLight.intensity = isThrusting ? 3 + Math.random() * 0.5 : 0.5;
            }
        }
    }

    getPosition() {
        return this.position.clone();
    }

    getSpeed() {
        return Math.abs(this.speed);
    }

    getRotation() {
        return this.rotation;
    }

    getLookAhead() {
        const distance = 60 + this.speed * 0.4;
        return new THREE.Vector3(
            -Math.sin(this.rotation) * distance,
            0,
            -Math.cos(this.rotation) * distance
        );
    }

    warpTo(position) {
        this.position.copy(position);
        this.position.y = 0;
        const offset = position.clone().normalize().multiplyScalar(120);
        this.position.add(offset);
        this.speed = 0;
        this.velocity.set(0, 0, 0);
    }

    getThrottle() {
        return Math.abs(this.speed) / this.maxSpeed;
    }

    getMissileCount() {
        return this.currentMissiles;
    }
}

// Make available globally
window.Rocinante3D = Rocinante3D;
