const board = document.getElementById("board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const difficultyDial = document.getElementById("difficulty");
const difficultyText = document.getElementById("difficultyText");

let currentPlayer = "X";
let difficulty = "Easy";
let boardState = Array(9).fill("");

function createBoard() {
  board.innerHTML = "";
  boardState = Array(9).fill("");

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    board.appendChild(cell);
  }

  message.textContent = `Player ${currentPlayer}'s turn`;
}

function handleMove(e) {
  const index = e.target.dataset.index;

  if (boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("disabled");

  if (checkWinner(currentPlayer)) {
    message.textContent = `Player ${currentPlayer} wins!`;
    endGame();
    return;
  }

  if (!boardState.includes("")) {
    message.textContent = "It's a draw!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winCombos.some(combo => 
    combo.every(index => boardState[index] === player)
  );
}

function endGame() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.classList.add("disabled"));
}

restartBtn.addEventListener("click", () => {
  currentPlayer = "X";
  createBoard();
});

difficultyDial.addEventListener("click", () => {
  const difficulties = ["Easy", "Medium", "Hard"];
  const current = difficulties.indexOf(difficulty);
  const next = (current + 1) % difficulties.length;
  difficulty = difficulties[next];
  difficultyText.textContent = `Difficulty: ${difficulty}`;

  difficultyDial.className = `dial ${difficulty.toLowerCase()}`;
});

createBoard();
