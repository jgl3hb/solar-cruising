/**
 * TargetingSystem.js - Lock-on targeting for enemies and asteroids
 * TAB to cycle targets, shows target info and tracking reticle
 */

class TargetingSystem {
    constructor(scene, rocinante, enemyShips, asteroidField) {
        this.scene = scene;
        this.rocinante = rocinante;
        this.enemyShips = enemyShips;
        this.asteroidField = asteroidField;

        this.currentTarget = null;
        this.targetType = null;  // 'enemy' or 'asteroid'
        this.lockOnRange = 500;
        this.targets = [];
        this.targetIndex = -1;

        // Targeting reticle (3D)
        this.reticle = null;
        this.createReticle();

        // Create HUD
        this.createTargetHUD();

        // Setup controls
        this.setupControls();
    }

    createReticle() {
        const reticleGroup = new THREE.Group();

        // Outer ring
        const outerRing = new THREE.Mesh(
            new THREE.RingGeometry(12, 14, 32),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            })
        );
        reticleGroup.add(outerRing);

        // Inner crosshairs
        const crosshairMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.9
        });

        for (let i = 0; i < 4; i++) {
            const bar = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 8),
                crosshairMat
            );
            bar.rotation.z = (i * Math.PI / 2);
            bar.position.x = Math.cos(i * Math.PI / 2) * 8;
            bar.position.y = Math.sin(i * Math.PI / 2) * 8;
            reticleGroup.add(bar);
        }

        // Lock indicator corners
        const cornerMat = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.9
        });

        for (let i = 0; i < 4; i++) {
            const corner = new THREE.Group();
            const h = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), cornerMat);
            const v = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 6), cornerMat);
            h.position.x = 3;
            v.position.y = 3;
            corner.add(h, v);
            corner.rotation.z = i * Math.PI / 2;
            corner.position.x = Math.cos(i * Math.PI / 2 + Math.PI / 4) * 18;
            corner.position.y = Math.sin(i * Math.PI / 2 + Math.PI / 4) * 18;
            reticleGroup.add(corner);
        }

        reticleGroup.visible = false;
        this.reticle = reticleGroup;
        this.scene.add(reticleGroup);
    }

    createTargetHUD() {
        if (document.getElementById('target-hud')) return;

        const hud = document.createElement('div');
        hud.id = 'target-hud';
        hud.innerHTML = `
            <div class="target-panel">
                <div class="target-header">
                    <span class="target-icon">🎯</span>
                    <span class="target-label">TARGET LOCK</span>
                </div>
                <div class="target-name" id="target-name">NO TARGET</div>
                <div class="target-info">
                    <div class="target-row">
                        <span>Distance:</span>
                        <span id="target-distance">---</span>
                    </div>
                    <div class="target-row">
                        <span>Health:</span>
                        <span id="target-health">---</span>
                    </div>
                    <div class="target-row">
                        <span>Status:</span>
                        <span id="target-status">---</span>
                    </div>
                </div>
                <div class="target-hint">
                    <kbd>TAB</kbd> Cycle Targets | <kbd>G</kbd> Lock Nearest
                </div>
            </div>
        `;
        hud.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 200;
            pointer-events: none;
        `;
        document.body.appendChild(hud);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .target-panel {
                background: linear-gradient(180deg, rgba(30, 0, 0, 0.9), rgba(20, 0, 0, 0.95));
                border: 2px solid rgba(255, 0, 0, 0.6);
                border-radius: 10px;
                padding: 15px 25px;
                min-width: 220px;
                font-family: 'Space Mono', monospace;
                text-align: center;
            }
            .target-header {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                margin-bottom: 10px;
            }
            .target-icon {
                font-size: 1.2rem;
            }
            .target-label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                color: #ff4444;
                letter-spacing: 2px;
            }
            .target-name {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.1rem;
                font-weight: bold;
                color: #ff6666;
                text-shadow: 0 0 10px rgba(255, 100, 100, 0.5);
                margin-bottom: 10px;
            }
            .target-info {
                border-top: 1px solid rgba(255, 0, 0, 0.3);
                padding-top: 10px;
            }
            .target-row {
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
                color: #aaa;
                margin: 5px 0;
            }
            .target-row span:last-child {
                color: #ff8888;
                font-weight: bold;
            }
            .target-hint {
                margin-top: 10px;
                font-size: 0.65rem;
                color: #666;
            }
            .target-hint kbd {
                background: #333;
                border: 1px solid #555;
                border-radius: 3px;
                padding: 2px 5px;
                font-size: 0.6rem;
            }
            
            /* No target state */
            .target-panel.no-target {
                border-color: rgba(100, 100, 100, 0.4);
                background: linear-gradient(180deg, rgba(20, 20, 20, 0.8), rgba(10, 10, 10, 0.9));
            }
            .target-panel.no-target .target-label {
                color: #666;
            }
            .target-panel.no-target .target-name {
                color: #555;
            }
            
            /* Locked state */
            .target-panel.locked {
                animation: targetPulse 1s ease-in-out infinite;
            }
            @keyframes targetPulse {
                0%, 100% { border-color: rgba(255, 0, 0, 0.6); }
                50% { border-color: rgba(255, 0, 0, 1); box-shadow: 0 0 20px rgba(255, 0, 0, 0.3); }
            }
        `;
        document.head.appendChild(style);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'tab':
                    e.preventDefault();
                    this.cycleTargets();
                    break;
                case 'g':
                    this.lockNearestEnemy();
                    break;
            }
        });
    }

    cycleTargets() {
        // Build target list
        this.updateTargetList();

        if (this.targets.length === 0) {
            this.clearTarget();
            return;
        }

        this.targetIndex = (this.targetIndex + 1) % this.targets.length;
        const target = this.targets[this.targetIndex];
        this.setTarget(target.object, target.type);
    }

    lockNearestEnemy() {
        const playerPos = this.rocinante.getPosition();
        const nearest = this.enemyShips.getNearestEnemy(playerPos, this.lockOnRange);

        if (nearest) {
            this.setTarget(nearest.enemy, 'enemy');
            this.showLockNotification(nearest.enemy.config.name);
        } else {
            // Try asteroid
            const asteroids = this.asteroidField.getAsteroids();
            let nearestAst = null;
            let nearestDist = this.lockOnRange;

            for (const ast of asteroids) {
                const dist = playerPos.distanceTo(ast.mesh.position);
                if (dist < nearestDist) {
                    nearestAst = ast;
                    nearestDist = dist;
                }
            }

            if (nearestAst) {
                this.setTarget(nearestAst, 'asteroid');
                this.showLockNotification('Asteroid');
            }
        }
    }

    updateTargetList() {
        this.targets = [];
        const playerPos = this.rocinante.getPosition();

        // Add enemies
        for (const enemy of this.enemyShips.getEnemies()) {
            const dist = playerPos.distanceTo(enemy.position);
            if (dist < this.lockOnRange) {
                this.targets.push({ object: enemy, type: 'enemy', distance: dist });
            }
        }

        // Add nearby asteroids
        for (const ast of this.asteroidField.getAsteroids()) {
            const dist = playerPos.distanceTo(ast.mesh.position);
            if (dist < this.lockOnRange * 0.5) {  // Shorter range for asteroids
                this.targets.push({ object: ast, type: 'asteroid', distance: dist });
            }
        }

        // Sort by distance
        this.targets.sort((a, b) => a.distance - b.distance);
    }

    setTarget(target, type) {
        this.currentTarget = target;
        this.targetType = type;
        this.reticle.visible = true;

        const panel = document.querySelector('.target-panel');
        if (panel) {
            panel.classList.remove('no-target');
            panel.classList.add('locked');
        }
    }

    clearTarget() {
        this.currentTarget = null;
        this.targetType = null;
        this.reticle.visible = false;
        this.targetIndex = -1;

        this.updateHUD();

        const panel = document.querySelector('.target-panel');
        if (panel) {
            panel.classList.add('no-target');
            panel.classList.remove('locked');
        }
    }

    showLockNotification(name) {
        const notif = document.createElement('div');
        notif.textContent = `🎯 LOCKED: ${name}`;
        notif.style.cssText = `
            position: fixed;
            top: 35%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Orbitron', sans-serif;
            font-size: 1.2rem;
            color: #ff4444;
            text-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
            letter-spacing: 3px;
            pointer-events: none;
            z-index: 500;
            animation: lockNotif 0.8s ease-out forwards;
        `;

        if (!document.getElementById('lock-notif-style')) {
            const style = document.createElement('style');
            style.id = 'lock-notif-style';
            style.textContent = `
                @keyframes lockNotif {
                    0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
                    20% { opacity: 1; transform: translateX(-50%) scale(1.1); }
                    100% { opacity: 0; transform: translateX(-50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 800);
    }

    update(delta) {
        // Check if target still exists
        if (this.currentTarget) {
            if (this.targetType === 'enemy' && this.currentTarget.destroyed) {
                this.clearTarget();
                return;
            }
            if (this.targetType === 'asteroid' && this.currentTarget.destroyed) {
                this.clearTarget();
                return;
            }
        }

        // Update reticle position
        if (this.currentTarget && this.reticle.visible) {
            const targetPos = this.targetType === 'enemy'
                ? this.currentTarget.position
                : this.currentTarget.mesh.position;

            this.reticle.position.copy(targetPos);

            // Always face camera
            if (window.threeScene && window.threeScene.camera) {
                this.reticle.lookAt(window.threeScene.camera.position);
            }

            // Rotate animation
            this.reticle.children[0].rotation.z += delta * 2;

            // Scale based on distance
            const dist = this.rocinante.getPosition().distanceTo(targetPos);
            const scale = Math.max(0.5, Math.min(2, dist / 100));
            this.reticle.scale.setScalar(scale);
        }

        // Update HUD
        this.updateHUD();
    }

    updateHUD() {
        const nameEl = document.getElementById('target-name');
        const distEl = document.getElementById('target-distance');
        const healthEl = document.getElementById('target-health');
        const statusEl = document.getElementById('target-status');

        if (!this.currentTarget) {
            if (nameEl) nameEl.textContent = 'NO TARGET';
            if (distEl) distEl.textContent = '---';
            if (healthEl) healthEl.textContent = '---';
            if (statusEl) statusEl.textContent = '---';
            return;
        }

        const targetPos = this.targetType === 'enemy'
            ? this.currentTarget.position
            : this.currentTarget.mesh.position;
        const distance = this.rocinante.getPosition().distanceTo(targetPos);

        if (this.targetType === 'enemy') {
            if (nameEl) nameEl.textContent = this.currentTarget.config.name;
            if (distEl) distEl.textContent = Math.round(distance) + ' km';
            if (healthEl) healthEl.textContent = Math.round(this.currentTarget.health) + '/' + this.currentTarget.maxHealth;
            if (statusEl) statusEl.textContent = this.currentTarget.state.toUpperCase();
        } else {
            if (nameEl) nameEl.textContent = 'ASTEROID';
            if (distEl) distEl.textContent = Math.round(distance) + ' km';
            if (healthEl) healthEl.textContent = Math.round(this.currentTarget.health) + '/' + Math.round(this.currentTarget.maxHealth);
            if (statusEl) statusEl.textContent = 'STATIONARY';
        }
    }

    getTarget() {
        return this.currentTarget;
    }

    getTargetPosition() {
        if (!this.currentTarget) return null;
        return this.targetType === 'enemy'
            ? this.currentTarget.position.clone()
            : this.currentTarget.mesh.position.clone();
    }
}

// Make available globally
window.TargetingSystem = TargetingSystem;
