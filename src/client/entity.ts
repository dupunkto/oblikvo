import p5 from "p5";

import { default as CommonEntity } from "../common/entity";
import Vector from "../common/vector";

// Unfortunately we can't use the shared `toVector` util
// from `common/vector.ts` here, as it serializes to the `p5-node`
// instance of p5.Vector, and apparently other p5 methods then
// silently fail :(
export function toVector({ x, y, z }: Vector): p5.Vector {
  return new p5.Vector(x, y, z);
}

class Entity implements CommonEntity {
  p5: p5;
  id: string;
  nick: string;
  color: string;

  health: number;
  maxHealth: number;
  kills: number;
  killed: number;

  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;

  againstWall: boolean;
  isMoving: boolean;

  constructor(p5: p5, entity: CommonEntity) {
    this.p5 = p5;
    this.id = entity.id;
    this.nick = entity.nick;
    this.color = entity.color;

    this.health = entity.health;
    this.maxHealth = entity.maxHealth;
    this.kills = entity.kills;
    this.killed = entity.killed;

    this.position = toVector(entity.position);
    this.velocity = toVector(entity.velocity);
    this.dimensions = toVector(entity.dimensions);

    this.againstWall = entity.againstWall;
    this.isMoving = entity.isMoving;
  }

  public draw(towards: p5.Vector) {
    const angle =
      towards.z > Math.PI
        ? Math.asin(towards.z)
        : Math.PI + Math.asin(towards.z);

    const coordinates = new p5.Vector(
      this.position.x,
      -this.position.y,
      this.position.z,
    );

    const width = this.dimensions.x;
    const height = this.dimensions.y;
    const depth = this.dimensions.z;

    this.p5.push();
    this.p5.fill("red");
    this.p5.rotateY(angle);
    this.p5.translate(coordinates);
    this.p5.box(width, height, depth);
    this.p5.pop();
  }
}

export default Entity;
