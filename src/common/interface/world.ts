import type { Map, Lookup } from "../types";
import type { CommonEntity } from "./entity";

export interface CommonWorld {
  entities: Lookup<CommonEntity>;
  map: Map;
}
