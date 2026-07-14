# TypeClash ⌨️🏁

> **Real-time multiplayer typing races & solo speed tests** — competitive, fast, and polished.

![TypeClash Banner](./docs/banner.png)

---

## Features

### Solo Mode
- 🎯 **Live WPM & accuracy** stats updated every 250ms
- 🔥 **Streak multiplier** — consecutive correct keystrokes build a combo (×1 → ×5)
- 👻 **Ghost replay** — retry the same passage and race your previous self (stored in `localStorage`)
- 🎹 **Mistake heatmap** — bar chart of your most-mistyped characters
- 📋 **Custom text** — paste any text to practice on

### Multiplayer (2–4 Players)
- 🔗 **Room codes** — 6-character shareable codes (or direct link)
- 📡 **Real-time race track** — live progress bars per player via Socket.io
- ⏱️ **3-2-1 countdown** before all players start simultaneously
- 🏆 **Live leaderboard** with WPM and % completion per player
- 🔄 **Rematch** — same room, fresh passage, instant reset
- 💥 **Disconnect handling** — rooms survive individual dropouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS (CSS custom properties) |
| Routing | React Router v7 |
| Real-time | Socket.io (client + server) |
| Backend | Node.js + Express |
| Fonts | Space Grotesk (UI) + JetBrains Mono (typing) |

---

## Project Structure

```
Type_X/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero/            # Animated keyboard hero section
│   │   │   ├── ModeSelect/      # Solo vs Multiplayer card chooser
│   │   │   ├── SoloTest/        # Core typing engine UI
│   │   │   ├── MistakeHeatmap/  # Error analysis bar chart
│   │   │   ├── MultiplayerRoom/ # Room create/join + lobby
│   │   │   ├── RaceTrack/       # Live race progress bars
│   │   │   └── ResultsScreen/   # Post-race standings
│   │   ├── hooks/
│   │   │   ├── useTypingEngine.js  # Core typing state machine
│   │   │   ├── useSocket.js        # Socket.io event management
│   │   │   └── useGhostReplay.js   # Ghost cursor recording/playback
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Solo.jsx
│   │   │   └── Multiplayer.jsx
│   │   └── utils/
│   │       ├── wordBank.js    # 500+ word pool + curated passages
│   │       └── stats.js       # WPM/accuracy calculation helpers
│   └── package.json
├── backend/               # Node + Express + Socket.io server
│   ├── src/
│   │   ├── server.js          # Main server + socket events
│   │   ├── roomManager.js     # In-memory room state management
│   │   └── passageGenerator.js # 30+ typing passages
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/typeclash.git
cd typeclash
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment

Create `frontend/.env.local`:
```env
VITE_BACKEND_URL=http://localhost:3001
```

### 4. Run locally

Open **two terminals**:

```bash
# Terminal 1 — Backend (Socket.io server)
cd backend
npm start
# Server running on http://localhost:3001

# Terminal 2 — Frontend (Vite dev server)
cd frontend
npm run dev
# App running on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

For multiplayer testing, open two separate browser windows and create/join a room.

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

Set `VITE_BACKEND_URL` in your Vercel environment variables to your backend URL.

### Backend → Railway / Render

1. Connect your GitHub repo to [Railway](https://railway.app) or [Render](https://render.com)
2. Set the root directory to `backend/`
3. Start command: `npm start`
4. No environment variables needed (PORT is set automatically)

Update `VITE_BACKEND_URL` in your frontend deployment to point to the backend URL.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#E63946` | Buttons, active states, progress bars |
| `--bg` | `#FFFFFF` | Page background |
| `--bg-card` | `#F7F2F2` | Cards, test areas |
| `--ink` | `#1A1A1A` | Primary text |
| `--muted` | `#8C8C8C` | Secondary text, labels |
| `--success` | `#4A7C59` | Perfect accuracy state |

---

## Socket.io Event Reference

| Event | Direction | Description |
|---|---|---|
| `room:create` | client → server | Create a new room |
| `room:join` | client → server | Join by room code |
| `room:state` | server → client | Full room snapshot |
| `room:ready` | client → server | Toggle ready state |
| `room:start` | client → server | Host force-starts |
| `race:countdown` | server → client | Countdown tick (3→2→1) |
| `race:go` | server → client | Race starts, passage delivered |
| `race:progress` | client → server | Player's current position |
| `race:update` | server → client | All players' live state |
| `race:finish` | client → server | Player completed the passage |
| `race:results` | server → client | Final standings |
| `race:rematch` | client → server | Host requests new round |

---

## License

MIT — feel free to fork, modify, and race your friends.
