import p5 from "p5-node";

interface Vector {
  x: number;
  y: number;
  z: number;
}

export default Vector;

export function toVector({ x, y, z }: Vector): p5.Vector {
  return new p5.Vector(x, y, z);
}
