// Constants
const PLAYER_X = 'X', PLAYER_O = 'O';
const WIN_COLOR = 'lightgreen', DEFAULT_CELL_COLOR = '';

// Game state
let board = Array(9).fill('');
let currentPlayer = PLAYER_X;
let gameActive = true;
let twoPlayerMode = true;
let difficulty = 'medium';

// DOM Elements
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status-message');
const container = document.querySelector('.container');
const modeToggleBtn = document.getElementById('mode-toggle');
const difficultyButtons = document.querySelectorAll('.difficulty-select button');

function startGame() {
  board.fill('');
  currentPlayer = PLAYER_X;
  gameActive = true;
  updateStatus();
  renderBoard();
  applyDifficultyStyle();
  updateToggleText();
}

function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, i) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.textContent = cell;
    cellEl.style.cursor = gameActive && cell === '' ? 'pointer' : 'default';
    if (gameActive && !cell) cellEl.addEventListener('click', () => handleClick(i));
    boardElement.appendChild(cellEl);
  });
}

function handleClick(i) {
  if (!gameActive || board[i]) return;

  board[i] = currentPlayer;
  renderBoard();

  if (checkWinner(board, currentPlayer)) {
    statusElement.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    highlightWin(board, currentPlayer);
    return;
  }

  if (!board.includes('')) {
    statusElement.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  updateStatus();

  if (!twoPlayerMode && currentPlayer === PLAYER_O && gameActive) {
    setTimeout(makeBotMove, 500);
  }
}

function updateStatus() {
  statusElement.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(bd, player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(c => c.every(i => bd[i] === player));
}

function highlightWin(bd, player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  const winCombo = combos.find(c => c.every(i => bd[i] === player));
  if (winCombo) winCombo.forEach(i => boardElement.children[i].style.backgroundColor = WIN_COLOR);
}

function makeBotMove() {
  if (!gameActive) return;
  const empty = board.map((v,i) => v === '' ? i : null).filter(i => i !== null);

  let move;
  if (difficulty === 'easy') {
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'medium') {
    move = Math.random() < 0.5
      ? empty[Math.floor(Math.random() * empty.length)]
      : minimax(board, PLAYER_O).index;
  } else {
    move = minimax(board, PLAYER_O).index;
  }

  handleClick(move);
}

function minimax(bd, player) {
  const empty = bd.map((v,i) => v === '' ? i : null).filter(i => i !== null);

  if (checkWinner(bd, PLAYER_X)) return { score: -10 };
  if (checkWinner(bd, PLAYER_O)) return { score: 10 };
  if (!empty.length) return { score: 0 };

  const moves = empty.map(i => {
    bd[i] = player;
    const result = minimax(bd, player === PLAYER_O ? PLAYER_X : PLAYER_O);
    bd[i] = '';
    return { index: i, score: result.score };
  });

  return player === PLAYER_O
    ? moves.reduce((best, m) => m.score > best.score ? m : best, { score: -Infinity })
    : moves.reduce((best, m) => m.score < best.score ? m : best, { score: Infinity });
}

function setDifficulty(level) {
  difficulty = level;
  applyDifficultyStyle();
  startGame();
}

function applyDifficultyStyle() {
  container.classList.remove('easy', 'medium', 'hard');
  container.classList.add(difficulty);
  difficultyButtons.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === difficulty);
  });
}

function togglePlayerMode() {
  twoPlayerMode = !twoPlayerMode;
  updateToggleText();
  startGame();
}

function updateToggleText() {
  if (modeToggleBtn) {
    modeToggleBtn.textContent = twoPlayerMode ? 'Switch to VS Bot' : 'Switch to 2 Players';
  }
}

// Hook up event listeners
difficultyButtons.forEach(btn =>
  btn.addEventListener('click', () => setDifficulty(btn.textContent.toLowerCase()))
);
if (modeToggleBtn) modeToggleBtn.addEventListener('click', togglePlayerMode);

// Kick things off
startGame();
