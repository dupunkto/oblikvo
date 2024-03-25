import Entity from "./entity";
import Level from "./level";

enum Type {
  Initial,
  Update,
}

interface UpdatePayload {
  entities: [String, Entity][];
}

interface InitialPayload {
  entities: [String, Entity][];
  level: Level;
}

type Payload = InitialPayload | UpdatePayload;

export default Payload;
export { Type, InitialPayload, UpdatePayload };
