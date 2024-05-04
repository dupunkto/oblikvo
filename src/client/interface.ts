export function hideScreens() {
  document.querySelectorAll("main").forEach((element) => {
    element.style.display = "none";
  });
}

// These functions use shitty TypeScript type juggling
// because TypeScript is stupid and sucks.

export function showScreen(screen: string) {
  hideScreens();
  const element = document.querySelector(`.${screen}`);
  if (element) (element as HTMLElement).style.display = "block";
}

export function setCode(inviteCode: string) {
  const code = document.querySelector(`.code`);
  if (code) (code as HTMLElement).innerText = inviteCode;
}
