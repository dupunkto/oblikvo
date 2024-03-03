import p5 from "p5";
import { Oblikvo } from "./oblikvo";

// Invite URLs look like this:
// example.com#abcdefu
const inviteCode = window.location.hash;

if (inviteCode) {
  new p5((p) => new Oblikvo(p, inviteCode), document.body);
} else {
  // TODO(robin): Render "join" screen.
}
