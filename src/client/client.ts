import { io, Socket } from "socket.io-client";

import { CommonEntity } from "../common/interfaces";
import { CommonWorld } from "../common/interfaces";

import { World } from "./world";

export class Client {
  server: Socket;
  world: World;

  // `undefined` if the connection is broken.
  id: string | undefined;

  constructor() {
    this.server = io();
    this.world = new World();

    this.server.on("connected", () => {
      this.id = this.server.id;
      console.log("Connected to server.");
    });
  }

  async join(inviteCode: string): Promise<void> {
    this.server.emit("joinGame", inviteCode);

    return new Promise((resolve) => {
      // Return after the world has been loaded.
      this.server.on("joinedGame", (world: CommonWorld) => {
        this.world.load(world);
        resolve();
      });
    });
  }

  async new(): Promise<string> {
    this.server.emit("newGame");

    return new Promise((resolve) => {
      // Return the inviteCode.
      this.server.on("createdGame", resolve);
    });
  }

  public get player(): CommonEntity {
    if (!this.id) throw "Client not connected.";
    return this.world.entities[this.id];
  }

  broadcast(event: string, ...params: any) {
    this.server.emit(event, params);
  }
}
