/**
 * PlutoMoons.js - Charon and smaller moons
 */

class Charon extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'charon',
            size: 4, // Half the size of Pluto - binary system!
            color: 0xa0a0a0,
            orbitRadius: 12,
            orbitSpeed: 0.5,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Charon: Gray with reddish north pole

        // Base gray
        ctx.fillStyle = '#989898';
        ctx.fillRect(0, 0, width, height);

        // Surface variation
        for (let i = 0; i < 300; i++) {
            const v = Math.random() * 25 - 12;
            ctx.fillStyle = `rgb(${152 + v}, ${152 + v}, ${152 + v})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 4, 4);
        }

        // Mordor Macula (dark red north polar region)
        ctx.beginPath();
        ctx.ellipse(width / 2, 25, 120, 35, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 50, 40, 0.5)';
        ctx.fill();

        // Serenity Chasma (large canyon)
        ctx.beginPath();
        ctx.moveTo(0, height * 0.4);
        ctx.bezierCurveTo(width * 0.3, height * 0.45, width * 0.7, height * 0.35, width, height * 0.4);
        ctx.strokeStyle = 'rgba(60, 60, 60, 0.6)';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Vulcan Planum (smooth plain)
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.65, 70, 50, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(170, 170, 170, 0.4)';
        ctx.fill();

        // Craters
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 2 + Math.random() * 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(120, 120, 120, 0.3)';
            ctx.fill();
        }

        // Mountain range
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.arc(width * 0.3 + i * 15, height * 0.55, 5 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(180, 180, 180, 0.4)';
            ctx.fill();
        }
    }
}

// Small outer moons
class Nix extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'nix',
            size: 0.3,
            color: 0xc0c0c0,
            orbitRadius: 25,
            orbitSpeed: 0.3,
            segments: 16,
            textureResolution: 64,
            ...config
        });
    }
}

class Hydra extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'hydra',
            size: 0.35,
            color: 0xb8b8b8,
            orbitRadius: 35,
            orbitSpeed: 0.25,
            segments: 16,
            textureResolution: 64,
            ...config
        });
    }
}

class Kerberos extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'kerberos',
            size: 0.15,
            color: 0xa0a0a0,
            orbitRadius: 30,
            orbitSpeed: 0.28,
            segments: 12,
            textureResolution: 32,
            ...config
        });
    }
}

class Styx extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'styx',
            size: 0.1,
            color: 0x909090,
            orbitRadius: 22,
            orbitSpeed: 0.35,
            segments: 12,
            textureResolution: 32,
            ...config
        });
    }
}

window.Charon = Charon;
window.Nix = Nix;
window.Hydra = Hydra;
window.Kerberos = Kerberos;
window.Styx = Styx;
