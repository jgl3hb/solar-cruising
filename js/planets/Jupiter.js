/**
 * Jupiter.js - The King of Planets
 * Features: Turbulent bands, Great Red Spot, massive storms
 */

class Jupiter extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'jupiter',
            distance: 800,
            size: 80,
            color: 0xc4a35a,
            orbitSpeed: 0.2,
            rotationSpeed: 1.2, // Fastest rotation in solar system
            tilt: 3,
            segments: 96, // Higher detail for the gas giant
            textureResolution: 2048,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        // Jupiter's distinctive banded appearance
        const bandColors = [
            { color: '#f5e6d3', height: 0.04 },  // Equatorial zone
            { color: '#d4a574', height: 0.06 },  // North Equatorial Belt
            { color: '#e8d5be', height: 0.05 },  // North Tropical Zone
            { color: '#c49456', height: 0.07 },  // North Temperate Belt
            { color: '#ddc896', height: 0.04 },  // North Temperate Zone
            { color: '#b89956', height: 0.06 },  // N.N. Temperate Belt
            { color: '#e8dbc4', height: 0.05 },  // N.N. Temperate Zone
            { color: '#a0805a', height: 0.04 },  // N. Polar Region
            { color: '#8b7355', height: 0.09 },  // North Polar
        ];

        // Draw bands from equator to poles (mirrored)
        let y = height / 2;

        // Draw from middle to top
        for (let i = 0; i < bandColors.length; i++) {
            const bandHeight = bandColors[i].height * height;
            ctx.fillStyle = bandColors[i].color;
            ctx.fillRect(0, y - bandHeight, width, bandHeight);

            // Add turbulence to band edges
            for (let x = 0; x < width; x += 3) {
                const wave = Math.sin(x * 0.02 + i * 2) * (bandHeight * 0.15);
                const nextColor = bandColors[Math.min(i + 1, bandColors.length - 1)].color;
                ctx.fillStyle = nextColor;
                ctx.fillRect(x, y - bandHeight + wave, 4, 3);
            }

            y -= bandHeight;
        }

        // Mirror for southern hemisphere
        y = height / 2;
        for (let i = 0; i < bandColors.length; i++) {
            const bandHeight = bandColors[i].height * height;
            ctx.fillStyle = bandColors[i].color;
            ctx.fillRect(0, y, width, bandHeight);

            for (let x = 0; x < width; x += 3) {
                const wave = Math.sin(x * 0.02 + i * 2 + Math.PI) * (bandHeight * 0.15);
                const nextColor = bandColors[Math.min(i + 1, bandColors.length - 1)].color;
                ctx.fillStyle = nextColor;
                ctx.fillRect(x, y + bandHeight + wave - 3, 4, 3);
            }

            y += bandHeight;
        }

        // Add atmospheric turbulence
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.ellipse(x, y, 5 + Math.random() * 20, 2 + Math.random() * 5, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`;
            ctx.fill();
        }

        // Great Red Spot - massive anticyclonic storm
        const grsX = width * 0.65, grsY = height * 0.55;
        const grsWidth = 100, grsHeight = 60;

        // Outer storm
        for (let r = grsWidth; r > 0; r -= 5) {
            const ratio = r / grsWidth;
            ctx.beginPath();
            ctx.ellipse(grsX, grsY, r, r * 0.6, 0.1, 0, Math.PI * 2);
            const red = 180 + (1 - ratio) * 75;
            const green = 80 + (1 - ratio) * 40;
            const blue = 60;
            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.15 + (1 - ratio) * 0.4})`;
            ctx.fill();
        }

        // Storm swirl pattern
        for (let angle = 0; angle < Math.PI * 4; angle += 0.3) {
            const r = 20 + angle * 8;
            const x = grsX + Math.cos(angle) * r * 0.8;
            const y = grsY + Math.sin(angle) * r * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220, 120, 80, 0.3)';
            ctx.fill();
        }

        // White ovals (smaller storms)
        const ovals = [
            { x: width * 0.3, y: height * 0.65, rx: 30, ry: 18 },
            { x: width * 0.8, y: height * 0.45, rx: 25, ry: 15 },
            { x: width * 0.2, y: height * 0.35, rx: 20, ry: 12 },
        ];
        for (const oval of ovals) {
            ctx.beginPath();
            ctx.ellipse(oval.x, oval.y, oval.rx, oval.ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 250, 240, 0.4)';
            ctx.fill();
        }

        // Brown barges (dark spots)
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.ellipse(
                Math.random() * width,
                height * 0.4 + Math.random() * height * 0.2,
                15 + Math.random() * 25,
                8 + Math.random() * 12,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = 'rgba(100, 70, 50, 0.35)';
            ctx.fill();
        }

        // Festoons (dark projections into zones)
        for (let x = 0; x < width; x += 60) {
            if (Math.random() > 0.5) {
                ctx.beginPath();
                ctx.moveTo(x, height * 0.45);
                ctx.bezierCurveTo(
                    x + 10, height * 0.48,
                    x + 20, height * 0.52,
                    x + 15, height * 0.55
                );
                ctx.strokeStyle = 'rgba(140, 100, 70, 0.4)';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }
    }

    getRoughness() {
        return 0.8;
    }

    getMetalness() {
        return 0.02;
    }
}

window.Jupiter = Jupiter;
