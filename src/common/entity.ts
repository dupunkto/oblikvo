import p5 from "p5";

const G = 9.81;
const FRICTION = 0.1;
const SPEED = 8;

export class Entity {
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;
  speed: number;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;

  constructor() {
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.dimensions = new p5.Vector(3, 3, 3);
    this.speed = SPEED;
  }

  public spawn(position: p5.Vector) {
    this.position = position;
    // TODO(robin): add other logic here later :)
  }

  public update() {
    // These will be set later, when checking
    // collisions etc.
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

// A `Player` is an `Entity` with an API for
// controlling its movement.

export class Player extends Entity {
  public move(direction: p5.Vector) {
    this.velocity.add(direction);
    this.isMoving = true;
  }

  public update() {
    if (this.isMoving) this.normalizeVelocity();
    super.update();
  }

  // Prevents cheating. Makes the X and Y components of the
  // velocity vector add up to exactly 1 and then multiplies
  // by the speed.
  normalizeVelocity() {
    let vertical = this.velocity.y;
    this.velocity.y = 0;
    this.velocity.normalize().mult(this.speed);
    this.velocity.y = vertical;
  }
}
