import p5 from "p5";
import { setup_live_reload } from "./live-reload";

function setup() {
  this.createCanvas(400, 400);
}

function draw() {
  if (this.mouseIsPressed) {
    this.fill(0);
  } else {
    this.fill(255);
  }
  this.ellipse(this.mouseX, this.mouseY, 80, 80);
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
