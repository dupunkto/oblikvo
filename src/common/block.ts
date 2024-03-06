import p5 from "p5-node";

export class Block {
  position: p5.Vector = new p5.Vector(0, 0, 0);
  dimensions: p5.Vector = new p5.Vector(0, 0, 0);
  color: string;

  constructor(x: number, y: number, z: number, size: number) {
    this.position = new p5.Vector(x, y, z);
    this.dimensions = new p5.Vector(size, size, size);
    this.color = randomColor();
  }
}

function randomColor(): string {
  return "#" + randomNumber(100, 200).toString(16).repeat(3);
}

function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}
