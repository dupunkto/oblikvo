import p5 from "p5-node";

import Vector from "../common/vector";
import Room from "./room";

import { initializeServer } from "./server";
import { randomID } from "../common/random";

type inviteCode = string;
const rooms: Map<inviteCode, Room> = new Map();

const io = initializeServer();

io.on("connection", (client) => {
  dbg("A new client connected.");

  let room: Room | undefined;

  client.once("newGame", () => {
    const inviteCode = randomID();
    rooms.set(inviteCode, new Room(inviteCode));

    client.emit("createdGame", inviteCode);
  });

  client.on("gameExists", (inviteCode: inviteCode) => {
    client.emit("gameExists", rooms.has(inviteCode));
  });

  client.once("joinGame", (inviteCode: inviteCode) => {
    if (rooms.has(inviteCode)) {
      room = rooms.get(inviteCode);

      // @ts-ignore `room` is definitely not undefined.
      // I just called rooms.has(inviteCode) in the if-statement.
      // Fucking dumbass type checker.
      const payload = room.join(client.id);

      client.join(inviteCode);
      client.emit("joinedGame", payload);
    } else {
      dbg("Warning: client tried to join game that doesn't exist.");
    }
  });

  client.once("startGame", (inviteCode) => {
    // Only allow players to start their own game.
    if (!room || room != rooms.get(inviteCode)) return;

    io.to(inviteCode).emit("startedGame", room.start());
    gameLoop(inviteCode); // Kickstart gameloop.
  });

  client.on("move", ({ x, y, z }: Vector) => {
    if (!room) return;
    room.move(client.id, new p5.Vector(x, y, z));
  });

  client.on("shoot", ({ x, y, z }: Vector) => {
    if (!room) return;
    room.shoot(client.id, new p5.Vector(x, y, z), (id: string) => {
      // @ts-ignore ??
      io.to(room.inviteCode).emit("hit", { from: client.id, to: id });
    });
  });

  client.on("disconnect", () => {
    if (!room) return;
    room.leave(client.id);

    dbg("A client left the game.");
  });
});

const FPS = 60;

function gameLoop(inviteCode: inviteCode) {
  if (!rooms.has(inviteCode)) return;
  const room = rooms.get(inviteCode);

  // End game if there are no players left.
  if (!room || room.empty) {
    rooms.delete(inviteCode);
    return;
  }

  io.to(inviteCode).emit("update", room.update());
  setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
}

function dbg(message: string) {
  console.log(message);
}
