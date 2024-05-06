// If a participant joins a game, they turn into a Player (which extends Entity)
// with the same ID.

// A participant (client that joined a room) doesn't always have a correspondig
// entity. Forexample, a client can join after the game already started. In that
// case, they get the ability to join the next game (as managed by the room), but
// the current game doesn't have a corresponding entity.

import p5 from "p5-node";

import Entity from "./entity";

class Player extends Entity {
  // A `Player` is an `Entity` with an API for
  // controlling its movement.

  processMovement: boolean = false;

  public move(direction: p5.Vector) {
    this.velocity.add(direction);
    this.processMovement = true;
  }

  public update() {
    if (this.processMovement) this.normalizeVelocity();
    super.update();

    this.isMoving = this.movement > 0.1;
    this.processMovement = false;
  }

  normalizeVelocity() {
    // Prevents cheating. Makes the X and Y components of the
    // velocity p5.vector add up to exactly 1 and then multiplies
    // by the speed.

    let vertical = this.velocity.y;
    this.velocity.y = 0;
    this.velocity.normalize().mult(this.speed);
    this.velocity.y = vertical;
  }

  public get movement(): number {
    return Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
  }
}

export default Player;
