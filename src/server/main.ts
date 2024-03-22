import p5 from "p5-node";

import { initializeServer } from "./server";
import { Player, World } from "./world";

const FPS = 60;

type inviteCode = string;
const rooms: Map<inviteCode, World> = new Map();

const io = initializeServer();

io.on("connection", (client) => {
  console.log("A new client connected.");

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

      // Start gameloop if you're the first player to join.
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
    const player: Player = world.entities.get(client.id);
    const movement = new p5.Vector(x, y, z);

    player.move(movement);
  });

  client.on("disconnect", () => {
    if (!world) return;
    world.despawn(client.id);
    console.log("A client left the game.");
  });
});

function gameLoop(inviteCode: inviteCode) {
  if (!rooms.has(inviteCode)) return;
  const world = rooms.get(inviteCode);

  if (world.empty) {
    rooms.delete(inviteCode);
    return;
  } else {
    world.update();

    io.to(inviteCode).emit("update", world);
    setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
  }
}

function randomID() {
  return (Math.random() + 1).toString(36).substring(7);
}
