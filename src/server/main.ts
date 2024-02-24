import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const staticAssets = process.env.DIST;
app.use(express.static(staticAssets));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
