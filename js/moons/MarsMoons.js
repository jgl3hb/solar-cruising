/**
 * MarsMoons.js - Phobos and Deimos
 * Mars's two small, irregularly shaped moons
 */

class Phobos extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'phobos',
            size: 0.8,
            color: 0x8b7355,
            orbitRadius: 6,
            orbitSpeed: 3,
            segments: 24,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        const baseR = 139, baseG = 115, baseB = 85;

        // Irregular, potato-shaped appearance via texture
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgb(${baseR + v}, ${baseG + v}, ${baseB + v})`;
            ctx.fillRect(x, y, 4, 4);
        }

        // Stickney crater (large crater)
        ctx.beginPath();
        ctx.arc(width * 0.3, height * 0.4, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(60, 50, 40, 0.5)';
        ctx.fill();

        // More craters
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 2 + Math.random() * 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 30}, ${baseG - 25}, ${baseB - 20}, 0.4)`;
            ctx.fill();
        }
    }
}

class Deimos extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'deimos',
            size: 0.5,
            color: 0x9e8b6e,
            orbitRadius: 10,
            orbitSpeed: 1.5,
            segments: 20,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        const baseR = 158, baseG = 139, baseB = 110;

        for (let i = 0; i < 80; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const v = Math.random() * 25 - 12;
            ctx.fillStyle = `rgb(${baseR + v}, ${baseG + v}, ${baseB + v})`;
            ctx.fillRect(x, y, 3, 3);
        }

        // Smoother surface than Phobos
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 2 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 20}, ${baseG - 18}, ${baseB - 15}, 0.3)`;
            ctx.fill();
        }
    }
}

window.Phobos = Phobos;
window.Deimos = Deimos;
