/**
 * CombatSystem.js - Ship damage, shields, and PDC targeting
 * Full combat mechanics for the Rocinante
 */

class CombatSystem {
    constructor(rocinante, asteroidField) {
        this.rocinante = rocinante;
        this.asteroidField = asteroidField;

        // Ship status
        this.maxHull = 100;
        this.currentHull = 100;
        this.maxShields = 50;  // PDCs act as "shields" by intercepting
        this.pdcAmmo = 10000;  // PDC rounds

        // PDC settings
        this.pdcRange = 200;
        this.pdcFireRate = 0.1;  // Seconds between shots
        this.pdcCooldown = 0;
        this.pdcActive = true;

        // Incoming threats
        this.threats = [];

        // Kill count
        this.kills = {
            asteroids: 0,
            missiles: 0
        };

        // HUD elements
        this.initHUD();
    }

    initHUD() {
        // Create combat HUD if not exists
        if (!document.getElementById('combat-hud')) {
            const hud = document.createElement('div');
            hud.id = 'combat-hud';
            hud.innerHTML = `
                <div class="combat-panel">
                    <div class="combat-header">SHIP STATUS</div>
                    <div class="status-row">
                        <span class="status-label">HULL</span>
                        <div class="status-bar hull-bar">
                            <div class="status-fill" id="hull-fill"></div>
                        </div>
                        <span class="status-value" id="hull-value">100%</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">PDC</span>
                        <div class="status-bar pdc-bar">
                            <div class="status-fill" id="pdc-fill"></div>
                        </div>
                        <span class="status-value" id="pdc-ammo">10000</span>
                    </div>
                    <div class="pdc-status">
                        <span>PDC Status:</span>
                        <span id="pdc-status" class="pdc-active">ACTIVE</span>
                    </div>
                    <div class="kill-count">
                        <span>Kills:</span>
                        <span id="kill-count">0</span>
                    </div>
                </div>
            `;
            hud.style.cssText = `
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 200;
            `;
            document.body.appendChild(hud);

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .combat-panel {
                    background: linear-gradient(180deg, rgba(10, 15, 30, 0.95), rgba(5, 8, 20, 0.98));
                    border: 1px solid rgba(0, 170, 255, 0.4);
                    border-radius: 10px;
                    padding: 15px;
                    min-width: 180px;
                    font-family: 'Space Mono', monospace;
                }
                .combat-header {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 0.8rem;
                    color: #00aaff;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                    text-align: center;
                }
                .status-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .status-label {
                    font-size: 0.7rem;
                    color: #888;
                    width: 35px;
                }
                .status-bar {
                    flex: 1;
                    height: 8px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .status-fill {
                    height: 100%;
                    transition: width 0.3s ease;
                }
                .hull-bar .status-fill {
                    background: linear-gradient(90deg, #00ff88, #44ff88);
                    width: 100%;
                }
                .pdc-bar .status-fill {
                    background: linear-gradient(90deg, #ffaa00, #ffcc00);
                    width: 100%;
                }
                .status-value {
                    font-size: 0.7rem;
                    color: #fff;
                    width: 45px;
                    text-align: right;
                }
                .pdc-status {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    color: #888;
                    margin-top: 10px;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .pdc-active {
                    color: #00ff88;
                    font-weight: bold;
                }
                .pdc-inactive {
                    color: #ff4444;
                }
                .kill-count {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    color: #888;
                    margin-top: 5px;
                }
                .kill-count span:last-child {
                    color: #ff4444;
                    font-weight: bold;
                }
                
                /* Damage flash */
                .damage-flash {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle, rgba(255,0,0,0.3), rgba(255,0,0,0.1));
                    pointer-events: none;
                    z-index: 999;
                    animation: damageFlash 0.3s ease-out forwards;
                }
                @keyframes damageFlash {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    update(delta) {
        // Update PDC cooldown
        this.pdcCooldown = Math.max(0, this.pdcCooldown - delta);

        // Check for projectile hits on asteroids
        this.checkProjectileHits();

        // PDC auto-targeting (if we add enemy missiles later)
        if (this.pdcActive && this.pdcCooldown <= 0) {
            this.updatePDC(delta);
        }

        // Update HUD
        this.updateHUD();
    }

    checkProjectileHits() {
        if (!this.asteroidField) return;

        // Check railgun projectiles
        for (let i = this.rocinante.projectiles.length - 1; i >= 0; i--) {
            const proj = this.rocinante.projectiles[i];
            const result = this.asteroidField.checkCollision(proj.position, 'railgun');

            if (result.hit) {
                // Remove projectile
                this.rocinante.scene.remove(proj);
                this.rocinante.projectiles.splice(i, 1);

                if (result.destroyed) {
                    this.kills.asteroids++;
                    this.showKillNotification('ASTEROID DESTROYED');
                }
            }
        }

        // Check missiles/torpedoes
        for (let i = this.rocinante.missiles.length - 1; i >= 0; i--) {
            const missile = this.rocinante.missiles[i];
            const result = this.asteroidField.checkCollision(missile.position, 'missile');

            if (result.hit) {
                // Create explosion at impact point
                this.rocinante.createExplosion(result.position);

                // Remove missile
                this.rocinante.scene.remove(missile);
                this.rocinante.missiles.splice(i, 1);

                if (result.destroyed) {
                    this.kills.asteroids++;
                    this.showKillNotification('ASTEROID OBLITERATED');
                }
            }
        }
    }

    updatePDC(delta) {
        // PDC would target incoming missiles here
        // For now, just track that PDCs are ready
    }

    firePDC(target) {
        if (this.pdcAmmo <= 0 || this.pdcCooldown > 0) return false;

        this.pdcAmmo -= 10;  // Burst fire
        this.pdcCooldown = this.pdcFireRate;

        // Create PDC tracer effect
        this.createPDCTracer(target);

        return true;
    }

    createPDCTracer(target) {
        const start = this.rocinante.position.clone();
        const end = target.clone();

        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 1
        });

        const tracer = new THREE.Line(geometry, material);
        this.rocinante.scene.add(tracer);

        // Fade out
        let opacity = 1;
        const fade = () => {
            opacity -= 0.1;
            material.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                this.rocinante.scene.remove(tracer);
            }
        };
        fade();
    }

    takeDamage(amount) {
        this.currentHull = Math.max(0, this.currentHull - amount);

        // Flash screen red
        const flash = document.createElement('div');
        flash.className = 'damage-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);

        // Screen shake
        this.rocinante.triggerScreenShake();

        if (this.currentHull <= 0) {
            this.shipDestroyed();
        }
    }

    shipDestroyed() {
        console.log('💀 SHIP DESTROYED');

        // Create big explosion
        this.rocinante.createExplosion(this.rocinante.position);

        // Show game over message
        const gameOver = document.createElement('div');
        gameOver.innerHTML = `
            <div style="font-family: 'Orbitron', sans-serif; font-size: 3rem; color: #ff4444; 
                        text-shadow: 0 0 30px rgba(255,0,0,0.8); margin-bottom: 20px;">
                SHIP DESTROYED
            </div>
            <div style="font-family: 'Space Mono', monospace; color: #888;">
                Asteroids destroyed: ${this.kills.asteroids}
            </div>
            <button onclick="location.reload()" style="
                margin-top: 30px; padding: 15px 40px; font-family: 'Orbitron', sans-serif;
                background: #ff4444; color: white; border: none; border-radius: 8px;
                cursor: pointer; font-size: 1rem;
            ">RESPAWN</button>
        `;
        gameOver.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            text-align: center; z-index: 2000;
        `;
        document.body.appendChild(gameOver);
    }

    showKillNotification(message) {
        const notif = document.createElement('div');
        notif.textContent = `💥 ${message}`;
        notif.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Orbitron', sans-serif;
            font-size: 1.2rem;
            color: #ff8800;
            text-shadow: 0 0 20px rgba(255, 136, 0, 0.8);
            letter-spacing: 3px;
            pointer-events: none;
            z-index: 500;
            animation: killNotif 1s ease-out forwards;
        `;

        if (!document.getElementById('kill-notif-style')) {
            const style = document.createElement('style');
            style.id = 'kill-notif-style';
            style.textContent = `
                @keyframes killNotif {
                    0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 1000);
    }

    updateHUD() {
        const hullFill = document.getElementById('hull-fill');
        const hullValue = document.getElementById('hull-value');
        const pdcFill = document.getElementById('pdc-fill');
        const pdcAmmo = document.getElementById('pdc-ammo');
        const pdcStatus = document.getElementById('pdc-status');
        const killCount = document.getElementById('kill-count');

        if (hullFill) {
            const hullPercent = (this.currentHull / this.maxHull) * 100;
            hullFill.style.width = hullPercent + '%';

            // Change color based on health
            if (hullPercent > 60) {
                hullFill.style.background = 'linear-gradient(90deg, #00ff88, #44ff88)';
            } else if (hullPercent > 30) {
                hullFill.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc00)';
            } else {
                hullFill.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
            }
        }

        if (hullValue) {
            hullValue.textContent = Math.round(this.currentHull) + '%';
        }

        if (pdcFill) {
            pdcFill.style.width = (this.pdcAmmo / 10000) * 100 + '%';
        }

        if (pdcAmmo) {
            pdcAmmo.textContent = this.pdcAmmo;
        }

        if (pdcStatus) {
            pdcStatus.textContent = this.pdcActive ? 'ACTIVE' : 'OFFLINE';
            pdcStatus.className = this.pdcActive ? 'pdc-active' : 'pdc-inactive';
        }

        if (killCount) {
            killCount.textContent = this.kills.asteroids;
        }
    }

    togglePDC() {
        this.pdcActive = !this.pdcActive;
    }

    repair(amount) {
        this.currentHull = Math.min(this.maxHull, this.currentHull + amount);
    }

    reloadPDC(amount) {
        this.pdcAmmo = Math.min(10000, this.pdcAmmo + amount);
    }
}

// Make available globally
window.CombatSystem = CombatSystem;
