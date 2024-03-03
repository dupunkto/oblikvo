import p5 from "p5";
import { io, Socket } from "socket.io-client";

import { Entity } from "../common/entity";
import { World } from "../common/world";

export class Client {
  id: number;
  server: Socket;
  world: World;
  player: Entity;

  constructor() {
    this.server = io();

    this.server.on("connected", () => {
      console.log("Connected to server.");
    });
  }

  join(inviteCode: string) {
    this.server.emit("joinGame", inviteCode);
  }

  async new(): Promise<string> {
    this.server.emit("newGame");

    return new Promise(function (resolve) {
      this.server.on("createdGame", resolve);
    });
  }

  load(callback: (world: World) => void) {}

  broadcast(event: string, ...params: any) {
    this.server.emit(event, params);
  }
}
