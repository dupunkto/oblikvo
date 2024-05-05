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
