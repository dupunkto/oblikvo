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

class Oblikvo {
  server: Socket;

  // `undefined` if the connection is broken.
  id: string | undefined;

  // `undefined` before a game is joined.
  p5: p5 | undefined;
  camera: Camera | undefined;
  level: Level | undefined;
  entities: Lookup<Entity>;

  constructor() {
    this.server = io();
    this.entities = {};

    this.server.on("connected", () => {
      this.id = this.server.id;
      console.log("Connected to server.");
    });
  }

  async new(): Promise<string> {
    this.server.emit("newGame");

    return new Promise((resolve) => {
      // Return the inviteCode.
      this.server.on("createdGame", resolve);
    });
  }

  async join(inviteCode: string): Promise<void> {
    console.log(`Joining ${inviteCode}`);
    this.server.emit("joinGame", inviteCode);

    return new Promise((resolve) => {
      // Return after the world has been loaded.
      this.server.once("joinedGame", async (state: State) => {
        console.log(`Joined ${inviteCode}`);

        await this.startGame(state);
        resolve();
      });
    });
  }

  async startGame({ map, entities }: State) {
    console.log("yay");
    const renderer = await this.createRenderer();

    this.p5 = renderer;
    this.entities = entities;
    this.level = new Level(map);
    this.camera = new Camera(renderer);
  }

  async createRenderer(): Promise<p5> {
    return new Promise((resolve) => {
      new p5((p) => {
        console.log(p);
        resolve(p);

        p.setup = this.setup;
        p.draw = this.draw;
        p.windowResized = this.windowResized;
      }, document.body);
    });
  }

  public get player(): Entity {
    if (!this.id) throw "Not connected.";
    return this.entities[this.id];
  }

  public setup() {
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

  public draw() {
    this.p5.background(0, 0, 51);
    this.p5.pointLight(255, 255, 255, this.player.position);

    this.controller();
    this.camera.follow(this.player);

    for (let block of this.level.blocks) this.drawBlock(sketch, block);
    for (let id in this.entities) this.drawEntity(sketch, this.entities[id]);
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

  public broadcast(event: string, ...params: any) {
    this.server.emit(event, params);
  }
}

export default Oblikvo;
