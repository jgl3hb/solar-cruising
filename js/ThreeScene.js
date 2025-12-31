/**
 * ThreeScene.js - Three.js Scene Manager
 * Handles WebGL rendering, camera, lights, and animation loop
 */

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.animationId = null;
        this.isRunning = false;

        // Camera settings
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.cameraOffset = new THREE.Vector3(0, 150, 300);

        // Callbacks for update loop
        this.updateCallbacks = [];
    }

    init(container) {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x020208);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            50000
        );
        this.camera.position.set(0, 200, 500);
        this.camera.lookAt(0, 0, 0);

        // Create renderer with antialiasing
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        container.appendChild(this.renderer.domElement);

        // Create clock for delta time
        this.clock = new THREE.Clock();

        // Add lights
        this.setupLights();

        // Add starfield
        this.createStarfield();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        return this;
    }

    setupLights() {
        // Ambient light for base visibility
        const ambient = new THREE.AmbientLight(0x111122, 0.5);
        this.scene.add(ambient);

        // Main sun light will be added by SolarSystem3D
    }

    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 15000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const colorOptions = [
            new THREE.Color(0xffffff),  // White
            new THREE.Color(0xb4e0ff),  // Blue-white
            new THREE.Color(0xffeaa7),  // Yellow-white
            new THREE.Color(0xffcccc),  // Red-white
        ];

        for (let i = 0; i < starCount; i++) {
            // Distribute stars in a large sphere
            const radius = 5000 + Math.random() * 15000;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Random star color
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random size
            sizes[i] = 0.5 + Math.random() * 2;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });

        this.starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starfield);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    removeUpdateCallback(callback) {
        const index = this.updateCallbacks.indexOf(callback);
        if (index > -1) {
            this.updateCallbacks.splice(index, 1);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clock.start();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // Run all update callbacks
        for (const callback of this.updateCallbacks) {
            callback(delta, elapsed);
        }

        // Gentle starfield rotation
        if (this.starfield) {
            this.starfield.rotation.y += delta * 0.002;
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    setCameraTarget(target, immediate = false) {
        if (immediate) {
            this.cameraTarget.copy(target);
            this.camera.position.copy(target).add(this.cameraOffset);
        } else {
            this.cameraTarget.lerp(target, 0.05);
        }
    }

    updateCameraFollow(targetPos, lookAhead = new THREE.Vector3()) {
        const targetPosition = targetPos.clone().add(this.cameraOffset);
        this.camera.position.lerp(targetPosition, 0.03);

        const lookAtPos = targetPos.clone().add(lookAhead);
        this.camera.lookAt(lookAtPos);
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }
}

// Make available globally
window.ThreeScene = ThreeScene;
