const boardSize = 8;
const tileTypes = ["shih-tzu", "shiba", "toypoodle", "chihuahua", "pekingese", "schnauzer"];
let board = [];
let score = 0;
let movesLeft = 30;

function initGame() {
    board = [];
    score = 0;
    movesLeft = 30;
    document.getElementById("score").textContent = score;
    document.getElementById("moves").textContent = movesLeft;
    document.getElementById("message").textContent = "";
    document.getElementById("board").innerHTML = "";
    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            let type = tileTypes[Math.floor(Math.random() * tileTypes.length)];
            board[row][col] = type;
            drawTile(row, col, type);
        }
    }
    checkMatches();
}

function drawTile(row, col, type) {
    const tile = document.createElement("div");
    tile.className = `tile ${type}`;
    tile.dataset.row = row;
    tile.dataset.col = col;
    tile.addEventListener("click", handleTileClick);
    document.getElementById("board").appendChild(tile);
}

let firstTile = null;

function handleTileClick(e) {
    if (movesLeft <= 0) return;
    const tile = e.target;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);

    if (!firstTile) {
        firstTile = { row, col };
        tile.classList.add("selected");
    } else {
        const secondTile = { row, col };
        if (isAdjacent(firstTile, secondTile)) {
            swapTiles(firstTile, secondTile);
            if (checkMatches()) {
                movesLeft--;
                document.getElementById("moves").textContent = movesLeft;
            } else {
                swapTiles(firstTile, secondTile); // 戻す
            }
        }
        clearSelection();
    }
}

function isAdjacent(tile1, tile2) {
    const dx = Math.abs(tile1.row - tile2.row);
    const dy = Math.abs(tile1.col - tile2.col);
    return (dx + dy === 1);
}

function swapTiles(tile1, tile2) {
    const temp = board[tile1.row][tile1.col];
    board[tile1.row][tile1.col] = board[tile2.row][tile2.col];
    board[tile2.row][tile2.col] = temp;
    updateBoard();
}

function updateBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            drawTile(row, col, board[row][col]);
        }
    }
}

function clearSelection() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.classList.remove("selected"));
    firstTile = null;
}

function checkMatches() {
    let matched = [];
    // 横方向チェック
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize - 2; col++) {
            const type = board[row][col];
            if (type === board[row][col + 1] && type === board[row][col + 2]) {
                matched.push([row, col], [row, col + 1], [row, col + 2]);
            }
        }
    }

    // 縦方向チェック
    for (let col = 0; col < boardSize; col++) {
        for (let row = 0; row < boardSize - 2; row++) {
            const type = board[row][col];
            if (type === board[row + 1][col] && type === board[row + 2][col]) {
                matched.push([row, col], [row + 1, col], [row + 2, col]);
            }
        }
    }

    if (matched.length > 0) {
        removeMatches(matched);
        return true;
    }
    return false;
}

function removeMatches(matched) {
    matched.forEach(([row, col]) => {
        board[row][col] = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        score += 10;
    });
    document.getElementById("score").textContent = score;
    updateBoard();
}

document.getElementById("reset").addEventListener("click", initGame);

initGame();
