// An entity is a *thing* in the game that's not part of the
// level. It is subjective to physics and can be independently manipulated.

// An entity is not necessarily a player. It can also be a bot or NPC.

import p5 from "p5-node";

import { default as CommonEntity } from "../common/entity";

const G = 2;
const FRICTION = 0.1;
const SPEED = 8;
const KNOCKBACK = 3;
const POWER = 5;

class Entity implements CommonEntity {
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;
  speed: number = SPEED;

  inGame: boolean = false;
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
    this.inGame = true;

    // TODO(robin): add other logic here later :)
  }

  public hit(direction: p5.Vector, distance: number) {
    this.applyKnockback(direction, distance);
    this.health -= POWER / distance;
  }

  applyKnockback(direction: p5.Vector, distance: number) {
    this.velocity.add(direction.mult(KNOCKBACK / distance));
  }

  public update() {
    // These will be set later, when checking collisions etc.
    this.isMoving = false;
    this.onGround = false;
    this.againstWall = false;

    this.applyFriction();
    this.applyGravity();

    this.position.add(this.velocity);

    const minY = 0;
    if (this.position.y < minY) this.position.y = minY;
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
