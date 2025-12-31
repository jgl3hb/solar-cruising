/**
 * Earth.js - Our home planet
 * Features: Oceans, continents, ice caps, clouds, and the Moon
 */

class Earth extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'earth',
            distance: 380,
            size: 22,
            color: 0x4a90d9,
            orbitSpeed: 0.5,
            rotationSpeed: 0.5,
            tilt: 23.5,
            segments: 64,
            textureResolution: 2048, // Higher res for our home planet
            ...config
        });

        this.moon = null;
        this.moonOrbitAngle = 0;
    }

    drawTextureDetails(ctx, width, height) {
        // Ocean base with depth variation
        const oceanGradient = ctx.createLinearGradient(0, 0, 0, height);
        oceanGradient.addColorStop(0, '#1a5276');
        oceanGradient.addColorStop(0.3, '#2874a6');
        oceanGradient.addColorStop(0.5, '#3498db');
        oceanGradient.addColorStop(0.7, '#2874a6');
        oceanGradient.addColorStop(1, '#1a5276');
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, width, height);

        // Deep ocean texture variation
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = `rgba(0, ${30 + Math.random() * 50}, ${80 + Math.random() * 60}, 0.25)`;
            ctx.fillRect(x, y, 10, 6);
        }

        // Continents with realistic shapes and coloring
        const continents = [
            // North America
            { points: [[150, 80], [280, 70], [300, 150], [280, 200], [200, 220], [150, 200], [120, 150]], color: '#2d5a27' },
            // South America
            { points: [[250, 240], [300, 250], [310, 350], [280, 420], [240, 400], [230, 300]], color: '#1e7b1e' },
            // Europe
            { points: [[480, 80], [580, 70], [600, 120], [550, 150], [480, 140]], color: '#3d6b35' },
            // Africa
            { points: [[480, 160], [580, 150], [620, 200], [600, 340], [540, 380], [480, 350], [460, 250]], color: '#8b7355' },
            // Asia
            { points: [[580, 60], [800, 50], [900, 100], [880, 200], [750, 220], [650, 180], [600, 120]], color: '#4a7c3f' },
            // Australia
            { points: [[780, 320], [880, 310], [900, 380], [860, 420], [780, 400]], color: '#c4a35a' },
            // Antarctica (partial)
            { points: [[0, 470], [300, 480], [600, 475], [900, 480], [width, 470], [width, height], [0, height]], color: '#f0f8ff' }
        ];

        for (const cont of continents) {
            ctx.beginPath();
            ctx.moveTo(cont.points[0][0], cont.points[0][1]);
            for (let i = 1; i < cont.points.length; i++) {
                ctx.lineTo(cont.points[i][0], cont.points[i][1]);
            }
            ctx.closePath();
            ctx.fillStyle = cont.color;
            ctx.fill();

            // Add terrain variation within continents
            ctx.save();
            ctx.clip();
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                ctx.beginPath();
                ctx.arc(x, y, 3 + Math.random() * 10, 0, Math.PI * 2);
                const shade = Math.random() > 0.5 ? 20 : -20;
                ctx.fillStyle = `rgba(${shade > 0 ? 255 : 0}, ${shade > 0 ? 255 : 0}, ${shade > 0 ? 255 : 0}, 0.15)`;
                ctx.fill();
            }
            ctx.restore();
        }

        // Mountain ranges
        const mountains = [
            { x: 200, y: 130, w: 80, h: 30 },  // Rockies
            { x: 260, y: 320, w: 20, h: 100 }, // Andes
            { x: 500, y: 100, w: 40, h: 20 },  // Alps
            { x: 700, y: 120, w: 120, h: 40 }, // Himalayas
        ];

        for (const m of mountains) {
            for (let i = 0; i < 30; i++) {
                ctx.beginPath();
                ctx.arc(m.x + Math.random() * m.w, m.y + Math.random() * m.h, 3 + Math.random() * 8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 119, 101, ${0.4 + Math.random() * 0.3})`;
                ctx.fill();
            }
        }

        // Arctic ice cap
        ctx.fillStyle = 'rgba(240, 248, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(width / 2, 15, 300, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cloud layer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * width;
            const y = 50 + Math.random() * (height - 100);
            ctx.beginPath();
            ctx.ellipse(x, y, 25 + Math.random() * 80, 12 + Math.random() * 30, Math.random() * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Hurricane/cyclone
        ctx.beginPath();
        ctx.arc(350, 280, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }

    addSpecialFeatures() {
        // Add the Moon
        const moonGroup = new THREE.Group();

        const moonGeometry = new THREE.SphereGeometry(3, 32, 32);

        // Create moon texture
        const moonCanvas = document.createElement('canvas');
        moonCanvas.width = 512;
        moonCanvas.height = 256;
        const ctx = moonCanvas.getContext('2d');

        // Base gray
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(0, 0, 512, 256);

        // Craters
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 256;
            const r = 2 + Math.random() * 15;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(80, 80, 80, ${0.3 + Math.random() * 0.3})`;
            ctx.fill();
        }

        // Maria (dark plains)
        const maria = [
            { x: 150, y: 100, r: 60 },
            { x: 300, y: 130, r: 50 },
            { x: 400, y: 80, r: 40 },
        ];
        for (const m of maria) {
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(70, 70, 75, 0.4)';
            ctx.fill();
        }

        const moonTexture = new THREE.CanvasTexture(moonCanvas);
        const moonMaterial = new THREE.MeshStandardMaterial({
            map: moonTexture,
            roughness: 0.9
        });

        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.x = 18;
        moonGroup.add(moon);

        this.moon = moonGroup;
        this.group.add(moonGroup);
    }

    updateSpecialFeatures(delta, elapsed) {
        if (this.moon) {
            this.moonOrbitAngle += delta * 2;
            this.moon.rotation.y = this.moonOrbitAngle;
        }
    }

    getRoughness() {
        return 0.6; // Mix of water and land
    }

    getData() {
        return {
            ...super.getData(),
            hasMoon: true,
            atmosphere: true
        };
    }
}

window.Earth = Earth;
