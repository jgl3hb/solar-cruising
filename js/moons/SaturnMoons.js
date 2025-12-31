/**
 * SaturnMoons.js - Major moons of Saturn
 * Mimas, Enceladus, Tethys, Dione, Rhea, Titan
 */

class Mimas extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'mimas',
            size: 0.8,
            color: 0xe8e8e8,
            orbitRadius: 25,
            orbitSpeed: 3,
            segments: 24,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Mimas: "Death Star" moon with giant Herschel crater
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, width, height);

        // Surface texture
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(${200 + Math.random() * 30}, ${200 + Math.random() * 30}, ${200 + Math.random() * 30}, 0.5)`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 3, 3);
        }

        // Herschel crater - 1/3 of moon's diameter!
        const hx = width * 0.35, hy = height * 0.45;
        ctx.beginPath();
        ctx.arc(hx, hy, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.fill();
        // Central peak
        ctx.beginPath();
        ctx.arc(hx, hy, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 180, 180, 0.6)';
        ctx.fill();
        // Rim
        ctx.beginPath();
        ctx.arc(hx, hy, 25, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220, 220, 220, 0.7)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Other craters
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140, 140, 140, 0.3)';
            ctx.fill();
        }
    }
}

class Enceladus extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'enceladus',
            size: 1,
            color: 0xffffff,
            orbitRadius: 35,
            orbitSpeed: 2.5,
            segments: 28,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Enceladus: Brightest object in solar system, ice geysers
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Subtle blue tint in fresh ice areas
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 15 + Math.random() * 20, 10, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220, 235, 255, 0.3)';
            ctx.fill();
        }

        // Tiger stripes at south pole (bottom of texture)
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(width * 0.2 + i * 40, height - 30);
            ctx.bezierCurveTo(
                width * 0.3 + i * 40, height - 15,
                width * 0.4 + i * 40, height - 20,
                width * 0.5 + i * 40, height - 10
            );
            ctx.strokeStyle = 'rgba(100, 180, 220, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Smooth plains
        ctx.beginPath();
        ctx.ellipse(width * 0.6, height * 0.4, 40, 30, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 250, 255, 0.5)';
        ctx.fill();

        // Few craters (young surface)
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height * 0.7, 1 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 200, 210, 0.3)';
            ctx.fill();
        }
    }
}

class Tethys extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'tethys',
            size: 1.5,
            color: 0xf0f0f0,
            orbitRadius: 45,
            orbitSpeed: 2,
            segments: 28,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(0, 0, width, height);

        // Odysseus crater
        ctx.beginPath();
        ctx.arc(width * 0.3, height * 0.4, 30, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 180, 180, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(220, 220, 220, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ithaca Chasma (giant canyon)
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.2);
        ctx.bezierCurveTo(width * 0.3, height * 0.5, width * 0.5, height * 0.6, width * 0.7, height * 0.8);
        ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Craters
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(170, 170, 170, 0.3)';
            ctx.fill();
        }
    }
}

class Dione extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'dione',
            size: 1.6,
            color: 0xe5e5e5,
            orbitRadius: 55,
            orbitSpeed: 1.8,
            segments: 28,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, width, height);

        // Bright wispy terrain (ice cliffs)
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            const y = Math.random() * height;
            ctx.moveTo(0, y);
            for (let x = 0; x < width; x += 20) {
                ctx.lineTo(x, y + (Math.random() - 0.5) * 15);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Craters
        for (let i = 0; i < 60; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(160, 160, 160, 0.3)';
            ctx.fill();
        }
    }
}

class Rhea extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'rhea',
            size: 2,
            color: 0xd8d8d8,
            orbitRadius: 70,
            orbitSpeed: 1.5,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        ctx.fillStyle = '#d5d5d5';
        ctx.fillRect(0, 0, width, height);

        // Heavily cratered
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 2 + Math.random() * 10;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
            ctx.stroke();
        }

        // Bright streaks
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.strokeStyle = 'rgba(240, 240, 240, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

class Titan extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'titan',
            size: 4,
            color: 0xd4a574,
            orbitRadius: 100,
            orbitSpeed: 1,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Titan: Thick orange atmosphere, only moon with dense atmosphere

        // Base orange haze
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#c49058');
        gradient.addColorStop(0.5, '#d4a574');
        gradient.addColorStop(1, '#c49058');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Atmospheric bands
        for (let y = 0; y < height; y += 15) {
            ctx.fillStyle = `rgba(180, 140, 100, ${0.1 + Math.random() * 0.15})`;
            ctx.fillRect(0, y, width, 10);
        }

        // Haze layers
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 30 + Math.random() * 50, 10 + Math.random() * 20, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 180, 140, ${0.05 + Math.random() * 0.1})`;
            ctx.fill();
        }

        // Darker polar regions
        ctx.fillStyle = 'rgba(100, 80, 60, 0.3)';
        ctx.beginPath();
        ctx.ellipse(width / 2, 20, 150, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 20, 150, 30, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.Mimas = Mimas;
window.Enceladus = Enceladus;
window.Tethys = Tethys;
window.Dione = Dione;
window.Rhea = Rhea;
window.Titan = Titan;
