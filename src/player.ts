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
const E = 69;
const Q = 81;
const SPACE = 32;
const PLUS = 61;
const MINUS = 173;

class Player {
  p5: p5;

  pointerLocked: boolean;
  canvas: p5._renderer.elt;

  position: p5.Vector;
  velocity: p5.Vector;
  gravity: p5.Vector;
  onGround: boolean;
  width: number;
  height: number;

  sensitivity: number;
  friction: number;
  speed: number;

  pan: number;
  tilt: number;
  rot: number;
  fov_y: number;

  // Calculated from the values above
  directionX: p5.Vector;
  directionY: p5.Vector;
  directionZ: p5.Vector;

  constructor(sketch) {
    this.p5 = sketch;
    this.usePointerLock();

    this.sensitivity = 0.02;
    this.friction = 0.8;
    this.speed = 0.1;
    this.reset();
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

  reset() {
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.gravity = new p5.Vector(0, 0.03, 0);
    this.width = 0;
    this.height = 0;

    this.pan = 0.0;
    this.tilt = 0.0;
    this.rot = 0.0;
    this.fov_y = 1.0;

    this.directionX = new p5.Vector(0, 0, 1);
    this.directionY = new p5.Vector(1, 0, 0);
    this.directionZ = new p5.Vector(0, 1, 0);
  }

  controller() {
    // Mouse controls
    this.yaw((this.p5.movedX * this.sensitivity) / 10);
    this.pitch((this.p5.movedY * this.sensitivity) / 10);

    // Movement controls
    if (this.keyDown(W)) this.moveX(this.speed);
    if (this.keyDown(A)) this.moveY(this.speed);
    if (this.keyDown(S)) this.moveX(-this.speed);
    if (this.keyDown(D)) this.moveY(-this.speed);
    if (this.keyDown(E)) this.moveZ(this.speed);
    if (this.keyDown(Q)) this.moveZ(-this.speed);

    // Jump
    if (this.keyDown(SPACE) && this.onGround) this.jump();

    // Field of view controls
    if (this.keyDown(PLUS)) this.fov(-this.sensitivity / 10);
    if (this.keyDown(MINUS)) this.fov(this.sensitivity / 10);
  }

  keyDown(keyCode) {
    return this.p5.keyIsDown(keyCode);
  }

  moveX(speed) {
    this.velocity.add(p5.Vector.mult(this.directionX, speed));
  }

  moveY(speed) {
    this.velocity.add(p5.Vector.mult(this.directionY, speed));
  }

  moveZ(speed) {
    this.velocity.add(p5.Vector.mult(this.directionZ, -speed));
  }

  jump() {
    // TODO(robin): implement jumping
  }

  yaw(angle) {
    this.pan += angle;
  }

  pitch(angle) {
    this.tilt += angle;
    this.tilt = this.clamp(this.tilt, -Math.PI / 2.01, Math.PI / 2.01);
    if (this.tilt == Math.PI / 2.0) this.tilt += 0.001;
  }

  fov(angle) {
    this.fov_y += angle;
    this.setPerspective();
  }

  draw() {
    if (this.p5.width != this.width || this.p5.height != this.height) {
      this.setPerspective();
    }

    this.controller();
    this.applyMovement();
    this.applyGravity();
    this.applyRotation();

    let position = p5.Vector.sub(this.position, this.directionY);
    let center = p5.Vector.add(position, this.directionX);

    this.p5.camera(
      position.x,
      position.y,
      position.z,
      center.x,
      center.y,
      center.z,
      this.directionZ.x,
      this.directionZ.y,
      this.directionZ.z,
    );
  }

  applyGravity() {
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);
  }

  applyMovement() {
    this.velocity.mult(this.friction);
    this.position.add(this.velocity);
  }

  applyRotation() {
    this.directionX = new p5.Vector(
      Math.cos(this.pan),
      Math.tan(this.tilt),
      Math.sin(this.pan),
    ).normalize();

    this.directionY = new p5.Vector(
      Math.cos(this.pan - Math.PI / 2.0),
      0,
      Math.sin(this.pan - Math.PI / 2.0),
    );
  }

  setPerspective() {
    this.p5.perspective(
      this.fov_y,
      this.p5.width / this.p5.height,
      0.01,
      10000.0,
    );
    this.width = this.p5.width;
    this.height = this.p5.height;
  }

  clamp(aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
  }
}

export default Player;
