type Level = [Coords, Block][];

// 0 = air, 1 = filled
export type Kind = number;

// "x,y,z" (needs to be a string because JS is a horrible language)
export type Coords = string;

export interface Block {
  color: string;
  kind: Kind;
}

export const SIZE = 9;
export default Level;

// TODO: Actually import all textures
export const kindAssetMap: Map<Kind, string> = new Map([
  [1, "Metal1"],
  [2, "Metal2"],
  [3, "Sand1"],
  [4, "Sand2"],
  [5, "Cobbles1"],
  [6, "Cobbles2"],
  [7, "Cobbles3"],
  [8, "Bricks2"],
  [9, "Bricks3"],
]);
