import p5 from "p5";

import { Lookup } from "../common/types";
import { Map } from "../common/types";
import { Block } from "../common/block";
import { Level } from "../common/level";
import { Entity } from "./entity";

import { CommonWorld } from "../common/interface/world";

export class World implements CommonWorld {
  entities: Lookup<Entity> = {};
  map: Map;
  level: Level;

  constructor(map: Map) {
    this.map = map;
    this.level = new Level(map);
  }

  public spawn(id: string, entity: Entity) {
    let initialCoordinates = new p5.Vector(0, 0, 0);
    entity.spawn(initialCoordinates);

    this.entities[id] = entity;
  }

  public update() {
    for (let id in this.entities) {
      const entity = this.entities[id];
      entity.update();

      this.level.blocks.forEach((block) => this.collide(entity, block));
    }
  }

  collide(entity: Entity, block: Block) {
    let entityLeft = entity.position.x - entity.dimensions.x / 2;
    let entityRight = entity.position.x + entity.dimensions.x / 2;
    let entityTop = entity.position.y - entity.dimensions.y / 2;
    let entityBottom = entity.position.y + entity.dimensions.y / 2;
    let entityFront = entity.position.z - entity.dimensions.z / 2;
    let entityBack = entity.position.z + entity.dimensions.z / 2;

    let boxLeft = block.position.x - block.dimensions.x / 2;
    let boxRight = block.position.x + block.dimensions.x / 2;
    let boxTop = block.position.y - block.dimensions.y / 2;
    let boxBottom = block.position.y + block.dimensions.y / 2;
    let boxFront = block.position.z - block.dimensions.z / 2;
    let boxBack = block.position.z + block.dimensions.z / 2;

    let boxLeftOverlap = entityRight - boxLeft;
    let boxRightOverlap = boxRight - entityLeft;
    let boxTopOverlap = entityBottom - boxTop;
    let boxBottomOverlap = boxBottom - entityTop;
    let boxFrontOverlap = entityBack - boxFront;
    let boxBackOverlap = boxBack - entityFront;

    if (
      ((entityLeft > boxLeft && entityLeft < boxRight) ||
        (entityRight > boxLeft && entityRight < boxRight)) &&
      ((entityTop > boxTop && entityTop < boxBottom) ||
        (entityBottom > boxTop && entityBottom < boxBottom)) &&
      ((entityFront > boxFront && entityFront < boxBack) ||
        (entityBack > boxFront && entityBack < boxBack))
    ) {
      let xOverlap = Math.max(Math.min(boxLeftOverlap, boxRightOverlap), 0);
      let yOverlap = Math.max(Math.min(boxTopOverlap, boxBottomOverlap), 0);
      let zOverlap = Math.max(Math.min(boxFrontOverlap, boxBackOverlap), 0);

      if (xOverlap < yOverlap && xOverlap < zOverlap) {
        if (boxLeftOverlap < boxRightOverlap) {
          entity.position.x = boxLeft - entity.dimensions.x / 2;
          entity.againstWall = true;
        } else {
          entity.position.x = boxRight + entity.dimensions.x / 2;
          entity.againstWall = true;
        }
      } else if (yOverlap < xOverlap && yOverlap < zOverlap) {
        if (boxTopOverlap < boxBottomOverlap) {
          entity.position.y = boxTop - entity.dimensions.y / 2;
          entity.velocity.y = 0;
          entity.onGround = true;
        } else {
          entity.position.y = boxBottom + entity.dimensions.y / 2;
        }
      } else if (zOverlap < xOverlap && zOverlap < yOverlap) {
        if (boxFrontOverlap < boxBackOverlap) {
          entity.position.z = boxFront - entity.dimensions.x / 2;
          entity.againstWall = true;
        } else {
          entity.position.z = boxBack + entity.dimensions.x / 2;
          entity.againstWall = true;
        }
      }
    }
  }
}
