// Code your JavaScript / jQuery solution here
var board = []
var turn = 0
win_combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [1,4,7],
  [2,5,8],
  [0,3,6],
  [2,4,6]
]

$(document).ready(function() {
  attachListeners()
});
// The ready() method is used to make a function available after the document is loaded.
// Whatever code you write inside the $(document ).ready() method will run once the page DOM is ready to execute JavaScript code.


function player(){
  return ( turn & 1 ) ? "O" : "X";
}

function updateState(element) {
  element.innerHTML = player()
};

function setMessage(string){
  var mssg = document.getElementById("message")
  mssg.innerHTML = string
  //   $("#message").text(string);
}

function checkWinner() {
  var board = [];
  var winner = false

  $('td').text((index, square) => board[index] = square);
win_combos.some(function (combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}
// .text - Get the combined TEXT contents of each element in the set of matched elements, including their descendants.
// .some - checks if any of the elements in an array pass a test (provided as a function).


function doTurn(element){
 updateState(element);
  turn++;
  if(checkWinner()){
   saveGame();
   clearGame();
  }else if(turn === 9){
   setMessage("Tie game.")
   saveGame();
   clearGame();
  }
}
// on every turn it updates filed with X or O and increments turn
// if turn reaches 9 its a tie
// if there checkWinner results to true game ends as well


function attachListeners(){
  $("td").on("click", function(){
  if($(this).text() == "" && !checkWinner()){
   doTurn(this);
  }
 })
  $("#save").click(() => saveGame());
  $("#previous").click(() => previousGames());
  $("#clear").click(() => clearGame());
}
// listeners to do a turn, runs functions on buttons


function saveGame(){
 let state = $("td").toArray().map(x => x.innerText);
 if(board){
  $.ajax({
  type: 'PATCH',
  url: `/games/${board}`,
  data: {state: state}
   });
 }else{
  $.post('/games', {state: state}).done(function(response){
    board = response.data.id
  })
 }
}
// .toArray - retrieve all the elements contained in the jQuery set, as an array.
// clicking the save button after loading the game sends patch request

//function saveGame() {
//  var state = [];
//  var gameData;

//  $('td').text((index, square) => {
//    state.push(square);
//  });

//  gameData = { state: state };

//  if (currentGame) {
//    $.ajax({
//      type: 'PATCH',
//      url: `/games/${currentGame}`,
//      data: gameData
//    });
//  } else {
//    $.post('/games', gameData, function(game) {
//      currentGame = game.data.id;
//      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
//      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
//    });
//  }
//}



function clearGame(){
 $('td').empty();
 turn = 0;
 board = 0;
}

function loadGame(gameid){
 $('#message').text("");
 $.get(`/games/${gameid}`, function(game){
  var state = game.data.attributes.state;
  $("td").text((i,text) => state[i]);
  board = gameid;
  // set board equal to gameid
  turn = state.join('').length
  checkWinner();
 })
}

function previousGames(){
 $("#games").text("");
 $.get('/games', function(games){
  games.data.map(function(game){
   $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
   $("#gameid-" + game.id).click(() => loadGame(game.id));
  })
 })
}
