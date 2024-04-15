import Vector from "../common/vector";
import Entity from "./entity";

// Helpfully provided by ChatGPT. Fuck algorithms Am I Right.
export function insertsects(entity: Entity, origin: Vector, direction: Vector) {
  let t1, t2;
  
  let tMin = Number.NEGATIVE_INFINITY;
  let tMax = Number.POSITIVE_INFINITY;

  let invDirection = {
    x: 1 / direction.x,
    y: 1 / direction.y,
    z: 1 / direction.z
  };

  // Calculate the intersection with the x plane
  t1 = (entity.position.x - entity.dimensions.x / 2 - origin.x) * invDirection.x;
  t2 = (entity.position.x + entity.dimensions.x / 2 - origin.x) * invDirection.x;

  tMin = Math.max(tMin, Math.min(t1, t2));
  tMax = Math.min(tMax, Math.max(t1, t2));

  // Calculate the intersection with the y plane
  t1 = (entity.position.y - entity.dimensions.y / 2 - origin.y) * invDirection.y;
  t2 = (entity.position.y + entity.dimensions.y / 2 - origin.y) * invDirection.y;

  tMin = Math.max(tMin, Math.min(t1, t2));
  tMax = Math.min(tMax, Math.max(t1, t2));

  // Calculate the intersection with the z plane
  t1 = (entity.position.z - entity.dimensions.z / 2 - origin.z) * invDirection.z;
  t2 = (entity.position.z + entity.dimensions.z / 2 - origin.z) * invDirection.z;

  tMin = Math.max(tMin, Math.min(t1, t2));
  tMax = Math.min(tMax, Math.max(t1, t2));

  return tMax >= tMin && tMax >= 0;  
}

// Implementation of 3D pythagoras
export function distanceBetween(p1: Vector, p2: Vector) {
  return Math.sqrt(Math.pow(p2.2 - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
}
