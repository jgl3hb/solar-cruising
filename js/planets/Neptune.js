/**
 * Neptune.js - The Windiest Planet
 * Features: Deep blue color, Great Dark Spot, supersonic winds
 */

class Neptune extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'neptune',
            distance: 1800,
            size: 42,
            color: 0x2e86de,
            orbitSpeed: 0.08,
            rotationSpeed: 0.6,
            tilt: 28,
            segments: 64,
            textureResolution: 1024,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Deep blue gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a5276');
        gradient.addColorStop(0.3, '#2874a6');
        gradient.addColorStop(0.5, '#2e86de');
        gradient.addColorStop(0.7, '#2874a6');
        gradient.addColorStop(1, '#1a5276');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Cloud bands
        for (let y = 0; y < height; y += 25) {
            ctx.fillStyle = `rgba(100, 160, 220, ${0.1 + Math.random() * 0.15})`;
            ctx.fillRect(0, y, width, 12 + Math.random() * 15);
        }

        // Streaky high-altitude clouds
        for (let i = 0; i < 40; i++) {
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(width * 0.3, y - 10, width * 0.7, y + 10, width, y);
            ctx.strokeStyle = `rgba(200, 220, 255, ${0.1 + Math.random() * 0.15})`;
            ctx.lineWidth = 3 + Math.random() * 8;
            ctx.stroke();
        }

        // Great Dark Spot
        const spotX = width * 0.35, spotY = height * 0.4;
        ctx.beginPath();
        ctx.ellipse(spotX, spotY, 60, 35, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 50, 100, 0.5)';
        ctx.fill();

        // Companion bright clouds
        ctx.beginPath();
        ctx.ellipse(spotX + 70, spotY - 20, 30, 15, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 220, 255, 0.4)';
        ctx.fill();

        // Scooter (fast-moving cloud)
        ctx.beginPath();
        ctx.ellipse(width * 0.7, height * 0.55, 25, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 240, 255, 0.35)';
        ctx.fill();
    }

    getRoughness() { return 0.65; }

    addSpecialFeatures() {
        this.moons = [];

        const triton = new Triton();
        triton.init();
        this.moons.push(triton);
        this.group.add(triton.getGroup());
    }

    updateSpecialFeatures(delta, elapsed) {
        for (const moon of this.moons) {
            moon.update(delta);
        }
    }

    getData() {
        return {
            ...super.getData(),
            moons: ['Triton']
        };
    }
}

window.Neptune = Neptune;
