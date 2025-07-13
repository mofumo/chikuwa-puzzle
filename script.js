const boardSize = 8;
const numMoves = 30;
let movesLeft = numMoves;
let score = 0;

const dogTypes = [
  'dog_shih_tzu',
  'dog_poodle',
  'dog_chihuahua',
  'dog_shiba',
  'dog_schnauzer'
];

// 各セルに画像を設定
const img = document.createElement("img");
img.src = `img/${dogTypes[type]}.png`;
img.alt = dogTypes[type];
img.classList.add("dog-icon");
cell.appendChild(img);

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board = [];

  for (let row = 0; row < boardSize; row++) {
    const rowArr = [];
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const emoji = getRandomEmoji();
      cell.textContent = emoji;
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardDiv.appendChild(cell);
      rowArr.push(cell);
    }
    board.push(rowArr);
  }

  document.getElementById("movesLeft").textContent = movesLeft;
  document.getElementById("score").textContent = score;
}

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function swapCells(cell1, cell2) {
  const temp = cell1.textContent;
  cell1.textContent = cell2.textContent;
  cell2.textContent = temp;
}

function areAdjacent(cell1, cell2) {
  const r1 = parseInt(cell1.dataset.row);
  const c1 = parseInt(cell1.dataset.col);
  const r2 = parseInt(cell2.dataset.row);
  const c2 = parseInt(cell2.dataset.col);
  return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
}

let selected = null;
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;
  if (!selected) {
    selected = e.target;
    selected.style.outline = "2px solid black";
  } else {
    selected.style.outline = "";
    if (selected === e.target) {
      selected = null;
      return;
    }
    if (areAdjacent(selected, e.target)) {
      swapCells(selected, e.target);
      if (checkMatches()) {
        movesLeft--;
        document.getElementById("movesLeft").textContent = movesLeft;
      } else {
        setTimeout(() => swapCells(selected, e.target), 200);
      }
    }
    selected = null;
  }
});

function checkMatches() {
  let matched = false;

  // 横チェック
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize - 2; col++) {
      const a = board[row][col];
      const b = board[row][col + 1];
      const c = board[row][col + 2];
      if (a.textContent === b.textContent && b.textContent === c.textContent) {
        matched = true;
        [a, b, c].forEach(cell => cell.classList.add("pop"));
      }
    }
  }

  // 縦チェック
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row < boardSize - 2; row++) {
      const a = board[row][col];
      const b = board[row + 1][col];
      const c = board[row + 2][col];
      if (a.textContent === b.textContent && b.textContent === c.textContent) {
        matched = true;
        [a, b, c].forEach(cell => cell.classList.add("pop"));
      }
    }
  }

  if (matched) {
    setTimeout(removeMatches, 300);
  }

  return matched;
}

function removeMatches() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      if (cell.classList.contains("pop")) {
        cell.textContent = getRandomEmoji();
        cell.classList.remove("pop");
        score++;
      }
    }
  }
  document.getElementById("score").textContent = score;
}

createBoard();
