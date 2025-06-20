// Constants
const PLAYER_X = 'X';
const PLAYER_O = 'O';
const WIN_COLOR = 'lightgreen';
const DEFAULT_CELL_COLOR = ''; // reset color

// Game state
let board = Array(9).fill('');
let currentPlayer = PLAYER_X;
let gameActive = true;
let twoPlayerMode = true; // true = 2-player, false = vs Bot
let difficulty = 'medium'; // 'easy', 'medium', 'hard'

// DOM Elements
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status-message');
const container = document.querySelector('.container'); // for difficulty styling
const modeToggleBtn = document.getElementById('mode-toggle'); // assumes you have a button for mode toggle
const difficultyButtons = document.querySelectorAll('.difficulty-select button'); // your difficulty buttons

// Initialize everything
function startGame() {
  board.fill('');
  currentPlayer = PLAYER_X;
  gameActive = true;
  statusElement.textContent = `${currentPlayer}'s turn`;
  clearHighlights();
  renderBoard();
  updateModeStyle();
  updateModeToggleButton();
}

function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, i) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.textContent = cell;
    cellEl.style.backgroundColor = DEFAULT_CELL_COLOR;
    if (gameActive && cell === '') {
      cellEl.style.cursor = 'pointer';
      cellEl.addEventListener('click', () => handleCellClick(i));
    } else {
      cellEl.style.cursor = 'default';
    }
    boardElement.appendChild(cellEl);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner(board, currentPlayer)) {
    statusElement.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    highlightWinningCells(board, currentPlayer);
    return;
  }

  if (board.every(cell => cell !== '')) {
    statusElement.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  statusElement.textContent = `${currentPlayer}'s turn`;

  if (!twoPlayerMode && currentPlayer === PLAYER_O && gameActive) {
    // Bot's move delayed for UX
    setTimeout(makeBotMove, 500);
  }
}

function checkWinner(bd, player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.some(combo => combo.every(i => bd[i] === player));
}

function highlightWinningCells(bd, player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  const winningCombo = winCombos.find(combo => combo.every(i => bd[i] === player));
  if (!winningCombo) return;

  const cells = boardElement.children;
  winningCombo.forEach(i => cells[i].style.backgroundColor = WIN_COLOR);
}

function clearHighlights() {
  Array.from(boardElement.children).forEach(cell => cell.style.backgroundColor = DEFAULT_CELL_COLOR);
}

function makeBotMove() {
  if (!gameActive) return; // Safety net

  let bestMove;
  const empty = getEmptyCells(board);

  if (difficulty === 'easy') {
    bestMove = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'medium') {
    if (Math.random() < 0.5) {
      bestMove = empty[Math.floor(Math.random() * empty.length)];
    } else {
      bestMove = minimax(board, PLAYER_O).index;
    }
  } else { // hard
    bestMove = minimax(board, PLAYER_O).index;
  }

  handleCellClick(bestMove);
}

function minimax(newBoard, player) {
  const emptyIndices = newBoard.map((v,i) => v === '' ? i : null).filter(v => v !== null);

  if (checkWinner(newBoard, PLAYER_X)) return { score: -10 };
  if (checkWinner(newBoard, PLAYER_O)) return { score: 10 };
  if (emptyIndices.length === 0) return { score: 0 };

  const moves = [];

  for (const i of emptyIndices) {
    const move = { index: i };
    newBoard[i] = player;

    let result;
    if (player === PLAYER_O) {
      result = minimax(newBoard, PLAYER_X);
      move.score = result.score;
    } else {
      result = minimax(newBoard, PLAYER_O);
      move.score = result.score;
    }

    newBoard[i] = '';
    moves.push(move);
  }

  if (player === PLAYER_O) {
    let maxScore = -Infinity, bestMove;
    moves.forEach(m => { if (m.score > maxScore) { maxScore = m.score; bestMove = m; } });
    return bestMove;
  } else {
    let minScore = Infinity, bestMove;
    moves.forEach(m => { if (m.score < minScore) { minScore = m.score; bestMove = m; } });
    return bestMove;
  }
}

function getEmptyCells(bd) {
  return bd.reduce((acc, cell, i) => cell === '' ? acc.concat(i) : acc, []);
}

// Difficulty setting handler
function setDifficulty(level) {
  difficulty = level;
  updateModeStyle();
  startGame();
}

// Update container class for difficulty styling
function updateModeStyle() {
  container.classList.remove('easy', 'medium', 'hard');
  container.classList.add(difficulty);

  // Also highlight the active difficulty button
  difficultyButtons.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === difficulty);
  });
}

// Toggle between 2-player and vs bot mode with UI update
function togglePlayerMode() {
  twoPlayerMode = !twoPlayerMode;
  updateModeToggleButton();
  startGame();
}

function updateModeToggleButton() {
  if (!modeToggleBtn) return; // no button in UI? skip
  modeToggleBtn.textContent = twoPlayerMode ? 'Switch to VS Bot' : 'Switch to 2 Players';
}

// Event listeners for difficulty buttons
difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => setDifficulty(btn.textContent.toLowerCase()));
});

// Event listener for mode toggle button (if present)
if (modeToggleBtn) {
  modeToggleBtn.addEventListener('click', togglePlayerMode);
}

// Kickoff game on page load
startGame();
