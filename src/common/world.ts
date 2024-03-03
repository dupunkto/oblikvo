import p5 from "p5";
import { Entity } from "./entity";

export type Tile = number;
export type Map = Tile[][];

const BLOCKSIZE = 12;

class Block {
  position: p5.Vector;
  dimensions: p5.Vector;
  color: p5.Color;

  constructor(x, y, z, size, color) {
    this.position = new p5.Vector(x, y, z);
    this.dimensions = new p5.Vector(size, size, size);
    this.color = color;
  }

  draw(sketch: p5) {
    sketch.push();
    sketch.translate(this.position.x, -this.position.y, this.position.z);
    sketch.fill(this.color);
    sketch.box(this.dimensions.x, this.dimensions.y, this.dimensions.z);
    sketch.pop();
  }
}

class Level {
  map: Map;
  blocks: Block[];

  constructor(map: Map) {
    this.map = map;
  }

  load() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        const size = BLOCKSIZE;
        const color = p5.color(this.randomNumber(150, 200));
        const y = this.isGroundTile(this.map[i][j]) ? -size : 0;

        const block = new Block(i * size, y, j * size, size, color);
        this.blocks.push(block);
      }
    }
  }

  isGroundTile(tile: Tile): boolean {
    return tile === 0;
  }

  randomNumber(min, max): number {
    return Math.random() * (max - min) + min;
  }

  draw(sketch: p5) {
    this.blocks.forEach((block) => block.draw(sketch));
  }
}

export class World {
  level: Level;
  entities: Entity[];

  constructor() {
    this.entities = [];
  }

  load() {
    let map: Map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.level = new Level(map);
  }

  spawn(entity: Entity) {
    entity.spawn();
    this.entities.push(entity);
  }

  draw(sketch: p5) {
    this.level.draw(sketch);
  }

  collide(entity: Entity, block: Block) {
    let entityLeft = entity.position.x - entity.dimensions.x / 2;
    let entityRight = entity.position.x + entity.dimensions.x / 2;
    let entityTop = entity.position.y - entity.dimensions.y / 2;
    let entityBottom = entity.position.y + entity.dimensions.y / 2;
    let entityFront = entity.position.z - entity.dimensions.z / 2;
    let entityBack = entity.position.z + entity.dimensions.z / 2;

    let boxLeft = block.position.x - block.dimensions.x / 2;
    let boxRight = block.position.x + block.dimensions.x / 2;
    let boxTop = block.position.y - block.dimensions.y / 2;
    let boxBottom = block.position.y + block.dimensions.y / 2;
    let boxFront = block.position.z - block.dimensions.z / 2;
    let boxBack = block.position.z + block.dimensions.z / 2;

    let boxLeftOverlap = entityRight - boxLeft;
    let boxRightOverlap = boxRight - entityLeft;
    let boxTopOverlap = entityBottom - boxTop;
    let boxBottomOverlap = boxBottom - entityTop;
    let boxFrontOverlap = entityBack - boxFront;
    let boxBackOverlap = boxBack - entityFront;

    if (
      ((entityLeft > boxLeft && entityLeft < boxRight) ||
        (entityRight > boxLeft && entityRight < boxRight)) &&
      ((entityTop > boxTop && entityTop < boxBottom) ||
        (entityBottom > boxTop && entityBottom < boxBottom)) &&
      ((entityFront > boxFront && entityFront < boxBack) ||
        (entityBack > boxFront && entityBack < boxBack))
    ) {
      let xOverlap = Math.max(Math.min(boxLeftOverlap, boxRightOverlap), 0);
      let yOverlap = Math.max(Math.min(boxTopOverlap, boxBottomOverlap), 0);
      let zOverlap = Math.max(Math.min(boxFrontOverlap, boxBackOverlap), 0);

      if (xOverlap < yOverlap && xOverlap < zOverlap) {
        if (boxLeftOverlap < boxRightOverlap) {
          entity.position.x = boxLeft - entity.dimensions.x / 2;
          entity.againstWall = true;
        } else {
          entity.position.x = boxRight + entity.dimensions.x / 2;
          entity.againstWall = true;
        }
      } else if (yOverlap < xOverlap && yOverlap < zOverlap) {
        if (boxTopOverlap < boxBottomOverlap) {
          entity.position.y = boxTop - entity.dimensions.y / 2;
          entity.velocity.y = 0;
          entity.onGround = true;
        } else {
          entity.position.y = boxBottom + entity.dimensions.y / 2;
        }
      } else if (zOverlap < xOverlap && zOverlap < yOverlap) {
        if (boxFrontOverlap < boxBackOverlap) {
          entity.position.z = boxFront - entity.dimensions.x / 2;
          entity.againstWall = true;
        } else {
          entity.position.z = boxBack + entity.dimensions.x / 2;
          entity.againstWall = true;
        }
      }
    }
  }
}
