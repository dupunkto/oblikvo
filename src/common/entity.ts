import Vector from "./vector";

interface Entity {
  id: string;
  nick: string;
  color: string;
  health: number;
  maxHealth: number;
  kills: number;
  killed: number;
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  dimensions: Vector;
  againstWall: boolean;
  isMoving: boolean;
}

export default Entity;
