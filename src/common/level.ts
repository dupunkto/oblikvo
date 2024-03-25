type Level = [Coords, Block][];

// 0 = air, 1 = filled
export type Kind = number;

// "x,y,z" (needs to be a string because JS is a horrible language)
export type Coords = string;

export interface Block {
  color: string;
  kind: Kind;
}

export default Level;
