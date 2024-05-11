import p5 from "p5";

import Entity from "./entity";
import { randomBetween } from "../common/random";

const LEFT = 37;
const RIGHT = 39;

class Camera {
  p5: p5;
  pan: number;
  tilt: number;
  sway: number;
  bob: number;
  fov: number;
  sensitivity: number;
  intensity: number;
  isShaking: boolean;
  useMouseControls: boolean;

  constructor(p5: p5) {
    this.p5 = p5;
    this.pan = 0.0;
    this.tilt = 0.0;
    this.sway = 0.0;
    this.bob = 0.0;
    this.fov = 1.0;
    this.sensitivity = 0.02;
    this.intensity = 1.2;
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

  public shake(duration: number = 100) {
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

    this.sway *= 0.5;
    this.sway += p5.Vector.dot(entity.velocity, this.normalDirection);

    if (entity.isMoving && !entity.againstWall) this.bob += 0.1;
    let bobbingAmount = this.intensity * Math.sin(this.bob) ** 2;

    let sway = this.intensity * this.sway / 15;
    let offset = bobbingAmount + 1.5;

    this.p5.camera(
      position.x + this.shakiness,
      -(position.y + offset),
      position.z + this.shakiness,
      center.x + this.shakiness,
      -(center.y + offset),
      center.z + this.shakiness,
      this.normalDirection.x * sway + this.shakiness,
      1,
      this.normalDirection.z * sway + this.shakiness,
    );
  }

  public get shakiness(): number {
    return this.isShaking ? 0.015 * randomBetween(-this.intensity, this.intensity) : 0;
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
