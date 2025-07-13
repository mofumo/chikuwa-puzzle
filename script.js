const boardSize = 8;
const dogTypes = [
  'dog_chihuahua',
  'dog_poodle',
  'dog_schnauzer',
  'dog_shiba',
  'dog_shih_tzu'
];

let board = [];
let firstSelected = null;
let score = 0;

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');

function createDogElement(type) {
  const img = document.createElement('img');
  img.src = `img/${type}.png`;
  img.classList.add('dog');
  img.dataset.type = type;
  return img;
}

function initBoard() {
  boardElement.innerHTML = '';
  board = [];

  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const type = dogTypes[Math.floor(Math.random() * dogTypes.length)];
      const dog = createDogElement(type);
      dog.dataset.row = i;
      dog.dataset.col = j;
      dog.addEventListener('click', handleDogClick);
      boardElement.appendChild(dog);
      row.push(dog);
    }
    board.push(row);
  }

  score = 0;
  updateScore();
  checkMatches();
}

function updateScore() {
  scoreElement.textContent = `スコア：${score}`;
}

function handleDogClick(e) {
  const clicked = e.target;
  if (!firstSelected) {
    firstSelected = clicked;
    clicked.classList.add('selected');
  } else {
    const row1 = parseInt(firstSelected.dataset.row);
    const col1 = parseInt(firstSelected.dataset.col);
    const row2 = parseInt(clicked.dataset.row);
    const col2 = parseInt(clicked.dataset.col);

    const isAdjacent = Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;

    if (isAdjacent) {
      swapDogs(firstSelected, clicked);
      setTimeout(() => {
        if (!checkMatches()) {
          swapDogs(firstSelected, clicked); // 戻す
        }
        firstSelected.classList.remove('selected');
        firstSelected = null;
      }, 100);
    } else {
      firstSelected.classList.remove('selected');
      firstSelected = null;
    }
  }
}

function swapDogs(dog1, dog2) {
  const row1 = dog1.dataset.row;
  const col1 = dog1.dataset.col;
  const row2 = dog2.dataset.row;
  const col2 = dog2.dataset.col;

  const temp = board[row1][col1];
  board[row1][col1] = board[row2][col2];
  board[row2][col2] = temp;

  board[row1][col1].dataset.row = row1;
  board[row1][col1].dataset.col = col1;
  board[row2][col2].dataset.row = row2;
  board[row2][col2].dataset.col = col2;

  boardElement.innerHTML = '';
  board.flat().forEach(dog => boardElement.appendChild(dog));
}

function checkMatches() {
  let matched = [];

  // 横方向
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize - 2; j++) {
      const type = board[i][j].dataset.type;
      if (
        type === board[i][j + 1].dataset.type &&
        type === board[i][j + 2].dataset.type
      ) {
        matched.push(board[i][j], board[i][j + 1], board[i][j + 2]);
      }
    }
  }

  // 縦方向
  for (let j = 0; j < boardSize; j++) {
    for (let i = 0; i < boardSize - 2; i++) {
      const type = board[i][j].dataset.type;
      if (
        type === board[i + 1][j].dataset.type &&
        type === board[i + 2][j].dataset.type
      ) {
        matched.push(board[i][j], board[i + 1][j], board[i + 2][j]);
      }
    }
  }

  if (matched.length === 0) return false;

  matched = [...new Set(matched)];

  matched.forEach(dog => {
    const row = parseInt(dog.dataset.row);
    const col = parseInt(dog.dataset.col);
    const newType = dogTypes[Math.floor(Math.random() * dogTypes.length)];
    const newDog = createDogElement(newType);
    newDog.dataset.row = row;
    newDog.dataset.col = col;
    newDog.addEventListener('click', handleDogClick);
    board[row][col] = newDog;
  });

  boardElement.innerHTML = '';
  board.flat().forEach(dog => boardElement.appendChild(dog));

  score += matched.length * 10;
  updateScore();

  setTimeout(checkMatches, 300);

  return true;
}

document.getElementById('resetButton').addEventListener('click', initBoard);

window.onload = initBoard;
