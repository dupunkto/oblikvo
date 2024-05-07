import p5 from "p5";

import Entity from "./entity";

const LEFT = 37;
const RIGHT = 39;

class Camera {
  p5: p5;
  pan: number;
  tilt: number;
  sway: number;
  fov: number;
  sensitivity: number;
  intensity: number;
  offset: number;
  isShaking: boolean;
  useMouseControls: boolean;

  constructor(p5: p5) {
    this.p5 = p5;
    this.pan = 0.0;
    this.tilt = 0.0;
    this.sway = 0.0;
    this.fov = 1.0;
    this.sensitivity = 0.02;
    this.intensity = 1.2;
    this.offset = 0.0;
    this.isShaking = false;
    this.useMouseControls = false;
  }

  public setPerspective() {
    this.p5.perspective(
      this.fov,
      this.p5.width / this.p5.height,
      0.01,
      10000.0,
    );
  }

  yaw(angle: number) {
    this.pan += angle;
  }

  pitch(angle: number) {
    this.tilt += angle;
    this.tilt = this.clamp(this.tilt, -Math.PI / 2.01, Math.PI / 2.01);
    if (this.tilt == Math.PI / 2.0) this.tilt += 0.001;
  }

  public shake(duration: number) {
    this.isShaking = true;
    setTimeout(() => (this.isShaking = false), duration);
  }

  public controller() {
    if (this.useMouseControls) {
      this.yaw((this.p5.movedX * this.sensitivity) / 10);
    }

    if (this.keyDown(LEFT)) this.yaw(-2 * this.sensitivity);
    if (this.keyDown(RIGHT)) this.yaw(2 * this.sensitivity);
  }

  keyDown(keyCode: number) {
    return this.p5.keyIsDown(keyCode);
  }

  public follow(entity: Entity) {
    const direction = this.facingDirection;
    const position = entity.position;

    const center = p5.Vector.add(position, direction);

    if (this.isShaking) {
      let shakeIntensity = 5 * this.intensity;

      this.p5.translate(
        this.p5.random(-shakeIntensity, shakeIntensity),
        this.p5.random(-shakeIntensity, shakeIntensity),
      );
    }

    let swing = p5.Vector.dot(entity.velocity, this.normalDirection);
    this.sway = this.sway * 0.5 + swing * (this.intensity/15);

    if (entity.isMoving && !entity.againstWall) this.offset += 0.1;
    let bobbingAmount = Math.pow(Math.sin(this.offset), 2) * this.intensity;

    let offset = bobbingAmount + 1.5;

    this.p5.camera(
      position.x,
      -(position.y + offset),
      position.z,
      center.x,
      -(center.y + offset),
      center.z,
      this.normalDirection.x * this.sway,
      1,
      this.normalDirection.z * this.sway,
    );
  }

  public get facingDirection(): p5.Vector {
    return new p5.Vector(
      Math.cos(this.pan),
      Math.tan(this.tilt),
      Math.sin(this.pan),
    ).normalize();
  }

  public get normalDirection(): p5.Vector {
    return this.facingDirection.cross(new p5.Vector(0, 1, 0)).mult(-1);
  }

  clamp(num: number, min: number, max: number): number {
    return num > max ? max : num < min ? min : num;
  }
}

export default Camera;
