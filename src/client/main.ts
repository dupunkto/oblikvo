import { Client } from "./client";
import { Oblikvo } from "./oblikvo";

const client = new Client();

// Invite URLs look like this:
// example.com#abcdefu
let inviteCode = window.location.hash;

// If the URL already contains an invite code, join
// the game right away. Otherwise, we render a simple
// menu that allows the player to create a new game
// or join an existing one.

if (inviteCode) {
  joinGame(inviteCode);
}

export async function newGame() {
  let inviteCode = await client.new();
  joinGame(inviteCode);
}

export function joinGame(inviteCode: string | null = null) {
  while (!inviteCode) inviteCode = prompt("Invite code?") || "";
  window.location.hash = inviteCode;

  client.join(inviteCode);
  new Oblikvo(client);
}
