// An entity is a *thing* in the game that's not part of the
// level. It is subjective to physics and can be independently manipulated.

// An entity is not necessarily a player. It can also be a bot or NPC.

import p5 from "p5-node";

import { default as CommonEntity } from "../common/entity";
import Participant from "./participant";

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
  nick: string;
  color: string;

  health: number = HEALTH;
  maxHealth: number = HEALTH;
  speed: number = SPEED;
  kills: number = 0;
  killed: number = 0;

  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  dimensions: p5.Vector;

  onGround: boolean = false;
  againstWall: boolean = false;
  isMoving: boolean = false;

  constructor(participant: Participant) {
    this.id = participant.id;
    this.nick = participant.nick;
    this.color = participant.color;
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.acceleration = new p5.Vector(0, 0, 0);
    this.dimensions = new p5.Vector(3, 5, 3);
  }

  public spawn(position: p5.Vector) {
    this.position = position;
    this.velocity = new p5.Vector(0, 0, 0);
    this.acceleration = new p5.Vector(0, 0, 0);
  }

  public bump() {
    this.killed += 1;
    this.speed *= 1 + INCREASE;
    this.maxHealth += INCREASE * HEALTH;
    this.health = this.maxHealth;
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
    this.applyFriction();
    this.applyGravity();

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration = new p5.Vector(0, 0, 0);
  }

  applyGravity() {
    if(!this.onGround) this.acceleration.y -= G;
  }

  applyFriction() {
    const friction = FRICTION;
    this.velocity.mult(friction);
  }
}

export default Entity;
