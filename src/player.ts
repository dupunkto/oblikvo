// This is a reimplementation from scratch of p5.RoverCam(v1.1) by freshfork,
// which is a derivative of QueasyCam (v1.5) by Josh Castle.
//
// Original QueasyCam was licensed GPL, however RoverCam is somehow licensed MIT.
// I opened an issue (https://github.com/freshfork/p5.RoverCam/issues/6),
// but I can't be sure. To prevent the entire game from becoming GPL,
// I reimplemented the entire library from scratch.

import p5 from "p5";

const W = 87;
const A = 65;
const S = 83;
const D = 68;
const LEFT = 37;
const RIGHT = 39;

class Entity {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;

  constructor(x, y, z) {
    this.position = new p5.Vector(x, y, z);
    this.velocity = new p5.Vector(0, 0, 0);
    this.acceleration = new p5.Vector(0, 0, 0);
  }

  update() {
    this.applyFriction();
    this.applyGravity();

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    // Simulate collisions with the ground for now.
    if (this.position.y < 0) this.position.y = 0;
  }

  applyGravity() {
    const gravity = new p5.Vector(0, -9.81, 0);
    this.acceleration.add(gravity);
  }

  applyFriction() {
    const friction = 0.2;
    this.velocity.mult(friction);
  }
}

class Player extends Entity {
  p5: p5;
  pointerLocked: boolean;

  speed: number;
  sensitivity: number;

  fovy: number;
  pan: number;
  tilt: number;

  constructor(sketch) {
    super(0, 0, 0);

    this.p5 = sketch;
    this.speed = 1.3;
    this.sensitivity = 0.02;

    this.fovy = 1.0;
    this.pan = 0.0;
    this.tilt = 0.0;
  }

  spawn() {
    this.setPerspective();
    this.usePointerLock();
  }

  usePointerLock() {
    this.pointerLocked = false;

    document.addEventListener("click", () => this.togglePointerLock());
    document.addEventListener("pointerlockchange", () => this.unlockPointer());
  }

  togglePointerLock() {
    if (this.pointerLocked) {
      this.p5.exitPointerLock();
      this.pointerLocked = false;
    } else {
      this.pointerLocked = true;
      this.p5.requestPointerLock();
    }
  }

  unlockPointer() {
    if (document.pointerLockElement != this.p5.canvas) {
      this.pointerLocked = false;
    }
  }

  controller() {
    if (this.pointerLocked) {
      this.yaw((this.p5.movedX * this.sensitivity) / 10);
    }

    if (this.keyDown(W)) this.moveX(this.speed);
    if (this.keyDown(A)) this.moveY(-this.speed);
    if (this.keyDown(S)) this.moveX(-this.speed);
    if (this.keyDown(D)) this.moveY(this.speed);
    if (this.keyDown(LEFT)) this.yaw(-0.035);
    if (this.keyDown(RIGHT)) this.yaw(0.035);
  }

  keyDown(keyCode) {
    return this.p5.keyIsDown(keyCode);
  }

  yaw(angle) {
    this.pan += angle;
  }
  pitch(angle) {
    this.tilt += angle;
    this.tilt = this.clamp(this.tilt, -Math.PI / 2.01, Math.PI / 2.01);
    if (this.tilt == Math.PI / 2.0) this.tilt += 0.001;
  }

  moveX(speed) {
    this.move(this.getFacingDirection(), speed);
  }
  moveY(speed) {
    this.move(this.getNormalDirection(), -speed);
  }
  move(direction, speed) {
    const movement = direction.mult(speed);
    this.velocity.add(movement);
  }

  getFacingDirection(): p5.Vector {
    return new p5.Vector(
      Math.cos(this.pan),
      Math.tan(this.tilt),
      Math.sin(this.pan)
    ).normalize();
  }
  getNormalDirection(): p5.Vector {
    const a = Math.PI / 2;
    return new p5.Vector(Math.cos(this.pan - a), 0, Math.sin(this.pan - a));
  }

  setPerspective() {
    this.p5.perspective(
      this.fovy,
      this.p5.width / this.p5.height,
      0.01,
      10000.0
    );
  }

  update() {
    this.controller();
    super.update(); // Apply physics for all entities.

    // console.log(this.velocity);

    const direction = this.getFacingDirection();
    const center = p5.Vector.add(this.position, direction);

    this.p5.camera(
      this.position.x,
      this.position.y,
      this.position.z,
      center.x,
      center.y,
      center.z,
      0,
      1,
      0
    );
  }

  clamp(aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
  }
}

export default Player;
