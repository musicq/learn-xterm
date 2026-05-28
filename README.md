# learn-xterm

A minimal web terminal demo built with [xterm.js](https://xtermjs.org/), WebSocket, and [node-pty](https://github.com/microsoft/node-pty). It connects a browser-based terminal emulator to a real shell session on the backend.

Also includes a standalone knowledge page (`xterm-terminal-knowledge.html`) covering terminal concepts, PTY, ANSI sequences, and debugging tips.

## Prerequisites

- Node.js >= 18
- pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the backend PTY server
node server.js

# In another terminal, start the frontend dev server
pnpm dev
```

Open the URL printed by Vite (usually `http://localhost:5173`) to use the web terminal.
