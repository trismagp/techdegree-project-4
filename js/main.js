const COLOR_PLAYER1 = '#FFA000';
const COLOR_PLAYER2 = '#3688C3';
const COLOR_DRAW = '#54D17A';
const DRAW = 0;

const winPossibilities = [
  [0,1,2],[3,4,5],[6,7,8],  // lines
  [0,3,6],[1,4,7],[2,5,8],  // columns
  [0,4,8],[2,4,6]           // diagonals
]

const START_VIEW = `<div class="screen screen-start" id="start">
                      <header>
                        <h1>Tic Tac Toe</h1>
                        <div class = "divinput">
                          <input type="text" id="name" placeholder="Enter your name"/>
                        </div>
                        <a href="#" class="button">Start game</a>
                      </header>
                    </div>`;

const BOARD_VIEW = `<div class="board" id="board">
                      <header>
                        <h1>Tic Tac Toe</h1>
                        <ul>
                          <li class="players player1 active" id="player1"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg>
                          </li>
                          <li class="players player2" id="player2"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg></li>
                        </ul>
                      </header>
                      <ul class="boxes">
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                        <li class="box"></li>
                      </ul>
                    </div>`;

const WIN_VIEW = `<div class="screen screen-win" id="finish">
                    <header>
                      <h1>Tic Tac Toe</h1>
                      <p class="message"></p>
                      <a href="#" class="button">New game</a>
                    </header>
                  </div>`;

var currentPlayer;
var otherPlayer;
var mainBoard;
var countTurns;
var playerName;


function score(winner, depth){
  if(winner === -1 ){
    return 0;
  }
  if(winner === currentPlayer){
    return 10 - depth;
  }
  return depth - 10
}

function duplicateBoard(board){
  return board.slice();
}

function getNewState(board, move, activeTurn){
  var newBoard = duplicateBoard(board);
  newBoard[move] = activeTurn;
  return newBoard;
}

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

function minimax(game, depth){
  var board = game.board;
  var scores = game.scores;
  var moves = game.moves;
  var activeTurn = game.activeTurn;

  var winner = isGameOver(board);

  if(winner !== 0){
    return score(winner,depth);
  }

  for (var move = 0; move < board.length; move++) {
    if(board[move] === 0){
      var possibleGame = getNewState(board,move,activeTurn);
      var newGame = new Game(possibleGame,switchPlayerNumber(activeTurn));
      scores.push(minimax(newGame, depth + 1));
      moves.push(move);
    }
  }

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

class Game{
  constructor(board,activeTurn){
    this.board = board;
    this.activeTurn = activeTurn;
    this.choice = -1;
    this.scores = []; // an array of scores
    this.moves = []; //  # an array of moves
  }

  get board(){
    return this._board;
  }

  set board(value){
    this._board = value;
  }

  get activeTurn(){
    return this._activeTurn;
  }

  set activeTurn(value){
    this._activeTurn = value;
  }

  get choice(){
    return this._choice;
  }

  set choice(value){
    this._choice = value;
  }

}

// on start, loads start.txt snippet
loadStart();

function loadStart(){
  $("body").empty();
  $("body").append(START_VIEW);

  $(".button").on('click',function(){
    playerName = $("#name").val();
    playerName = playerName !== "" ? playerName : "Player1";
    loadBoard();
  });
}


function initBoard(){
  mainBoard = new Array(9).fill(0);
  currentPlayer = 1;
  otherPlayer = 2;
  winner = 0;
  countTurns = 0;
}

function backgroundColor(winner){
  switch(winner) {
    case 1:
        return COLOR_PLAYER1;
    case 2:
        return COLOR_PLAYER2;
    default:
        return COLOR_DRAW;
    }
}

function screenWin(winner){
  switch(winner) {
    case 1:
        return "screen-win-one";
    case 2:
        return "screen-win-two";
    default:
        return "screen-win-tie";
    }
}

function loadBoard(){
  initBoard();
  $("body").empty();
  $("body").append(BOARD_VIEW);

  $("#player1").append(`<p>${playerName}</p>`);
  $("#player2").append(`<p>Computer</p>`);

  $(".box").on('click',function(){
    if(mainBoard[$(this).index()] === 0){
      $(this).addClass(`box-filled-${currentPlayer}`);
      mainBoard[$(this).index()] = currentPlayer;
      countTurns += 1;
      if(isWinner(currentPlayer,mainBoard)){
        var message;
        if(currentPlayer ===1 ){
          message = playerName + " wins";
        }else{
          message = "Computer wins";
        }
        setTimeout(function (){
            loadWin(currentPlayer,message);
        }, 1000);
      }else if(countTurns===9){
        setTimeout(function (){
            loadWin(DRAW, "It's a draw");
        }, 1000);
      }else{
        switchPlayers();
      }

      if(currentPlayer===2){
        var game = new Game(mainBoard,currentPlayer);
        minimax(game,0);
        playMove(game.choice);
      }
    }
  });

  $(".box").hover(function(){
    if(mainBoard[$(this).index()] === 0){
      var image = getPlayerImage(currentPlayer);
       $(this).css('background-image', `url('./img/${image}')`);
    }
  },function(){
    if(mainBoard[$(this).index()] === 0){
      $(this).css('background-image', "none");
    }
  });

}

function playMove(move){
  $(".box").eq(move).addClass(`box-filled-${currentPlayer}`);
  var image = getPlayerImage(currentPlayer);
  $(".box").eq(move).css('background-image', `url('./img/${image}')`);
  mainBoard[move] = currentPlayer;
  countTurns += 1;
  if(isWinner(currentPlayer,mainBoard)){
    var message;
    if(currentPlayer ===1 ){
      message = playerName + " wins";
    }else{
      message = "Computer wins";
    }
    setTimeout(function (){
        loadWin(currentPlayer,message);
    }, 1000);
  }else if(countTurns===9){
    setTimeout(function (){
        loadWin(DRAW, "It's a draw");
    }, 1000);
  }else{
    switchPlayers();
  }
}

function loadWin(winner, message){
  $("body").empty();
  $("body").append(WIN_VIEW);

  $(".button").on('click',function(){
    loadStart();
  });
  $("#finish").addClass(screenWin(winner));
  $(".message").text(message);
}

function isGameOver(board){
  for (var i = 0; i < winPossibilities.length; i++) {
    var box1 = board[winPossibilities[i][0]];
    var box2 = board[winPossibilities[i][1]];
    var box3 = board[winPossibilities[i][2]];

    var box1box2box3 = `${box1}${box2}${box3}`;

    if(box1box2box3 === '111'){
      return 1;
    }
    if(box1box2box3 === '222'){
      return 2;
    }
  }
  if(board.includes(0)){
    return 0;
  }
  return -1;
}

function isWinner(player,board){
  return isGameOver(board) === player;
}

function switchPlayers(){
  $(`#player${currentPlayer}`).removeClass('active');
  $(`#player${otherPlayer}`).addClass('active');
  currentPlayer = switchPlayerNumber(currentPlayer);
  otherPlayer = switchPlayerNumber(otherPlayer);
}

function switchPlayerNumber(player){
  return player === 1 ? 2 : 1;
}

function getPlayerImage(player){
  return player === 1 ? 'o.svg' : 'x.svg';
}
