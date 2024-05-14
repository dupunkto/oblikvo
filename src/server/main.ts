import { initializeServer } from "./server";
import { randomID } from "../common/random";
import "../common/string";

import Vector from "../common/vector";
import Entity from "./entity";
import Room from "./room";

import { TPS, LOGGING } from "../common/constants";

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

    this.registerHandler("new");
    this.registerHandler("new-from-existing");
    this.registerHandler("change-nick");
    this.registerHandler("joinable");
    this.registerHandler("join");
    this.registerHandler("start");
    this.registerHandler("move");
    this.registerHandler("shoot");
    this.registerHandler("disconnect");
  }

  public handleNew() {
    const inviteCode = randomID();
    rooms.set(inviteCode, new Room(inviteCode));

    this.client.emit("created", inviteCode);
  }

  public handleNewFromExisting(previousCode: Code) {
    dbg(previousCode);
    const replayExists = replays.has(previousCode);
    dbg(replayExists);
    const newCode = replayExists ? replays.get(previousCode) : randomID();
    dbg(newCode);

    if (!replayExists) this.createReplay(previousCode, newCode as string);

    this.client.emit("created", newCode);
  }

  createReplay(previousCode: Code, newCode: Code) {
    rooms.set(newCode, new Room(newCode));
    replays.set(previousCode, newCode);
  }

  public handleJoinable(inviteCode: Code) {
    const joinable = rooms.get(inviteCode)?.joinable;
    this.client.emit("joinable", joinable);
  }

  public handleJoin(inviteCode: Code) {
    if (this.inviteCode) this.leaveExistingRoom();

    if (rooms.has(inviteCode)) {
      this.inviteCode = inviteCode;
      const payload = this.room.join(this.id);

      this.client.join(inviteCode);
      this.client.emit("joined", payload);
      this.server.emit("player-count", this.room.playerCount);
    } else {
      dbg("Warning: client tried to join game that doesn't exist.");
    }
  }

  public handleChangeNick(nick: string) {
    if (this.inviteCode) {
      // @ts-ignore it definitely exists. shut up.
      this.room.participants.get(this.id).nick = nick;
    }
  }

  public handleStart() {
    if (this.inviteCode) {
      this.server.emit("started", this.room.start());
      gameLoop(this.inviteCode as string);
    }
  }

  public handleMove(movement: Vector) {
    this.room.move(this.id, movement);
  }

  public handleShoot(direction: Vector) {
    this.room.shoot(this.id, direction, (entity: Entity) => {
      const event = entity.health <= 0 ? "kill" : "hit";
      this.server.emit(event, { from: this.id, to: entity.id });
    });
  }

  public handleDisconnect() {
    if (this.inviteCode) this.leaveExistingRoom();
    dbg("A client left the game.");
  }

  leaveExistingRoom() {
    const entity = this.room.world.entities.get(this.id);

    this.room.leave(this.id);
    this.server.emit("left", entity);
    this.server.emit("player-count", this.room.playerCount);
  }

  public get id(): string {
    return this.client.id;
  }

  public get server(): Socket {
    if (this.inviteCode) return io.to(this.inviteCode);
    else throw "Warning: `this.inviteCode` is undefined.";
  }

  public get room(): Room {
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

  const payload = room.update();
  if (room.push) io.to(inviteCode).emit("update", payload);

  setTimeout(() => gameLoop(inviteCode), 1000 / TPS);
}

function dbg<T>(object: T): T {
  if (LOGGING) console.log(object);
  return object;
}
