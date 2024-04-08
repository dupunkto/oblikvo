export function hideScreens() {
  document.querySelectorAll("main").forEach((element) => {
    element.style.display = "none";
  });
}

export function showScreen(screen: string) {
  hideScreens();

  const element = document.querySelector(`.${screen}`);
  if (element) (element as HTMLElement).style.display = "block";
}

// This function uses shitty TypeScript type juggling because
// TS is shit.
export function setCode(inviteCode: string) {
  const code = document.querySelector(`.code`);
  if (code) (code as HTMLElement).innerText = inviteCode;
}
