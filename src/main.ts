import p5 from "p5";
import { setup_live_reload } from "./live-reload";

let m;

function setup() {
  this.createCanvas(400, 400, this.WEBGL);
  m = createModel();
}

function draw() {
    this.clear();
    this.orbitControl();
    this.model(m);
}

function createModel() {
  return new p5.Geometry(
    1, 1,
    function createGeometry() {
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
    }
  );
}

new p5((sketch) => {
  sketch.setup = () => {
    setup.apply(sketch, []);
    setup_live_reload();
  };
  sketch.draw = () => {
    draw.apply(sketch, []);
  };
}, "p5-canvas");
