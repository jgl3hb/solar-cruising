/**
 * DwarfPlanets.js - Trans-Neptunian dwarf planets
 * Eris, Makemake, Haumea, and others in the outer solar system
 */

class Eris extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'eris',
            distance: 2800, // Far beyond Pluto
            size: 9,
            color: 0xe8e8e8,
            orbitSpeed: 0.02,
            rotationSpeed: 0.3,
            tilt: 44,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Eris: Very bright, icy surface
        ctx.fillStyle = '#e5e5e5';
        ctx.fillRect(0, 0, width, height);

        // Methane ice patches
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 10 + Math.random() * 20, 8 + Math.random() * 12, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        }

        // Slight surface variation
        for (let i = 0; i < 300; i++) {
            const v = Math.random() * 15 - 7;
            ctx.fillStyle = `rgb(${230 + v}, ${230 + v}, ${230 + v})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 4, 4);
        }

        // Few craters
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 2 + Math.random() * 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(180, 180, 185, 0.3)';
            ctx.fill();
        }
    }

    addSpecialFeatures() {
        // Dysnomia (Eris's moon)
        this.moons = [];
        const dysnomia = new BaseMoon({
            name: 'dysnomia',
            size: 1.5,
            color: 0xaaaaaa,
            orbitRadius: 15,
            orbitSpeed: 0.3
        });
        dysnomia.init();
        this.moons.push(dysnomia);
        this.group.add(dysnomia.getGroup());
    }

    updateSpecialFeatures(delta) {
        for (const moon of this.moons) {
            moon.update(delta);
        }
    }

    getRoughness() { return 0.85; }

    getData() {
        return {
            ...super.getData(),
            type: 'dwarf planet',
            moons: ['Dysnomia']
        };
    }
}

class Makemake extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'makemake',
            distance: 2600,
            size: 7,
            color: 0xd4a574,
            orbitSpeed: 0.025,
            rotationSpeed: 0.25,
            tilt: 29,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Makemake: Reddish-brown, methane ice
        ctx.fillStyle = '#c49464';
        ctx.fillRect(0, 0, width, height);

        // Methane frost
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 12 + Math.random() * 20, 8 + Math.random() * 12, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(240, 230, 220, 0.3)';
            ctx.fill();
        }

        // Surface variation
        for (let i = 0; i < 400; i++) {
            const v = Math.random() * 25 - 12;
            ctx.fillStyle = `rgb(${196 + v}, ${149 + v}, ${100 + v})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 3, 3);
        }
    }

    getRoughness() { return 0.88; }

    getData() {
        return {
            ...super.getData(),
            type: 'dwarf planet'
        };
    }
}

class Haumea extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'haumea',
            distance: 2500,
            size: 6,
            color: 0xf5f5f5,
            orbitSpeed: 0.028,
            rotationSpeed: 2.5, // Fastest rotation of any large body!
            tilt: 126,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    createGeometry() {
        // Haumea is elongated (ellipsoid) due to fast rotation!
        this.geometry = new THREE.SphereGeometry(this.size, this.segments, this.segments);
        // Scale to make it elongated
        this.geometry.scale(1.8, 1, 1);
    }

    drawTextureDetails(ctx, width, height) {
        // Haumea: Very bright, crystalline water ice
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);

        // Dark red spot (organic material)
        ctx.beginPath();
        ctx.ellipse(width * 0.6, height * 0.4, 20, 15, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150, 80, 60, 0.4)';
        ctx.fill();

        // Ice variation
        for (let i = 0; i < 200; i++) {
            ctx.fillStyle = `rgba(${240 + Math.random() * 15}, ${240 + Math.random() * 15}, ${245 + Math.random() * 10}, 0.5)`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 5, 5);
        }
    }

    addSpecialFeatures() {
        // Haumea has rings!
        this.createRings();

        // Moons: Hi'iaka and Namaka
        this.moons = [];

        const hiiaka = new BaseMoon({
            name: 'hiiaka',
            size: 1,
            color: 0xcccccc,
            orbitRadius: 12,
            orbitSpeed: 0.4
        });
        hiiaka.init();
        this.moons.push(hiiaka);
        this.group.add(hiiaka.getGroup());

        const namaka = new BaseMoon({
            name: 'namaka',
            size: 0.6,
            color: 0xbbbbbb,
            orbitRadius: 8,
            orbitSpeed: 0.6
        });
        namaka.init();
        this.moons.push(namaka);
        this.group.add(namaka.getGroup());
    }

    createRings() {
        const ringGeometry = new THREE.RingGeometry(this.size * 1.8, this.size * 2.2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2;
        this.group.add(rings);
    }

    updateSpecialFeatures(delta) {
        for (const moon of this.moons) {
            moon.update(delta);
        }
    }

    getRoughness() { return 0.8; }

    getData() {
        return {
            ...super.getData(),
            type: 'dwarf planet',
            hasRings: true,
            moons: ["Hi'iaka", 'Namaka'],
            feature: 'Elongated shape, fastest rotation'
        };
    }
}

class Sedna extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'sedna',
            distance: 3200, // Very far out (inner Oort Cloud)
            size: 5,
            color: 0xcc4444,
            orbitSpeed: 0.008, // ~11,400 year orbit!
            rotationSpeed: 0.2,
            tilt: 12,
            segments: 28,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Sedna: One of the reddest objects in solar system
        ctx.fillStyle = '#b83a3a';
        ctx.fillRect(0, 0, width, height);

        // Tholins (organic compounds)
        for (let i = 0; i < 500; i++) {
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgb(${184 + v}, ${58 + v / 2}, ${58 + v / 2})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 3, 3);
        }

        // Darker patches
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 10 + Math.random() * 15, 8 + Math.random() * 10, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 30, 30, 0.3)';
            ctx.fill();
        }
    }

    getRoughness() { return 0.92; }

    getData() {
        return {
            ...super.getData(),
            type: 'detached object',
            feature: 'Extremely red, inner Oort Cloud'
        };
    }
}

window.Eris = Eris;
window.Makemake = Makemake;
window.Haumea = Haumea;
window.Sedna = Sedna;
