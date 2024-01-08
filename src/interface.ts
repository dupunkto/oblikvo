import p5 from "p5";

export function setupFonts(p5) {
  let font = p5.loadFont("inconsolata.otf");

  p5.textFont(font);
  p5.textSize(20);
  p5.textAlign(p5.LEFT, p5.TOP);
  p5.fill(225);
  p5.strokeWeight(2);
}

export class HUD {
  p5: p5;

  framerate: number;
  visible: boolean;
  x: number;
  y: number;
  col: number;

  constructor(sketch) {
    this.p5 = sketch;
    this.framerate = 400;
    this.visible = true;
    this.x = 10;
    this.y = 10;
  }

  draw() {
    this.col = 0;

    if (this.visible) {
      this.fixPositioning();

      this.drawText("mouse: left/right : pan");
      this.drawText("       up/down : tilt");
      this.drawText("       click : ptrlock");
      this.drawText(" keys: a/d : left/right");
      this.drawText("       w/s : fwd/bkwd");
      this.drawText("       e/q : up/down");
      this.drawText("       space : jump");
      this.drawText("       h : help");
    }
  }

  fixPositioning() {
    this.p5.camera();
    this.p5.perspective();

    // I don't know why this is needed and I don't know why
    // these values. I got here by trial-and-error.
    this.p5.translate(-this.p5.width / 2, -this.p5.height / 2 + 10, 0);
  }

  drawText(text: string) {
    this.p5.text(text, this.x, this.y + this.col * 20);
    this.col++;
  }
}
