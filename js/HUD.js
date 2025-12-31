/**
 * HUD.js
 * Manages the heads-up display with telemetry data
 */

class HUD {
    constructor() {
        // Speed elements
        this.speedKms = document.getElementById('speed-kms');
        this.lightspeedFill = document.getElementById('lightspeed-fill');
        this.lightspeedPercent = document.getElementById('lightspeed-percent');

        // Position elements
        this.distanceAu = document.getElementById('distance-au');
        this.nearestPlanet = document.getElementById('nearest-planet');

        // Throttle elements
        this.throttleFill = document.getElementById('throttle-fill');
        this.throttlePercent = document.getElementById('throttle-percent');

        // Mission time
        this.missionTimeElement = document.getElementById('mission-time');
        this.missionStartTime = null;

        // Store for smooth animations
        this.displayedSpeed = 0;
        this.displayedDistance = 1.0;

        this.init();
    }

    init() {
        // Initial state
        this.update({
            speed: 0,
            speedPercent: 0,
            throttle: 0,
            distanceAU: 1.0,
            nearestPlanet: 'Earth'
        });
    }

    startMissionTimer() {
        this.missionStartTime = Date.now();
    }

    update(data) {
        // Smooth speed display
        this.displayedSpeed += (data.speed - this.displayedSpeed) * 0.1;

        // Update speed
        if (this.speedKms) {
            this.speedKms.textContent = this.formatNumber(Math.round(this.displayedSpeed));
        }

        // Update lightspeed bar
        if (this.lightspeedFill) {
            const percent = Math.min(100, data.speedPercent);
            this.lightspeedFill.style.width = `${percent}%`;

            // Change color based on speed
            if (percent >= 90) {
                this.lightspeedFill.style.background = 'linear-gradient(90deg, #ff00ff, #00ffff, #ffffff)';
            } else if (percent >= 50) {
                this.lightspeedFill.style.background = 'linear-gradient(90deg, #00ff88, #00ffff, #ff00ff)';
            } else {
                this.lightspeedFill.style.background = 'linear-gradient(90deg, #00ff88, #00ffff)';
            }
        }

        if (this.lightspeedPercent) {
            this.lightspeedPercent.textContent = `${data.speedPercent.toFixed(1)}%`;
        }

        // Smooth distance display
        this.displayedDistance += (data.distanceAU - this.displayedDistance) * 0.05;

        // Update distance
        if (this.distanceAu) {
            this.distanceAu.textContent = this.displayedDistance.toFixed(2);
        }

        // Update nearest planet
        if (this.nearestPlanet) {
            this.nearestPlanet.textContent = data.nearestPlanet;
        }

        // Update throttle
        if (this.throttleFill) {
            this.throttleFill.style.height = `${data.throttle}%`;
        }

        if (this.throttlePercent) {
            this.throttlePercent.textContent = `${Math.round(data.throttle)}%`;
        }

        // Update mission time
        this.updateMissionTime();
    }

    updateMissionTime() {
        if (!this.missionStartTime || !this.missionTimeElement) return;

        const elapsed = Date.now() - this.missionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        this.missionTimeElement.textContent =
            `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    showWarning(message) {
        // Create warning popup
        const warning = document.createElement('div');
        warning.className = 'hud-warning-popup';
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 40px;
            background: rgba(255, 70, 70, 0.9);
            border: 2px solid #ff4444;
            border-radius: 10px;
            font-family: var(--font-display);
            font-size: 1.2rem;
            color: white;
            text-align: center;
            z-index: 500;
            animation: warningPulse 0.5s ease infinite;
        `;
        warning.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes warningPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(warning);

        setTimeout(() => {
            warning.remove();
            style.remove();
        }, 2000);
    }

    showAchievement(title, description) {
        // Create achievement popup
        const achievement = document.createElement('div');
        achievement.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 20px 40px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 165, 0, 0.9));
            border: 2px solid gold;
            border-radius: 15px;
            font-family: var(--font-display);
            color: #333;
            text-align: center;
            z-index: 500;
            opacity: 0;
            transition: all 0.5s ease;
        `;
        achievement.innerHTML = `
            <div style="font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 5px;">🏆 ACHIEVEMENT UNLOCKED</div>
            <div style="font-size: 1.3rem; font-weight: bold;">${title}</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">${description}</div>
        `;
        document.body.appendChild(achievement);

        // Animate in
        requestAnimationFrame(() => {
            achievement.style.opacity = '1';
            achievement.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove after delay
        setTimeout(() => {
            achievement.style.opacity = '0';
            achievement.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => achievement.remove(), 500);
        }, 3000);
    }

    showApproachNotification(bodyName, bodyType, distance) {
        // Don't show if already showing
        if (this.approachNotification) return;

        const notification = document.createElement('div');
        notification.id = 'approach-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            padding: 15px 30px;
            background: linear-gradient(135deg, rgba(0, 150, 255, 0.85), rgba(100, 0, 200, 0.85));
            border: 1px solid rgba(100, 200, 255, 0.6);
            border-radius: 12px;
            font-family: var(--font-display);
            color: white;
            text-align: center;
            z-index: 400;
            opacity: 0;
            transition: all 0.4s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 5px 30px rgba(0, 150, 255, 0.4);
        `;

        const typeEmoji = {
            'planet': '🪐',
            'dwarf planet': '🌑',
            'moon': '🌙',
            'detached object': '💫'
        }[bodyType] || '✨';

        notification.innerHTML = `
            <div style="font-size: 0.7rem; letter-spacing: 3px; margin-bottom: 5px; opacity: 0.8;">APPROACHING</div>
            <div style="font-size: 1.4rem; font-weight: bold;">${typeEmoji} ${bodyName}</div>
            <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">Distance: ${distance.toFixed(1)} units</div>
        `;
        document.body.appendChild(notification);

        this.approachNotification = notification;

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
    }

    hideApproachNotification() {
        if (this.approachNotification) {
            this.approachNotification.style.opacity = '0';
            this.approachNotification.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => {
                this.approachNotification?.remove();
                this.approachNotification = null;
            }, 400);
        }
    }

    showBodyInfo(bodyData) {
        // Show detailed info panel for a celestial body
        const panel = document.createElement('div');
        panel.id = 'body-info-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%) translateX(20px);
            width: 280px;
            padding: 20px;
            background: linear-gradient(180deg, rgba(20, 30, 50, 0.95), rgba(10, 15, 30, 0.95));
            border: 1px solid rgba(100, 150, 255, 0.4);
            border-radius: 15px;
            font-family: var(--font-mono);
            color: white;
            z-index: 350;
            opacity: 0;
            transition: all 0.5s ease;
            backdrop-filter: blur(15px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `;

        const moons = bodyData.moons ? `<div style="margin-top: 10px; font-size: 0.8rem; color: #88aaff;">Moons: ${bodyData.moons.join(', ')}</div>` : '';
        const feature = bodyData.feature ? `<div style="margin-top: 8px; font-size: 0.85rem; color: #ffcc66; font-style: italic;">${bodyData.feature}</div>` : '';

        panel.innerHTML = `
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: bold; margin-bottom: 15px; color: #66ccff;">
                ${bodyData.name}
            </div>
            <div style="font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
                ${bodyData.type || 'Planet'}
            </div>
            <div style="display: grid; gap: 8px; font-size: 0.9rem;">
                <div><span style="color: #888;">Size:</span> ${bodyData.size} units</div>
                <div><span style="color: #888;">Orbit:</span> ${bodyData.distance} units</div>
                <div><span style="color: #888;">Tilt:</span> ${bodyData.tilt}°</div>
            </div>
            ${moons}
            ${feature}
        `;

        // Remove any existing panel
        document.getElementById('body-info-panel')?.remove();
        document.body.appendChild(panel);

        requestAnimationFrame(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(-50%) translateX(0)';
        });

        // Auto-hide after 8 seconds
        setTimeout(() => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(-50%) translateX(20px)';
            setTimeout(() => panel.remove(), 500);
        }, 8000);
    }
}

// Export for use in main.js
window.HUD = HUD;

