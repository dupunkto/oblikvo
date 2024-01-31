import p5 from "p5";

export type Tile = number;
export type Map = Tile[][];

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
  blocks: Block[];

  constructor(sketch: p5, map: Map) {
    this.p5 = sketch;
    this.map = map;
  }

  load() {
    this.blocks = [];
    this.loadBlocks(5);
  }

  loadBlocks(size) {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        const color = this.p5.color(this.p5.random(150, 200));
        const y = this.isGroundTile(this.map[i][j]) ? 0 : -size;

        const block = new Block(i * size, y, j * size, size, color);
        this.blocks.push(block);
      }
    }
  }

  isGroundTile(col: Tile): boolean {
    return col === 0;
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
}

export { Level };
