import p5 from "p5-node";

import { default as CommonEntity } from "../common/entity";

const G = 9.81;
const FRICTION = 0.1;
const SPEED = 8;

class Entity implements CommonEntity {
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;
  speed: number = SPEED;

  onGround: boolean = false;
  againstWall: boolean = false;
  isMoving: boolean = false;

  constructor() {
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.dimensions = new p5.Vector(3, 3, 3);
  }

  public spawn(position: p5.Vector) {
    this.position = position;
    // TODO(robin): add other logic here later :)
  }

  public update() {
    // These will be set later, when checking collisions etc.
    this.isMoving = false;
    this.onGround = false;
    this.againstWall = false;

    this.applyFriction();
    this.applyGravity();

    this.position.add(this.velocity);

    // Simulate collisions with the ground for now.
    if (this.position.y < 0) this.position.y = 0;
  }

  applyGravity() {
    const acceleration = new p5.Vector(0, -G, 0);
    this.velocity.add(acceleration);
  }

  applyFriction() {
    const friction = FRICTION;
    this.velocity.mult(friction);
  }
}

export default Entity;
