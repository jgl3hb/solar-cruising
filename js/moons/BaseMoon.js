/**
 * BaseMoon.js - Base class for all moons
 * Provides common functionality for moon rendering and orbiting
 */

class BaseMoon {
    constructor(config = {}) {
        this.name = config.name || 'moon';
        this.size = config.size || 1;
        this.color = config.color || 0xaaaaaa;
        this.orbitRadius = config.orbitRadius || 10;
        this.orbitSpeed = config.orbitSpeed || 1;
        this.rotationSpeed = config.rotationSpeed || 0.5;
        this.segments = config.segments || 32;
        this.textureResolution = config.textureResolution || 256;
        this.parentPlanet = config.parentPlanet || null;

        this.group = new THREE.Group();
        this.mesh = null;
        this.orbitAngle = Math.random() * Math.PI * 2;
    }

    init() {
        this.createGeometry();
        this.createTexture();
        this.createMaterial();
        this.createMesh();
        this.updatePosition();
        return this;
    }

    createGeometry() {
        this.geometry = new THREE.SphereGeometry(this.size, this.segments, this.segments);
    }

    createTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = this.textureResolution;
        canvas.height = this.textureResolution / 2;
        const ctx = canvas.getContext('2d');

        const color = new THREE.Color(this.color);
        ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawTextureDetails(ctx, canvas.width, canvas.height);

        this.texture = new THREE.CanvasTexture(canvas);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
    }

    drawTextureDetails(ctx, width, height) {
        // Default crater texture
        const color = new THREE.Color(this.color);
        const baseR = Math.floor(color.r * 255);
        const baseG = Math.floor(color.g * 255);
        const baseB = Math.floor(color.b * 255);

        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 1 + Math.random() * 5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 20}, ${baseG - 20}, ${baseB - 20}, 0.5)`;
            ctx.fill();
        }
    }

    createMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture,
            roughness: 0.9,
            metalness: 0.05
        });
    }

    createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.group.add(this.mesh);
    }

    updatePosition() {
        this.group.position.x = Math.cos(this.orbitAngle) * this.orbitRadius;
        this.group.position.z = Math.sin(this.orbitAngle) * this.orbitRadius;
    }

    update(delta) {
        this.orbitAngle += delta * this.orbitSpeed;
        this.updatePosition();
        if (this.mesh) {
            this.mesh.rotation.y += delta * this.rotationSpeed;
        }
    }

    getGroup() {
        return this.group;
    }

    getPosition() {
        return this.group.position.clone();
    }

    getData() {
        return {
            name: this.name,
            size: this.size,
            orbitRadius: this.orbitRadius
        };
    }
}

window.BaseMoon = BaseMoon;
