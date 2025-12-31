/**
 * JupiterMoons.js - The Galilean Moons
 * Io, Europa, Ganymede, Callisto
 */

class Io extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'io',
            size: 3,
            color: 0xf4d03f,
            orbitRadius: 30,
            orbitSpeed: 2.5,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Io: Most volcanically active body in solar system
        // Yellow-orange with volcanic spots

        // Base sulfur yellow
        ctx.fillStyle = '#e8c547';
        ctx.fillRect(0, 0, width, height);

        // Sulfur deposits - varied yellows and oranges
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const colors = ['#f4d03f', '#f5b041', '#eb984e', '#e59866', '#d4ac0d'];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillRect(x, y, 4, 4);
        }

        // Volcanic calderas (dark spots)
        const volcanoes = [
            { x: 0.2, y: 0.3, r: 12 },
            { x: 0.5, y: 0.5, r: 15 },
            { x: 0.7, y: 0.2, r: 10 },
            { x: 0.3, y: 0.7, r: 14 },
            { x: 0.8, y: 0.6, r: 11 },
            { x: 0.1, y: 0.5, r: 8 },
        ];

        for (const v of volcanoes) {
            // Dark caldera
            ctx.beginPath();
            ctx.arc(v.x * width, v.y * height, v.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(40, 30, 20, 0.7)';
            ctx.fill();

            // Orange lava ring
            ctx.beginPath();
            ctx.arc(v.x * width, v.y * height, v.r + 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Volcanic plume deposit
            ctx.beginPath();
            ctx.ellipse(v.x * width + 10, v.y * height, v.r * 2, v.r * 1.5, 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 50, 0, 0.2)';
            ctx.fill();
        }

        // White SO2 frost patches
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 8 + Math.random() * 15, 5 + Math.random() * 10, Math.random(), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 240, 0.3)';
            ctx.fill();
        }
    }
}

class Europa extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'europa',
            size: 2.5,
            color: 0xf5f5dc,
            orbitRadius: 45,
            orbitSpeed: 1.8,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Europa: Smooth ice surface with reddish-brown cracks

        // Base ice white
        ctx.fillStyle = '#f8f4e8';
        ctx.fillRect(0, 0, width, height);

        // Subtle ice variation
        for (let i = 0; i < 300; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = `rgba(230, 225, 210, ${0.2 + Math.random() * 0.2})`;
            ctx.fillRect(x, y, 6, 6);
        }

        // Lineae (cracks) - characteristic brown/red lines
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            ctx.moveTo(startX, startY);

            // Multiple segments for irregular cracks
            let x = startX, y = startY;
            for (let j = 0; j < 5; j++) {
                x += (Math.random() - 0.5) * 80;
                y += (Math.random() - 0.5) * 40;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = `rgba(139, 90, 60, ${0.3 + Math.random() * 0.4})`;
            ctx.lineWidth = 1 + Math.random() * 2;
            ctx.stroke();
        }

        // Chaos terrain (disrupted ice)
        for (let i = 0; i < 8; i++) {
            const cx = Math.random() * width;
            const cy = Math.random() * height;
            for (let j = 0; j < 20; j++) {
                ctx.beginPath();
                ctx.arc(cx + (Math.random() - 0.5) * 30, cy + (Math.random() - 0.5) * 30, 2 + Math.random() * 5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 140, 100, ${0.2 + Math.random() * 0.2})`;
                ctx.fill();
            }
        }

        // Subtle blue tint in some areas (fresh ice)
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, 15 + Math.random() * 25, 10 + Math.random() * 15, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 220, 255, 0.15)';
            ctx.fill();
        }
    }
}

class Ganymede extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'ganymede',
            size: 4,
            color: 0xc0b8a8,
            orbitRadius: 65,
            orbitSpeed: 1.2,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Ganymede: Largest moon, mix of dark and light terrain

        // Base grayish-brown
        ctx.fillStyle = '#b8b0a0';
        ctx.fillRect(0, 0, width, height);

        // Dark terrain (older, heavily cratered)
        const darkRegions = [
            { x: 0.2, y: 0.3, rx: 60, ry: 40 },
            { x: 0.7, y: 0.6, rx: 50, ry: 35 },
            { x: 0.4, y: 0.8, rx: 45, ry: 30 },
        ];

        for (const r of darkRegions) {
            ctx.beginPath();
            ctx.ellipse(r.x * width, r.y * height, r.rx, r.ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(80, 70, 60, 0.5)';
            ctx.fill();
        }

        // Light terrain (grooved terrain)
        for (let i = 0; i < 30; i++) {
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y + (Math.random() - 0.5) * 20);
            ctx.strokeStyle = 'rgba(200, 195, 185, 0.4)';
            ctx.lineWidth = 3 + Math.random() * 5;
            ctx.stroke();
        }

        // Impact craters
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 2 + Math.random() * 10;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(90, 85, 75, 0.4)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(180, 175, 165, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Bright ray craters
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(230, 225, 215, 0.6)';
            ctx.fill();
        }
    }
}

class Callisto extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'callisto',
            size: 3.8,
            color: 0x8b8378,
            orbitRadius: 90,
            orbitSpeed: 0.8,
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Callisto: Most heavily cratered object in solar system

        // Base dark gray-brown
        ctx.fillStyle = '#7a746a';
        ctx.fillRect(0, 0, width, height);

        // Surface variation
        for (let i = 0; i < 400; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const v = Math.random() * 20 - 10;
            ctx.fillStyle = `rgb(${122 + v}, ${116 + v}, ${106 + v})`;
            ctx.fillRect(x, y, 4, 4);
        }

        // LOTS of craters - ancient surface
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 2 + Math.random() * 15;

            // Crater depression
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(60, 55, 50, ${0.3 + Math.random() * 0.3})`;
            ctx.fill();

            // Bright rim
            ctx.strokeStyle = `rgba(180, 175, 165, ${0.2 + Math.random() * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Valhalla multi-ring impact basin
        const vx = width * 0.4, vy = height * 0.4;
        for (let r = 80; r > 10; r -= 12) {
            ctx.beginPath();
            ctx.arc(vx, vy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(150, 145, 135, ${0.15 + (80 - r) / 200})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(vx, vy, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 195, 185, 0.5)';
        ctx.fill();

        // Bright spots (fresh ice)
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 2 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220, 215, 205, 0.4)';
            ctx.fill();
        }
    }
}

window.Io = Io;
window.Europa = Europa;
window.Ganymede = Ganymede;
window.Callisto = Callisto;
