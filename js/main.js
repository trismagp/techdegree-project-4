const COLOR_PLAYER1 = '#FFA000';
const COLOR_PLAYER2 = '#3688C3';
const COLOR_DRAW = '#54D17A';
const DRAW = 0;
const GAME_NOT_OVER = 0;

// list all of the winning possibilities
const winPossibilities = [
  [0,1,2],[3,4,5],[6,7,8],  // lines
  [0,3,6],[1,4,7],[2,5,8],  // columns
  [0,4,8],[2,4,6]           // diagonals
]

var currentPlayer;
var otherPlayer;
var mainBoard;
var playerName;
var nbHumanPlayer=1;


// on start, loads start view
loadStart();


/* =================================
  Views loader functions
==================================== */

function loadStart(){
  initBoard();
  $("body").empty();
  $("body").append(START_VIEW);
$("#human2").css('display','none');

  // event listener: on button click,
  // get the name input by the player
  // and load the board view
  $(".button").on('click',function(){
    playerName1 = $("#name1").val();
    playerName1 = playerName1 !== "" ? playerName1 : "Human 1";
    playerName2 = $("#name2").val();
    playerName2 = playerName2 !== "" ? playerName2 : "Human 2";
    loadBoard();
  });

  $(".nb-player-choice").on('change',function(){
    nbHumanPlayer = parseInt($(".nb-player-choice").val());
    if(nbHumanPlayer === 1){
      $("#human2").css('display','none');
    }else{
      $("#human2").css('display','block');
    }
  })
}

function loadBoard(){
  $("body").empty();
  $("body").append(BOARD_VIEW);

  // display the player's name
  $("#player1").append(`<p>${playerName1}</p>`);
  if(nbHumanPlayer===2){
    $("#player2").append(`<p>${playerName2}</p>`);
  }else{
    $("#player2").append(`<p>Minimax (Computer)</p>`);
  }
  // event listener: on .box click, plays the player's move
  // then the computer plays its move right away
  $(".box").on('click',function(){
    var move = $(this).index();
    if(mainBoard[move] === 0){
      playMove(move);
      if(nbHumanPlayer===1){
        computerMove();
      }
    }
  });

  // event listener: on .box hover, display the player's image in the box
  // then removes the image from the box when it's not hovered anymore
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

// loads the game over view
function loadWin(winner, message){
  $("body").empty();
  $("body").append(WIN_VIEW);

  // display will be different depending on which player wins
  // or if the the game ends in a draw
  $("#finish").addClass(screenClassWin(winner));
  $(".message").text(message);

  // event listener to load the start view
  // when button is clicked
  $(".button").on('click',function(){
    loadStart();
  });
}

// initialise the main game state
function initBoard(){
  mainBoard = new Array(9).fill(0);
  currentPlayer = 1;
  otherPlayer = 2;
  nbHumanPlayer=1;
}

// returns a different color depending on the winner
// or if the game ends in a draw
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


// returns a different class name depending on the winner
// or if the game ends in a draw
function screenClassWin(winner){
  switch(winner) {
    case 1:
        return "screen-win-one";
    case 2:
        return "screen-win-two";
    default:
        return "screen-win-tie";
    }
}

// creates first a copy of the game state then pass it
// to the the minimax algorithm to calculates the computer's move
// and plays it
function computerMove(){
  var game = new Game(mainBoard,currentPlayer);
  minimax(game,0);
  playMove(game.choice);
}


function playMove(move){
  // display the player's move
  $(".box").eq(move).addClass(`box-filled-${currentPlayer}`); // box background
  var image = getPlayerImage(currentPlayer);
  $(".box").eq(move).css('background-image', `url('./img/${image}')`); // box image

  // register the player's move in the main board
  mainBoard[move] = currentPlayer;

  var winner = isGameOver(mainBoard);

  if(winner !== GAME_NOT_OVER){
    // in order to avoid the free boxes to be clicked when game is over
    disableFreeBoxes();
    var message =  getGameOverMessage(winner);
    // displays the game over screen with a delay of one second
    setTimeout(function (){
        loadWin(winner, message);
    }, 1000);
  }else{
    // if game is not over, switch players
    switchPlayers();
  }
}

// remove click and hover listener on the main board free boxes
function disableFreeBoxes(){
  for (var i = 0; i < mainBoard.length; i++) {
    if(mainBoard[i] === 0){
      $(".box").eq(i).unbind('click');
      $(".box").eq(i).unbind('mouseenter').unbind('mouseleave');
    }
  }
}

function getGameOverMessage(winner){
  if(winner === 1 ){
    return playerName1 + " wins";
  }
  if(winner === 2 ){
      if(nbHumanPlayer===2){
        return playerName2 + " wins";
      }else{
        return "Computer wins";
      }
  }
  return "It's a draw";
}

function isGameOver(board){
  for (var i = 0; i < winPossibilities.length; i++) {
    var box1 = board[winPossibilities[i][0]];
    var box2 = board[winPossibilities[i][1]];
    var box3 = board[winPossibilities[i][2]];

    var box1box2box3 = `${box1}${box2}${box3}`;

    // player 1 wins return 1
    if(box1box2box3 === '111'){
      return 1;
    }

    // player 2 wins return 2
    if(box1box2box3 === '222'){
      return 2;
    }
  }
  // no more free box, it's a draw and returns 0
  if(board.includes(0)){
    return 0;
  }

  // game is not finish yet, return -1
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
