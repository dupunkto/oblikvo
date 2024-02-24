import p5 from "p5";
import io from "socket.io-client";

import setupLiveReload from "./live-reload";
import { Level, Map } from "./level";
import { Player, Camera } from "./player";
import { HUD } from "./interface";

let map: Map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

new p5((p) => {
  const socket = io();

  let camera = new Camera(p);
  let level = new Level(p, map);
  let player = new Player(p);
  let hud = new HUD(p);

  p.setup = function () {
    let font = p.loadFont("inconsolata.otf");

    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.frameRate(60);
    p.angleMode(p.RADIANS);
    p.textFont(font);
    p.noStroke();

    setupLiveReload();
    level.load();
    level.spawn(player);
    camera.setPerspective();

    document.addEventListener("click", () => usePointerlock());
    document.addEventListener("pointerlockchange", () => unlockPointer());
  };

  function usePointerlock() {
    player.useMouseControls = true;
    p.requestPointerLock();
  }

  function unlockPointer() {
    if (document.pointerLockElement != p.canvas) {
      player.useMouseControls = false;
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    camera.setPerspective();
  };

  p.draw = function () {
    p.background(0, 0, 51);

    player.update();
    p.pointLight(255, 255, 255, player.position);

    level.collisions();
    camera.follow(player);
    level.draw();
    hud.draw();
  };

  p.keyPressed = function () {
    if (p.key == "h") hud.visible = !hud.visible;
  };
}, document.body);
