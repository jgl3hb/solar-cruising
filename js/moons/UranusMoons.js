/**
 * UranusMoons.js - Major moons of Uranus
 * Miranda, Ariel, Umbriel, Titania, Oberon
 */

class Miranda extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'miranda',
            size: 0.8,
            color: 0xc0c0c0,
            orbitRadius: 15,
            orbitSpeed: 2.5,
            segments: 24,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Miranda: Most geologically diverse body, "Frankenstein moon"
        ctx.fillStyle = '#b8b8b8';
        ctx.fillRect(0, 0, width, height);

        // Coronae (unique ridged terrain)
        const coronae = [
            { x: 0.3, y: 0.4, r: 25 },
            { x: 0.7, y: 0.3, r: 20 },
            { x: 0.5, y: 0.7, r: 22 },
        ];

        for (const c of coronae) {
            // Concentric ridges
            for (let r = c.r; r > 5; r -= 4) {
                ctx.beginPath();
                ctx.arc(c.x * width, c.y * height, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(100, 100, 100, ${0.3 + (c.r - r) / c.r * 0.3})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Verona Rupes (tallest cliff in solar system)
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.5);
        ctx.lineTo(width * 0.4, height * 0.55);
        ctx.strokeStyle = 'rgba(60, 60, 60, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Fractures
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.strokeStyle = 'rgba(80, 80, 80, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Craters
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(90, 90, 90, 0.3)';
            ctx.fill();
        }
    }
}

class Ariel extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'ariel',
            size: 1.2,
            color: 0xd0d0d0,
            orbitRadius: 25,
            orbitSpeed: 2,
            segments: 28,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Ariel: Brightest Uranian moon, extensive valleys
        ctx.fillStyle = '#c8c8c8';
        ctx.fillRect(0, 0, width, height);

        // Rift valleys
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, 0);
            ctx.bezierCurveTo(
                Math.random() * width, height * 0.3,
                Math.random() * width, height * 0.7,
                Math.random() * width, height
            );
            ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Smooth plains (resurfaced)
        ctx.beginPath();
        ctx.ellipse(width * 0.6, height * 0.5, 40, 30, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 220, 220, 0.4)';
        ctx.fill();

        // Craters
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
            ctx.fill();
        }
    }
}

class Umbriel extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'umbriel',
            size: 1.2,
            color: 0x707070,
            orbitRadius: 35,
            orbitSpeed: 1.7,
            segments: 28,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Umbriel: Darkest Uranian moon
        ctx.fillStyle = '#606060';
        ctx.fillRect(0, 0, width, height);

        // Surface variation
        for (let i = 0; i < 200; i++) {
            const v = Math.random() * 20 - 10;
            ctx.fillStyle = `rgb(${96 + v}, ${96 + v}, ${96 + v})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 4, 4);
        }

        // Wunda crater (bright ring)
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.15, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Craters
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(50, 50, 50, 0.3)';
            ctx.fill();
        }
    }
}

class Titania extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'titania',
            size: 1.6,
            color: 0xb8b8b8,
            orbitRadius: 50,
            orbitSpeed: 1.3,
            segments: 32,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Titania: Largest Uranian moon
        ctx.fillStyle = '#b0b0b0';
        ctx.fillRect(0, 0, width, height);

        // Messina Chasmata (large rift)
        ctx.beginPath();
        ctx.moveTo(0, height * 0.4);
        ctx.bezierCurveTo(width * 0.3, height * 0.45, width * 0.7, height * 0.35, width, height * 0.4);
        ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Craters
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 2 + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140, 140, 140, 0.3)';
            ctx.fill();
        }

        // Bright deposits
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 3 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
            ctx.fill();
        }
    }
}

class Oberon extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'oberon',
            size: 1.5,
            color: 0xa0a0a0,
            orbitRadius: 65,
            orbitSpeed: 1,
            segments: 32,
            textureResolution: 128,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Oberon: Heavily cratered, dark spots
        ctx.fillStyle = '#989898';
        ctx.fillRect(0, 0, width, height);

        // Dark spots on crater floors
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 8 + Math.random() * 12, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(40, 40, 40, 0.4)';
            ctx.fill();
        }

        // Craters
        for (let i = 0; i < 70; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 7, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(120, 120, 120, 0.3)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.2)';
            ctx.stroke();
        }

        // Mountain (possibly 6km high)
        ctx.beginPath();
        ctx.arc(width * 0.7, height * 0.6, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 180, 180, 0.5)';
        ctx.fill();
    }
}

window.Miranda = Miranda;
window.Ariel = Ariel;
window.Umbriel = Umbriel;
window.Titania = Titania;
window.Oberon = Oberon;
