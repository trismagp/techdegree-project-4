// function score returns:
//  10 - depth: if currentPlayer wins
//  depth - 10: if opponent wins
// -1:          if the game ends in a draw
function score(winner, depth){
  if(winner === currentPlayer){
    return 10 - depth;
  }
  if(winner === otherPlayer){
    return depth - 10;
  }
  if(winner === -1 ){
    return 0;
  }
}

// duplicates the board in parameter
function duplicateBoard(board){
  return board.slice();
}

// duplicates the board and plays the move of the active turn player
function getNewState(board, move, activeTurn){
  var newBoard = duplicateBoard(board);
  newBoard[move] = activeTurn;
  return newBoard;
}

// finds the max value in the score array and returns the index
function getMaxScoreIndex(scores){
  var maxScore = scores[0];
  var maxScoreIndex = 0;

  for (var i = 1; i < scores.length; i++) {
    if(maxScore < scores[i]){
      maxScore = scores[i];
      maxScoreIndex = i;
    }
  }
  return maxScoreIndex;
}

// finds the min value in the score array and returns the index
function getMinScoreIndex(scores){
  var minScore = scores[0];
  var minScoreIndex = 0;

  for (var i = 1; i < scores.length; i++) {
    if(minScore > scores[i]){
      minScore = scores[i];
      minScoreIndex = i;
    }
  }
  return minScoreIndex;
}


// minimax algorithm found in this link
// https://www.neverstopbuilding.com/blog/2013/12/13/tic-tac-toe-understanding-the-minimax-algorithm13/
function minimax(game, depth){
  var board = game.board;
  var scores = game.scores;
  var moves = game.moves;
  var activeTurn = game.activeTurn;

  var winner = isGameOver(board);
  if(winner !== 0){
    return score(winner,depth);
  }

  // Populate the scores array, recursing as needed
  for (var move = 0; move < board.length; move++) {
    if(board[move] === 0){
      var possibleGame = getNewState(board,move,activeTurn);
      var newGame = new Game(possibleGame,switchPlayerNumber(activeTurn));
      scores.push(minimax(newGame, depth + 1));
      moves.push(move);
    }
  }

  // Do the min or the max calculation
  if(activeTurn === currentPlayer){
    var maxScoreIndex = getMaxScoreIndex(scores);
    game.choice = moves[maxScoreIndex];
    return scores[maxScoreIndex];
  }else{
    var minScoreIndex = getMinScoreIndex(scores);
    game.choice = moves[minScoreIndex];
    return scores[minScoreIndex];
  }
}
