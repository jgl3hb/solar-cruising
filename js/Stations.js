/**
 * Stations.js - Expanse space stations
 * Tycho Station, Ceres Station, Medina Station
 */

class SpaceStations {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.stations = {};
    }

    init() {
        this.createTychoStation();
        this.createCeresStation();
        this.createMedinaStation();
        this.scene.add(this.group);
        return this;
    }

    createTychoStation() {
        // Tycho Station - asteroid with industrial complex
        // Located in the Belt
        const station = new THREE.Group();

        // Main asteroid body
        const asteroidGeom = new THREE.IcosahedronGeometry(15, 2);
        const positions = asteroidGeom.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const noise = 0.8 + Math.random() * 0.4;
            positions.setXYZ(i, x * noise, y * noise, z * noise);
        }
        asteroidGeom.computeVertexNormals();

        const asteroidMat = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.9,
            metalness: 0.1
        });
        const asteroid = new THREE.Mesh(asteroidGeom, asteroidMat);
        station.add(asteroid);

        // Industrial structures
        const structureMat = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.7,
            roughness: 0.3
        });

        // Main dome
        const domeGeom = new THREE.SphereGeometry(8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeom, structureMat);
        dome.position.y = 12;
        station.add(dome);

        // Construction arms
        for (let i = 0; i < 4; i++) {
            const arm = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.5, 30, 8),
                structureMat
            );
            arm.rotation.z = Math.PI / 4;
            arm.rotation.y = (i * Math.PI / 2);
            arm.position.set(
                Math.cos(i * Math.PI / 2) * 20,
                5,
                Math.sin(i * Math.PI / 2) * 20
            );
            station.add(arm);
        }

        // Lights
        const redLight = new THREE.PointLight(0xff0000, 1, 50);
        redLight.position.set(0, 20, 0);
        station.add(redLight);

        // Tycho logo glow
        const logoLight = new THREE.PointLight(0x00aaff, 2, 30);
        logoLight.position.set(0, 15, 10);
        station.add(logoLight);

        // Position in the Belt
        station.position.set(600, 20, 300);

        // Station data
        station.userData = {
            name: 'Tycho Station',
            type: 'Manufacturing',
            faction: 'Tycho Manufacturing',
            description: 'Premier shipyard of the Belt. Built the Nauvoo.'
        };

        this.stations['tycho'] = station;
        this.group.add(station);
    }

    createCeresStation() {
        // Ceres Station - hollowed asteroid with spin gravity
        const station = new THREE.Group();

        // Main body (Ceres is already a planet, this is the station complex)
        const ringGeom = new THREE.TorusGeometry(20, 3, 16, 50);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x666677,
            metalness: 0.6,
            roughness: 0.4
        });

        // Multiple dock rings
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.position.y = i * 8 - 8;
            ring.scale.setScalar(1 - i * 0.2);
            station.add(ring);
        }

        // Central spire
        const spireGeom = new THREE.CylinderGeometry(2, 4, 40, 8);
        const spire = new THREE.Mesh(spireGeom, ringMat);
        station.add(spire);

        // Dock lights
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const light = new THREE.PointLight(0xffaa00, 0.5, 20);
            light.position.set(
                Math.cos(angle) * 20,
                0,
                Math.sin(angle) * 20
            );
            station.add(light);
        }

        // Position near Ceres (which is at distance 280)
        station.position.set(290, 10, 100);

        station.userData = {
            name: 'Ceres Station',
            type: 'Trading Hub',
            faction: 'OPA',
            description: 'Heart of the Belt. Former Earth control, now OPA headquarters.'
        };

        this.stations['ceres'] = station;
        this.group.add(station);
    }

    createMedinaStation() {
        // Medina Station - the converted Nauvoo/Behemoth
        const station = new THREE.Group();

        // Main drum (rotating section)
        const drumGeom = new THREE.CylinderGeometry(12, 12, 60, 32);
        const drumMat = new THREE.MeshStandardMaterial({
            color: 0x445566,
            metalness: 0.5,
            roughness: 0.5
        });
        const drum = new THREE.Mesh(drumGeom, drumMat);
        drum.rotation.x = Math.PI / 2;
        station.add(drum);

        // Engine section
        const engineGeom = new THREE.ConeGeometry(15, 30, 16);
        const engineMat = new THREE.MeshStandardMaterial({
            color: 0x333344,
            metalness: 0.7,
            roughness: 0.3
        });
        const engine = new THREE.Mesh(engineGeom, engineMat);
        engine.rotation.x = -Math.PI / 2;
        engine.position.z = 45;
        station.add(engine);

        // Bow section
        const bowGeom = new THREE.ConeGeometry(10, 20, 16);
        const bow = new THREE.Mesh(bowGeom, drumMat);
        bow.rotation.x = Math.PI / 2;
        bow.position.z = -40;
        station.add(bow);

        // Ring gates docking arms
        for (let i = 0; i < 6; i++) {
            const arm = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2, 20),
                drumMat
            );
            const angle = (i / 6) * Math.PI * 2;
            arm.position.set(
                Math.cos(angle) * 14,
                Math.sin(angle) * 14,
                0
            );
            arm.rotation.z = angle;
            station.add(arm);
        }

        // Blue ring gate glow effect
        const ringGlow = new THREE.Mesh(
            new THREE.TorusGeometry(25, 1, 16, 50),
            new THREE.MeshBasicMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.5
            })
        );
        ringGlow.position.z = -80;
        station.add(ringGlow);

        // Ring gate light
        const gateLight = new THREE.PointLight(0x0088ff, 3, 100);
        gateLight.position.z = -80;
        station.add(gateLight);

        // Position far out (slow zone entrance)
        station.position.set(1800, 0, 500);

        station.userData = {
            name: 'Medina Station',
            type: 'Ring Gate Hub',
            faction: 'Transport Union',
            description: 'Gateway to 1,300 worlds. Former Mormon generation ship Nauvoo.'
        };

        this.stations['medina'] = station;
        this.group.add(station);
    }

    update(delta, elapsed) {
        // Rotate Ceres station rings
        if (this.stations['ceres']) {
            this.stations['ceres'].rotation.y += delta * 0.1;
        }

        // Rotate Medina drum
        if (this.stations['medina']) {
            this.stations['medina'].children[0].rotation.z += delta * 0.2;
        }

        // Pulse ring gate
        if (this.stations['medina']) {
            const ringGlow = this.stations['medina'].children.find(c =>
                c.geometry && c.geometry.type === 'TorusGeometry'
            );
            if (ringGlow) {
                ringGlow.material.opacity = 0.3 + Math.sin(elapsed * 2) * 0.2;
            }
        }
    }

    getStation(name) {
        return this.stations[name];
    }

    getStationNear(position, radius = 100) {
        for (const [name, station] of Object.entries(this.stations)) {
            const distance = position.distanceTo(station.position);
            if (distance < radius) {
                return { name, station, distance };
            }
        }
        return null;
    }
}

// Make available globally
window.SpaceStations = SpaceStations;
