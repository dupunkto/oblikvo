import p5 from "p5";
import setupLiveReload from "./live-reload";
import Player from "./player";
import World from "./world";
import { HUD } from "./interface";
import { SEED } from "./settings";

new p5((p) => {
  let player = new Player(p);
  let world = new World(p);
  let hud = new HUD(p);

  p.preload = function () {
    world.loadShaders();
  };

  p.setup = function () {
    p.noiseSeed(SEED); // Global
    p.frameRate(60);
    p.angleMode(p.RADIANS);

    setupLiveReload();
    setupCanvas();

    world.generate();
    player.spawn();
  };

  function setupCanvas() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = function () {
    p.background(0, 0, 51);

    player.update();
    world.draw(player.position);
    hud.draw();
  };

  p.keyPressed = function () {
    if (p.key == "h") hud.visible = !hud.visible;
  };
}, document.body);
