import p5 from "p5";
import setupLiveReload from "./live-reload";
import { setupFonts, HUD } from "./interface";
import Player from "./player";

new p5((p) => {
  let hud, player;

  p.setup = function () {
    hud = new HUD(p);
    player = new Player(p);

    setupLiveReload();
    setupCanvas(p);
    setupFonts(p);
  };

  function setupCanvas(p) {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
  }

  p.draw = function () {
    p.background(0, 0, 51);

    hud.draw();
    player.draw();
  };
}, document.body);
