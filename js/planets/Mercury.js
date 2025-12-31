/**
 * Mercury.js - The smallest planet, closest to the Sun
 * Features: Heavily cratered gray surface
 */

class Mercury extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'mercury',
            distance: 150,
            size: 12,
            color: 0x9e9e9e,
            orbitSpeed: 0.8,
            rotationSpeed: 0.3,
            tilt: 0.03,
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

        // Surface variation
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const variation = Math.random() * 20 - 10;
            ctx.fillStyle = `rgb(${baseR + variation}, ${baseG + variation}, ${baseB + variation})`;
            ctx.fillRect(x, y, 4, 4);
        }

        // Heavily cratered surface - lots of impact craters
        for (let i = 0; i < 600; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = 2 + Math.random() * 25;
            const darkness = Math.floor(Math.random() * 50);

            // Crater depression
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness})`;
            ctx.fill();

            // Crater rim highlight
            ctx.strokeStyle = `rgb(${Math.min(255, baseR + 25)}, ${Math.min(255, baseG + 25)}, ${Math.min(255, baseB + 25)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Central peak for larger craters
            if (radius > 15) {
                ctx.beginPath();
                ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${baseR + 10}, ${baseG + 10}, ${baseB + 10})`;
                ctx.fill();
            }
        }

        // Caloris Basin - large impact feature
        ctx.beginPath();
        ctx.arc(width * 0.3, height * 0.4, 80, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseR - 30}, ${baseG - 30}, ${baseB - 30}, 0.6)`;
        ctx.fill();
        ctx.strokeStyle = `rgb(${baseR + 15}, ${baseG + 15}, ${baseB + 15})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Scarps (cliff lines from planetary cooling)
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.bezierCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height
            );
            ctx.strokeStyle = `rgba(${baseR - 20}, ${baseG - 20}, ${baseB - 20}, 0.5)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    getRoughness() {
        return 0.95; // Very rough, no atmosphere
    }
}

window.Mercury = Mercury;
