import p5 from "p5-node";
import { initializeServer } from "./server";

import { willHit, distanceBetween } from "./raycast";
import { randomID } from "../common/random";

import Vector from "../common/vector";
import Entity from "./entity";
import Room from "./room";

type inviteCode = string;
const rooms: Map<inviteCode, Room> = new Map();

const FPS = 60;

const io = initializeServer();

io.on("connection", (client) => {
  dbg("A new client connected.");

  let room: Room | undefined;

  client.once("newGame", () => {
    const inviteCode = randomID();
    rooms.set(inviteCode, new Room());

    client.emit("createdGame", inviteCode);
  });

  client.on("gameExists", (inviteCode: inviteCode) => {
    client.emit("gameExists", rooms.has(inviteCode));
  });

  client.once("joinGame", (inviteCode: inviteCode) => {
    if (rooms.has(inviteCode)) {
      rooms.get(inviteCode)?.join(client.id);

      client.join(inviteCode);
      client.emit("joinedGame", randomID());
    } else {
      dbg("Warning: client tried to join game that doesn't exist.");
    }
  });

  client.once("startGame", (inviteCode) => {
    // Only allow players to start their own game.
    if (room && room != rooms.get(inviteCode)) return;

    io.to(inviteCode).emit("startedGame", room.start());
    gameLoop(inviteCode); // Kickstart gameloop.
  });

  client.on("move", ({ x, y, z }: Vector) => {
    if (!room) return;
    room.move(client.id, new p5.Vector(x, y, z));
  });

  client.on("shoot", ({ x, y, z }: Vector) => {
    if (!room) return;

    const player: Entity = room.world.entities.get(client.id);
    const direction = new p5.Vector(x, y, z);

    room.world.entities.forEach((entity, id) => {
      if (willHit(entity, player.position, direction)) {
        const distance = distanceBetween(player.position, entity.position);

        entity.hit(distance);
        client.emit("hit", { from: client.id, to: id });
      }
    });
  });

  client.on("disconnect", () => {
    if (!room) return;
    room.leave(client.id);

    dbg("A client left the game.");
  });
});

function gameLoop(inviteCode: inviteCode) {
  if (!rooms.has(inviteCode)) return;
  const room = rooms.get(inviteCode);

  // End game if there are no players left.
  if (room.empty) {
    rooms.delete(inviteCode);
    return;
  } else {
    io.to(inviteCode).emit("update", room.update());
    setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
  }
}

function dbg(message: string) {
  console.log(message);
}
