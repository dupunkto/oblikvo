import p5 from "p5";
import setupLiveReload from "./live-reload";
import { setupFonts, HUD } from "./interface";
import Player from "./player";
import { createChunk } from "./terrain";

new p5((p) => {
  let hud, player, shader, geom;

  p.preload = function () {
    shader = p.loadShader("simple.vert", "simple.frag");
  };

  p.setup = function () {
    hud = new HUD(p);
    player = new Player(p);

    setupLiveReload();
    setupCanvas(p);
    setupFonts(p);

    p.frameRate(60);
    p.shader(shader);
    p.angleMode(p.RADIANS);

    geom = createChunk();
  };

  function setupCanvas(p) {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = function () {
    p.background(0, 0, 51);
    shader.setUniform("millis", p.millis());
    p.model(geom);

    hud.draw();
    player.draw();
  };

  p.keyPressed = function () {
    if (p.key == "h") hud.visible = !hud.visible;
  };
}, document.body);
