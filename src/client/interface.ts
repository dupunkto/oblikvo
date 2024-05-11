import { MIN_PLAYERS } from "../common/constants";
import Entity from "./entity";

export function showBorders() {
  document.documentElement.classList.add("soviet");
}

export function hideBorders() {
  document.documentElement.classList.remove("soviet");
}

export function hideScreens() {
  document.querySelectorAll("main").forEach((element) => {
    element.style.display = "none";
  });
}

export function showScreen(screen: string) {
  hideScreens();
  forElement(`.${screen}`, (screen) => (screen.style.display = "block"));
}

export function showCrosshair() {
  forElement(".crosshair", (bar) => (bar.style.display = "block"));
}

export function hideCrosshair() {
  forElement(".crosshair", (bar) => (bar.style.display = "none"));
}

export function showHealthBar() {
  forElement(".health", (bar) => (bar.style.display = "block"));
}

export function updateHealthBar(hp: number, max: number) {
  forElement(".health", (bar) => {
    bar.setAttribute("value", hp.toString());
    bar.setAttribute("max", max.toString());
  });
}

export function hideHealthBar() {
  forElement(".health", (bar) => (bar.style.display = "none"));
}

export function showLeaderboard() {
  forElement(".leaderboard", (board) => (board.style.display = "block"));
}

export function updateLeaderboard(entities: [string, Entity][]) {
  forElement(".leaderboard", (board) => {
    board.innerHTML = "";

    entities
      .sort((a, b) => b[1].kills - a[1].kills)
      .forEach(([_, entity]) => {
        const line = renderLeaderLine(entity);
        board.appendChild(line);
      });
  });
}

function renderLeaderLine(entity: Entity) {
  const line = document.createElement("span");
  const name = document.createElement("span");
  const points = document.createElement("span");

  points.innerText = entity.kills.toString();
  name.innerText = `${entity.nick} (${entity.killed})`;
  name.style.color = entity.color;

  line.appendChild(name);
  line.appendChild(points);

  return line;
}

export function hideLeaderboard() {
  forElement(".leaderboard", (board) => (board.style.display = "none"));
}

export function showTimer() {
  forElement(".timer", (timer) => (timer.style.display = "block"));
}

export function updateTimer(left: number) {
  forElement(".timer", (timer) => {
    const minutes = Math.floor(left / 60);
    const seconds = `${left % 60}`.padStart(2, "0");

    timer.innerText = `${minutes}:${seconds}`;
  });
}

export function hideTimer() {
  forElement(".timer", (timer) => (timer.style.display = "none"));
}

export function showChat() {
  forElement(".chat", (chat) => (chat.style.display = "block"));
}

export function appendChatLine(callback: (line: HTMLElement) => void) {
  forElement(".chat", (chat) => {
    const line = document.createElement("span");
    callback(line);
    chat.appendChild(line);
    window.setTimeout(() => {
      line.remove();
    }, 3000);
  });
}

export function formatName(entity: Entity | undefined): string {
  if (entity) {
    const name = document.createElement("span");
    name.className = "name";
    name.innerText = entity.nick;
    name.style.color = entity.color;

    return name.outerHTML;
  } else {
    return "";
  }
}

export function hideChat() {
  forElement(".chat", (chat) => (chat.style.display = "none"));
}

export function setPlayerCount(playerCount: number) {
  forElement(".count", (count) => (count.innerText = `${playerCount}`));
}

export function setCode(inviteCode: string) {
  forElement(".code", (code) => (code.innerText = inviteCode));
}

export function setMVP(entity: Entity) {
  forElement(".mvp", (mvp) => (mvp.innerHTML = formatName(entity)));
}

export function setLoser(entity: Entity) {
  forElement(".loser", (loser) => (loser.innerHTML = formatName(entity)));
}

export function setNick(nick: string, color: string) {
  forElement(".nick", (input) => {
    input.style.color = color;
    (input as HTMLInputElement).value = nick;
  });
}

export function updateStartButton(count: number, min: number = MIN_PLAYERS) {
  forElement(".start", (button) => {
    const disabled = count < min;
    (button as HTMLButtonElement).disabled = disabled;
  });
}

function forElement(
  selector: string,
  callback: (element: HTMLElement) => void,
) {
  document.querySelectorAll(selector).forEach((element) => {
    callback(element as HTMLElement);
  });
}
