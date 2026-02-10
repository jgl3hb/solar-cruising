# Solar Cruising

This project is a **vanilla HTML/CSS/JavaScript** app.
There is currently **no `package.json`**, so commands like `npm run dev` will fail.

## Run locally (no Python required)

### Option 1: VS Code Live Server (recommended)
1. Open the project in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Your browser opens automatically (usually at `http://127.0.0.1:5500`).

### Option 2: Node static server
If you already have Node installed, you can run a static server without adding scripts to this repo:

```bash
npx serve .
```

Then open the URL printed in your terminal.

### Option 3: Open `index.html` directly
You can also double-click `index.html` to open it in a browser, but a local static server is usually better for consistent behavior.

## Controls (current)
- `←` / `→`: Steer left/right
- `↑` / `↓`: Ascend / descend (3D flight)
- `W`: Accelerate
- `S`: Brake / reverse thrust
- `SPACE`: Boost
- `1-9`, `0`, `C/E/M/H/S`: Warp shortcuts

## Quick test checklist
1. Launch mission with `SPACE` or click **INITIATE LAUNCH**.
2. Confirm steering (`←/→`) changes heading.
3. Confirm vertical movement (`↑/↓`) moves rocket up/down in 3D.
4. Confirm `W` accelerates, `S` brakes, and `SPACE` boosts.
5. Confirm warp keys move you to target bodies.
