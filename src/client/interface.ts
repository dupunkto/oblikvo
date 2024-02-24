import p5 from "p5";

class Element {
  p5: p5;

  constructor(sketch) {
    this.p5 = sketch;
  }

  startDrawing() {
    this.p5.push();

    this.prepareCamera();
    this.prepareText();
  }

  stopDrawing() {
    this.p5.pop();
  }

  prepareCamera() {
    this.p5.camera(
      0,
      0,
      this.p5.height / 2.0 / Math.tan((Math.PI * 30.0) / 180.0),
      0,
      0,
      0,
      0,
      1,
      0,
    );
    this.p5.ortho(
      -this.p5.width / 2,
      this.p5.width / 2,
      -this.p5.height / 2,
      this.p5.height / 2,
      0,
      1000,
    );
    this.p5.translate(-this.p5.width / 2, -this.p5.height / 2);
  }

  prepareText() {
    this.p5.textSize(20);
    this.p5.fill(225);
    this.p5.strokeWeight(2);
  }
}

export class HUD extends Element {
  visible: boolean;
  x: number;
  y: number;
  col: number;

  constructor(sketch) {
    super(sketch);

    this.visible = true;
    this.x = 10;
    this.y = 20;
  }

  draw() {
    this.col = 0;

    if (this.visible) {
      this.startDrawing();
      this.drawText("mouse: left/right : pan");
      this.drawText("       up/down : tilt");
      this.drawText("       click : ptrlock");
      this.drawText(" keys: a/d : left/right");
      this.drawText("       w/s : fwd/bkwd");
      this.drawText("       e/q : up/down");
      this.drawText("       space : jump");
      this.drawText("       h : help");
      this.stopDrawing();
    }
  }

  drawText(text: string) {
    this.p5.text(text, this.x, this.y + this.col * 20);
    this.col++;
  }
}
