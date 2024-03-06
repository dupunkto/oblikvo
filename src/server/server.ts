// The node `http` module is implemented by Bun to use
// Bun.serve() under-the-hood (so it's fast :D). I could
// rewrite the entire server to use their fancy Websockets API,
// but I'm lazy; we're sticking to socket.io for now.

import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";

const STATIC = process.env["DIST"] || "dist";
const PORT = 4000;

export function initializeServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.static(STATIC));

  server.listen(PORT, () => {
    console.log(`Serving './${STATIC}' on http://localhost:${PORT}`);
  });

  return new SocketIO(server);
}
