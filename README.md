# 🃏 Poker Planning UNO

A fast, playful, and minimalist real-time **Poker Planning & Agile Estimation** web app inspired by the timeless fun and vibrant aesthetic of the **UNO** card game.

Designed to eliminate agile ceremony fatigue, bring laughter to story point estimation, and protect team privacy with a 100% ephemeral, in-memory architecture.

🎮 **Live Demo**: Try it with your team right now at **[https://uno-planning.onrender.com/](https://uno-planning.onrender.com/)**

---

## 🌟 Why Teams Love It (Key Features)

- 🃏 **UNO-Themed Fibonacci Deck**: 9 balanced estimation cards (`0`, `1`, `2`, `3`, `5`, `8`, `13`, `?`, `☕`) with cyclical UNO colors (Blue, Green, Yellow, Red) and special wildcards (`?` for uncertainty, `☕` for coffee/break).
- 🔒 **100% Ephemeral & Private**: Zero databases, zero third-party tracking, and zero signups. All rooms, tasks, and votes live strictly in RAM and are permanently wiped as soon as a room is closed.
- ⚡ **Real-Time Collaboration**: Sub-millisecond room synchronization powered by WebSockets via Socket.io.
- 🎭 **3D Card Flip Animation**: Votes stay face-down behind the iconic "POKER" card back and flip simultaneously in 3D when revealed.
- 🚀 **Parabolic Comic Reactions**: Throw humorous projectiles (`☕`, `🍅`, `🔥`, `🔪`, `🧱`, `💩`, `💀`, `👾`, `⏰`) at teammate cards with GPU-accelerated ballistic flight arcs, 3D scale elevation, dynamic rotational spin, and wobble impacts.
- ⏱️ **Authoritative Timer & Web Audio Soundscapes**: Configurable round countdowns with optional auto-reveal on expiration and zero-latency audio synthesized directly via the Web Audio API (start chime, midpoint bell, countdown ticks, and end fanfare).
- 📋 **Live Task & Jira Backlog**: Paste task titles or Jira links, track estimated story points, and navigate automatically with smooth auto-scroll to the active story.
- 📊 **Instant Metrics & Confetti Consensus**: Automatic computation of arithmetic average, statistical mode, and unanimous agreement with celebratory confetti bursts.
- 👥 **Spectator Mode & Avatars**: Join as a spectator (PO, Scrum Master, or observer) without skewing vote averages, accompanied by generative DiceBear avatars and host reconnection tokens.
- 🌓 **Dynamic Theme Switching**: Seamlessly toggle between dark poker table felt and crisp light mode.

---

## 🛠️ Technology Stack

### Frontend
- **[React 19](https://react.dev/)**: Latest functional components and hooks for reactive state management.
- **[Vite 8](https://vitejs.dev/)**: Next-generation frontend build tooling with instant Hot Module Replacement (HMR).
- **[Tailwind CSS v4](https://tailwindcss.com/)**: High-performance utility-first styling engine integrated via `@tailwindcss/vite`.
- **[Socket.io Client 4](https://socket.io/)**: Real-time WebSocket connection client with automatic reconnection and fallback.
- **Web Audio API**: Browser-native sound synthesis (zero external audio files or bandwidth required).
- **[Lucide React](https://lucide.dev/)**: Clean, accessible, modern iconography.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: High-performance canvas-rendered celebratory particles.
- **[DiceBear Avatars API](https://www.dicebear.com/)**: Deterministic, seed-based generative avatars for room participants.

### Backend
- **[Node.js](https://nodejs.org/)**: Scalable asynchronous JavaScript runtime.
- **[Express 4](https://expressjs.com/)**: Minimalist HTTP framework serving static client production bundles.
- **[Socket.io 4](https://socket.io/)**: Authoritative real-time server orchestrating room state, timing, and anonymized reactions.
- **[Helmet](https://helmetjs.github.io/) & [CORS](https://www.npmjs.com/package/cors)**: Security headers, strict Content Security Policy (CSP), clickjacking prevention, and safe cross-origin policies.
- **Native Cryptography (`node:crypto`)**: Cryptographically secure room code generation and unguessable host authorization tokens.
- **In-Memory Rate Limiting**: Built-in sliding window rate limiters preventing socket flooding, spamming, and task bombing.

---

## 📋 System Requirements

Ensure your environment satisfies the following prerequisites before running locally:

| Requirement | Recommended Version | Minimum Version | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v20.x LTS` or `v22.x LTS` | `v18.11.0+` | Node 18.11+ is required for the native `--watch` flag used in development. |
| **npm** | `v9.x+` or `v10.x+` | `v9.0.0+` | Bundled with modern Node.js installations. |
| **Modern Browser** | Latest stable | Evergreen | Chrome, Firefox, Safari, or Edge supporting WebSockets and Web Audio API. |

---

## 🚀 Local Development Setup

Follow these simple steps to clone, install, and launch the application on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/ArturoHerrera/uno-planning.git
cd uno-planning
```

### 2. Install dependencies
Install dependencies for both the root backend server and the React client application:
```bash
npm install
npm --prefix client install
```

### 3. Start development servers
Run both the backend (with live code reloading via `node --watch`) and the Vite frontend dev server concurrently:
```bash
npm run dev
```

Once running:
- **Client (Frontend)**: Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Server (Backend)**: Running at [http://localhost:3000](http://localhost:3000).

*(Any changes made to frontend components or server files will update immediately in real time.)*

---

## 🧪 Testing & Verification

The project includes automated security auditing and multi-client simulated integration testing:

```bash
# Run the 7-step security & rate-limiting audit (headers, tokens, anti-hijacking, input validation)
npm run test:security

# Run the end-to-end multi-client simulation (room creation, voting, consensus, timer, reaction bursts)
npm run test:e2e
```

---

## 📦 Production Build & Local Preview

To build the client bundle and run the unified production server locally:

```bash
# 1. Compile the optimized client production assets
npm run build

# 2. Start the production Express server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to preview the complete production build.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
