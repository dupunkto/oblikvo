// This is a reimplementation from scratch of p5.RoverCam(v1.1) by freshfork,
// which is a derivative of QueasyCam (v1.5) by Josh Castle.
//
// Original QueasyCam was licensed GPL, however RoverCam is somehow licensed MIT.
// I opened an issue (https://github.com/freshfork/p5.RoverCam/issues/6),
// but I can't be sure. To prevent the entire game from becoming GPL,
// I reimplemented the entire library from scratch.

import p5 from "p5";

import { G, CHUNK_CELL_DIM, CHUNK_HEIGHT, TERRAIN_SPREAD } from "./settings";

const W = 87;
const A = 65;
const S = 83;
const D = 68;
const SPACE = 32;

class Player {
  p5: p5;
  camera: p5.Camera;
  pointerLocked: boolean;
  onGround: boolean;

  height: number;
  sensitivity: number;
  speed: number;
  reach: number;
  friction: number;
  gravity: number;
  tilt: number;
  accel: number;
  velocity: p5.Vector;

  constructor(sketch) {
    this.p5 = sketch;
    this.sensitivity = 0.04;
    this.height = 250;
    this.speed = 10;
    this.friction = 1;
    this.reach = 1.7;
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

  spawn() {
    this.camera = this.p5.createCamera();
    this.onGround = false;
    this.tilt = 0;
    this.velocity = new p5.Vector(0, 0, 0);
  }

  controller() {
    if (this.pointerLocked) {
      this.yaw((this.p5.movedX * this.sensitivity) / 10);
      this.pitch((this.p5.movedY * this.sensitivity) / 10);
    }

    if (this.keyDown(W)) this.velocity.z += 1;
    if (this.keyDown(A)) this.velocity.x += 1;
    if (this.keyDown(S)) this.velocity.z -= 1;
    if (this.keyDown(D)) this.velocity.x -= 1;
    if (this.keyDown(SPACE) && this.onGround) this.jump();
  }

  keyDown(keyCode) {
    return this.p5.keyIsDown(keyCode);
  }
  yaw(angle) {
    this.camera.pan(-angle);
  }
  pitch(angle) {
    // const prev = this.tilt;
    // this.tilt -= angle;

    // this.tilt = this.clamp(this.tilt, -Math.PI / 2.01, Math.PI / 2.01);
    // if (this.tilt == Math.PI / 2.0) this.tilt += 0.001;
    // this.camera.tilt(prev - this.tilt);

    this.camera.tilt(angle);
  }
  jump() {
    this.velocity.y -= 3 * this.reach * this.speed;
  }

  update() {
    this.controller();
    this.normalizeVelocity();
    this.velocity.y += G;

    const groundY = this.calculateGroundLevel();
    const playerY = Math.min(this.camera.eyeY + this.velocity.y, groundY);

    if (playerY === groundY) {
      this.onGround = true;
      this.velocity.y = 0;
    } else {
      this.onGround = false;
    }

    this.camera.move(-this.velocity.x, 0, -this.velocity.z);
    this.camera.setPosition(this.camera.eyeX, playerY, this.camera.eyeZ);

    this.velocity.x = 0;
    this.velocity.z = 0;
  }

  normalizeVelocity() {
    const speedFactor = this.onGround ? 1 : this.reach;
    let vertical = this.velocity.y;

    this.velocity.y = 0;
    this.velocity.normalize().mult(speedFactor * this.speed);
    this.velocity.y = vertical;
  }

  calculateGroundLevel() {
    const chunk_player_x = this.camera.eyeX / CHUNK_CELL_DIM;
    const chunk_player_z = this.camera.eyeZ / CHUNK_CELL_DIM;
    const n = this.p5.noise(
      TERRAIN_SPREAD * chunk_player_x,
      TERRAIN_SPREAD * chunk_player_z
    );

    return CHUNK_HEIGHT * n - this.height;
  }

  clamp(aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
  }
}

export default Player;
