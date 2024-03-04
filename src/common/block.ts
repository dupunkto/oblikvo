import p5 from "p5";

export class Block {
  position: p5.Vector = new p5.Vector(0, 0, 0);
  dimensions: p5.Vector = new p5.Vector(0, 0, 0);
  color: p5.Color;

  constructor(x: number, y: number, z: number, size: number) {
    this.position = new p5.Vector(x, y, z);
    this.dimensions = new p5.Vector(size, size, size);
    this.color = randomColor();
  }
}

function randomColor(): p5.Color {
  const c: number = randomNumber(100, 200);
  return newColor(c, c, c);
}

function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// p5js is shit and doesn't have a proper constructor for the
// p5.Color struct, hence the existence of this function.
function newColor(r: number, g: number, b: number) {
  const color = new p5.Color();

  color.setRed(r);
  color.setGreen(g);
  color.setBlue(b);

  return color;
}
