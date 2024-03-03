import p5 from "p5";
import { io, Socket } from "socket.io-client";

import { Entity } from "../common/entity";
import { World } from "../common/world";

export class Client {
  socket: Socket;

  join(inviteCode: string) {
    this.socket = io();
  }

  load(callback: (world: World) => void) {}
  broadcast(event: string, params: object) {}
  receive(event) {}
}
