import Oblikvo from "./oblikvo";

const client = new Oblikvo();

// Invite URLs look like this:
// example.com#abcdefu
let inviteCode = window.location.hash.replace("#", "");

// If the URL already contains an invite code, join
// the game right away. Otherwise, we render a simple
// menu that allows the player to create a new game
// or join an existing one.

if (inviteCode) {
  joinGame(inviteCode);
}

async function newGame() {
  console.log("Creating new game");

  let inviteCode = await client.new();
  joinGame(inviteCode);
}

async function joinGame(inviteCode: string = "") {
  while (!inviteCode) inviteCode = prompt("Invite code?") || "";
  window.location.hash = inviteCode;

  await client.join(inviteCode);
}

// Make public API available globally.
window.newGame = newGame;
window.joinGame = joinGame;
