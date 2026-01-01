/**
 * ModeSelector.js - Launch screen mode selector
 * Choose between Explorer mode (peaceful) and Combat mode (Expanse Pack)
 */

class ModeSelector {
    constructor() {
        this.selectedMode = null;
        this.onModeSelected = null;
    }

    show(callback) {
        this.onModeSelected = callback;
        this.createUI();
    }

    createUI() {
        const overlay = document.createElement('div');
        overlay.id = 'mode-selector-overlay';
        overlay.innerHTML = `
            <div class="mode-selector-container">
                <div class="mode-selector-header">
                    <h1>🚀 SOLAR SYSTEM EXPLORER</h1>
                    <p>Choose your experience</p>
                </div>
                <div class="mode-options">
                    <div class="mode-card" data-mode="explorer">
                        <div class="mode-icon">🌍</div>
                        <h2>EXPLORER</h2>
                        <p>Peaceful journey through the solar system. Visit planets, moons, and dwarf planets.</p>
                        <ul>
                            <li>✓ All planets & moons</li>
                            <li>✓ Accurate information</li>
                            <li>✓ Relaxing experience</li>
                        </ul>
                    </div>
                    <div class="mode-card" data-mode="expanse">
                        <div class="mode-icon">⚔️</div>
                        <h2>EXPANSE COMBAT</h2>
                        <p>Command the MCRN Rocinante. Hunt pirates, destroy asteroids, and engage in space combat.</p>
                        <ul>
                            <li>✓ Railgun & torpedoes</li>
                            <li>✓ Enemy ships</li>
                            <li>✓ Targeting system</li>
                            <li>✓ Expanse stations</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.id = 'mode-selector-style';
        style.textContent = `
            #mode-selector-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.5s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .mode-selector-container {
                text-align: center;
                max-width: 900px;
                padding: 40px;
            }
            .mode-selector-header h1 {
                font-family: 'Orbitron', sans-serif;
                font-size: 2.5rem;
                color: #00f5ff;
                text-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
                margin-bottom: 10px;
                letter-spacing: 3px;
            }
            .mode-selector-header p {
                font-family: 'Space Mono', monospace;
                color: #888;
                font-size: 1rem;
                margin-bottom: 40px;
            }
            .mode-options {
                display: flex;
                gap: 30px;
                justify-content: center;
            }
            .mode-card {
                background: linear-gradient(180deg, rgba(20, 25, 45, 0.9), rgba(10, 15, 30, 0.95));
                border: 2px solid rgba(100, 100, 150, 0.3);
                border-radius: 20px;
                padding: 30px;
                width: 320px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .mode-card:hover {
                border-color: #00f5ff;
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0, 245, 255, 0.2);
            }
            .mode-card[data-mode="expanse"]:hover {
                border-color: #ff4444;
                box-shadow: 0 20px 40px rgba(255, 68, 68, 0.2);
            }
            .mode-icon {
                font-size: 4rem;
                margin-bottom: 15px;
            }
            .mode-card h2 {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.3rem;
                color: #fff;
                margin-bottom: 15px;
                letter-spacing: 2px;
            }
            .mode-card p {
                font-family: 'Space Mono', monospace;
                color: #aaa;
                font-size: 0.85rem;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .mode-card ul {
                list-style: none;
                padding: 0;
                text-align: left;
            }
            .mode-card li {
                font-family: 'Space Mono', monospace;
                color: #00ff88;
                font-size: 0.8rem;
                margin: 8px 0;
            }
            .mode-card[data-mode="expanse"] li {
                color: #ff8888;
            }
            
            /* Selected state */
            .mode-card.selected {
                border-color: #00f5ff !important;
                background: linear-gradient(180deg, rgba(0, 100, 120, 0.3), rgba(10, 15, 30, 0.95));
            }
            .mode-card[data-mode="expanse"].selected {
                border-color: #ff4444 !important;
                background: linear-gradient(180deg, rgba(120, 30, 30, 0.3), rgba(10, 15, 30, 0.95));
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Add click handlers
        const cards = overlay.querySelectorAll('.mode-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                this.selectMode(mode, overlay);
            });
        });
    }

    selectMode(mode, overlay) {
        this.selectedMode = mode;

        // Visual feedback
        const card = overlay.querySelector(`[data-mode="${mode}"]`);
        card.classList.add('selected');

        // Fade out
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';

        setTimeout(() => {
            overlay.remove();
            document.getElementById('mode-selector-style')?.remove();

            if (this.onModeSelected) {
                this.onModeSelected(mode);
            }
        }, 500);
    }

    getMode() {
        return this.selectedMode;
    }
}

// Make available globally
window.ModeSelector = ModeSelector;
