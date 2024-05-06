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

export function showLeaderBoard() {
  forElement(".leaderboard", (board) => (board.style.display = "block"));
}

export function updateLeaderBoard(entities: Entity[]) {
  forElement(".leaderboard", (board) => {
    board.innerHTML = "";

    entities
      .sort((a: Entity, b: Entity) => b.kills - a.kills)
      .forEach((entity) => {
        const line = renderLeaderLine(entity);
        board.appendChild(line);
      });
  });
}

function renderLeaderLine(entity: Entity) {
  const line = document.createElement("p");
  const name = document.createElement("span");
  const points = document.createElement("span");

  points.innerText = entity.kills.toString();
  name.innerText = entity.nick;
  name.style.color = entity.color;

  line.appendChild(name);
  line.appendChild(points);

  return line;
}

export function hideLeaderBoard() {
  forElement(".leaderboard", (board) => (board.style.display = "none"));
}

export function setCode(inviteCode: string) {
  forElement(".code", (code) => (code.innerText = inviteCode));
}

export function setColor(color: string) {
  forElement(".nick", (nick) => (nick.style.color = color));
}

export function setNick(nick: string) {
  forElement(".nick", (input) => {
    (input as HTMLInputElement).value = nick;
  });
}

function forElement(
  selector: string,
  callback: (element: HTMLElement) => void,
) {
  const element = document.querySelector(selector);
  if (element) callback(element as HTMLElement);
}
