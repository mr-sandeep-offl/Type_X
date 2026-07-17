# TypeClash ⌨️🏁

> **Real-time multiplayer typing races & solo speed tests** — competitive, fast, and polished.

![TypeClash Banner](/banner.png)

---

## ✨ Features

### 🎯 Solo Mode

- Live **WPM** & **Accuracy** tracking (updates every 250ms)
- 🔥 Streak multiplier (×1 → ×5 combo system)
- 👻 Ghost Replay — race against your previous attempt
- 📊 Mistake Heatmap showing your most mistyped characters
- 📝 Custom Text mode to practice with any passage
- ⚡ Smooth typing engine with instant feedback

---

### 🌐 Multiplayer Mode (2–4 Players)

- 🔗 6-character room codes for quick sharing
- 📡 Real-time race progress powered by Socket.io
- ⏱️ Synchronized 3-2-1 countdown
- 🏆 Live leaderboard with WPM & completion %
- 🔄 Instant rematch without creating another room
- 💥 Automatic disconnect handling

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS + CSS Variables |
| Routing | React Router v7 |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Fonts | Space Grotesk + JetBrains Mono |

---

# 📂 Project Structure

```text
Type_X/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero/
│   │   │   ├── ModeSelect/
│   │   │   ├── SoloTest/
│   │   │   ├── MistakeHeatmap/
│   │   │   ├── MultiplayerRoom/
│   │   │   ├── RaceTrack/
│   │   │   └── ResultsScreen/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useTypingEngine.js
│   │   │   ├── useSocket.js
│   │   │   └── useGhostReplay.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Solo.jsx
│   │   │   └── Multiplayer.jsx
│   │   │
│   │   └── utils/
│   │       ├── wordBank.js
│   │       └── stats.js
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── roomManager.js
│   │   └── passageGenerator.js
│   │
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js **18+**
- npm **9+**

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/typeclash.git
cd typeclash
```

---

## 2️⃣ Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3️⃣ Configure Environment

Create a file named:

```text
frontend/.env.local
```

Add:

```env
VITE_BACKEND_URL=http://localhost:3001
```

---

## 4️⃣ Run the Application

Open **two terminals**.

### Terminal 1 (Backend)

```bash
cd backend
npm start
```

Runs on:

```text
http://localhost:3001
```

---

### Terminal 2 (Frontend)

```bash
cd frontend
npm run dev
```

Runs on:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

To test multiplayer, open the application in two browser windows and join the same room.

---

# 🌍 Deployment

## Frontend (Vercel)

```bash
cd frontend
npm run build
```

Deploy the generated `dist/` folder to **Vercel**.

Set:

```env
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## Backend (Railway / Render)

1. Connect your GitHub repository.
2. Set the root directory to:

```text
backend/
```

3. Start command:

```bash
npm start
```

The hosting platform automatically provides the `PORT` environment variable.

After deployment, update the frontend's `VITE_BACKEND_URL` to point to your deployed backend.

---

# 🎨 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--accent` | `#E63946` | Primary buttons & highlights |
| `--bg` | `#FFFFFF` | Background |
| `--bg-card` | `#F7F2F2` | Cards & typing area |
| `--ink` | `#1A1A1A` | Main text |
| `--muted` | `#8C8C8C` | Secondary text |
| `--success` | `#4A7C59` | Success state |

---

# 🔌 Socket.io Events

| Event | Direction | Description |
|--------|-----------|-------------|
| `room:create` | Client → Server | Create a room |
| `room:join` | Client → Server | Join using room code |
| `room:state` | Server → Client | Current room snapshot |
| `room:ready` | Client → Server | Toggle ready status |
| `room:start` | Client → Server | Host starts the race |
| `race:countdown` | Server → Client | Countdown before race |
| `race:go` | Server → Client | Start race & send passage |
| `race:progress` | Client → Server | Send player progress |
| `race:update` | Server → Client | Broadcast player updates |
| `race:finish` | Client → Server | Player completed race |
| `race:results` | Server → Client | Final leaderboard |
| `race:rematch` | Client → Server | Start another round |

---

# 🚀 Future Improvements

- 👥 Global matchmaking
- 🏅 Player profiles & statistics
- 🌎 Online leaderboards
- 🎖 Achievement system
- 🎨 Multiple themes
- 📱 Fully responsive mobile gameplay
- 🔊 Sound effects & keyboard feedback

---

## ⭐ If you enjoyed this project, consider giving it a star on GitHub!
