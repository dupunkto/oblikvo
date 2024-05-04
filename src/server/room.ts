// A room is a re-usable class representing a "game". It manages the
// interactions between players and the world state (which it holds).

// The room also manages serialization.

import p5 from "p5-node";

import Participant from "./participant";
import Player from "./player";
import Entity from "./entity";
import World from "./world";

import { JoinPayload } from "../common/payload";
import { StartPayload } from "../common/payload";
import { UpdatePayload } from "../common/payload";
import { Type } from "../common/payload";

import { willHit, distanceBetween } from "./raycast";

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

  public move(id: string, movement: p5.Vector): void {
    // @ts-ignore the `id` always returns a Player.
    const player: Player = this.world.entities.get(id);
    player.move(movement);
  }

  public shoot(
    shooterID: string,
    direction: p5.Vector,
    callback: (id: string, entity: Entity) => void,
  ): void {
    // @ts-ignore the `id` always returns a Player.
    const player: Player = this.world.entities.get(shooterID);

    this.world.entities.forEach((entity: Entity, id: string) => {
      if (willHit(player.position, direction, entity)) {
        const distance = distanceBetween(player.position, entity.position);
        entity.hit(direction, distance);

        callback(id, entity);
      }
    });
  }

  public start(): StartPayload {
    this.status = "ongoing";
    this.participants.forEach((participant) => {
      this.world.spawn(participant.id, new Player());
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
