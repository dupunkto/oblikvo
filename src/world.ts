import p5 from "p5";

import {
  CHUNK_CELL_DIM,
  CHUNK_DIM,
  CHUNK_HEIGHT,
  TERRAIN_SPREAD,
  SEA_LEVEL,
} from "./settings";

class World {
  p5: p5;
  terrain: p5.Geometry;
  terrainShader: p5.Shader;
  overlayShader: p5.Shader;

  constructor(sketch) {
    this.p5 = sketch;
  }

  loadShaders() {
    this.terrainShader = this.p5.loadShader("terrain.vert", "terrain.frag");
    this.overlayShader = this.p5.loadShader("overlay.vert", "overlay.frag");
  }

  generate() {
    let chunks: p5.Geometry[] = [];

    for (let z = -2; z < 2; z++) {
      for (let x = -2; x < 2; x++) {
        chunks.push(this.createChunk(x, z));
      }
    }

    this.terrain = this.mergeChunks(chunks);
  }

  createChunk(ch_x, ch_z): p5.Geometry[] {
    const sketch = this.p5;

    return new p5.Geometry(CHUNK_DIM, CHUNK_DIM, function createGeometry() {
      for (let z = 0; z < CHUNK_DIM; z++) {
        for (let x = 0; x < CHUNK_DIM; x++) {
          const world_x = x + ch_x * CHUNK_DIM - ch_x;
          const world_z = z + ch_z * CHUNK_DIM - ch_z;

          this.vertices.push(
            new p5.Vector(
              CHUNK_CELL_DIM * world_x,
              CHUNK_HEIGHT *
                sketch.noise(
                  TERRAIN_SPREAD * world_x,
                  TERRAIN_SPREAD * world_z
                ),
              CHUNK_CELL_DIM * world_z
            )
          );
        }
      }

      for (let y = 0; y < CHUNK_DIM - 1; y++) {
        for (let x = 0; x < CHUNK_DIM - 1; x++) {
          this.faces.push(
            [x + y * CHUNK_DIM, x + y * CHUNK_DIM + 1, x + (y + 1) * CHUNK_DIM],
            [
              x + y * CHUNK_DIM + 1,
              x + (y + 1) * CHUNK_DIM + 1,
              x + (y + 1) * CHUNK_DIM,
            ]
          );
        }
      }
    });
  }

  mergeChunks(chunks: p5.Geometry[]): p5.Geometry {
    return new p5.Geometry(1, 1, function mergeChunk() {
      let f_offset = 0;

      for (const chunk of chunks) {
        this.vertices = this.vertices.concat(chunk.vertices);

        this.faces = this.faces.concat(
          chunk.faces.map((f) => [
            f[0] + f_offset,
            f[1] + f_offset,
            f[2] + f_offset,
          ])
        );
        f_offset += chunk.vertices.length;
      }

      this.computeNormals();
    });
  }

  draw(player_y) {
    this.terrainShader.setUniform("sea_level", SEA_LEVEL);
    this.overlayShader.setUniform("sea_level", SEA_LEVEL);
    this.overlayShader.setUniform("player_y", player_y);

    this.p5.shader(this.terrainShader);
    this.p5.model(this.terrain);

    this.p5.shader(this.overlayShader);
    this.p5.rect(0, 0, this.p5.width, this.p5.height);
  }
}

export default World;
