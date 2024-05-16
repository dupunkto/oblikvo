import p5 from "p5";
import "../common/string";

import { io, Socket } from "socket.io-client";
import { Howl } from "howler";

import {
  JoinPayload,
  StartPayload,
  UpdatePayload,
  FinishPayload,
} from "../common/payload";

import Camera from "./camera";
import Entity from "./entity";
import World from "./world";

const W = 87;
const A = 65;
const S = 83;
const D = 68;
const SPACE = 32;

import { FPS, PIXELATION, LOGGING } from "../common/constants";

class Oblikvo {
  joined: boolean = false;
  started: boolean = false;
  server: Socket;

  // Lookup map containing assets like
  // sprites and sounds.
  assets: Map<string, any>;

  // `undefined` before a game is joined.
  inviteCode: string | undefined;

  // `undefined` before the game is started.
  p5: p5 | undefined;
  canvas: p5.Renderer | undefined;
  camera: Camera | undefined;
  world: World | undefined;

  constructor() {
    this.initializeState();
    this.server = io();
    this.assets = new Map();
  }

  initializeState() {
    if (this.p5) this.p5.remove();

    this.joined = false;
    this.started = false;
    this.inviteCode = undefined;
    this.p5 = undefined;
    this.canvas = undefined;
    this.camera = undefined;
    this.world = undefined;
  }

  // Public API for interacting with the server.

  public async new(): Promise<string> {
    this.broadcast("new");

    // Return the inviteCode.
    return this.receive("created");
  }

  public async joinable(inviteCode: string): Promise<boolean> {
    this.broadcast("joinable", inviteCode);
    return this.receive("joinable");
  }

  public async join(inviteCode: string): Promise<void> {
    this.broadcast("join", inviteCode);
    return this.receive("joined").then((payload) => {
      this.handleJoined(payload);
    });
  }

  public start(): void {
    this.broadcast("start");

    // Handling actually starting the game is managed in
    // the `handleStarted` handler, that we registered in
    // `handleJoined` earlier.

    // This is because we don't only want to start our own game,
    // but everyone's game. If we'd register it here, we'd only
    // start our own game.
  }

  public async reuse(): Promise<string> {
    this.broadcast("new-from-existing", this.inviteCode);
    this.initializeState();

    // Return the inviteCode.
    return this.receive("created");
  }

  // Handlers for mutating client-side state.

  handleJoined(payload: JoinPayload) {
    this.inviteCode = payload.inviteCode;
    this.joined = true;

    this.registerHandler("started");
    this.registerHandler("finished");
  }

  handleStarted(payload: StartPayload) {
    new p5((renderer) => {
      this.p5 = renderer;

      this.world = new World(renderer, payload);
      this.camera = new Camera(renderer);

      this.bindMethod("preload");
      this.bindMethod("setup");
      this.bindMethod("draw");
      this.bindMethod("windowResized");
      this.bindMethod("keyPressed");

      this.registerHandler("update");
      this.registerHandler("hit");
      this.registerHandler("kill");
    }, document.body);
  }

  handleFinished(_payload: FinishPayload) {
    this.p5?.remove();
  }

  handleHit({ from, to }: { from: string; to: string }) {
    if (to == this.server.id) this.playSound("gotHit");
    if (from == this.server.id)
      setTimeout(() => {
        this.playSound("hitAnotherPlayer");
        this.camera?.shake();
      }, 50);
  }

  handleKill(payload: { from: string; to: string }) {
    this.handleHit(payload);
  }

  handleUpdate(payload: UpdatePayload) {
    // @ts-ignore update can only be called when registered with
    // the hook in `startGame`, which also sets `this.world`.
    this.world.load(payload);
  }

  // APIs implementing p5.js functionality.

  public preload() {
    if (!this.p5) throw "`setup` called but `p5` not set.";

    this.loadImage("Metal1");
    this.loadImage("Metal2");
    this.loadImage("Sand1");
    this.loadImage("Sand2");
    this.loadImage("Cobbles1");
    this.loadImage("Cobbles2");
    this.loadImage("Cobbles3");
    this.loadImage("Bricks2");
    this.loadImage("Bricks3");

    this.loadSound("hitAnotherPlayer");
    this.loadSound("gotHit");
    this.loadSound("shootLaser");
  }

  loadImage(identifier: string) {
    this.assets.set(identifier, this.p5?.loadImage(`${identifier}.bmp`));
  }

  loadSound(identifier: string) {
    this.assets.set(identifier, new Howl({ src: [`${identifier}.wav`] }));
  }

  playSound(identifier: string) {
    this.assets.get(identifier)?.play();
  }

  public setup() {
    if (!this.p5) throw "`setup` called but `p5` not set.";
    if (!this.camera) throw "`setup` called but `camera` not set.";

    this.canvas = this.p5.createCanvas(
      this.p5.windowWidth / PIXELATION,
      this.p5.windowHeight / PIXELATION,
      this.p5.WEBGL,
    );

    this.p5.frameRate(FPS);
    this.p5.angleMode(this.p5.RADIANS);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.noStroke();

    this.canvas.mousePressed(() => this.mousePressed());

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
    this.p5?.requestPointerLock();
  }

  unlockPointer() {
    // @ts-ignore (same as `lockPointer` applies here)
    if (!document.pointerLockElement) this.camera.useMouseControls = false;
  }

  public windowResized() {
    if (!this.p5) throw "`windowResized` called but `p5` not set.";
    if (!this.camera) throw "`setwindowResizedup` called but `camera` not set.";

    this.p5.resizeCanvas(
      this.p5.windowWidth / PIXELATION,
      this.p5.windowHeight / PIXELATION,
    );
    this.camera.setPerspective();
  }

  public mousePressed() {
    this.shoot();
  }

  public keyPressed() {
    if (!this.p5) throw "`mousePressed` called, but `p5` not set.";
    if (this.p5.keyCode == SPACE) this.shoot();
  }

  shoot() {
    if (!this.camera) throw "`shoot` called, but `camera` not set.";
    this.broadcast("shoot", this.camera.facingDirection);
    this.playSound("shootLaser");
  }

  public draw() {
    if (!this.server.id) throw "Not connected.";
    if (!this.p5) throw "`draw` called but `p5` not set.";
    if (!this.camera) throw "`draw` called but `camera` not set.";
    if (!this.world) throw "`draw` called but `world` not set.";

    this.p5.background(21, 23, 26);
    this.p5.pointLight(255, 255, 255, this.player.position);
    this.p5.ambientLight(180, 180, 180);

    this.controller();
    this.camera.follow(this.player);
    this.world.draw(this.assets, this.player);
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

  public getEntity(id: string): Entity | undefined {
    return this.world?.entities.get(id);
  }

  public get player(): Entity {
    if (!this.server.id) throw "Not connected.";

    // @ts-ignore the entity with the server ID always exists;
    // can't return undefined.
    return this.world.entities.get(this.server.id);
  }

  // Public API for direct client-server communication.

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

  public on(event: string, callback: (...args: any[]) => void) {
    this.server.on(event, callback);
  }

  // Internal APIs for client-server communications.

  bindMethod(method: any) {
    // @ts-ignore This black magic fuckery works--don't touch it.
    this.p5[method] = () => this[method]();
  }

  registerHandler(event: string) {
    this.server.on(event, (params: any) => {
      dbg(`Receiving ${event}`);

      // @ts-expect-error You're not supposed to call
      // `registerHandler` if the method doesn't exist.
      this[`handle${event.pascalize()}`](params);
    });
  }
}

export default Oblikvo;

function dbg<T>(object: T): T {
  if (LOGGING) console.log(object);
  return object;
}
