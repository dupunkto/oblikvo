import p5 from "p5";
import { Entity } from "./player";

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
}

class Level {
  p5: p5;
  map: Map;
  entities: Entity[];
  blocks: Block[];

  constructor(sketch: p5, map: Map) {
    this.p5 = sketch;
    this.map = map;
  }

  load() {
    this.entities = [];
    this.blocks = [];
    this.loadBlocks();
  }

  loadBlocks() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        const size = BLOCKSIZE;
        const color = this.p5.color(this.p5.random(150, 200));
        const y = this.isGroundTile(this.map[i][j]) ? -size : 0;

        const block = new Block(i * size, y, j * size, size, color);
        this.blocks.push(block);
      }
    }
  }

  isGroundTile(col: Tile): boolean {
    return col === 0;
  }

  spawn(entity: Entity) {
    entity.spawn(BLOCKSIZE, 0, BLOCKSIZE);
    this.entities.push(entity);
  }

  draw() {
    this.blocks.forEach((block) => this.placeBlock(block));
  }

  placeBlock(block) {
    this.p5.push();
    this.p5.translate(block.position.x, -block.position.y, block.position.z);
    this.p5.fill(block.color);
    this.p5.box(block.dimensions.x, block.dimensions.y, block.dimensions.z);
    this.p5.pop();
  }

  collisions() {
    this.entities.forEach((entity) => {
      this.blocks.forEach((block) => {
        this.collide(entity, block);
      });
    });
  }

  collide(entity: Entity, block: Block) {
    let playerLeft = entity.position.x - entity.dimensions.x / 2;
    let playerRight = entity.position.x + entity.dimensions.x / 2;
    let playerTop = entity.position.y - entity.dimensions.y / 2;
    let playerBottom = entity.position.y + entity.dimensions.y / 2;
    let playerFront = entity.position.z - entity.dimensions.z / 2;
    let playerBack = entity.position.z + entity.dimensions.z / 2;

    let boxLeft = block.position.x - block.dimensions.x / 2;
    let boxRight = block.position.x + block.dimensions.x / 2;
    let boxTop = block.position.y - block.dimensions.y / 2;
    let boxBottom = block.position.y + block.dimensions.y / 2;
    let boxFront = block.position.z - block.dimensions.z / 2;
    let boxBack = block.position.z + block.dimensions.z / 2;

    let boxLeftOverlap = playerRight - boxLeft;
    let boxRightOverlap = boxRight - playerLeft;
    let boxTopOverlap = playerBottom - boxTop;
    let boxBottomOverlap = boxBottom - playerTop;
    let boxFrontOverlap = playerBack - boxFront;
    let boxBackOverlap = boxBack - playerFront;

    if (
      ((playerLeft > boxLeft && playerLeft < boxRight) ||
        (playerRight > boxLeft && playerRight < boxRight)) &&
      ((playerTop > boxTop && playerTop < boxBottom) ||
        (playerBottom > boxTop && playerBottom < boxBottom)) &&
      ((playerFront > boxFront && playerFront < boxBack) ||
        (playerBack > boxFront && playerBack < boxBack))
    ) {
      let xOverlap = Math.max(Math.min(boxLeftOverlap, boxRightOverlap), 0);
      let yOverlap = Math.max(Math.min(boxTopOverlap, boxBottomOverlap), 0);
      let zOverlap = Math.max(Math.min(boxFrontOverlap, boxBackOverlap), 0);

      if (xOverlap < yOverlap && xOverlap < zOverlap) {
        if (boxLeftOverlap < boxRightOverlap) {
          entity.position.x = boxLeft - entity.dimensions.x / 2;
        } else {
          entity.position.x = boxRight + entity.dimensions.x / 2;
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
        } else {
          entity.position.z = boxBack + entity.dimensions.x / 2;
        }
      }
    }
  }
}

export { Level };
