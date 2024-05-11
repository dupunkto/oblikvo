import p5 from "p5";

import { default as Blocks, SIZE, Block, textureMap } from "../common/level";

class Level {
  p5: p5;
  blocks: Blocks;

  constructor(p5: p5, blocks: Blocks) {
    this.p5 = p5;
    this.blocks = blocks;
  }

  draw(assets: Map<string, any>) {
    this.blocks.forEach(([coords, block]) => {
      let [x, y, z] = coords.split(",");
      const dimensions = SIZE;

      this.p5.push();
      this.p5.texture(getTexture(assets, block));
      this.p5.translate(
        dimensions * (parseInt(x) + 0.5),
        -dimensions * (parseInt(y) + 0.5),
        dimensions * (parseInt(z) + 0.5),
      );
      this.p5.box(dimensions);
      this.p5.pop();
    });
  }
}

function getTexture(assets: Map<string, any>, block: Block) {
  const identifier = textureMap.get(block.kind) as string;
  return assets.get(identifier);
}

export default Level;
