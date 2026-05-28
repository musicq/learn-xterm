import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const dom = document.getElementById("terminal");
if (!dom) {
  throw new Error("terminal element not found");
}

const ws = new WebSocket("ws://localhost:3001");

const fitAddon = new FitAddon();
const term = new Terminal({
  cursorBlink: true,
  cursorStyle: "bar",
  fontFamily: '"SFMono Nerd Font", Menlo, Monaco, "Courier New", monospace',
  fontSize: 14,
  theme: {
    background: "#1e1e1e",
    foreground: "#d4d4d4",
    cursor: "#fff",
  },
  scrollback: 1000,
});

term.loadAddon(fitAddon);
term.open(dom);
fitAddon.fit();

window.addEventListener("resize", handleResize);

term.onData((data) => {
  console.log("onData", JSON.stringify(data));

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: "input",
        data,
      })
    );
  }
});

term.write("connecting...\r\n");

// term.write("line 1\r\n");
// term.write("line 2\r\n");
// term.write("line 3\r\n");

// setTimeout(() => {
//   term.write("\x1b[2J\x1b[H");
//   term.write("after clear\r\n");
// }, 1000);

ws.addEventListener("open", () => {
  term.write("ws opened\r\n");
  sendResize();
});

ws.addEventListener("message", (e) => {
  term.write(e.data);
});

function sendResize() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: "resize",
        cols: term.cols,
        rows: term.rows,
      })
    );
  }
}

function handleResize() {
  fitAddon.fit();
  sendResize();
}

function cleanup() {
  window.removeEventListener("resize", handleResize);
  term.dispose();
  fitAddon.dispose();
  ws.close();
}

window.addEventListener("beforeunload", cleanup);
