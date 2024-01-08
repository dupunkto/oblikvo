import p5 from "p5";
import setupLiveReload from "./live-reload";
import { HUD } from "./interface";
import Player from "./player";

new p5((p) => {
  const hud = new HUD(p);
  const player = new Player(p);

  p.setup = function () {
    setupLiveReload();
    setupCanvas();
  };

  function setupCanvas() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = function () {
    p.clear();
    p.orbitControl();

    hud.draw();
    player.draw();
  };
}, document.body);
