import { WebSocketServer } from "ws";
import pty from "node-pty";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (socket) => {
  console.log("client connected");

  const shell = process.env.SHELL || "/bin/zsh";
  console.log("shell: ", shell);

  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.cwd(),
    env: process.env,
  });

  ptyProcess.onData((data) => {
    // console.log("onData", JSON.stringify(data));
    socket.send(data);
  });

  socket.addEventListener("message", (e) => {
    console.log("server received: ", e.data);

    const data = e.data.toString();
    try {
      const payload = JSON.parse(data);

      if (payload.type === "input") {
        ptyProcess.write(payload.data);
      } else if (payload.type === "resize") {
        if (
          Number.isInteger(payload.cols) &&
          Number.isInteger(payload.rows) &&
          payload.cols > 0 &&
          payload.rows > 0
        ) {
          ptyProcess.resize(payload.cols, payload.rows);
        }
      }
    } catch (error) {
      console.error("invalid ws message", error);
    }
  });

  socket.addEventListener("close", () => {
    ptyProcess.kill();
  });
});

console.log("WebSocket server is running on ws://localhost:3001");
