import p5 from "p5-node";

import Entity from "./entity";
import Payload from "../common/payload";

class World {
  entities: Map<String, Entity> = new Map();

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

  public serialize(): Payload {
    return {
      entities: [...this.entities.entries()],
    };
  }
}

export default World;
