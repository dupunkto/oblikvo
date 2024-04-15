import p5 from "p5-node";

import Level from "./level";
import Entity from "./entity";
import Payload from "../common/payload";

import { Type as PayloadType } from "../common/payload";
import { SIZE } from "../common/level";

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
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
      ],
    });

    this.level.appendFormat({
      offset: { x: 1, y: 2, z: 1 },
      source: [
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
      ],
    });
  }

  public spawn(id: string, entity: Entity) {
    let initialCoordinates = new p5.Vector(0, 0, 0);
    entity.spawn(initialCoordinates);

    this.entities.set(id, entity);
  }

  public despawn(id: string) {
    this.entities.delete(id);
  }

  public get empty(): boolean {
    return this.entities.size < 1;
  }

  public update() {
    this.entities.forEach((entity) => {
      entity.update();
      this.collide(entity);
    });
  }

  public collide(player: Entity) {
    let ix = floor(player.position.x / SIZE);
    let iy = floor(player.position.y / SIZE);
    let iz = floor(player.position.z / SIZE);
  
    if (level.get(ix + 1, iy, iz) !== undefined && level.get(ix + 1, iy, iz) !== 0) {
      let side = player.position.x+player.dimensions.x/2;
      if (side >= (ix+1)*SIZE)
        player.position.x = (ix+1)*SIZE - player.dimensions.x/2 - 1;
    }
  
    if (level.get(ix - 1, iy, iz) !== undefined && level.get(ix - 1, iy, iz) !== 0) {
      let side = player.position.x-player.dimensions.x/2;
      if (side <= ix*SIZE)
        player.position.x = ix*SIZE + player.dimensions.x/2 + 1;
    }
  
    if (level.get(ix, iy + 1, iz) !== undefined && level.get(ix, iy + 1, iz) !== 0) {
      let side = player.position.y+player.dimensions.y/2;
      if (side >= (iy+1)*SIZE)
        player.position.y = (iy+1)*SIZE - player.dimensions.y/2 - 1;
    }
  
    if (level.get(ix, iy - 1, iz) !== undefined && level.get(ix, iy - 1, iz) !== 0) {
      let side = player.position.y-player.dimensions.y/2;
      if (side <= iy*SIZE)
        player.position.y = iy*SIZE + player.dimension.y/2 + 1;
    }
  
    if (level.get(ix, iy, iz + 1) !== undefined && level.get(ix, iy, iz + 1) !== 0) {
      let side = player.position.z+player.dimensions.z/2;
      if (side >= (iz+1)*SIZE)
        player.position.z = (iz+1)*SIZE - player.dimensions.z/2 - 1;
    }

    if (level.get(ix, iy, iz - 1) !== undefined && level.get(ix, iy, iz - 1) !== 0) {
      let side = player.position.z-player.dimensions.z/2;
      if (side <= iz*SIZE)
        player.position.z = iz*SIZE + player.dimensions.z/2 + 1;
    }
  }

  public serialize(type: PayloadType): Payload {
    switch (type) {
      case PayloadType.Initial:
        return {
          entities: [...this.entities.entries()],
          level: this.level.serialize(),
        };

      case PayloadType.Update:
        return {
          entities: [...this.entities.entries()],
        };
    }
  }
}

export default World;
