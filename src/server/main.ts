import { initializeServer } from "./server";
import { randomID } from "../common/random";

import Vector from "../common/vector";
import Entity from "./entity";
import Room from "./room";

import { FPS } from "../common/constants";

type Socket = any;
type Code = string;

const rooms: Map<Code, Room> = new Map();
const replays: Map<Code, Code> = new Map();

const io = initializeServer();

class Connection {
  client: Socket;
  inviteCode: Code | undefined;

  constructor(client: Socket) {
    dbg("A new client connected.");

    this.client = client;
    this.inviteCode = undefined;

    this.registerHandler("newGame");
    this.registerHandler("newGameFromExisting");
    this.registerHandler("gameExists");
    this.registerHandler("joinGame");
  }

  public handleNewGame() {
    const inviteCode = randomID();
    rooms.set(inviteCode, new Room(inviteCode));

    this.client.emit("created", inviteCode);
  }

  public handleNewGameFromExisting(previousCode: Code) {
    const replayExists = replays.has(previousCode);
    const newCode = replayExists ? replays.get(previousCode) : randomID();

    if (!replayExists) this.createReplay(previousCode, newCode as string);

    this.client.emit("created", newCode);
  }

  createReplay(previousCode: Code, newCode: Code) {
    rooms.set(newCode, new Room(newCode));
    replays.set(previousCode, newCode);
  }

  public handleGameExists(inviteCode: Code) {
    const joinable = rooms.get(inviteCode)?.joinable;
    this.client.emit("gameExists", joinable);
  }

  public handleJoinGame(inviteCode: Code) {
    if (rooms.has(inviteCode)) {
      this.inviteCode = inviteCode;
      const payload = this.room.join(this.client.id);

      this.client.join(inviteCode);
      this.client.emit("joined", payload);
      this.server.emit("player-count", this.room.playerCount);
    } else {
      dbg("Warning: client tried to join game that doesn't exist.");
    }
  }

  public handleStartGame() {
    if (this.room) {
      this.server.emit("started", this.room.start());
      gameLoop(this.inviteCode as string);
    }
  }

  public handleMove(movement: Vector) {
    this.room.move(this.client.id, movement);
  }

  public handleShoot(direction: Vector) {
    this.room.shoot(this.client.id, direction, (entity: Entity) => {
      const event = entity.health <= 0 ? "kill" : "hit";
      this.server.emit(event, { from: this.client.id, to: entity.id });
    });
  }

  public handleDisconnect() {
    const entity = this.room.world.entities.get(this.client.id);

    this.room.leave(this.client.id);
    this.server.emit("left", entity);
    this.server.emit("player-count", this.room.playerCount);

    dbg("A client left the game.");
  }

  public get server() {
    if (this.inviteCode) return io.to(this.inviteCode);
    else throw "Warning: `this.inviteCode` is undefined.";
  }

  public get room() {
    if (this.inviteCode) return rooms.get(this.inviteCode) as Room;
    else throw "Warning: `this.inviteCode` is undefined.";
  }

  registerHandler(event: string) {
    this.client.on(event, (params: any) => {
      dbg(`Receiving ${event}`);

      // @ts-expect-error You're not supposed to call
      // `registerHandler` if the method doesn't exist.
      this[`handle${event.pascalize()}`](params);
    });
  }
}

io.on("connection", (client) => {
  new Connection(client);
});

function gameLoop(inviteCode: Code) {
  if (!rooms.has(inviteCode)) return;
  const room = rooms.get(inviteCode);

  // End game if there are no players left.
  if (!room || room.empty) {
    rooms.delete(inviteCode);
    return;
  }

  // End game when time's up.
  if (room.timeLeft <= 0) {
    io.to(inviteCode).emit("finished", room.finish());
    room.participants.forEach((_, id) => {
      io.sockets.sockets.get(id)?.leave(inviteCode);
    });

    return;
  }

  io.to(inviteCode).emit("update", room.update());
  setTimeout(() => gameLoop(inviteCode), 1000 / FPS);
}

function dbg(message: string) {
  console.log(message);
}
