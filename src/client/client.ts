import { io, Socket } from "socket.io-client";

import { Entity } from "../common/entity";
import { World, Level } from "../common/world";

export class Client {
  server: Socket;
  world: World;
  player: Entity;

  // `undefined` is the connection is broken.
  id: string | undefined;

  constructor() {
    this.server = io();
    this.world = new World();
    this.player = new Entity();

    this.server.on("connected", () => {
      this.id = this.server.id;
      console.log("Connected to server.");
    });
  }

  join(inviteCode: string) {
    this.server.emit("joinGame", inviteCode);
    this.server.on("joinedGame", (world) => {
      this.cast(world);
    });
  }

  // This variable contains the structure of the `World`
  // class and it's children, but doesn't have all the attached
  // methods etc. This function copies the data from this
  // "shell" to the internal world state the game uses.
  cast(world: any) {
    this.world.entities = world.entities.forEach((data: object) =>
      Object.assign(new Entity(), data)
    );
  }

  async new(): Promise<string> {
    this.server.emit("newGame");

    return new Promise((resolve) => {
      // Returns the inviteCode.
      this.server.on("createdGame", resolve);
    });
  }

  // @ts-ignore TODO(robin)
  load(callback: (world: World) => void) {}

  broadcast(event: string, ...params: any) {
    this.server.emit(event, params);
  }
}
