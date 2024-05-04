// A participant is a client that joined a room.

import { randomBetween, randomFromArray } from "../common/random.ts";

const ADJECTIVES = ["Sunny", "Dizzy", "Whimsical", "Breezy", "Silly", "Sussy"];
const NOUNS = [
  "Penguin",
  "Banana",
  "Kangaroo",
  "Cookie",
  "Panda",
  "Rainbow",
  "Baka",
];

class Participant {
  id: string;
  nick: string;
  color: string;

  constructor(id: string) {
    this.id = id;
    this.nick = randomNick();
    this.color = randomColor(50, 255);
  }
}

function randomNick(): string {
  const adjective = randomFromArray(ADJECTIVES);
  const noun = randomFromArray(NOUNS);

  return adjective + noun;
}

function randomColor(min: number, max: number): string {
  const r = randomBetween(min, max);
  const g = randomBetween(min, max);
  const b = randomBetween(min, max);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(c: number): string {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export default Participant;
