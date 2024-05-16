// A world is the game state. It holds all the necessary data
// to render the world at any point in time. It can be serialized into
// a payload, to send to the client.

import p5 from "p5-node";
import "../common/map";

import Level from "./level";
import Entity from "./entity";
import Player from "./player";

import { SPEED } from "../common/constants";
import { SIZE, MIN_Y } from "../common/level";
import { willHit, distanceBetween } from "./raycast";

import { StartPayload } from "../common/payload";

class World {
  ticks: number = 0;
  level: Level = new Level();
  entities: Map<string, Entity> = new Map();

  // Maps the ID of a player to the ID of
  // the player that last hit them within
  // X seconds.
  hitters: Map<string, string> = new Map();

  constructor() {
    this.level.appendFormat({
      offset: { x: 0, y: -1, z: 0 },
      source: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 4, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    });
    this.level.appendFormat({
      offset: { x: 0, y: 2, z: 0 },
      source: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    });
  }

  public spawn(entity: Entity) {
    this.entities.set(entity.id, entity);
    entity.spawn(this.level.randomCoords());
  }

  public despawn(id: string) {
    this.entities.delete(id);
  }

  public respawn(entity: Entity) {
    const hitter = this.hitters.get(entity.id);
    if (hitter) {
      // @ts-ignore hitter must exist
      this.entities.get(hitter).kills += 1;
      entity.bumpStats();
    }

    entity.respawn(this.level.randomCoords());
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
        // If you've just spawned in and some other player
        // spawned at the same point, the distance is zero, and
        // players can basically spawn-camp and one-shot the others.
        //
        // We shouldn't allow that.

        const distance = distanceBetween(player.position, entity.position);
        const onSpawn = distance !== 0;

        if (onSpawn) {
          entity.hit(direction, distance);
          if (entity.health <= 0) player.kills += 1;

          // Set hitter
          this.hitters.set(entity.id, player.id);
          setTimeout(() => this.hitters.delete(entity.id), 3000);
        }

        return entity;
      })
      .toArray();
  }

  public update() {
    this.ticks += 1;
    this.entities.forEach((entity) => {
      if (entity.health <= 0 || entity.position.y < MIN_Y) {
        this.respawn(entity);
      }

      entity.update();
      this.collide(entity);
    });
  }

  public collide(player: Entity) {
    player.onGround = false;
    player.againstWall = false;

    let ix = Math.floor(player.position.x / SIZE);
    let iy = Math.floor(player.position.y / SIZE);
    let iz = Math.floor(player.position.z / SIZE);

    if (this.level.get(ix + 1, iy, iz)) {
      let side = player.position.x + player.dimensions.x / 2;
      if (side >= (ix + 1) * SIZE) {
        player.position.x = (ix + 1) * SIZE - player.dimensions.x / 2;
        player.againstWall = true;
      }
    }

    if (this.level.get(ix - 1, iy, iz)) {
      let side = player.position.x - player.dimensions.x / 2;
      if (side <= ix * SIZE) {
        player.position.x = ix * SIZE + player.dimensions.x / 2;
        player.againstWall = true;
      }
    }

    if (this.level.get(ix, iy + 1, iz)) {
      let side = player.position.y + player.dimensions.y / 2;
      if (side >= (iy + 1) * SIZE)
        player.position.y = (iy + 1) * SIZE - player.dimensions.y / 2;
    }

    if (this.level.get(ix, iy - 1, iz)) {
      if (this.level.get(ix, iy - 1, iz)?.kind == 3)
        player.acceleration.y += 8 * SPEED;
      if (this.level.get(ix, iy - 1, iz)?.kind == 4)
        player.acceleration.y += 12 * SPEED;

      let side = player.position.y - player.dimensions.y / 2;
      if (side <= iy * SIZE) {
        player.position.y = iy * SIZE + player.dimensions.y / 2;
        player.onGround = true;
      }
    }

    if (this.level.get(ix, iy, iz + 1)) {
      let side = player.position.z + player.dimensions.z / 2;
      if (side >= (iz + 1) * SIZE) {
        player.position.z = (iz + 1) * SIZE - player.dimensions.z / 2;
        player.againstWall = true;
      }
    }

    if (this.level.get(ix, iy, iz - 1)) {
      let side = player.position.z - player.dimensions.z / 2;
      if (side <= iz * SIZE) {
        player.position.z = iz * SIZE + player.dimensions.z / 2;
        player.againstWall = true;
      }
    }
  }

  public serialize(): StartPayload {
    return {
      entities: [...this.entities.entries()],
      level: this.level.serialize(),
    };
  }
}

export default World;
