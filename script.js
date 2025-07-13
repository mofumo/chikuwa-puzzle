
const boardSize = 8;
const board = [];
const dogTypes = [
    'dog_shih_tzu',
    'dog_poodle',
    'dog_chihuahua',
    'dog_shiba',
    'dog_schnauzer'
];

let score = 0;

function updateScore(points) {
  score += points;
  document.getElementById('score').textContent = `スコア：${score}`;
}

function createBoard() {
    const boardElem = document.getElementById("board");
    boardElem.innerHTML = "";
    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            const type = dogTypes[Math.floor(Math.random() * dogTypes.length)];
            board[row][col] = type;
            const cell = createCell(row, col, type);
            boardElem.appendChild(cell);
        }
    }
    setTimeout(checkMatches, 100);
}

function createCell(row, col, type) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = row;
    cell.dataset.col = col;
    const img = document.createElement("img");
    img.src = `img/${type}.png`;
    img.alt = type;
    cell.appendChild(img);
    cell.addEventListener("click", () => handleClick(row, col));
    return cell;
}

let firstClick = null;

function handleClick(row, col) {
    if (!firstClick) {
        firstClick = { row, col };
    } else {
        const { row: r1, col: c1 } = firstClick;
        if (Math.abs(r1 - row) + Math.abs(c1 - col) === 1) {
            swap(r1, c1, row, col);
            if (!checkImmediateMatch()) {
                swap(r1, c1, row, col); // swap back
            } else {
                setTimeout(() => checkMatches(), 100);
            }
        }
        firstClick = null;
    }
    renderBoard();
}

function swap(r1, c1, r2, c2) {
    [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
}

function checkImmediateMatch() {
    return findMatches().length > 0;
}

function renderBoard() {
    const boardElem = document.getElementById("board");
    boardElem.innerHTML = "";
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = createCell(row, col, board[row][col]);
            boardElem.appendChild(cell);
        }
    }
}

function findMatches() {
    const matches = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize - 2; col++) {
            const type = board[row][col];
            if (type && board[row][col + 1] === type && board[row][col + 2] === type) {
                matches.push([row, col], [row, col + 1], [row, col + 2]);
            }
        }
    }
    for (let col = 0; col < boardSize; col++) {
        for (let row = 0; row < boardSize - 2; row++) {
            const type = board[row][col];
            if (type && board[row + 1][col] === type && board[row + 2][col] === type) {
                matches.push([row, col], [row + 1, col], [row + 2, col]);
            }
        }
    }
    return matches;
}

function checkMatches() {
  let matched = [];

  // 横のマッチ判定
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize - 2; col++) {
      const dog = board[row][col];
      if (
        dog &&
        dog === board[row][col + 1] &&
        dog === board[row][col + 2]
      ) {
        matched.push([row, col], [row, col + 1], [row, col + 2]);
      }
    }
  }

  // 縦のマッチ判定
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row < boardSize - 2; row++) {
      const dog = board[row][col];
      if (
        dog &&
        dog === board[row + 1][col] &&
        dog === board[row + 2][col]
      ) {
        matched.push([row, col], [row + 1, col], [row + 2, col]);
      }
    }
  }

  if (matched.length >= 3) {
    matched.forEach(([r, c]) => {
      board[r][c] = null;
    });
    updateScore(matched.length * 10);
    renderBoard();
    setTimeout(() => {
      dropDogs();
      fillEmptyTiles();
      setTimeout(checkMatches, 100);
    }, 200);
  }
}

    collapse();
    setTimeout(() => {
        refill();
        renderBoard();
        setTimeout(checkMatches, 200);
    }, 200);
}

function collapse() {
    for (let col = 0; col < boardSize; col++) {
        let pointer = boardSize - 1;
        for (let row = boardSize - 1; row >= 0; row--) {
            if (board[row][col]) {
                board[pointer][col] = board[row][col];
                if (pointer !== row) board[row][col] = null;
                pointer--;
            }
        }
    }
}

function refill() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col]) {
                const type = dogTypes[Math.floor(Math.random() * dogTypes.length)];
                board[row][col] = type;
            }
        }
    }
}

createBoard();
