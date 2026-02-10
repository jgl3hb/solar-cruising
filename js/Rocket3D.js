/**
 * Rocket3D.js - 3D Rocket with particle thrust
 * 3D flight: yaw steering + vertical ascent/descent + throttle/brake
 */

class Rocket3D {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.mesh = null;
        this.flame = null;
        this.flameParticles = null;

        // Physics - adjusted for larger solar system
        this.position = new THREE.Vector3(0, 0, 450); // Start outside Earth orbit
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = 0; // Y-axis rotation
        this.speed = 0;
        this.maxSpeed = 800;  // Faster for larger distances
        this.acceleration = 150;
        this.friction = 0.985;
        this.rotationSpeed = 2;
        this.verticalSpeed = 0;
        this.maxVerticalSpeed = 220;
        this.verticalAcceleration = 220;
        this.verticalFriction = 0.93;

        // Controls state
        this.controls = {
            accelerate: false,
            brake: false,
            left: false,
            right: false,
            ascend: false,
            descend: false,
            boost: false
        };

        // Thrust particles
        this.particleCount = 200;
        this.particles = [];
    }

    init() {
        this.createRocket();
        this.createThrustParticles();
        this.setupControls();

        this.group.position.copy(this.position);
        this.scene.add(this.group);

        return this;
    }

    createRocket() {
        const rocketGroup = new THREE.Group();

        // Body - white cylinder
        const bodyGeometry = new THREE.CylinderGeometry(3, 3, 20, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        rocketGroup.add(body);

        // Nose cone - red
        const noseGeometry = new THREE.ConeGeometry(3, 8, 16);
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc0000,
            metalness: 0.3,
            roughness: 0.4
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.z = -14;
        nose.rotation.x = -Math.PI / 2;
        rocketGroup.add(nose);

        // Stripe - red band
        const stripeGeometry = new THREE.CylinderGeometry(3.1, 3.1, 3, 16);
        const stripeMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc0000,
            metalness: 0.3,
            roughness: 0.4
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.rotation.x = Math.PI / 2;
        stripe.position.z = -3;
        rocketGroup.add(stripe);

        // USA text (as a simple box for now)
        const textGeometry = new THREE.BoxGeometry(4, 0.3, 1.5);
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 3.1, -3);
        rocketGroup.add(text);

        // Window - blue
        const windowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90d9,
            metalness: 0.8,
            roughness: 0.1,
            emissive: 0x224466,
            emissiveIntensity: 0.3
        });
        const rocketWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        rocketWindow.position.set(0, 3, -6);
        rocketWindow.scale.z = 0.5;
        rocketGroup.add(rocketWindow);

        // Fins - red triangular
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(5, 0);
        finShape.lineTo(0, 8);
        finShape.closePath();

        const finGeometry = new THREE.ExtrudeGeometry(finShape, {
            depth: 0.5,
            bevelEnabled: false
        });

        const finMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc0000,
            metalness: 0.3,
            roughness: 0.4
        });

        for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(finGeometry, finMaterial);
            fin.rotation.x = Math.PI / 2;
            fin.rotation.z = (i * Math.PI / 2) + Math.PI / 4;
            fin.position.z = 8;
            rocketGroup.add(fin);
        }

        // Engine nozzle
        const engineGeometry = new THREE.CylinderGeometry(1.5, 2.5, 4, 16);
        const engineMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.rotation.x = Math.PI / 2;
        engine.position.z = 12;
        rocketGroup.add(engine);

        // Rocket light (internal glow)
        const rocketLight = new THREE.PointLight(0xffaa00, 0.5, 50);
        rocketLight.position.z = 15;
        rocketGroup.add(rocketLight);
        this.rocketLight = rocketLight;

        this.mesh = rocketGroup;
        this.group.add(rocketGroup);
    }

    createThrustParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const lifetimes = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 15;

            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.7;
            colors[i * 3 + 2] = 0.2;

            sizes[i] = 2;
            lifetimes[i] = Math.random();
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.particleLifetimes = lifetimes;

        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.flameParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.group.add(this.flameParticles);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowleft':
                    this.controls.left = true;
                    e.preventDefault();
                    break;
                case 'arrowright':
                    this.controls.right = true;
                    e.preventDefault();
                    break;
                case 'arrowup':
                    this.controls.ascend = true;
                    e.preventDefault();
                    break;
                case 'arrowdown':
                    this.controls.descend = true;
                    e.preventDefault();
                    break;
                case 'w':
                    this.controls.accelerate = true;
                    break;
                case 's':
                    this.controls.brake = true;
                    break;
                case ' ':
                    this.controls.boost = true;
                    e.preventDefault();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowleft':
                    this.controls.left = false;
                    break;
                case 'arrowright':
                    this.controls.right = false;
                    break;
                case 'arrowup':
                    this.controls.ascend = false;
                    break;
                case 'arrowdown':
                    this.controls.descend = false;
                    break;
                case 'w':
                    this.controls.accelerate = false;
                    break;
                case 's':
                    this.controls.brake = false;
                    break;
                case ' ':
                    this.controls.boost = false;
                    break;
            }
        });
    }

    update(delta) {
        // Rotation
        if (this.controls.left) {
            this.rotation += this.rotationSpeed * delta;
        }
        if (this.controls.right) {
            this.rotation -= this.rotationSpeed * delta;
        }

        // Acceleration
        const boostMultiplier = this.controls.boost ? 3 : 1;

        if (this.controls.accelerate) {
            this.speed = Math.min(this.maxSpeed * boostMultiplier, this.speed + this.acceleration * delta * boostMultiplier);
        } else if (this.controls.brake) {
            this.speed = Math.max(-this.maxSpeed * 0.3, this.speed - this.acceleration * delta);
        }

        // Apply friction
        this.speed *= this.friction;

        // Update velocity based on rotation
        this.velocity.x = -Math.sin(this.rotation) * this.speed * delta;
        this.velocity.z = -Math.cos(this.rotation) * this.speed * delta;

        // Vertical movement (true 3D travel)
        if (this.controls.ascend) {
            this.verticalSpeed = Math.min(this.maxVerticalSpeed, this.verticalSpeed + this.verticalAcceleration * delta);
        } else if (this.controls.descend) {
            this.verticalSpeed = Math.max(-this.maxVerticalSpeed, this.verticalSpeed - this.verticalAcceleration * delta);
        } else {
            this.verticalSpeed *= this.verticalFriction;
            if (Math.abs(this.verticalSpeed) < 0.5) {
                this.verticalSpeed = 0;
            }
        }
        this.velocity.y = this.verticalSpeed * delta;

        // Update position
        this.position.add(this.velocity);
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotation;

        // Update thrust particles
        this.updateParticles(delta);

        // Update rocket light intensity based on thrust
        if (this.rocketLight) {
            const isThrusting = this.controls.accelerate || this.controls.boost;
            this.rocketLight.intensity = isThrusting ? 2 + Math.random() * 0.5 : 0.2;
        }
    }

    updateParticles(delta) {
        if (!this.flameParticles) return;

        const positions = this.flameParticles.geometry.attributes.position.array;
        const colors = this.flameParticles.geometry.attributes.color.array;
        const isThrusting = this.controls.accelerate || this.controls.boost;

        for (let i = 0; i < this.particleCount; i++) {
            this.particleLifetimes[i] -= delta * 3;

            if (this.particleLifetimes[i] <= 0) {
                // Reset particle
                this.particleLifetimes[i] = 1;
                positions[i * 3] = (Math.random() - 0.5) * 3;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
                positions[i * 3 + 2] = 15;
            } else if (isThrusting) {
                // Move particle backward (thrust)
                positions[i * 3 + 2] += delta * 50;
                positions[i * 3] += (Math.random() - 0.5) * 2;
                positions[i * 3 + 1] += (Math.random() - 0.5) * 2;

                // Color fade: white -> yellow -> orange -> red
                const life = this.particleLifetimes[i];
                if (life > 0.7) {
                    colors[i * 3] = 1;
                    colors[i * 3 + 1] = 1;
                    colors[i * 3 + 2] = 0.8;
                } else if (life > 0.4) {
                    colors[i * 3] = 1;
                    colors[i * 3 + 1] = 0.6 + life * 0.4;
                    colors[i * 3 + 2] = 0.1;
                } else {
                    colors[i * 3] = 1;
                    colors[i * 3 + 1] = life;
                    colors[i * 3 + 2] = 0;
                }
            }
        }

        this.flameParticles.geometry.attributes.position.needsUpdate = true;
        this.flameParticles.geometry.attributes.color.needsUpdate = true;

        // Hide particles when not thrusting
        this.flameParticles.visible = isThrusting || this.speed > 10;
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
        const distance = 50 + this.speed * 0.5;
        return new THREE.Vector3(
            -Math.sin(this.rotation) * distance,
            this.verticalSpeed * 0.6,
            -Math.cos(this.rotation) * distance
        );
    }

    warpTo(position) {
        this.position.copy(position);
        this.position.y = 0;
        // Offset to appear just outside planet (scaled for larger planets)
        const offset = position.clone().normalize().multiplyScalar(100);
        this.position.add(offset);
        this.speed = 0;
        this.verticalSpeed = 0;
        this.velocity.set(0, 0, 0);
    }

    getThrottle() {
        return Math.abs(this.speed) / this.maxSpeed;
    }
}

// Make available globally
window.Rocket3D = Rocket3D;
