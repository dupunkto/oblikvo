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

client.on("joined", ({ inviteCode, color, nick, count }) => {
  UI.showScreen("lobby");
  UI.setCode(inviteCode);
  UI.setNick(nick, color);
  UI.setPlayerCount(count);
  UI.updateStartButton(count);
});

client.on("player-count", (count: number) => {
  UI.setPlayerCount(count);
  UI.updateStartButton(count);
});

client.on("started", () => {
  UI.hideScreens();
  UI.hideBorders();
  UI.showHealthBar();
  UI.showTimer();
  UI.showChat();
});

client.on("finished", ({ winner, loser }) => {
  UI.showScreen("podium");
  UI.setMVP(winner);
  UI.setLoser(loser);
});

client.on("update", ({ timeLeft }) => {
  UI.updateHealthBar(client.player.health, client.player.maxHealth);
  UI.updateTimer(timeLeft);
});

client.on("hit", ({ from, to }) => {
  UI.appendChatLine(
    (line) => (line.innerHTML += name(from) + " hit " + name(to)),
  );
});

client.on("kill", ({ from, to }) => {
  UI.appendChatLine(
    (line) => (line.innerHTML += name(from) + " slashed " + name(to)),
  );
});

client.on("left", (entity) => {
  UI.appendChatLine(
    (line) => (line.innerHTML += UI.formatName(entity) + " left"),
  );
});

function name(id: string) {
  const entity = client.getEntity(id);
  return entity ? UI.formatName(entity) : "";
}

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

function playAgain() {
  if (client.joined) {
    UI.showScreen("loading");
    client.restart();
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
    alert(
      "Couldn't join a game using that code. Either the game doesn't exist or has already started.",
    );
  }
}

window.newGame = newGame;
window.joinGame = joinGame;
window.startGame = startGame;
window.changeNick = changeNick;
window.playAgain = playAgain;
