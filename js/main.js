const COLOR_PLAYER1 = '#FFA000';
const COLOR_PLAYER2 = '#3688C3';
const COLOR_DRAW = '#54D17A';
const DRAW = 0;

const winPossibilities = [
  [0,1,2],[3,4,5],[6,7,8],  // lines
  [0,3,6],[1,4,7],[2,5,8],  // columns
  [0,4,8],[2,4,6]           // diagonals
]

var currentPlayer;
var otherPlayer;
var boardArray;
var countTurns;

// on start, loads start.txt snippet
$("body").load("./html_snippets/start.txt", function(){
  $(".button").on('click',function(){
    loadBoard();
  });
});

function initBoard(){
  boardArray = new Array(9).fill(0);
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
  $("body").load("./html_snippets/board.txt", function(){
    $(".box").on('click',function(){
      if(boardArray[$(this).index()] === 0){
        $(this).addClass(`box-filled-${currentPlayer}`);
        boardArray[$(this).index()] = currentPlayer;
        countTurns += 1;
        if(isWinner(currentPlayer)){
          loadWin(currentPlayer, "Winner");
        }else if(countTurns===9){
          loadWin(DRAW, "It's a draw");
        }else{
          switchPlayers();
        }
      }
    });

    $(".box").hover(function(){
      console.log($(this).index());
      // console.log(boardArray[$(this).index()]);
      if(boardArray[$(this).index()] === 0){
        var image = currentPlayer === 1 ? 'o.svg' : 'x.svg';
         $(this).css('background-image', `url('./img/${image}')`);
      }
    },function(){
      if(boardArray[$(this).index()] === 0){
        $(this).css('background-image', "none");
      }
    });
  });
}


function loadWin(winner, message){
  $("body").load(`./html_snippets/win.txt`, function(){
    $(".button").on('click',function(){
      loadBoard();
    });
    $("#finish").addClass(screenWin(winner));
    $(".message").text(message);
  });
}


function isWinner(player){
  var hasWon;
  for (var i = 0; i < winPossibilities.length; i++) {
    hasWon = boardArray[winPossibilities[i][0]] === player;
    hasWon = boardArray[winPossibilities[i][1]] === player && hasWon;
    hasWon = boardArray[winPossibilities[i][2]] === player && hasWon;

    if(hasWon){
      return true;
    }
  }
  return false;
}

function switchPlayers(){
  $(`#player${currentPlayer}`).removeClass('active');
  $(`#player${otherPlayer}`).addClass('active');
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  otherPlayer = otherPlayer === 1 ? 2 : 1;
}
