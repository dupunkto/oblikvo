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

export class Entity {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  dimensions: p5.Vector;
  onGround: boolean;

  constructor() {
    this.dimensions = new p5.Vector(3, 3, 3);
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.acceleration = new p5.Vector(0, 0, 0);
  }

  spawn(x, y, z) {
    this.position = new p5.Vector(x, y, z);
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
    const acceleration = new p5.Vector(0, -9.81, 0);
    this.velocity.add(acceleration);
  }

  applyFriction() {
    const friction = 0.1;
    this.velocity.mult(friction);
  }
}

export class Player extends Entity {
  p5: p5;
  speed: number;
  sensitivity: number;
  pan: number;
  tilt: number;
  isMoving: boolean;
  useMouseControls: boolean;

  constructor(sketch) {
    super();
    this.p5 = sketch;
    this.speed = 8;
    this.sensitivity = 0.02;
    this.pan = 0.0;
    this.tilt = 0.0;
    this.isMoving = false;
    this.useMouseControls = false;
  }

  controller() {
    if (this.useMouseControls) {
      this.yaw((this.p5.movedX * this.sensitivity) / 10);
    }

    if (this.keyDown(W)) this.moveX(this.speed);
    if (this.keyDown(A)) this.moveY(-this.speed);
    if (this.keyDown(S)) this.moveX(-this.speed);
    if (this.keyDown(D)) this.moveY(this.speed);
    if (this.keyDown(LEFT)) this.yaw(-0.04);
    if (this.keyDown(RIGHT)) this.yaw(0.04);
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
    this.isMoving = true;
  }

  getFacingDirection(): p5.Vector {
    return new p5.Vector(
      Math.cos(this.pan),
      Math.tan(this.tilt),
      Math.sin(this.pan),
    ).normalize();
  }
  getNormalDirection(): p5.Vector {
    const a = Math.PI / 2;
    return new p5.Vector(Math.cos(this.pan - a), 0, Math.sin(this.pan - a));
  }

  update() {
    this.isMoving = false;

    // Apply player controls
    this.controller();
    if (this.isMoving) this.normalizeVelocity();

    // Apply general physics
    super.update();
  }

  normalizeVelocity() {
    let verticalVelocity = this.velocity.y;
    this.velocity.y = 0;
    this.velocity.normalize().mult(this.speed);
    this.velocity.y = verticalVelocity;
  }

  clamp(aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
  }
}

export class Camera {
  p5: p5;
  fov: number;
  intensity: number;
  offset: number;
  isShaking: boolean;

  constructor(sketch) {
    this.p5 = sketch;
    this.fov = 1;
    this.intensity = 1.2;
    this.offset = 0.0;
  }

  setPerspective() {
    this.p5.perspective(
      this.fov,
      this.p5.width / this.p5.height,
      0.01,
      10000.0,
    );
  }

  shake(duration: number) {
    this.isShaking = true;
    setTimeout(() => (this.isShaking = false), duration);
  }

  follow(player: Player) {
    const direction = player.getFacingDirection();
    const position = player.position;
    const center = p5.Vector.add(position, direction);

    // if (player.isMoving) {
    //   this.fov = 1.1;
    //   this.setPerspective();
    // } else {
    //   this.fov = 1.0; // Default.
    //   this.setPerspective();
    // }

    if (this.isShaking) {
      let shakeIntensity = 5 * this.intensity;

      this.p5.translate(
        this.p5.random(-shakeIntensity, shakeIntensity),
        this.p5.random(-shakeIntensity, shakeIntensity),
      );
    }

    let bobbingAmount = Math.pow(Math.sin(this.offset), 2) * this.intensity;
    if (player.isMoving) this.offset += 0.1; // || this.inTheMiddleOfABob()

    let offset = bobbingAmount + 1.5;

    this.p5.camera(
      position.x,
      position.y - offset,
      position.z,
      center.x,
      center.y - offset,
      center.z,
      0,
      1,
      0,
    );
  }

  // inTheMiddleOfABob() {
  //   let offset = Math.sin(this.offset);
  //   let threshold = 0.5;
  //   return offset > threshold || offset < -threshold;
  // }
}
