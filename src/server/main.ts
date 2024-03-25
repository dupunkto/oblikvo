import p5 from "p5-node";
import { initializeServer } from "./server";

import Vector from "../common/vector";
import Player from "./player";
import World from "./world";

import { Type as PayloadType } from "../common/payload";

const FPS = 60;

type inviteCode = string;
const rooms: Map<inviteCode, World> = new Map();

const io = initializeServer();

io.on("connection", (client) => {
  dbg("A new client connected.");

  let world: World | undefined;

  client.once("newGame", () => {
    const inviteCode = randomID();
    rooms.set(inviteCode, new World());

    client.emit("createdGame", inviteCode);
  });

  client.on("gameExists", (inviteCode: inviteCode) => {
    client.emit("gameExists", rooms.has(inviteCode));
  });

  client.once("joinGame", (inviteCode: inviteCode) => {
    if (rooms.has(inviteCode)) {
      world = rooms.get(inviteCode);

      // Please the TS compiler (yet again): we already check if `world`
      // is defined in the fucking if-statement, but it complains anyway.
      if (!world) return;

      const firstPlayer = world.empty;
      world.spawn(client.id, new Player());

      client.join(inviteCode);

      const payload = world.serialize(PayloadType.Initial);
      client.emit("joinedGame", payload);

      // Kickstart gameloop if you're the first player to join.
      if (firstPlayer) gameLoop(inviteCode);
    } else {
      dbg("Warning: client tried to join game that doesn't exist.");
    }
  });

  client.on("move", ({ x, y, z }: Vector) => {
    if (!world) return;

    // @ts-ignore The `client.id` always returns an `Player` instance.
    const player: Player = world.entities.get(client.id);
    const movement = new p5.Vector(x, y, z);

    player.move(movement);
  });

  client.on("disconnect", () => {
    if (!world) return;
    world.despawn(client.id);

    dbg("A client left the game.");
  });
});

function gameLoop(inviteCode: inviteCode) {
  if (!rooms.has(inviteCode)) return;
  const world = rooms.get(inviteCode);

  // @ts-ignore see comment in `joinGame`.
  if (world.empty) {
    // End game if there are no players left.
    rooms.delete(inviteCode);

    return;
  } else {
    // @ts-ignore also see comment in `joinGame`.
    world.update();

    // @ts-ignore again, see comment in `joinGame`
    const payload = world.serialize(PayloadType.Update);

    io.to(inviteCode).emit("update", payload);
    setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
  }
}

function randomID() {
  return (Math.random() + 1).toString(36).substring(7);
}

function dbg(message: string) {
  console.log(message);
}
