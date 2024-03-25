import p5 from "p5";

import { default as Blocks } from "../common/level";

class Level {
  p5: p5;
  blocks: Blocks;

  constructor(p5: p5, blocks: Blocks) {
    this.p5 = p5;
    this.blocks = blocks;
  }

  draw() {
    this.blocks.forEach(([coords, block]) => {
      let [x, y, z] = coords.split(",");
      const dimensions = 7;

      this.p5.push();
      this.p5.fill(block.color);
      this.p5.translate(
        dimensions * parseInt(x),
        -dimensions * parseInt(y),
        dimensions * parseInt(z)
      );
      this.p5.box(dimensions);
      this.p5.pop();
    });
  }
}

export default Level;
