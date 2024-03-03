import p5 from "p5";
import { Entity } from "../common/entity";
import { World } from "../common/world";
import { Client } from "./client";
import { Camera } from "./camera";

const W = 87;
const A = 65;
const S = 83;
const D = 68;

export class Oblikvo {
  p5: p5;
  client: Client;
  camera: Camera;
  player: Entity;
  world: World;

  constructor(sketch: p5, inviteCode: string) {
    this.p5 = sketch;
    this.player = new Entity();
    this.client = new Client();
    this.camera = new Camera(sketch);

    this.client.join(inviteCode);
    this.client.load((world) => {
      this.world = world;
    });
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
    if (document.pointerLockElement != this.p5.canvas) {
      this.camera.useMouseControls = false;
    }
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
    const facing = this.camera.getFacingDirection();
    const normal = this.camera.getNormalDirection();

    if (this.keyDown(W)) movement.add(facing);
    if (this.keyDown(A)) movement.add(p5.Vector.mult(normal, -1));
    if (this.keyDown(S)) movement.add(p5.Vector.mult(facing, -1));
    if (this.keyDown(D)) movement.add(normal);

    if (movement.mag() > 0) this.client.broadcast("move", movement);
  }

  keyDown(keyCode) {
    return this.p5.keyIsDown(keyCode);
  }
}
