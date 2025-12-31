/**
 * BasePlanet.js - Base class for all planets
 * Provides common functionality for planet rendering
 */

class BasePlanet {
    constructor(config = {}) {
        // Default configuration
        this.name = config.name || 'planet';
        this.distance = config.distance || 100;
        this.size = config.size || 10;
        this.color = config.color || 0xcccccc;
        this.orbitSpeed = config.orbitSpeed || 0.5;
        this.rotationSpeed = config.rotationSpeed || 0.5;
        this.tilt = config.tilt || 0;
        this.segments = config.segments || 64;
        this.textureResolution = config.textureResolution || 1024;

        // Three.js objects
        this.group = new THREE.Group();
        this.mesh = null;
        this.material = null;
        this.texture = null;

        // Orbit tracking
        this.orbitAngle = Math.random() * Math.PI * 2;
    }

    /**
     * Initialize the planet - call after construction
     */
    init() {
        this.createGeometry();
        this.createTexture();
        this.createMaterial();
        this.createMesh();
        this.addSpecialFeatures();
        this.positionOnOrbit();
        return this;
    }

    /**
     * Create planet geometry
     */
    createGeometry() {
        this.geometry = new THREE.SphereGeometry(
            this.size,
            this.segments,
            this.segments
        );
    }

    /**
     * Create planet texture - override in subclass for custom textures
     */
    createTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = this.textureResolution;
        canvas.height = this.textureResolution / 2;
        const ctx = canvas.getContext('2d');

        // Base color fill
        const color = new THREE.Color(this.color);
        ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply custom texture details
        this.drawTextureDetails(ctx, canvas.width, canvas.height);

        this.texture = new THREE.CanvasTexture(canvas);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
        this.texture.anisotropy = 16;
    }

    /**
     * Draw texture details - override in subclass
     */
    drawTextureDetails(ctx, width, height) {
        // Default: add some noise
        const color = new THREE.Color(this.color);
        const baseR = Math.floor(color.r * 255);
        const baseG = Math.floor(color.g * 255);
        const baseB = Math.floor(color.b * 255);

        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const variation = Math.random() * 30 - 15;
            ctx.fillStyle = `rgb(${Math.min(255, Math.max(0, baseR + variation))}, ${Math.min(255, Math.max(0, baseG + variation))}, ${Math.min(255, Math.max(0, baseB + variation))})`;
            ctx.fillRect(x, y, 3, 3);
        }
    }

    /**
     * Create planet material
     */
    createMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture,
            roughness: this.getRoughness(),
            metalness: this.getMetalness(),
            bumpScale: 0.02
        });
    }

    /**
     * Get roughness value - override for custom values
     */
    getRoughness() {
        return 0.85;
    }

    /**
     * Get metalness value - override for custom values
     */
    getMetalness() {
        return 0.05;
    }

    /**
     * Create the mesh and add to group
     */
    createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.z = THREE.MathUtils.degToRad(this.tilt);
        this.group.add(this.mesh);
    }

    /**
     * Add special features like rings or moons - override in subclass
     */
    addSpecialFeatures() {
        // Override in subclass
    }

    /**
     * Position planet on its orbit
     */
    positionOnOrbit() {
        this.group.position.x = Math.cos(this.orbitAngle) * this.distance;
        this.group.position.z = Math.sin(this.orbitAngle) * this.distance;
    }

    /**
     * Update planet animation
     */
    update(delta, elapsed) {
        // Orbit around sun
        this.orbitAngle += delta * this.orbitSpeed * 0.1;
        this.group.position.x = Math.cos(this.orbitAngle) * this.distance;
        this.group.position.z = Math.sin(this.orbitAngle) * this.distance;

        // Planet rotation
        if (this.mesh) {
            this.mesh.rotation.y += delta * this.rotationSpeed;
        }

        // Update special features
        this.updateSpecialFeatures(delta, elapsed);
    }

    /**
     * Update special features - override in subclass
     */
    updateSpecialFeatures(delta, elapsed) {
        // Override in subclass
    }

    /**
     * Get the Three.js group for this planet
     */
    getGroup() {
        return this.group;
    }

    /**
     * Get current position
     */
    getPosition() {
        return this.group.position.clone();
    }

    /**
     * Get planet data for HUD/info display
     */
    getData() {
        return {
            name: this.name,
            distance: this.distance,
            size: this.size,
            color: this.color,
            orbitSpeed: this.orbitSpeed,
            tilt: this.tilt
        };
    }
}

// Make available globally
window.BasePlanet = BasePlanet;
