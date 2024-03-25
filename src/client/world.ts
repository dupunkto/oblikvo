import p5 from "p5";
import "../common/map";

import { InitialPayload, UpdatePayload } from "../common/payload";

import Entity from "./entity";
import Level from "./level";

class World {
  p5: p5;
  level: Level;
  entities: Map<String, Entity>;

  constructor(p5: p5, payload: InitialPayload) {
    this.p5 = p5;

    const { level } = payload;
    this.level = new Level(p5, level);
    this.entities = new Map();

    this.load(payload);
  }

  public load({ entities }: UpdatePayload) {
    this.entities = new Map(entities).map((entity) => {
      return new Entity(this.p5, entity);
    });
  }

  public draw(except: string) {
    this.level.draw();
    this.entities.forEach((entity, id) => {
      if (id == except) return;
      entity.draw();
    });
  }
}

export default World;
