import p5 from "p5";
import { io, Socket } from "socket.io-client";

import Camera from "./camera";

import { Entity } from "../common/interfaces";
import { World } from "../common/interfaces";

const W = 87;
const A = 65;
const S = 83;
const D = 68;

class Oblikvo {
  server: Socket;

  // `undefined` before a game is joined.
  p5: p5 | undefined;
  camera: Camera | undefined;
  entities: Map<string, Entity>;

  constructor() {
    this.server = io();
    this.entities = new Map();
  }

  public async new(): Promise<string> {
    this.broadcast("newGame");

    // Return the inviteCode.
    return this.receive("createdGame");
  }

  public async exists(inviteCode: string): Promise<Boolean> {
    this.broadcast("gameExists", inviteCode);
    return this.receive("gameExists");
  }

  public async join(inviteCode: string): Promise<void> {
    this.broadcast("joinGame", inviteCode);

    const world = await this.receive("joinedGame");
    await this.startGame(world);

    return;
  }

  async startGame(world: World) {
    new p5((renderer) => {
      this.p5 = renderer;

      this.update(world);
      this.camera = new Camera(renderer);

      this.bindMethod("setup");
      this.bindMethod("draw");
      this.bindMethod("windowResized");

      this.registerHandler("update");

      this.hideMenu();
    }, document.body);
  }

  bindMethod(method: any) {
    // @ts-ignore This black magic fuckery works--don't touch it.
    this.p5[method] = () => this[method]();
  }

  hideMenu() {
    document.querySelector("main")?.remove();
  }

  public setup() {
    if (!this.p5) throw "`setup` called but `p5` not set.";
    if (!this.camera) throw "`setup` called but `camera` not set.";

    this.p5.createCanvas(
      this.p5.windowWidth,
      this.p5.windowHeight,
      this.p5.WEBGL
    );

    this.p5.frameRate(60);
    this.p5.angleMode(this.p5.RADIANS);
    this.p5.noStroke();

    this.camera.setPerspective();
    this.usePointerLock();
  }

  usePointerLock() {
    document.addEventListener("click", () => this.lockPointer());
    document.addEventListener("pointerlockchange", () => this.unlockPointer());
  }

  lockPointer() {
    // @ts-ignore This is only called in `setup`,
    // and we already check if `p5` and `camera` are `undefined` there.
    this.camera.useMouseControls = true;
    // @ts-ignore
    this.p5.requestPointerLock();
  }

  unlockPointer() {
    // @ts-ignore (Same as `lockPointer` applies here)
    if (!document.pointerLockElement) this.camera.useMouseControls = false;
  }

  public windowResized() {
    if (!this.p5) throw "`windowResized` called but `p5` not set.";
    if (!this.camera) throw "`setwindowResizedup` called but `camera` not set.";

    this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
    this.camera.setPerspective();
  }

  public update({ entities }: World) {
    this.entities = entities;
    this.entities.forEach((entity) => {
      entity.position = toVector(entity.position);
      entity.velocity = toVector(entity.velocity);
      entity.dimensions = toVector(entity.dimensions);
    });
  }

  public draw() {
    if (!this.p5) throw "`draw` called but `p5` not set.";
    if (!this.camera) throw "`draw` called but `camera` not set.";

    this.p5.background(0, 0, 51);
    this.p5.pointLight(255, 255, 255, this.player.position);

    this.controller();
    this.camera.follow(this.player);

    this.entities.forEach((entity) => {
      if (entity !== this.player) this.drawEntity(entity);
    });
  }

  controller() {
    if (!this.camera) throw "`controller` called but `camera` not set.";

    this.camera.controller();

    const movement = new p5.Vector();
    const facing = this.camera.facingDirection;
    const normal = this.camera.normalDirection;

    if (this.p5?.keyIsDown(W)) movement.add(facing);
    if (this.p5?.keyIsDown(A)) movement.add(normal);
    if (this.p5?.keyIsDown(D)) movement.add(normal.mult(-1));
    if (this.p5?.keyIsDown(S)) movement.add(facing.mult(-1));

    if (movement.mag() > 0) this.broadcast("move", movement);
  }

  drawEntity({ position, dimensions }: Entity) {
    this.p5?.push();
    this.p5?.fill("red");
    this.p5?.translate(position);
    this.p5?.box(dimensions);
    this.p5?.pop();
  }

  public get player(): Entity {
    if (!this.server.id) throw "Not connected.";
    // @ts-ignore the fucking maps. (this cannot return undefined)
    return this.entities.get(this.server.id);
  }

  public broadcast(event: string, params: any = {}) {
    dbg(`Broadcasting ${event}`);
    this.server.emit(event, params);
  }

  public async receive(event: string): Promise<any> {
    return new Promise((resolve) => {
      this.server.once(event, (params) => {
        dbg(`Receiving ${event}`);
        resolve(params);
      });
    });
  }

  public registerHandler(event: string) {
    this.server.on(event, (params) => {
      dbg(`Receiving ${event}`);

      // @ts-ignore You're not supposed to call `registerHandler` if
      // the method doesn't exist.
      this[event](params);
    });
  }
}

export default Oblikvo;

function toVector({ x, y, z }: { x: number; y: number; z: number }): p5.Vector {
  return new p5.Vector(x, y, z);
}

function dbg(message: any) {
  console.log(message);
}
