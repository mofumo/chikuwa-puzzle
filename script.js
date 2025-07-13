const boardSize = 6;
const dogTypes = [
  'dog_shih_tzu',
  'dog_poodle',
  'dog_chihuahua',
  'dog_shiba',
  'dog_schnauzer'
];

let board = [];
let selected = null;

function createBoard() {
  board = [];
  for (let y = 0; y < boardSize; y++) {
    let row = [];
    for (let x = 0; x < boardSize; x++) {
      row.push(dogTypes[Math.floor(Math.random() * dogTypes.length)]);
    }
    board.push(row);
  }
}

function drawBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const div = document.createElement("div");
      div.className = "tile";
      const img = document.createElement("img");
      img.src = `img/${board[y][x]}.png`;
      img.alt = board[y][x];
      img.className = "dog-icon";
      div.appendChild(img);
      div.addEventListener("click", () => handleClick(x, y));
      boardDiv.appendChild(div);
    }
  }
}


function createCell(row, col, type) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  const img = document.createElement("img");
  img.src = "img/" + type + ".png";
  img.classList.add("dog-icon");
  cell.appendChild(img);
  cell.addEventListener("click", () => selectCell(row, col));
  return cell;
}

function selectCell(row, col) {
  if (movesLeft <= 0) return;
  const cellElement = document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`);
  if (!firstSelected) {
    firstSelected = { row, col };
    cellElement.classList.add("selected");
  } else {
    const { row: r, col: c } = firstSelected;
    if ((Math.abs(r - row) === 1 && c === col) || (Math.abs(c - col) === 1 && r === row)) {
      swapCells(r, c, row, col);
      firstSelected = null;
      document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
    } else {
      document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
      firstSelected = null;
    }
  }
}

function swapCells(r1, c1, r2, c2) {
  [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
  updateBoard();
  movesLeft--;
  updateStatus();
  setTimeout(checkAndRemoveMatches, 200);
}

function updateBoard() {
  const gameBoard = document.getElementById("game-board");
  for (let row = 0; row < numRows; row++) {
    const rowElement = gameBoard.children[row];
    for (let col = 0; col < numCols; col++) {
      const cell = rowElement.children[col];
      const img = cell.querySelector("img");
      img.src = "img/" + board[row][col] + ".png";
    }
  }
}

function checkAndRemoveMatches() {
  let matched = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  // 横方向チェック
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols - 2; col++) {
      const type = board[row][col];
      if (type && type === board[row][col + 1] && type === board[row][col + 2]) {
        matched[row][col] = matched[row][col + 1] = matched[row][col + 2] = true;
      }
    }
  }
  // 縦方向チェック
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows - 2; row++) {
      const type = board[row][col];
      if (type && type === board[row + 1][col] && type === board[row + 2][col]) {
        matched[row][col] = matched[row + 1][col] = matched[row + 2][col] = true;
      }
    }
  }
  let hasMatch = false;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (matched[row][col]) {
        board[row][col] = null;
        score += 10;
        hasMatch = true;
      }
    }
  }
  if (hasMatch) {
    updateStatus();
    setTimeout(() => {
      collapseBoard();
      refillBoard();
      updateBoard();
      setTimeout(checkAndRemoveMatches, 200);
    }, 200);
  } else if (movesLeft <= 0) {
    alert("またおさんぽにいくわん！");
  }
}

function collapseBoard() {
  for (let col = 0; col < numCols; col++) {
    for (let row = numRows - 1; row >= 0; row--) {
      if (!board[row][col]) {
        for (let r = row - 1; r >= 0; r--) {
          if (board[r][col]) {
            board[row][col] = board[r][col];
            board[r][col] = null;
            break;
          }
        }
      }
    }
  }
}

function refillBoard() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!board[row][col]) {
        board[row][col] = dogTypes[Math.floor(Math.random() * dogTypes.length)];
      }
    }
  }
}

function updateStatus() {
  document.getElementById("score").textContent = score;
  document.getElementById("moves").textContent = movesLeft;
}

// 残りの関数（handleClick, checkMatches, removeMatches, dropTiles, fillTiles, etc.）はver1.5のままでOK
function startGame() {
  createBoard();
  drawBoard();
}

window.onload = startGame;

document.getElementById("start-button").addEventListener("click", createBoard);
window.onload = () => {
  document.getElementById("start-button").style.display = "block";
};
