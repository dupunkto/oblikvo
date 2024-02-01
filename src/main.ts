import p5 from "p5";
import setupLiveReload from "./live-reload";
import { Level, Map } from "./level";
import Player from "./player";
import { HUD } from "./interface";

let map: Map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

new p5((p) => {
  let font = p.loadFont("inconsolata.otf");

  let level = new Level(p, map);
  let player = new Player(p);
  let hud = new HUD(p);

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.frameRate(60);
    p.angleMode(p.RADIANS);
    p.noStroke();

    setupLiveReload();
    level.load();
    level.spawn(player);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    player.setPerspective();
  };

  p.draw = function () {
    p.background(0, 0, 51);

    player.update();
    level.collisions();
    level.draw();
    hud.draw();
  };

  p.keyPressed = function () {
    if (p.key == "h") hud.visible = !hud.visible;
  };
}, document.body);
