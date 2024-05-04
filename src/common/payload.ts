import Entity from "./entity";
import Level from "./level";

enum Type {
  Join,
  Start,
  Update,
}

interface JoinPayload {
  inviteCode: string;
  status: string; // "pending" | "ongoing" | "done"
  nick: string;
  color: string;
  clients: number;
}

interface StartPayload {
  entities: [string, Entity][];
  level: Level;
}

interface UpdatePayload {
  entities: [string, Entity][];
}

type Payload = JoinPayload | StartPayload | UpdatePayload;

export default Payload;
export { Type, JoinPayload, StartPayload, UpdatePayload };
