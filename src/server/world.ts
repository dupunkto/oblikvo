import p5 from "p5-node";

import Level from "./level";
import Entity from "./entity";
import Payload from "../common/payload";

import { Type as PayloadType } from "../common/payload";

class World {
  level: Level = new Level();
  entities: Map<String, Entity> = new Map();

  constructor() {
    this.level.appendFormat({
      offset: { x: -5, y: 0, z: -5 },
      source: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    });
    this.level.appendFormat({
      offset: { x: -5, y: 1, z: -5 },
      source: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    });
    this.level.appendFormat({
      offset: { x: -5, y: -2, z: -5 },
      source: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
    this.entities.forEach((entity) => entity.update());
  }

  public serialize(type: PayloadType): Payload {
    switch (type) {
      case PayloadType.Initial:
        return {
          entities: [...this.entities.entries()],
          level: [...this.level.blocks.entries()],
        };

      case PayloadType.Update:
        return {
          entities: [...this.entities.entries()],
        };
    }
  }
}

export default World;
