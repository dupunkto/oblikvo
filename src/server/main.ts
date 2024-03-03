import p5 from "p5";
import { initializeServer } from "./server";

import { Player } from "../common/entity";
import { World } from "../common/world";

// Maps client ID or invite code to a mutable `World`.
type Lookup = { [inviteCode: string]: World };
const lookup: Lookup = {};

const io = initializeServer();

io.on("connection", (client) => {
  let room: string;
  let world: World;

  client.once("newGame", newGame);
  client.once("joinGame", joinGame);

  client.on("move", handleMovement);

  function newGame() {
    const inviteCode = randomID();
    createGame(inviteCode);
    joinGame(inviteCode);
  }

  function createGame(inviteCode: string) {
    world = new World();
    lookup[inviteCode] = world;

    client.emit("createdGame", inviteCode);
  }

  function joinGame(inviteCode: string) {
    if (inviteCode in lookup) {
      room = inviteCode;
      client.join(room);

      const player = new Player();
      world = lookup[inviteCode];
      world.spawn(client.id, player);

      client.emit("joinedGame", world);
      io.to(room).emit("entitySpawned", client.id, player);
    }
  }

  // Only the properties of a Vector are serialized, hence the {x, y, z}.
  function handleMovement({ x, y, z }: p5.Vector) {
    // @ts-ignore the client.id always returns a `Player`.
    const player: Player = world.entities[client.id];
    player.move(new p5.Vector(x, y, z));

    io.to(room).emit("entityMoved", client.id, player);
  }

  client.on("disconnect", () => {
    console.log("A client left the game.");
  });
});

function randomID() {
  return (Math.random() + 1).toString(36).substring(7);
}
