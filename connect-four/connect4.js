/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  return new Array(HEIGHT).fill(null).map(column => Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById("board");

  const topRow = document.createElement("tr");
  topRow.setAttribute("id", "column-top");
  topRow.addEventListener("click", handleClick);

  for (let column = 0; column < WIDTH; column++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", column);
    topRow.append(headCell);
  }
  htmlBoard.append(topRow);

  // creates rows on board
  for (let row = 0; row < HEIGHT; row++) {
    const currentRow = document.createElement("tr");
    for (let column = 0; column < WIDTH; column++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${row}-${column}`);
      currentRow.append(cell);
    }
    htmlBoard.append(currentRow);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(column) {
  for(let row = HEIGHT - 1; row >= 0; row--){
    if(board[row][column] === null) {
      return row;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(row, column) {
  let tableCell = document.getElementById(`${row}-${column}`);

  let playerPiece = document.createElement("div");
  playerPiece.classList.add("piece", `Player${currPlayer}`);

  tableCell.append(playerPiece);
}

function addToBoard(row, column){
  board[row][column] = currPlayer;
}

function switchPlayer(){
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let column = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let row = findSpotForCol(column);
  if (row === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(row, column);
  addToBoard(row, column);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(checkForTie()){
    return endGame(`It's a tie!`);
  }

  // switch players
  switchPlayer();
}

function checkForTie(){
  return board.every(row => row.every(cell => cell !== null));
//   for(let row = 0; row < HEIGHT - 1; row++){
//     for(let column = 0; column < WIDTH - 1; column++){
//       if(board[row][column] === null){
//         return false;
//       }
//     }
//   }
//   return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // checks entire board to see if there are 4 in a row of the same color
  // along horizontal, vertical, diagonal
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

board = makeBoard();
makeHtmlBoard();
