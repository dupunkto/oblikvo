import p5 from "p5-node";

import type { Lookup } from "./types";

export interface Entity {
  position: p5.Vector;
  velocity: p5.Vector;
  dimensions: p5.Vector;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;
}

export interface World {
  entities: Lookup<Entity>;
}
