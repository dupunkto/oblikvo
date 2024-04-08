import Entity from "./entity";
import Level from "./level";

enum Type {
  Initial,
  Update,
}

interface UpdatePayload {
  entities: [string, Entity][];
}

interface InitialPayload {
  entities: [string, Entity][];
  level: Level;
}

type Payload = InitialPayload | UpdatePayload;

export default Payload;
export { Type, InitialPayload, UpdatePayload };
