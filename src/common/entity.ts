import Vector from "./vector";

interface Entity {
  id: string;
  health: number;
  kills: number;
  killed: number;
  position: Vector;
  velocity: Vector;
  dimensions: Vector;
  onGround: boolean;
  againstWall: boolean;
  isMoving: boolean;
}

export default Entity;
