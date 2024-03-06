import p5 from "p5-node";

import type { Map, Lookup } from "./types";

export interface Entity {
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;
}

export interface State {
  map: Map;
  entities: Lookup<Entity>;
}
