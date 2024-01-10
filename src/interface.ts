import p5 from "p5";

export function setupFonts(p5) {
  let font = p5.loadFont("inconsolata.otf");

  p5.textFont(font);
  p5.textSize(20);
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
    // this.col = 0;
    // if (this.visible) {
    //   this.drawText("mouse: left/right : pan");
    //   this.drawText("       up/down : tilt");
    //   this.drawText("       click : ptrlock");
    //   this.drawText(" keys: a/d : left/right");
    //   this.drawText("       w/s : fwd/bkwd");
    //   this.drawText("       e/q : up/down");
    //   this.drawText("       space : jump");
    //   this.drawText("       h : help");
    // }
  }

  drawText(text: string) {
    this.p5.text(text, this.x, this.y + this.col * 20);
    this.col++;
  }
}
