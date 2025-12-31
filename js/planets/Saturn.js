/**
 * Saturn.js - The Ringed Planet
 * Features: Beautiful ring system, subtle bands, hexagonal polar vortex
 */

class Saturn extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'saturn',
            distance: 1100,
            size: 70,
            color: 0xead6b8,
            orbitSpeed: 0.15,
            rotationSpeed: 1.1, // Very fast rotation
            tilt: 27,
            segments: 96,
            textureResolution: 2048,
            ...config
        });

        this.rings = null;
    }

    drawTextureDetails(ctx, width, height) {
        // Saturn's pale, subtle bands
        const bandColors = [
            '#f5e8d5',
            '#ead6b8',
            '#e5d0b0',
            '#f0dcc5',
            '#dfc9a8',
            '#e8d5be',
            '#eedfc8',
            '#e2cdb5',
        ];

        // Draw subtle horizontal bands
        let y = 0;
        for (let band = 0; band < 25; band++) {
            const bandHeight = 15 + Math.random() * 25;
            const colorIdx = band % bandColors.length;

            ctx.fillStyle = bandColors[colorIdx];
            ctx.fillRect(0, y, width, bandHeight);

            // Subtle variation within bands
            for (let x = 0; x < width; x += 10) {
                const variation = (Math.random() - 0.5) * 10;
                ctx.fillStyle = `rgba(${220 + variation}, ${200 + variation}, ${170 + variation}, 0.3)`;
                ctx.fillRect(x, y, 10, bandHeight);
            }

            y += bandHeight;
        }

        // Atmospheric haze towards poles
        const poleGradient = ctx.createLinearGradient(0, 0, 0, height);
        poleGradient.addColorStop(0, 'rgba(180, 160, 130, 0.4)');
        poleGradient.addColorStop(0.15, 'rgba(220, 200, 170, 0)');
        poleGradient.addColorStop(0.85, 'rgba(220, 200, 170, 0)');
        poleGradient.addColorStop(1, 'rgba(180, 160, 130, 0.4)');
        ctx.fillStyle = poleGradient;
        ctx.fillRect(0, 0, width, height);

        // North polar hexagon (unique to Saturn!)
        ctx.save();
        ctx.translate(width / 2, 40);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const x = Math.cos(angle) * 80;
            const y = Math.sin(angle) * 30; // Perspective compressed
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(160, 140, 100, 0.5)';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.fillStyle = 'rgba(140, 120, 80, 0.2)';
        ctx.fill();
        ctx.restore();

        // Storm systems
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = 100 + Math.random() * (height - 200);
            ctx.beginPath();
            ctx.ellipse(x, y, 10 + Math.random() * 30, 5 + Math.random() * 15, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 250, 240, ${0.1 + Math.random() * 0.15})`;
            ctx.fill();
        }

        // Great White Spot (periodic storm)
        ctx.beginPath();
        ctx.ellipse(width * 0.4, height * 0.35, 50, 25, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 245, 0.25)';
        ctx.fill();
    }

    addSpecialFeatures() {
        // Create Saturn's magnificent ring system
        this.rings = this.createRingSystem();
        this.group.add(this.rings);

        // Add Saturn's major moons
        this.moons = [];

        const mimas = new Mimas();
        mimas.init();
        this.moons.push(mimas);
        this.group.add(mimas.getGroup());

        const enceladus = new Enceladus();
        enceladus.init();
        this.moons.push(enceladus);
        this.group.add(enceladus.getGroup());

        const tethys = new Tethys();
        tethys.init();
        this.moons.push(tethys);
        this.group.add(tethys.getGroup());

        const dione = new Dione();
        dione.init();
        this.moons.push(dione);
        this.group.add(dione.getGroup());

        const rhea = new Rhea();
        rhea.init();
        this.moons.push(rhea);
        this.group.add(rhea.getGroup());

        const titan = new Titan();
        titan.init();
        this.moons.push(titan);
        this.group.add(titan.getGroup());
    }

    updateSpecialFeatures(delta, elapsed) {
        for (const moon of this.moons) {
            moon.update(delta);
        }
    }

    createRingSystem() {
        const ringGroup = new THREE.Group();

        // Saturn has multiple distinct rings: D, C, B, A, F, G, E
        const ringData = [
            { inner: 1.11, outer: 1.24, opacity: 0.15, color: [180, 160, 130] }, // D Ring
            { inner: 1.24, outer: 1.53, opacity: 0.5, color: [200, 180, 150] },  // C Ring
            { inner: 1.53, outer: 1.95, opacity: 0.85, color: [220, 200, 170] }, // B Ring (brightest)
            { inner: 1.95, outer: 2.02, opacity: 0.0, color: [0, 0, 0] },        // Cassini Division
            { inner: 2.02, outer: 2.27, opacity: 0.7, color: [210, 190, 160] },  // A Ring
            { inner: 2.32, outer: 2.35, opacity: 0.3, color: [190, 170, 140] },  // F Ring
        ];

        // Create texture for rings
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Draw ring bands
        const totalWidth = 2.35 - 1.11;
        for (const ring of ringData) {
            const startX = ((ring.inner - 1.11) / totalWidth) * 1024;
            const endX = ((ring.outer - 1.11) / totalWidth) * 1024;
            const width = endX - startX;

            if (ring.opacity > 0) {
                // Ring gradient
                const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
                gradient.addColorStop(0, `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, ${ring.opacity * 0.3})`);
                gradient.addColorStop(0.3, `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, ${ring.opacity})`);
                gradient.addColorStop(0.7, `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, ${ring.opacity})`);
                gradient.addColorStop(1, `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, ${ring.opacity * 0.3})`);

                ctx.fillStyle = gradient;
                ctx.fillRect(startX, 0, width, 64);

                // Add ring detail (gaps and variations)
                for (let x = startX; x < endX; x += 2) {
                    if (Math.random() > 0.7) {
                        const variation = Math.random() * 0.3;
                        ctx.fillStyle = `rgba(${ring.color[0] - 20}, ${ring.color[1] - 20}, ${ring.color[2] - 20}, ${variation})`;
                        ctx.fillRect(x, 0, 1, 64);
                    }
                }
            }
        }

        // Add fine structure (many thin ringlets)
        for (let x = 0; x < 1024; x += 3) {
            if (Math.random() > 0.85) {
                ctx.fillStyle = `rgba(180, 160, 140, ${Math.random() * 0.2})`;
                ctx.fillRect(x, 0, 1, 64);
            }
        }

        const ringTexture = new THREE.CanvasTexture(canvas);
        ringTexture.wrapS = THREE.RepeatWrapping;

        // Create ring geometry
        const innerRadius = this.size * 1.11;
        const outerRadius = this.size * 2.4;
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);

        // Adjust UVs for proper texture mapping
        const pos = ringGeometry.attributes.position;
        const uv = ringGeometry.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const dist = Math.sqrt(x * x + y * y);
            const u = (dist - innerRadius) / (outerRadius - innerRadius);
            uv.setXY(i, u, 0.5);
        }

        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95,
            depthWrite: false
        });

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2;
        ringGroup.add(rings);

        return ringGroup;
    }

    getRoughness() {
        return 0.75;
    }

    getData() {
        return {
            ...super.getData(),
            hasRings: true,
            moons: ['Mimas', 'Enceladus', 'Tethys', 'Dione', 'Rhea', 'Titan']
        };
    }
}

window.Saturn = Saturn;

