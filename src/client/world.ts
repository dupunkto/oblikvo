import p5 from "p5";
import "../common/map";

import Payload from "../common/payload";
import Entity from "./entity";

class World {
  p5: p5;
  entities: Map<String, Entity> = new Map();

  constructor(p5: p5, payload: Payload) {
    this.p5 = p5;
    this.load(payload);
  }

  public load({ entities }: Payload) {
    this.entities = new Map(entities).map((entity) => {
      return new Entity(this.p5, entity);
    });
  }

  public draw() {
    this.entities.forEach((entity) => entity.draw());
  }
}

export default World;
