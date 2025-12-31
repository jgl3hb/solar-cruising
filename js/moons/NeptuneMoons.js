/**
 * NeptuneMoons.js - Triton (Neptune's largest moon)
 */

class Triton extends BaseMoon {
    constructor(config = {}) {
        super({
            name: 'triton',
            size: 2.5,
            color: 0xd4c4b0,
            orbitRadius: 30,
            orbitSpeed: -1.5, // Retrograde orbit!
            segments: 32,
            textureResolution: 256,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Triton: Retrograde orbit, geysers, cantaloupe terrain

        // Base pinkish-tan
        ctx.fillStyle = '#d0c0ac';
        ctx.fillRect(0, 0, width, height);

        // Cantaloupe terrain (unique dimpled surface)
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.6 + height * 0.2;
            const r = 3 + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${180 + Math.random() * 30}, ${160 + Math.random() * 30}, ${140 + Math.random() * 30}, 0.3)`;
            ctx.fill();
        }

        // South polar cap (nitrogen/methane ice - pinkish)
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 30, 180, 50, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230, 200, 200, 0.6)';
        ctx.fill();

        // Geyser streaks from south pole
        for (let i = 0; i < 15; i++) {
            const startX = width * 0.3 + Math.random() * width * 0.4;
            ctx.beginPath();
            ctx.moveTo(startX, height - 40);
            ctx.lineTo(startX + (Math.random() - 0.5) * 50, height - 80 - Math.random() * 60);
            ctx.strokeStyle = 'rgba(50, 50, 50, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Smooth plains
        ctx.beginPath();
        ctx.ellipse(width * 0.3, height * 0.3, 50, 35, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(210, 200, 185, 0.5)';
        ctx.fill();

        // Craters
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height * 0.7, 2 + Math.random() * 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(160, 150, 140, 0.3)';
            ctx.fill();
        }

        // Cryovolcanic features
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height * 0.5, 5 + Math.random() * 10, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 220, 200, 0.3)';
            ctx.fill();
        }
    }
}

window.Triton = Triton;
