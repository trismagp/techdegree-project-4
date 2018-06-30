// class Game used by the minimax method to store game states

class Game{
  constructor(board,activeTurn){
    this.board = board;
    this.activeTurn = activeTurn;
    this.choice = -1;
    this.scores = []; // an array of scores
    this.moves = []; //  # an array of moves
  }
}
