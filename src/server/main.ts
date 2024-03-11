import p5 from "p5-node";
import { Lookup } from "../common/types";
import { initializeServer } from "./server";

import { Player } from "./entity";
import { World } from "./world";

const FPS = 60;

// Maps invite code to a `World`.
const rooms: Lookup<World> = {};

const io = initializeServer();

io.on("connection", (client) => {
  console.log("A new client connected.");

  let world: World | undefined;

  client.on("newGame", () => {
    const inviteCode = randomID();
    rooms[inviteCode] = new World();

    client.emit("createdGame", inviteCode);
  });

  client.on("gameExists", (inviteCode: string) => {
    client.emit("gameExists", inviteCode in rooms);
  });

  client.on("joinGame", (inviteCode: string) => {
    if (inviteCode in rooms) {
      // TODO(robin): start gameloop if you're the first player
      // to join.

      world = rooms[inviteCode];
      world.spawn(client.id, new Player());

      client.join(inviteCode);
      client.emit("joinedGame", world);
    } else {
      console.log("Warning: client tried to join game that doesn't exist.");
    }
  });

  client.on("move", ({ x, y, z }) => {
    if (!world) return;

    // @ts-ignore The `client.id` always returns an `Player` instance.
    const player: Player = world.entities[client.id];
    const movement = new p5.Vector(x, y, z);

    player.move(movement);
  });

  client.on("disconnect", () => {
    if (!world) return;

    world.despawn(client.id);
    // TODO(robin): remove world when empty

    console.log("A client left the game.");
  });
});

function gameLoop(inviteCode: string) {
  const world = rooms[inviteCode];
  world.update();

  io.to(inviteCode).emit("update", world);
  setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
}

function randomID() {
  return (Math.random() + 1).toString(36).substring(7);
}
