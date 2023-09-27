export default class Radiotopian {
  constructor(sketch) {
    this.sketch = sketch;
  }

  setup() {
    this.setupCanvas();
    this.model = this.createModel();
  }

  setupCanvas() {
    this.sketch.createCanvas(
      document.body.clientWidth,
      document.body.clientHeight,
      this.sketch.WEBGL,
    );

    window.addEventListener("resize", function (e) {
      this.sketch.resizeCanvas(
        document.body.clientWidth,
        document.body.clientHeight,
      );
    });
  }

  createModel() {
    return new p5.Geometry(1, 1, function createGeometry() {
      this.vertices.push(
        new p5.Vector(-50, -50, 50),
        new p5.Vector(50, -50, 50),
        new p5.Vector(-50, 50, 50),
        new p5.Vector(50, 50, 50),

        new p5.Vector(-50, -50, -50),
        new p5.Vector(50, -50, -50),
        new p5.Vector(-50, 50, -50),
        new p5.Vector(50, 50, -50),
      );
      this.faces.push(
        [0, 1, 3],
        [0, 2, 3],

        [4, 5, 7],
        [4, 6, 7],

        [0, 4, 6],
        [0, 2, 6],
        [0, 2, 3],
      );
    });
  }

  draw() {
    this.sketch.clear();
    this.sketch.orbitControl();
    this.sketch.model(this.model);
  }
}
