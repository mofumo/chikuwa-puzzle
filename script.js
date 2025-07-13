const boardSize = 8;
const dogTypes = [
  'dog_shih_tzu',
  'dog_poodle',
  'dog_chihuahua',
  'dog_shiba',
  'dog_schnauzer'
];
let board = [];

const boardElement = document.getElementById("board");
boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

// アイコンをランダムに生成
function getRandomDog() {
  return dogTypes[Math.floor(Math.random() * dogTypes.length)];
}

// 盤面の初期化
function initBoard() {
  board = [];
  boardElement.innerHTML = "";
  for (let row = 0; row < boardSize; row++) {
    const rowArray = [];
    for (let col = 0; col < boardSize; col++) {
      const dog = getRandomDog();
      rowArray.push(dog);
      const cell = document.createElement("div");
      cell.className = "cell";
      const img = document.createElement("img");
      img.src = `img/${dog}.png`;
      img.alt = dog;
      img.className = "dog-icon";
      cell.appendChild(img);
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
    board.push(rowArray);
  }
}

// マッチしているか確認
function checkMatch(row, col) {
  const current = board[row][col];
  if (!current) return false;

  let horizontal = 1;
  let vertical = 1;

  // 横方向
  for (let i = col - 1; i >= 0 && board[row][i] === current; i--) horizontal++;
  for (let i = col + 1; i < boardSize && board[row][i] === current; i++) horizontal++;

  // 縦方向
  for (let i = row - 1; i >= 0 && board[i][col] === current; i--) vertical++;
  for (let i = row + 1; i < boardSize && board[i][col] === current; i++) vertical++;

  return horizontal >= 3 || vertical >= 3;
}

// マッチしたピースを消す
function removeMatches() {
  const toRemove = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (checkMatch(row, col)) {
        toRemove.push([row, col]);
      }
    }
  }

  toRemove.forEach(([row, col]) => {
    board[row][col] = null;
  });

  return toRemove.length > 0;
}

// 落下処理
function dropDogs() {
  for (let col = 0; col < boardSize; col++) {
    for (let row = boardSize - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        for (let r = row - 1; r >= 0; r--) {
          if (board[r][col] !== null) {
            board[row][col] = board[r][col];
            board[r][col] = null;
            break;
          }
        }
      }
    }
  }

  // 新しい犬を上から補充
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row < boardSize; row++) {
      if (board[row][col] === null) {
        board[row][col] = getRandomDog();
      }
    }
  }
}

// 再描画
function renderBoard() {
  boardElement.innerHTML = "";
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const img = document.createElement("img");
      img.src = `img/${board[row][col]}.png`;
      img.alt = board[row][col];
      img.className = "dog-icon";
      cell.appendChild(img);
      boardElement.appendChild(cell);
    }
  }
}

// クリックで連鎖処理
function handleClick() {
  if (removeMatches()) {
    renderBoard();
    setTimeout(() => {
      dropDogs();
      renderBoard();
      setTimeout(() => {
        handleClick(); // 再帰で連鎖処理
      }, 300);
    }, 300);
  }
}

document.getElementById("shuffle").addEventListener("click", () => {
  initBoard();
  renderBoard();
});

document.getElementById("match").addEventListener("click", () => {
  handleClick();
});

// 最初の初期化
initBoard();
renderBoard();
