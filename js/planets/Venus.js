/**
 * Venus.js - Earth's "sister planet"
 * Features: Thick swirled atmosphere, hellish surface hidden beneath clouds
 */

class Venus extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'venus',
            distance: 250,
            size: 20,
            color: 0xe8b86d,
            orbitSpeed: 0.6,
            rotationSpeed: -0.1, // Retrograde rotation!
            tilt: 177.4,
            segments: 64,
            textureResolution: 1024,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        const color = new THREE.Color(this.color);
        const baseR = Math.floor(color.r * 255);
        const baseG = Math.floor(color.g * 255);
        const baseB = Math.floor(color.b * 255);

        // Base atmosphere gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `rgb(${baseR + 30}, ${baseG + 20}, ${baseB})`);
        gradient.addColorStop(0.5, `rgb(${baseR}, ${baseG}, ${baseB})`);
        gradient.addColorStop(1, `rgb(${baseR - 20}, ${baseG - 15}, ${baseB - 10})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Horizontal cloud bands
        for (let y = 0; y < height; y += 4) {
            const wave = Math.sin(y * 0.015) * 20;
            const alpha = 0.15 + Math.random() * 0.1;
            ctx.fillStyle = `rgba(${baseR + 30}, ${baseG + 20}, ${baseB}, ${alpha})`;
            ctx.fillRect(wave, y, width, 3);
        }

        // Superrotating atmosphere - V-shaped cloud pattern
        for (let i = 0; i < 20; i++) {
            const startY = Math.random() * height;
            ctx.beginPath();
            ctx.moveTo(0, startY);
            // V-shape pointing in direction of superrotation
            ctx.bezierCurveTo(
                width * 0.3, startY - 30 - Math.random() * 20,
                width * 0.7, startY + 30 + Math.random() * 20,
                width, startY
            );
            ctx.strokeStyle = `rgba(255, 230, 180, ${0.2 + Math.random() * 0.2})`;
            ctx.lineWidth = 10 + Math.random() * 20;
            ctx.stroke();
        }

        // Large atmospheric swirls and vortices
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const rx = 40 + Math.random() * 80;
            const ry = 15 + Math.random() * 30;
            const rotation = Math.random() * Math.PI;

            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 210, ${0.08 + Math.random() * 0.12})`;
            ctx.fill();
        }

        // Polar vortex features
        ctx.beginPath();
        ctx.ellipse(width / 2, 30, 200, 25, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 160, 100, 0.3)';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(width / 2, height - 30, 180, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 160, 100, 0.3)';
        ctx.fill();

        // Subtle dark spots (UV-absorbing regions)
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 10 + Math.random() * 30, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 40}, ${baseG - 30}, ${baseB - 20}, 0.15)`;
            ctx.fill();
        }
    }

    getRoughness() {
        return 0.7; // Smooth cloud tops
    }
}

window.Venus = Venus;
