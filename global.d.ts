declare global {
  interface Window {
    newGame: function;
    joinGame: function;
    startGame: function;
    changeNick: function;
    playAgain: function;
  }
}

export {};
