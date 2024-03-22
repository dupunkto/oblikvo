import p5 from "p5";

import Vector from "../common/vector";

import { default as CommonEntity } from "../common/entity";

class Entity implements CommonEntity {
  p5: p5;
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;

  constructor(p5: p5, entity: CommonEntity) {
    console.log(entity);

    this.p5 = p5;
    this.position = toVector(entity.position);
    this.velocity = toVector(entity.velocity);
    this.dimensions = toVector(entity.dimensions);

    this.onGround = entity.onGround;
    this.againstWall = entity.againstWall;
    this.isMoving = entity.isMoving;
  }

  public draw() {
    const coordinates = this.position;
    const width = this.dimensions.x;
    const height = this.dimensions.y;
    const depth = this.dimensions.z;

    this.p5.push();
    this.p5.fill("red");
    this.p5.translate(coordinates);
    this.p5.box(width, height, depth);
    this.p5.pop();
  }
}

export default Entity;

function toVector({ x, y, z }: Vector): p5.Vector {
  return new p5.Vector(x, y, z);
}
