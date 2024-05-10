import p5 from "p5-node";

import { default as Blocks } from "../common/level";
import { Block, Coords, Kind } from "../common/level";

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

  public insert(x: number, y: number, z: number, block: Block): void {
    this.blocks.set(this.key(x, y, z), block);
  }

  public clear(x: number, y: number, z: number): void {
    if (this.get(x, y, z)) {
      this.blocks.delete(this.key(x, y, z));
    }
  }

  public get(x: number, y: number, z: number): Block | undefined {
    return this.blocks.get(this.key(x, y, z));
  }

  public appendFormat(fmt: Format): void {
    for (let j = 0; j < fmt.source.length; j++) {
      for (let i = 0; i < fmt.source[0].length; i++) {
        const kind = fmt.source[j][i];
        const x = fmt.offset.x + i;
        const y = fmt.offset.y;
        const z = fmt.offset.z + j;

        if (kind == 0) {
          this.clear(x, y, z);
        } else {
          this.insert(x, y, z, {
            color: "white",
            kind: kind,
          });
        }
      }
    }
  }

  public randomCoords(): p5.Vector {
    // TODO(msb)
    return new p5.Vector(1, 10, 1)
  }

  public serialize(): Blocks {
    return [...this.blocks.entries()];
  }

  key(x: number, y: number, z: number): string {
    return [x, y, z].toString();
  }
}

export { Format };
export default Level;
