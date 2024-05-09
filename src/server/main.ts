import { initializeServer } from "./server";
import { randomID } from "../common/random";

import Entity from "./entity";
import Room from "./room";

import { FPS } from "../common/constants";

type inviteCode = string;
const rooms: Map<inviteCode, Room> = new Map();
const replays: Map<inviteCode, inviteCode> = new Map();

const io = initializeServer();

io.on("connection", (client) => {
  dbg("A new client connected.");

  let room: Room | undefined;

  client.on("newGame", () => {
    const inviteCode = randomID();
    rooms.set(inviteCode, new Room(inviteCode));

    client.emit("created", inviteCode);
  });

  client.on("gameExists", (inviteCode: inviteCode) => {
    const joinable = rooms.get(inviteCode)?.status == "pending";
    client.emit("gameExists", joinable);
  });

  client.on("joinGame", (inviteCode: inviteCode) => {
    if (rooms.has(inviteCode)) {
      room = rooms.get(inviteCode) as Room;
      const payload = room.join(client.id);

      client.join(inviteCode);
      client.emit("joined", payload);

      io.to(inviteCode).emit("player-count", room.playerCount);
    } else {
      dbg("Warning: client tried to join game that doesn't exist.");
    }
  });

  client.on("startGame", (inviteCode) => {
    // Only allow players to start their own game.
    if (!room || room != rooms.get(inviteCode)) return;

    io.to(inviteCode).emit("started", room.start());
    gameLoop(inviteCode); // Kickstart gameloop.
  });

  client.on("move", (movement) => {
    room?.move(client.id, movement);
  });

  client.on("shoot", (direction) => {
    room?.shoot(client.id, direction, (entity: Entity) => {
      // Yup, yet again pleasing the TS compiler. More like BS
      // compiler at this point...
      // (Context: the room cannot be nil, because we're in the
      // callback ON THE FUCKING ROOM.)
      if (!room) throw "room not set?!";

      if (entity.health <= 0) {
        io.to(room.inviteCode).emit("kill", { from: client.id, to: entity.id });
      } else {
        io.to(room.inviteCode).emit("hit", { from: client.id, to: entity.id });
      }
    });
  });

  client.on("disconnect", () => {
    if (!room) return;

    io.to(room.inviteCode).emit("left", room.world.entities.get(client.id));
    io.to(room.inviteCode).emit("player-count", room.playerCount - 1);

    room.leave(client.id);
    dbg("A client left the game.");
  });
});

function gameLoop(inviteCode: inviteCode) {
  if (!rooms.has(inviteCode)) return;
  const room = rooms.get(inviteCode);

  // End game if there are no players left.
  if (!room || room.empty) {
    rooms.delete(inviteCode);
    return;
  }

  // End game when time's up.
  if (room.timeLeft <= 0) {
    io.to(inviteCode).emit("finished", room.finish());
  }

  io.to(inviteCode).emit("update", room.update());
  setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
}

function dbg(message: string) {
  console.log(message);
}
