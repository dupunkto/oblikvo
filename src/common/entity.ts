import Vector from "./vector";

interface Entity {
  health: number;
  position: Vector;
  velocity: Vector;
  dimensions: Vector;

  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;
}

export default Entity;
