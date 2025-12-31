/**
 * Pluto.js - The Dwarf Planet
 * Features: Heart-shaped nitrogen ice plain (Tombaugh Regio), reddish-brown color
 */

class Pluto extends BasePlanet {
    constructor(config = {}) {
        super({
            name: 'pluto',
            distance: 2200,
            size: 8,
            color: 0xc9b8a5,
            orbitSpeed: 0.05,
            rotationSpeed: -0.15,
            tilt: 120,
            segments: 48,
            textureResolution: 512,
            ...config
        });
    }

    drawTextureDetails(ctx, width, height) {
        const color = new THREE.Color(this.color);
        const baseR = Math.floor(color.r * 255);
        const baseG = Math.floor(color.g * 255);
        const baseB = Math.floor(color.b * 255);

        // Mottled surface
        for (let i = 0; i < 1500; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const v = Math.random() * 40 - 20;
            ctx.fillStyle = `rgb(${baseR + v}, ${baseG + v}, ${baseB + v})`;
            ctx.fillRect(x, y, 4, 4);
        }

        // Tombaugh Regio - the famous heart!
        const heartX = width * 0.35, heartY = height * 0.45;
        ctx.beginPath();
        ctx.moveTo(heartX, heartY + 30);
        ctx.bezierCurveTo(heartX - 50, heartY - 20, heartX - 50, heartY - 50, heartX, heartY - 30);
        ctx.bezierCurveTo(heartX + 50, heartY - 50, heartX + 50, heartY - 20, heartX, heartY + 30);
        ctx.fillStyle = 'rgba(255, 250, 240, 0.7)';
        ctx.fill();

        // Sputnik Planitia (left lobe - nitrogen ice)
        ctx.beginPath();
        ctx.ellipse(heartX - 25, heartY - 10, 35, 45, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240, 235, 220, 0.5)';
        ctx.fill();

        // Dark equatorial region (Cthulhu Macula)
        ctx.beginPath();
        ctx.ellipse(width * 0.7, height * 0.5, 80, 40, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(80, 50, 40, 0.4)';
        ctx.fill();

        // Craters
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = 2 + Math.random() * 8;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseR - 30}, ${baseG - 25}, ${baseB - 20}, 0.4)`;
            ctx.fill();
        }
    }

    getRoughness() { return 0.95; }

    addSpecialFeatures() {
        this.moons = [];

        // Charon - almost a binary system!
        const charon = new Charon();
        charon.init();
        this.moons.push(charon);
        this.group.add(charon.getGroup());

        // Smaller moons
        const nix = new Nix();
        nix.init();
        this.moons.push(nix);
        this.group.add(nix.getGroup());

        const hydra = new Hydra();
        hydra.init();
        this.moons.push(hydra);
        this.group.add(hydra.getGroup());

        const kerberos = new Kerberos();
        kerberos.init();
        this.moons.push(kerberos);
        this.group.add(kerberos.getGroup());

        const styx = new Styx();
        styx.init();
        this.moons.push(styx);
        this.group.add(styx.getGroup());
    }

    updateSpecialFeatures(delta, elapsed) {
        for (const moon of this.moons) {
            moon.update(delta);
        }
    }

    getData() {
        return {
            ...super.getData(),
            type: 'dwarf planet',
            feature: 'Tombaugh Regio (Heart)',
            moons: ['Charon', 'Nix', 'Hydra', 'Kerberos', 'Styx']
        };
    }
}

window.Pluto = Pluto;
