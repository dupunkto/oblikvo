import p5 from "p5";

import { CommonEntity } from "../common/interfaces";

import { Client } from "./client";
import { Camera } from "./camera";
import { World } from "./world";

const W = 87;
const A = 65;
const S = 83;
const D = 68;

export class Oblikvo {
  p5: p5;
  client: Client;
  camera: Camera;

  constructor(client: Client) {
    this.p5 = new p5((p) => {
      p.setup = () => this.setup();
      p.windowResized = () => this.windowResized();
      p.draw = () => this.draw();
    }, document.body);

    this.client = client;
    this.camera = new Camera(this.p5);
  }

  public get world(): World {
    return this.client.world;
  }

  public get player(): CommonEntity {
    return this.client.player;
  }

  public setup() {
    this.p5.createCanvas(this.p5.windowWidth, this.p5.windowHeight, p5.WEBGL);
    this.p5.frameRate(60);
    this.p5.angleMode(p5.RADIANS);
    this.p5.noStroke();

    this.camera.setPerspective();
    this.usePointerLock();
  }

  usePointerLock() {
    document.addEventListener("click", () => this.lockPointer());
    document.addEventListener("pointerlockchange", () => this.unlockPointer());
  }

  lockPointer() {
    this.camera.useMouseControls = true;
    this.p5.requestPointerLock();
  }

  unlockPointer() {
    this.camera.useMouseControls = false;
  }

  public windowResized() {
    this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
    this.camera.setPerspective();
  }

  public draw() {
    this.p5.background(0, 0, 51);
    this.p5.pointLight(255, 255, 255, this.player.position);

    this.controller();
    this.camera.follow(this.player);

    this.world.draw(this.p5);
  }

  controller() {
    this.camera.controller();

    const movement = new p5.Vector();
    const facing = this.camera.facingDirection;
    const normal = this.camera.normalDirection;

    if (this.p5.keyIsDown(W)) movement.add(facing);
    if (this.p5.keyIsDown(A)) movement.add(p5.Vector.mult(normal, -1));
    if (this.p5.keyIsDown(S)) movement.add(p5.Vector.mult(facing, -1));
    if (this.p5.keyIsDown(D)) movement.add(normal);

    if (movement.mag() > 0) this.client.broadcast("move", movement);
  }
}
