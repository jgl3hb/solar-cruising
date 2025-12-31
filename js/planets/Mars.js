/**
 * Mars.js - The Red Planet
 * Features: Rust-colored surface, Olympus Mons, Valles Marineris, polar ice caps
 */

class Mars extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'mars',
            distance: 520,
            size: 16,
            color: 0xc1440e,
            orbitSpeed: 0.4,
            rotationSpeed: 0.48, // Similar to Earth
            tilt: 25,
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

        // Base gradient - darker at poles
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `rgb(${baseR - 30}, ${baseG - 20}, ${baseB})`);
        gradient.addColorStop(0.2, `rgb(${baseR}, ${baseG}, ${baseB})`);
        gradient.addColorStop(0.8, `rgb(${baseR}, ${baseG}, ${baseB})`);
        gradient.addColorStop(1, `rgb(${baseR - 30}, ${baseG - 20}, ${baseB})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Surface variation - dusty terrain
        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const variation = Math.random() * 60 - 30;
            ctx.fillStyle = `rgb(${Math.min(255, baseR + variation)}, ${Math.max(0, baseG + variation / 2)}, ${baseB})`;
            ctx.fillRect(x, y, 5, 5);
        }

        // Dark regions (ancient lava plains)
        const darkRegions = [
            { x: 600, y: 200, rx: 150, ry: 80 },
            { x: 300, y: 280, rx: 100, ry: 60 },
            { x: 800, y: 300, rx: 80, ry: 50 },
        ];
        for (const region of darkRegions) {
            ctx.beginPath();
            ctx.ellipse(region.x, region.y, region.rx, region.ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 50, 30, 0.3)';
            ctx.fill();
        }

        // Olympus Mons - largest volcano in solar system
        const olympusX = 180, olympusY = 150;
        // Outer caldera
        ctx.beginPath();
        ctx.arc(olympusX, olympusY, 70, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 100, 60, 0.5)';
        ctx.fill();
        // Inner caldera
        ctx.beginPath();
        ctx.arc(olympusX, olympusY, 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(140, 70, 40, 0.6)';
        ctx.fill();
        // Summit crater
        ctx.beginPath();
        ctx.arc(olympusX, olympusY, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(80, 40, 20, 0.7)';
        ctx.fill();

        // Tharsis volcanoes
        const tharsisVolcanoes = [
            { x: 250, y: 200, r: 30 },
            { x: 280, y: 250, r: 25 },
            { x: 230, y: 280, r: 28 },
        ];
        for (const v of tharsisVolcanoes) {
            ctx.beginPath();
            ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(160, 90, 50, 0.5)';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(v.x, v.y, v.r * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 50, 30, 0.6)';
            ctx.fill();
        }

        // Valles Marineris - massive canyon system
        ctx.strokeStyle = 'rgba(80, 30, 10, 0.7)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(350, height / 2);
        ctx.bezierCurveTo(
            450, height / 2 - 15,
            600, height / 2 + 10,
            800, height / 2 - 5
        );
        ctx.stroke();
        // Canyon shadow
        ctx.strokeStyle = 'rgba(50, 20, 5, 0.5)';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Impact craters
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 3 + Math.random() * 20;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 40}, ${baseG - 25}, ${baseB}, 0.4)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${baseR + 20}, ${baseG + 10}, ${baseB}, 0.3)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // North polar ice cap
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(width / 2, 20, 250, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        // Layered terrain near pole
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.ellipse(width / 2, 40 + i * 10, 200 - i * 30, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 230, ${0.3 - i * 0.05})`;
            ctx.fill();
        }

        // South polar ice cap (smaller)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 25, 150, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dust storm (seasonal)
        ctx.beginPath();
        ctx.ellipse(500, 350, 80, 40, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 150, 100, 0.25)';
        ctx.fill();
    }

    getRoughness() {
        return 0.9; // Dusty, rough surface
    }
}

window.Mars = Mars;
