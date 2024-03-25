import { default as Blocks, Block, Coords, Kind } from "../common/level";

import Vector from "../common/vector";

interface Format {
  offset: Vector;
  source: Kind[][];
}

class Level {
  blocks: Map<Coords, Block>;

  constructor() {
    this.blocks = new Map();
  }

  insert(x: number, y: number, z: number, value: Block) {
    let key = [x, y, z].toString();
    this.blocks.set(key, value);
  }

  get(x: number, y: number, z: number): Block | undefined {
    let key = [x, y, z].toString();
    return this.blocks.get(key);
  }

  appendFormat(fmt: Format) {
    for (let j = 0; j < fmt.source.length; j++) {
      for (let i = 0; i < fmt.source[0].length; i++) {
        const kind = fmt.source[j][i];
        if (kind != 0)
          this.insert(fmt.offset.x + i, fmt.offset.y, fmt.offset.z + j, {
            color: "white",
            kind: kind,
          });
      }
    }
  }

  serialize(): Blocks {
    return [...this.blocks.entries()];
  }
}

export { Format };
export default Level;
