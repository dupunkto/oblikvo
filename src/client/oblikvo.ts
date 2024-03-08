import p5 from "p5";
import { io, Socket } from "socket.io-client";

import Camera from "./camera";

import { Entity } from "../common/interfaces";
import { State } from "../common/interfaces";
import { Level } from "../common/level";
import { Block } from "../common/block";
import { Lookup } from "../common/types";

const W = 87;
const A = 65;
const S = 83;
const D = 68;

function dbg(message) {
  console.log(message);
}

class Oblikvo {
  server: Socket;

  // `undefined` before a game is joined.
  p5: p5 | undefined;
  camera: Camera | undefined;
  level: Level | undefined;
  entities: Lookup<Entity>;

  constructor() {
    this.server = io();
    this.entities = {};
  }

  async new(): Promise<string> {
    this.broadcast("newGame");

    // Return the inviteCode.
    return this.receive("createdGame");
  }

  async join(inviteCode: string): Promise<void> {
    this.broadcast("joinGame", inviteCode);

    const state = await this.receive("joinedGame");
    await this.startGame(state);

    return;
  }

  async startGame({ map, entities }: State) {
    new p5((renderer) => {
      this.p5 = renderer;

      this.entities = entities;
      this.level = new Level(map);
      this.camera = new Camera(renderer);

      this.bindMethod("setup");
      this.bindMethod("draw");
      this.bindMethod("windowResized");

      this.registerHandler("update");

      this.hideMenu();
    }, document.body);
  }

  bindMethod(method: any) {
    this.p5[method] = () => this[method]();
  }

  hideMenu() {
    document.querySelector("main")?.remove();
  }

  public setup() {
    console.log(this.entities);
    console.log(this.level);

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

  public update(state: State) {
    this.entities = state.entities;
  }

  public draw() {
    this.p5.background(0, 0, 51);
    this.p5.pointLight(255, 255, 255, this.player.position);

    this.controller();
    this.camera.follow(this.player);

    for (let block of this.level.blocks) this.drawBlock(block);
    for (let id in this.entities) this.drawEntity(this.entities[id]);
  }

  controller() {
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

  drawBlock(block: Block) {
    this.p5.push();
    this.p5.fill(block.color);
    this.placeBlock(block.position, block.dimensions);
    this.p5.pop();
  }

  drawEntity(entity: Entity) {
    this.p5.push();
    this.p5.fill("red");
    this.placeBlock(entity.position, entity.dimensions);
    this.p5.pop();
  }

  placeBlock(position: p5.Vector, dimensions: p5.Vector): void {
    this.p5.translate(position.x, -position.y, position.z);
    this.p5.box(dimensions.x, dimensions.y, dimensions.z);
  }

  public get player(): Entity {
    if (!this.server.id) throw "Not connected.";
    return this.entities[this.server.id];
  }

  public broadcast(event: string, ...params: any) {
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
      this[event](params);
    });
  }
}

export default Oblikvo;
