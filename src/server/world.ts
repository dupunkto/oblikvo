import p5 from "p5-node";

const G = 9.81;
const FRICTION = 0.1;
const SPEED = 8;

import { Entity as CommonEntity } from "../common/interfaces";
import { World as CommonWorld } from "../common/interfaces";

export class Entity implements CommonEntity {
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

export class Player extends Entity {
  // A `Player` is an `Entity` with an API for
  // controlling its movement.

  public move(direction: p5.Vector) {
    this.velocity.add(direction);
    this.isMoving = true;
  }

  public jump() {
    const speed = 2.5 * this.speed;
    const movement = new p5.Vector(0, 1, 0).mult(speed);

    this.velocity.add(movement);
  }

  public update() {
    // Prevents cheating. Makes the X and Y components of the
    // velocity p5.vector add up to exactly 1 and then multiplies
    // by the speed.
    if (this.isMoving) this.normalizeVelocity();

    super.update();
  }

  normalizeVelocity() {
    let vertical = this.velocity.y;
    this.velocity.y = 0;
    this.velocity.normalize().mult(this.speed);
    this.velocity.y = vertical;
  }
}

export class World implements CommonWorld {
  entities: Map<string, Entity> = new Map();

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
}
