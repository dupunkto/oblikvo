// A room is a re-usable class representing a "game". It manages the
// interactions between players and the world state (which it holds).

// The room also manages serialization.

import Participant from "./participant";
import Player from "./player";
import Entity from "./entity";
import World from "./world";
import Vector from "../common/vector";

import { JoinPayload } from "../common/payload";
import { StartPayload } from "../common/payload";
import { UpdatePayload } from "../common/payload";
import { FinishPayload } from "../common/payload";
import { toVector } from "../common/vector";

import { DURATION, FPS } from "../common/constants";

enum Status {
  Pending,
  Ongoing,
  Done,
}

class Room {
  inviteCode: string;
  status: Status;
  participants: Map<string, Participant>;
  world: World;

  constructor(inviteCode: string) {
    this.inviteCode = inviteCode;
    this.status = Status.Pending;
    this.participants = new Map();
    this.world = new World();
  }

  public join(id: string): JoinPayload {
    const participant = new Participant(id);
    this.participants.set(id, participant);

    return {
      inviteCode: this.inviteCode,
      nick: participant.nick,
      color: participant.color,
      count: this.participants.size,
    };
  }

  public leave(id: string): void {
    this.world.despawn(id);
    this.participants.delete(id);
  }

  public move(id: string, movement: Vector) {
    this.world.move(id, toVector(movement));
  }

  public shoot(
    id: string,
    direction: Vector,
    onhit: (entity: Entity) => void,
  ): void {
    this.world.shoot(id, toVector(direction)).forEach(onhit);
  }

  public start(): StartPayload {
    this.status = Status.Ongoing;
    this.participants.forEach((participant) => {
      const player = new Player(participant);
      this.world.spawn(player);
    });

    return this.world.serialize();
  }

  public get joinable(): boolean {
    return this.status == Status.Pending;
  }

  public get empty(): boolean {
    return this.participants.size < 1;
  }

  public get playerCount(): number {
    return this.participants.size;
  }

  public get timeLeft(): number {
    return DURATION - Math.floor(this.world.ticks / FPS);
  }

  public update(): UpdatePayload {
    this.world.update();

    return {
      timeLeft: this.timeLeft,
      entities: this.world.serialize().entities,
    };
  }

  public finish(): FinishPayload {
    this.status = Status.Done;
    const entities = [...this.world.entities.values()];

    return {
      winner: Array.from(entities).reduce((a, b) =>
        a.kills - a.killed > b.kills - b.killed ? a : b,
      ),
      loser: Array.from(entities).reduce((a, b) =>
        a.killed > b.killed ? a : b,
      ),
    };
  }
}

export default Room;
