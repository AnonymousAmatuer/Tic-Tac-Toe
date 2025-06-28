const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const difficultyText = document.getElementById("difficulty");
const changeDifficultyBtn = document.getElementById("changeDifficulty");

const difficulties = ["Easy", "Medium", "Hard"];
let difficultyIndex = 0;

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = index;
    div.textContent = cell;
    boardElement.appendChild(div);
  });
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // Rows
    [0,3,6],[1,4,7],[2,5,8], // Cols
    [0,4,8],[2,4,6]          // Diags
  ];
  for (const [a,b,c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "Draw";
}

function updateStatus() {
  const winner = checkWinner();
  if (winner) {
    gameActive = false;
    statusElement.textContent = winner === "Draw" ? "It's a draw!" : `Player ${winner} wins!`;
  } else {
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  renderBoard();
  updateStatus();
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  renderBoard();
  updateStatus();
}

function changeDifficulty() {
  difficultyIndex = (difficultyIndex + 1) % difficulties.length;
  difficultyText.textContent = `Difficulty: ${difficulties[difficultyIndex]}`;
}

boardElement.addEventListener("click", handleCellClick);
restartBtn.addEventListener("click", restartGame);
changeDifficultyBtn.addEventListener("click", changeDifficulty);

// Initial render
renderBoard();
updateStatus();
