import p5 from "p5-node";

import Entity from "./entity";

class Player extends Entity {
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

export default Player;
