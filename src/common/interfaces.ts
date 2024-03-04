import p5 from "p5";

import type { Map, Lookup } from "./types";

export interface CommonEntity {
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;
}

export interface CommonWorld {
  entities: Lookup<CommonEntity>;
  map: Map;
}
