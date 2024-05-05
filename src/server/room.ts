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
import { Type } from "../common/payload";
import { toVector } from "../common/vector";

class Room {
  inviteCode: string;
  status: string; // "pending" | "ongoing" | "done"
  participants: Map<string, Participant>;
  world: World;

  constructor(inviteCode: string) {
    this.inviteCode = inviteCode;
    this.status = "pending";
    this.participants = new Map();
    this.world = new World();
  }

  public join(id: string): JoinPayload {
    const participant = new Participant(id);
    this.participants.set(id, participant);

    return {
      inviteCode: this.inviteCode,
      status: "pending",
      nick: participant.nick,
      color: participant.color,
      clients: this.participants.size,
    };
  }

  public leave(id: string): void {
    this.participants.delete(id);
    this.world.entities.delete(id);
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
    this.status = "ongoing";
    this.participants.forEach(({ id }: Participant) => {
      this.world.spawn(id, new Player(id));
    });

    return this.world.serialize(Type.Start) as StartPayload;
  }

  public get empty(): boolean {
    return this.participants.size < 1;
  }

  public update(): UpdatePayload {
    this.world.update();
    return this.world.serialize(Type.Update) as UpdatePayload;
  }
}

export default Room;
