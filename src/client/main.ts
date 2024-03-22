import Oblikvo from "./oblikvo";

const client = new Oblikvo();

// Invite URLs look like this:
// example.com#abcdefu
let inviteCode = window.location.hash.replace("#", "");

// If the URL already contains an invite code, join
// the game right away. Otherwise, we render a simple
// menu that allows the player to create a new game
// or join an existing one.
if (inviteCode) join(inviteCode);

async function newGame() {
  let inviteCode = await client.new();
  join(inviteCode);
}

function joinGame() {
  let inviteCode = prompt("Invite code?");
  if (inviteCode) join(inviteCode);
}

async function join(inviteCode: string) {
  if (await client.exists(inviteCode)) {
    window.location.hash = inviteCode;
    client.join(inviteCode);
  } else {
    alert("Couldn't find an active game with that invite code.");
  }
}

// Make public API available globally.

globalThis.newGame = newGame;
globalThis.joinGame = joinGame;
