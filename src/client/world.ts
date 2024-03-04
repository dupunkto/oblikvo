import p5 from "p5";

import { CommonEntity } from "../common/interfaces";
import { CommonWorld } from "../common/interfaces";

import { Lookup } from "../common/types";
import { Map } from "../common/types";
import { Level } from "../common/level";
import { Block } from "../common/block";

export class World implements CommonWorld {
  entities: Lookup<CommonEntity> = {};
  map: Map = [];
  level: Level;

  constructor() {
    // Initialize with empty level to please the TS compiler :)
    this.level = new Level([]);
  }

  public load(data: CommonWorld) {
    this.map = data.map;
    this.entities = data.entities;
    this.level = new Level(this.map);
  }

  public update(data: CommonWorld) {
    this.entities = data.entities;
  }

  public draw(sketch: p5) {
    for (let block of this.level.blocks) this.drawBlock(sketch, block);
    for (let id in this.entities) this.drawEntity(sketch, this.entities[id]);
  }

  drawBlock(sketch: p5, block: Block) {
    sketch.push();
    sketch.fill(block.color);
    placeBlock(sketch, block.position, block.dimensions);
    sketch.pop();
  }

  drawEntity(sketch: p5, entity: CommonEntity) {
    sketch.push();
    sketch.fill("red");
    placeBlock(sketch, entity.position, entity.dimensions);
    sketch.pop();
  }
}

function placeBlock(
  sketch: p5,
  position: p5.Vector,
  dimensions: p5.Vector
): void {
  sketch.translate(position.x, -position.y, position.z);
  sketch.box(dimensions.x, dimensions.y, dimensions.z);
}
