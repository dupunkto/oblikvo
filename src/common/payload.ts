import Entity from "./entity";
import Level from "./level";

interface JoinPayload {
  inviteCode: string;
  nick: string;
  color: string;
  count: number;
}

interface StartPayload {
  entities: [string, Entity][];
  level: Level;
}

interface UpdatePayload {
  timeLeft: number; // in seconds
  entities: [string, Entity][];
}

type Payload = JoinPayload | StartPayload | UpdatePayload;

export default Payload;
export { JoinPayload, StartPayload, UpdatePayload };
