import p5 from "p5";
import "../common/map";

import { StartPayload, UpdatePayload } from "../common/payload";

import Entity from "./entity";
import Level from "./level";

class World {
  p5: p5;
  level: Level;
  entities: Map<string, Entity>;

  constructor(p5: p5, payload: StartPayload) {
    this.p5 = p5;

    const { level } = payload;
    this.level = new Level(p5, level);
    this.entities = new Map();

    this.load(payload);
  }

  public load({ entities }: StartPayload | UpdatePayload ) {
    this.entities = new Map(entities).map((entity) => {
      return new Entity(this.p5, entity);
    });
  }

  public draw(assets: Map<string, any>, perspective: Entity) {
    this.level.draw(assets);
    this.entities.forEach((entity, id) => {
      if (id == perspective.id) return;
      const towards = p5.Vector.sub(perspective.position, entity.position);
      entity.draw(assets, towards);
    });
  }
}

export default World;
