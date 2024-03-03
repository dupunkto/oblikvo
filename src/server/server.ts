import { Socket } from "socket.io";

import { Entity } from "../common/entity";
import { World, Map } from "../common/world";

export class State {
  inviteCode: string;
  world: World;
}

export class Connection {
  client: Socket;
  state: State;

  constructor(client: Socket, state: State) {
    console.log("A new client joined the game.");

    this.client = client;
    this.state = state;

    client.on("disconnect", () => {
      console.log("A client left the game.");
    });
  }
}
