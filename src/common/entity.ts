import Vector from "./vector";

interface Entity {
  position: Vector;
  velocity: Vector;
  dimensions: Vector;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;
}

export default Entity;
