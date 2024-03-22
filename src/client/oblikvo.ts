import p5 from "p5";
import { io, Socket } from "socket.io-client";

import Payload from "../common/payload";
import Camera from "./camera";
import Entity from "./entity";
import World from "./world";

const W = 87;
const A = 65;
const S = 83;
const D = 68;

class Oblikvo {
  server: Socket;

  // `undefined` before a game is joined.
  p5: p5 | undefined;
  camera: Camera | undefined;
  world: World | undefined;

  constructor() {
    this.server = io();
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

    const payload = await this.receive("joinedGame");
    await this.startGame(payload);

    return;
  }

  async startGame(payload: Payload) {
    new p5((renderer) => {
      this.p5 = renderer;

      this.world = new World(renderer, payload);
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
    // @ts-ignore (same)
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

  public update(payload: Payload) {
    // @ts-ignore update can only be called when registered with
    // the hook in `startGame`, which also sets `this.world`.
    this.world.load(payload);
  }

  public draw() {
    if (!this.server.id) throw "Not connected.";
    if (!this.p5) throw "`draw` called but `p5` not set.";
    if (!this.camera) throw "`draw` called but `camera` not set.";
    if (!this.world) throw "`draw` called but `world` not set.";

    this.p5.background(0, 0, 51);
    this.p5.pointLight(255, 255, 255, this.player.position);

    this.controller();
    this.camera.follow(this.player);
    this.world.draw(this.server.id);
  }

  controller() {
    if (!this.p5) throw "`controller` called but `p5` not set.";
    if (!this.camera) throw "`controller` called but `camera` not set.";

    this.camera.controller();

    const movement = new p5.Vector();
    const facing = this.camera.facingDirection;
    const normal = this.camera.normalDirection;

    if (this.p5.keyIsDown(W)) movement.add(facing);
    if (this.p5.keyIsDown(A)) movement.add(normal);
    if (this.p5.keyIsDown(D)) movement.add(normal.mult(-1));
    if (this.p5.keyIsDown(S)) movement.add(facing.mult(-1));

    if (movement.mag() > 0) this.broadcast("move", movement);
  }

  public get player(): Entity {
    if (!this.server.id) throw "Not connected.";

    // @ts-ignore the entity with the server ID always exists;
    // can't return undefined.
    return this.world.entities.get(this.server.id);
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

      // @ts-expect-error You're not supposed to call
      // `registerHandler` if the method doesn't exist.
      this[event](params);
    });
  }
}

export default Oblikvo;

function dbg(message: any) {
  console.log(message);
}
