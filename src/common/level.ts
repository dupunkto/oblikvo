type Level = [Coords, Block][];

// 0 = air, 1..9 = filled, 10 = spawn
export type Kind = number;

// "x,y,z" (needs to be a string because JS is a horrible language)
export type Coords = string;

export const SIZE = 14;
export const MIN_Y = -200;

export interface Block {
  color: string;
  kind: Kind;
}

// TODO: Add special texture for spawn points
export const textureMap: Map<Kind, string> = new Map([
  [1, "Metal1"],
  [2, "Metal2"],
  [3, "Sand1"],
  [4, "Sand2"],
  [5, "Cobbles1"],
  [6, "Cobbles2"],
  [7, "Cobbles3"],
  [8, "Bricks2"],
  [9, "Bricks3"],
  [10, "Bricks3"],
]);

export default Level;
