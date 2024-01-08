import p5 from "p5";
import setupLiveReload from "./live-reload";

new p5((p) => {
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
  };
}, document.body);
