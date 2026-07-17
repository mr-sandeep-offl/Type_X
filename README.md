# TypeClash

A real-time multiplayer typing game with solo speed tests. TypeClash is built to provide a fast, competitive, and responsive typing experience using React, Node.js, Express, and Socket.io.

## Features

### Solo Mode

- Live WPM and accuracy tracking
- Streak multiplier system
- Ghost replay to race against previous attempts
- Mistake heatmap
- Custom text practice
- Instant typing feedback

### Multiplayer Mode

- 2–4 player real-time races
- 6-character room codes
- Synchronized countdown
- Live leaderboard
- Instant rematch
- Automatic disconnect handling

## Tech Stack

| Layer | Technology |
| ------ | ---------- |
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Routing | React Router v7 |
| Styling | Vanilla CSS |
| Fonts | Space Grotesk, JetBrains Mono |

## Project Structure

```text
TypeClash/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── roomManager.js
│   │   └── passageGenerator.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Clone the Repository

```bash
git clone https://github.com/your-username/typeclash.git
cd typeclash
```

### Install Dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd ../frontend
npm install
```

### Environment Variables

Create a file named:

```text
frontend/.env.local
```

Add:

```env
VITE_BACKEND_URL=http://localhost:3001
```

### Run the Project

Start the backend:

```bash
cd backend
npm start
```

Backend runs at:

```text
http://localhost:3001
```

Open another terminal and start the frontend:

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open the application in your browser.

To test multiplayer mode, open the app in two browser windows and join the same room.

## Deployment

### Frontend

Build the project:

```bash
cd frontend
npm run build
```

Deploy the generated `dist` folder to Vercel.

Set:

```env
VITE_BACKEND_URL=https://your-backend-url.com
```

### Backend

Deploy the `backend` folder to Railway, Render, or another Node.js hosting service.

Start command:

```bash
npm start
```

The hosting platform will automatically provide the `PORT` environment variable.

## Socket Events

| Event | Description |
| ------ | ----------- |
| room:create | Create a room |
| room:join | Join a room |
| room:state | Receive room state |
| room:ready | Toggle ready status |
| room:start | Start the race |
| race:countdown | Countdown before race |
| race:go | Start race |
| race:progress | Update player progress |
| race:update | Broadcast progress |
| race:finish | Finish race |
| race:results | Final leaderboard |
| race:rematch | Start another race |

## Future Improvements

- Global matchmaking
- Player profiles
- Online leaderboards
- Achievement system
- Multiple themes
- Mobile optimization
- Sound effects

## License

This project is licensed under the MIT License.

---

If you found this project useful, consider giving it a ⭐ on GitHub.
