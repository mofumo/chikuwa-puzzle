const boardSize = 6;
const dogTypes = [
  'dog_shih_tzu',
  'dog_poodle',
  'dog_chihuahua',
  'dog_shiba',
  'dog_schnauzer'
];
const boardSize = 8; // ← ボードサイズを8×8に変更

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

function handleClick(x, y) {
  if (!selected) {
    selected = { x, y };
  } else {
    const dx = Math.abs(selected.x - x);
    const dy = Math.abs(selected.y - y);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      [board[y][x], board[selected.y][selected.x]] = [board[selected.y][selected.x], board[y][x]];
      if (checkMatches()) {
        removeMatches();
      } else {
        // 元に戻す
        [board[y][x], board[selected.y][selected.x]] = [board[selected.y][selected.x], board[y][x]];
      }
    }
    selected = null;
    drawBoard();
  }
}

function checkMatches() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize - 2; x++) {
      if (board[y][x] === board[y][x + 1] && board[y][x] === board[y][x + 2]) {
        return true;
      }
    }
  }
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize - 2; y++) {
      if (board[y][x] === board[y + 1][x] && board[y][x] === board[y + 2][x]) {
        return true;
      }
    }
  }
  return false;
}

function removeMatches() {
  let matched = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize - 2; x++) {
      if (board[y][x] === board[y][x + 1] && board[y][x] === board[y][x + 2]) {
        matched[y][x] = matched[y][x + 1] = matched[y][x + 2] = true;
      }
    }
  }
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize - 2; y++) {
      if (board[y][x] === board[y + 1][x] && board[y][x] === board[y + 2][x]) {
        matched[y][x] = matched[y + 1][x] = matched[y + 2][x] = true;
      }
    }
  }

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (matched[y][x]) {
        board[y][x] = null;
      }
    }
  }

  dropTiles();
  fillTiles();
  drawBoard();
}

function dropTiles() {
  for (let x = 0; x < boardSize; x++) {
    let emptySpots = 0;
    for (let y = boardSize - 1; y >= 0; y--) {
      if (board[y][x] === null) {
        emptySpots++;
      } else if (emptySpots > 0) {
        board[y + emptySpots][x] = board[y][x];
        board[y][x] = null;
      }
    }
  }
}

function fillTiles() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (board[y][x] === null) {
        board[y][x] = dogTypes[Math.floor(Math.random() * dogTypes.length)];
      }
    }
  }
}

function startGame() {
  createBoard();
  drawBoard();
}

window.onload = startGame;
