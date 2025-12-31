/**
 * Uranus.js - The Sideways Planet
 * Features: Extreme axial tilt (98°), faint rings, blue-green color
 */

class Uranus extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'uranus',
            distance: 1450,
            size: 45,
            color: 0x5dade2,
            orbitSpeed: 0.1,
            rotationSpeed: -0.7,
            tilt: 98,
            segments: 64,
            textureResolution: 1024,
            ...config
        });
        this.rings = null;
    }

    drawTextureDetails(ctx, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4db8d9');
        gradient.addColorStop(0.3, '#5dade2');
        gradient.addColorStop(0.7, '#5dade2');
        gradient.addColorStop(1, '#3d9bcf');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Subtle banding
        for (let y = 0; y < height; y += 30) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.03})`;
            ctx.fillRect(0, y, width, 15 + Math.random() * 20);
        }

        // Cloud features
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 15 + Math.random() * 25, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.08})`;
            ctx.fill();
        }
    }

    addSpecialFeatures() {
        this.rings = this.createRingSystem();
        this.group.add(this.rings);

        // Add Uranus's major moons
        this.moons = [];

        const miranda = new Miranda();
        miranda.init();
        this.moons.push(miranda);
        this.group.add(miranda.getGroup());

        const ariel = new Ariel();
        ariel.init();
        this.moons.push(ariel);
        this.group.add(ariel.getGroup());

        const umbriel = new Umbriel();
        umbriel.init();
        this.moons.push(umbriel);
        this.group.add(umbriel.getGroup());

        const titania = new Titania();
        titania.init();
        this.moons.push(titania);
        this.group.add(titania.getGroup());

        const oberon = new Oberon();
        oberon.init();
        this.moons.push(oberon);
        this.group.add(oberon.getGroup());
    }

    updateSpecialFeatures(delta, elapsed) {
        for (const moon of this.moons) {
            moon.update(delta);
        }
    }

    createRingSystem() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(150, 180, 200, 0.3)';
        ctx.fillRect(200, 0, 15, 16);

        const ringTexture = new THREE.CanvasTexture(canvas);
        const ringGeometry = new THREE.RingGeometry(this.size * 1.5, this.size * 1.8, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2;
        return rings;
    }

    getRoughness() { return 0.6; }

    getData() {
        return {
            ...super.getData(),
            hasRings: true,
            moons: ['Miranda', 'Ariel', 'Umbriel', 'Titania', 'Oberon']
        };
    }
}

window.Uranus = Uranus;

