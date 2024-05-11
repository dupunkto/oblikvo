import module = require("p5");
export as namespace p5;

declare global {
  interface Window {
    newGame: function;
    joinGame: function;
    startGame: function;
    changeNick: function;
    playAgain: function;
    p5: typeof module;
  }
}
