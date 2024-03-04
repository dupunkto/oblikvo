import { Map, Tile } from "./types";
import { Block } from "./block";

const BLOCKSIZE = 12;

export class Level {
  blocks: Block[] = [];

  constructor(map: Map) {
    this.blocks = toBlocks(map);
  }
}

function toBlocks(map: Map) {
  let blocks: Block[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const size = BLOCKSIZE;
      const y = isGroundTile(map[i][j]) ? -size : 0;

      const block = new Block(size * i, y, size * j, size);
      blocks.push(block);
    }
  }

  return blocks;
}

function isGroundTile(tile: Tile): boolean {
  return tile === 0;
}
