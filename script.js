
const dogTypes = ['dog_shih_tzu', 'dog_poodle', 'dog_chihuahua', 'dog_shiba', 'dog_schnauzer'];
const boardSize = 8;
let board = [], movesLeft = 30, score = 0;
let firstCell = null;

function getRandomType() {
  return Math.floor(Math.random() * dogTypes.length);
}

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.row = row;
  cell.dataset.col = col;
  const type = getRandomType();
  cell.dataset.type = type;

  const img = document.createElement("img");
  img.src = `img/${dogTypes[type]}.png`;
  img.className = "dog-icon";
  cell.appendChild(img);

  cell.addEventListener("click", handleClick);
  return cell;
}

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board = [];
  for (let r = 0; r < boardSize; r++) {
    const rowArr = [];
    for (let c = 0; c < boardSize; c++) {
      const cell = createCell(r, c);
      boardDiv.appendChild(cell);
      rowArr.push(cell);
    }
    board.push(rowArr);
  }
  setTimeout(removeMatches, 100);
}

function handleClick(e) {
  const cell = e.currentTarget;
  if (!firstCell) {
    firstCell = cell;
    cell.classList.add("selected");
  } else {
    if (firstCell === cell) {
      cell.classList.remove("selected");
      firstCell = null;
      return;
    }

    const r1 = parseInt(firstCell.dataset.row), c1 = parseInt(firstCell.dataset.col);
    const r2 = parseInt(cell.dataset.row), c2 = parseInt(cell.dataset.col);

    if ((Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2)) {
      swapCells(firstCell, cell);
      if (checkAnyMatches()) {
        movesLeft--;
        document.getElementById("moves").textContent = movesLeft;
        setTimeout(() => {
          removeMatches();
          if (movesLeft <= 0) alert("ゲーム終了！");
        }, 100);
      } else {
        swapCells(firstCell, cell);
      }
    }

    firstCell.classList.remove("selected");
    firstCell = null;
  }
}

function swapCells(cell1, cell2) {
  const tempType = cell1.dataset.type;
  cell1.dataset.type = cell2.dataset.type;
  cell2.dataset.type = tempType;

  cell1.querySelector("img").src = `img/${dogTypes[cell1.dataset.type]}.png`;
  cell2.querySelector("img").src = `img/${dogTypes[cell2.dataset.type]}.png`;
}

function checkAnyMatches() {
  return findMatches().length > 0;
}

function findMatches() {
  const matches = [];

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize - 2; c++) {
      const t = board[r][c].dataset.type;
      if (t === board[r][c + 1].dataset.type && t === board[r][c + 2].dataset.type) {
        matches.push(board[r][c], board[r][c + 1], board[r][c + 2]);
      }
    }
  }

  for (let c = 0; c < boardSize; c++) {
    for (let r = 0; r < boardSize - 2; r++) {
      const t = board[r][c].dataset.type;
      if (t === board[r + 1][c].dataset.type && t === board[r + 2][c].dataset.type) {
        matches.push(board[r][c], board[r + 1][c], board[r + 2][c]);
      }
    }
  }

  return matches;
}

function removeMatches() {
  const matches = findMatches();
  if (matches.length === 0) return;

  matches.forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    for (let i = r; i > 0; i--) {
      board[i][c].dataset.type = board[i - 1][c].dataset.type;
      board[i][c].querySelector("img").src = `img/${dogTypes[board[i][c].dataset.type]}.png`;
    }
    const newType = getRandomType();
    board[0][c].dataset.type = newType;
    board[0][c].querySelector("img").src = `img/${dogTypes[newType]}.png`;
  });

  score += matches.length;
  document.getElementById("score").textContent = score;
  setTimeout(removeMatches, 200);
}

window.onload = createBoard;
