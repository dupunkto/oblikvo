import p5 from "p5";
import { Entity, Player } from "./entity";

export type Map = Tile[][];
export type Tile = number;

const BLOCKSIZE = 12;

export class Block {
  position: p5.Vector;
  dimensions: p5.Vector;
  color: p5.Color;

  constructor(x: number, y: number, z: number, size: number, color: p5.Color) {
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

export class World {
  public map: Map;
  public entities: {
    [id: string]: Entity | Player;
  };

  private blocks: Block[];

  constructor() {
    this.map = [
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

    this.blocks = [];
    this.entities = {};

    this.loadMap();
  }

  public loadMap() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        const size = BLOCKSIZE;
        const color = randomColor();
        const y = this.isGroundTile(this.map[i][j]) ? -size : 0;

        const block = new Block(i * size, y, j * size, size, color);
        this.blocks.push(block);
      }
    }
  }

  isGroundTile(tile: Tile): boolean {
    return tile === 0;
  }

  spawn(id: string, entity: Entity) {
    let initialCoordinates = new p5.Vector(0, 0, 0);
    entity.spawn(initialCoordinates);

    this.entities[id] = entity;
  }

  update() {
    for (let id in this.entities) {
      const entity = this.entities[id];
      entity.update();

      this.blocks.forEach((block) => this.collide(entity, block));
    }
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

function randomColor(): p5.Color {
  const c: number = randomNumber(100, 200);
  return newColor(c, c, c);
}

function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function newColor(r: number, g: number, b: number) {
  const color = new p5.Color();

  color.setRed(r);
  color.setGreen(g);
  color.setBlue(b);

  return color;
}
