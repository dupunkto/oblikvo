export function hideScreens() {
  document.querySelectorAll("main").forEach((element) => {
    element.style.display = "none";
  });
}

export function showScreen(screen: string) {
  hideScreens();
  forElement(`.${screen}`, (screen) => (screen.style.display = "block"));
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
