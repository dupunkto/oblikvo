import p5 from "p5";
import setup_live_reload from "./live-reload";
import Radiotopian from "./radiotopian";

new p5((sketch) => {
  let game = new Radiotopian(sketch);

  sketch.setup = () => {
    game.setup();
    setup_live_reload();
  };
  sketch.draw = () => {
    game.draw();
  };
}, document.body);
