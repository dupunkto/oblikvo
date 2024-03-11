import p5 from "p5-node";

import { Lookup } from "../common/types";
import { Entity } from "./entity";

import { State as CommonWorld } from "../common/interfaces";

export class World implements CommonWorld {
  entities: Lookup<Entity> = {};

  public spawn(id: string, entity: Entity) {
    let initialCoordinates = new p5.Vector(0, 0, 0);
    entity.spawn(initialCoordinates);

    this.entities[id] = entity;
  }

  public update() {
    for (let id in this.entities) {
      const entity = this.entities[id];
      entity.update();
    }
  }
}
