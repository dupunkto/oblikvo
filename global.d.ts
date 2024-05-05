declare global {
  interface Window { 
    newGame: function,
    joinGame: function,
    startGame: function,
    changeNick: function
  }
}

export {};