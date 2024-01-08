import p5 from "p5";

export class HUD {
  visible: boolean;
  p5: p5;
  x: number;
  y: number;
  col: number;

  constructor(sketch) {
    this.p5 = sketch;
    this.visible = true;
    this.x = 10;
    this.y = 10;
    this.draw();
  }

  draw() {
    this.col = 0;

    if (this.visible) {
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

  drawText(text: string) {
    this.p5.text(text, this.x, this.y + this.col * 10);
    this.col++;
  }
}
