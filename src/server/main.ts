import p5 from "p5";
import { Lookup, Map } from "../common/types";
import { initializeServer } from "./server";

import { Player } from "./entity";
import { World } from "./world";

// Maps client ID or invite code to a mutable `World`.
const lookup: Lookup<World> = {};

const io = initializeServer();

io.on("connection", (client) => {
  let room: string;
  let world: World;

  client.once("newGame", newGame);
  client.once("joinGame", joinGame);

  client.on("move", handleMovement);

  function newGame() {
    const inviteCode = randomID();
    const map = randomMap();

    createGame(map, inviteCode);
    joinGame(inviteCode);
  }

  function createGame(map: Map, inviteCode: string) {
    world = new World(map);
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

  // Only the properties of a p5.Vector are serialized, hence the {x, y, z}.
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

function randomMap(): Map {
  // TODO(robin): this will be loaded from elsewhere,
  // like a file or smth :)

  return [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
}
