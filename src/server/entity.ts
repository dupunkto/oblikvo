// An entity is a *thing* in the game that's not part of the
// level. It is subjective to physics and can be independently manipulated.

// An entity is not necessarily a player. It can also be a bot or NPC.

import p5 from "p5-node";

import { default as CommonEntity } from "../common/entity";
import { randomID } from "../common/random";

import {
  G,
  FRICTION,
  SPEED,
  KNOCKBACK,
  POWER,
  HEALTH,
} from "../common/constants";

export const INCREASE = 0.25;

class Entity implements CommonEntity {
  id: string;

  health: number = HEALTH;
  maxHealth: number = HEALTH;
  speed: number = SPEED;
  kills: number = 0;
  killed: number = 0;

  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;

  onGround: boolean = false;
  againstWall: boolean = false;
  isMoving: boolean = false;

  constructor(id: string | undefined = undefined) {
    this.id = id || randomID();
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.dimensions = new p5.Vector(3, 5, 3);
  }

  public spawn(position: p5.Vector) {
    this.position = position;
  }

  public respawn(position: p5.Vector) {
    this.killed += 1;
    this.speed *= 1 + INCREASE;
    this.maxHealth += INCREASE * HEALTH;
    this.health = this.maxHealth;
    this.spawn(position);
  }

  public hit(direction: p5.Vector, distance: number) {
    distance = Math.max(distance, 0.1);
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
