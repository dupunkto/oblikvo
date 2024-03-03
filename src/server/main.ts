// The node `http` module is implemented by Bun to use
// Bun.serve() under-the-hood (so it's fast :D). I could
// rewrite the entire server to use their fancy Websockets API,
// but I'm lazy; we're sticking to socket.io for now.

import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";

import { State, Connection } from "./server";

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const staticAssets = process.env.DIST;
app.use(express.static(staticAssets));

// Maps client ID to a mutable `State`.
const games = {};

io.on("connection", (socket) => {
  new Connection(socket);
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
