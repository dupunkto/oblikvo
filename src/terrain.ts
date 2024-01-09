import p5 from "p5";

const CHUNK_DIM = 10;
const CHUNK_CELL_DIM = 10;

export function createChunk() {
  return new p5.Geometry(1, 1, function createGeometry() {
    for (let y = 0; y < CHUNK_DIM; y++) {
      for (let x = 0; x < CHUNK_DIM; x++) {
        this.vertices.push(
          new p5.Vector(
            10 * x * CHUNK_CELL_DIM,
            10 * y * CHUNK_CELL_DIM,
            Math.random() * 200
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

    this.computeNormals();
  });
}
