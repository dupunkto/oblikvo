// A world is the game state. It holds all the necessary data
// to render the world at any point in time. It can be serialized into
// a payload, to send to the client.

import p5 from "p5-node";
import "../common/map";

import Level from "./level";
import Entity from "./entity";
import Player from "./player";
import Payload from "../common/payload";

import { Type } from "../common/payload";
import { SIZE } from "../common/level";

import { willHit, distanceBetween } from "./raycast";

class World {
  level: Level = new Level();
  entities: Map<string, Entity> = new Map();

  constructor() {
    this.level.appendFormat({
      offset: { x: 0, y: -1, z: 0 },
      source: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    });
    this.level.appendFormat({
      offset: { x: 5, y: 0, z: 5 },
      source: [
        [1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 0, 0, 1, 1],
      ],
    });
    this.level.appendFormat({
      offset: { x: 5, y: 1, z: 5 },
      source: [
        [1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 0, 0, 1, 1],
      ],
    });

    this.level.appendFormat({
      offset: { x: 15, y: 2, z: 15 },
      source: [
        [0, 5, 5],
        [5, 5, 5],
        [5, 5, 0],
      ],
    });

    this.level.appendFormat({
      offset: { x: 1, y: 2, z: 1 },
      source: [
        [0, 5, 5],
        [5, 5, 5],
        [5, 5, 0],
      ],
    });
  }

  public spawn(entity: Entity) {
    // TODO(robin): make these random.
    const initialCoordinates = new p5.Vector(0, 30, 0);
    entity.spawn(initialCoordinates);
    this.entities.set(entity.id, entity);
  }

  public despawn(id: string) {
    this.entities.delete(id);
  }

  public respawn(id: string) {
    // TODO(robin): make these random.
    const coordinates = new p5.Vector(0, 30, 0);
    this.entities.get(id)?.respawn(coordinates);
  }

  public move(id: string, movement: p5.Vector): void {
    const player = this.entities.get(id) as Player;
    player.move(movement);
  }

  public shoot(id: string, direction: p5.Vector): Entity[] {
    const player = this.entities.get(id) as Player;

    return this.entities
      .filter((entity) => willHit(player.position, direction, entity))
      .filter((entity) => entity.id != player.id)
      .map((entity: Entity) => {
        const distance = distanceBetween(player.position, entity.position);
        entity.hit(direction, distance);

        if (entity.health <= 0) {
          this.respawn(entity.id);
        }

        return entity;
      })
      .toArray();
  }

  public update() {
    this.entities.forEach((entity) => {
      entity.update();
      this.collide(entity);
    });
  }

  public collide(player: Entity) {
    player.againstWall = false;

    let ix = Math.floor(player.position.x / SIZE);
    let iy = Math.floor(player.position.y / SIZE);
    let iz = Math.floor(player.position.z / SIZE);

    if (this.level.get(ix + 1, iy, iz)) {
      let side = player.position.x + player.dimensions.x / 2;
      if (side >= (ix + 1) * SIZE) {
        player.position.x = (ix + 1) * SIZE - player.dimensions.x / 2 - 1;
        player.againstWall = true;
      }
    }

    if (this.level.get(ix - 1, iy, iz)) {
      let side = player.position.x - player.dimensions.x / 2;
      if (side <= ix * SIZE) {
        player.position.x = ix * SIZE + player.dimensions.x / 2 + 1;
        player.againstWall = true;
      }
    }

    if (this.level.get(ix, iy + 1, iz)) {
      let side = player.position.y + player.dimensions.y / 2;
      if (side >= (iy + 1) * SIZE)
        player.position.y = (iy + 1) * SIZE - player.dimensions.y / 2 - 1;
    }

    if (this.level.get(ix, iy - 1, iz)) {
      if (this.level.get(ix, iy - 1, iz).kind == 3) { // Sand1
        player.accel.y += 200;
      }
      let side = player.position.y - player.dimensions.y / 2;
      if (side <= iy * SIZE)
        player.position.y = iy * SIZE + player.dimensions.y / 2 + 1;
    }

    if (this.level.get(ix, iy, iz + 1)) {
      let side = player.position.z + player.dimensions.z / 2;
      if (side >= (iz + 1) * SIZE) {
        player.position.z = (iz + 1) * SIZE - player.dimensions.z / 2 - 1;
        player.againstWall = true;
      }
    }

    if (this.level.get(ix, iy, iz - 1)) {
      let side = player.position.z - player.dimensions.z / 2;
      if (side <= iz * SIZE) {
        player.position.z = iz * SIZE + player.dimensions.z / 2 + 1;
        player.againstWall = true;
      }
    }
  }

  public serialize(type: Type): Payload {
    switch (type) {
      case Type.Start:
        return {
          entities: [...this.entities.entries()],
          level: this.level.serialize(),
        };

      case Type.Update:
        return {
          entities: [...this.entities.entries()],
        };

      case Type.Update:
        throw "can't serialize the world state to a `JoinPayload`, \
        as the world doesn't know room-specific client data";

      // Here because TypeScript is a dumb bitch.
      default:
        throw "impossible";
    }
  }
}

export default World;
