/**
 * Ceres.js - Dwarf Planet in the Asteroid Belt
 * Features: Largest object in asteroid belt, bright spots (Occator crater)
 */

class Ceres extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'ceres',
            distance: 660, // Between Mars and Jupiter (in asteroid belt)
            size: 5,
            color: 0x8a8a8a,
            orbitSpeed: 0.35,
            rotationSpeed: 0.5,
            tilt: 4,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        const baseR = 138, baseG = 138, baseB = 138;

        // Base gray surface
        ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
        ctx.fillRect(0, 0, width, height);

        // Surface variation
        for (let i = 0; i < 800; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgb(${baseR + v}, ${baseG + v}, ${baseB + v})`;
            ctx.fillRect(x, y, 3, 3);
        }

        // Craters
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 2 + Math.random() * 10;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 25}, ${baseG - 25}, ${baseB - 25}, 0.4)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${baseR + 15}, ${baseG + 15}, ${baseB + 15}, 0.3)`;
            ctx.stroke();
        }

        // Occator Crater with bright spots (Cerealia Facula)
        const occatorX = width * 0.4, occatorY = height * 0.35;
        ctx.beginPath();
        ctx.arc(occatorX, occatorY, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.fill();

        // Bright salt deposits!
        ctx.beginPath();
        ctx.arc(occatorX, occatorY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(occatorX + 8, occatorY + 3, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();

        // Ahuna Mons (cryovolcano)
        ctx.beginPath();
        ctx.arc(width * 0.7, height * 0.6, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.fill();
    }

    getRoughness() {
        return 0.9;
    }

    getData() {
        return {
            ...super.getData(),
            type: 'dwarf planet',
            feature: 'Occator bright spots'
        };
    }
}

window.Ceres = Ceres;
