import Oblikvo from "./oblikvo";
import * as UI from "./interface";

UI.showScreen("main-menu");
UI.showBorders();

const client = new Oblikvo();

// Invite URLs look like this:
// example.com#abcdefu
let inviteCode = window.location.hash.replace("#", "");

// If the URL already contains an invite code, join
// the game right away. Otherwise, we render a simple
// menu that allows the player to create a new game
// or join an existing one.
if (inviteCode) join(inviteCode);

// UI state

client.on("joined", ({ color, nick }) => {
  UI.showScreen("lobby");
  UI.setCode(inviteCode);
  UI.setColor(color);
  UI.setNick(nick);
});

client.on("started", () => {
  UI.hideScreens();
  UI.hideBorders();
});

// Public API

async function newGame() {
  let inviteCode = await client.new();
  join(inviteCode);
}

function joinGame() {
  let inviteCode = prompt("Invite code?");
  if (inviteCode) join(inviteCode);
}

function startGame() {
  if (client.joined) {
    UI.showScreen("loading");
    client.start();
  } else {
    alert("You have to join a game before you can start it.");
  }
}

function changeNick(input: HTMLInputElement) {
  client.broadcast("changeNick", input.value);
}

async function join(inviteCode: string) {
  if (await client.exists(inviteCode)) {
    window.location.hash = inviteCode;

    UI.showScreen("loading");
    client.join(inviteCode);
  } else {
    alert("Couldn't find an active game with that invite code.");
  }
}

window.newGame = newGame;
window.joinGame = joinGame;
window.startGame = startGame;
window.changeNick = changeNick;
