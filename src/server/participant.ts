// A participant is a client that joined a room.

import { randomColor, randomFromArray } from "../common/random.ts";

const ADJECTIVES = [
  "Dizzy",
  "Whimsical",
  "Silly",
  "Ludicrous",
  "Awkward",
  "Sussy",
  "Foolish",
  "Preposterous",
  "Unusual",
  "Omnipotent",
  "Yodeling",
  "Sweet",
  "Little",
  "Bumfuzzled",
  "Daft",
  "Incoherent",
  "Unfortunate",
  "Unidentified",
  "Disoriented",
  "Bamboozled",
  "Oblivious",
  "Ridiculous",
  "Reckless",
  "Peculiar",
  "Absurd",
  "Mischievous",
  "Bumbling",
  "Clumsy",
  "Dramatic",
  "Outrageous",
  "Goofy",
  "Idiosyncratic",
  "Despicable",
  "xX_",
  "xx_",
  "Xx_",
];

const NOUNS = [
  "Penguin",
  "Banana",
  "Kangaroo",
  "Cookie",
  "Panda",
  "Rainbow",
  "Clown",
  "Wizard",
  "Muggle",
  "Dragon",
  "Aardvark",
  "Baboon",
  "Officer",
  "Bumblebee",
  "Sillybilly",
  "Kitten",
  "Baka",
  "Cantaloupe",
  "Quokka",
  "_xx",
  "_xX",
  "_Xx",
];

class Participant {
  id: string;
  nick: string;
  color: string;

  constructor(id: string) {
    this.id = id;
    this.nick = randomNick();
    this.color = randomColor(50, 240);
  }
}

function randomNick(): string {
  const adjective = randomFromArray(ADJECTIVES);
  const noun = randomFromArray(NOUNS);

  return adjective + noun;
}

export default Participant;
