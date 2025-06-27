// Constants
const PLAYER_X = 'X', PLAYER_O = 'O';
const WIN_COLOR = 'lightgreen';
const DEFAULT_CELL_COLOR = '';

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
const dial = document.getElementById('difficultyDial');
const dialKnob = document.getElementById('dialKnob');
const modeLabel = document.getElementById('modeLabel');

// Start or reset the game
function startGame() {
  board.fill('');
  currentPlayer = PLAYER_X;
  gameActive = true;
  updateStatus();
  renderBoard();
  updateToggleText();
}

// Render the game board
function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, i) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.textContent = cell;
    cellEl.style.cursor = gameActive && !cell ? 'pointer' : 'default';
    if (gameActive && !cell) cellEl.addEventListener('click', () => handleClick(i));
    boardElement.appendChild(cellEl);
  });
}

// Handle player or bot moves
function handleClick(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner(board, currentPlayer)) {
    endGame(`${currentPlayer} wins!`, currentPlayer);
    return;
  }

  if (!board.includes('')) {
    endGame("It's a tie!");
    return;
  }

  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  updateStatus();

  if (!twoPlayerMode && currentPlayer === PLAYER_O && gameActive) {
    setTimeout(makeBotMove, 300);
  }
}

// End the game
function endGame(message, winner = null) {
  statusElement.textContent = message;
  gameActive = false;
  if (winner) highlightWin(board, winner);
}

// Update status message
function updateStatus() {
  statusElement.textContent = `${currentPlayer}'s turn`;
}

// Check for a winner
function checkWinner(bd, player) {
  return getWinningCombo(bd, player) !== null;
}

// Get winning combination
function getWinningCombo(bd, player) {
  const combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return combos.find(c => c.every(i => bd[i] === player)) || null;
}

// Highlight the winning combination
function highlightWin(bd, player) {
  const combo = getWinningCombo(bd, player);
  if (combo) combo.forEach(i => boardElement.children[i].style.backgroundColor = WIN_COLOR);
}

// Bot move logic
function makeBotMove() {
  const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
  let move;

  if (difficulty === 'easy') {
    move = randomMove(emptyIndices);
  } else if (difficulty === 'medium') {
    move = Math.random() < 0.5
      ? randomMove(emptyIndices)
      : minimax(board, PLAYER_O).index;
  } else {
    move = minimax(board, PLAYER_O).index;
  }

  handleClick(move);
}

// Pick random move
function randomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}

// Minimax algorithm
function minimax(bd, player) {
  const opponent = player === PLAYER_O ? PLAYER_X : PLAYER_O;
  const empty = bd.map((v, i) => v === '' ? i : null).filter(i => i !== null);

  if (checkWinner(bd, PLAYER_X)) return { score: -10 };
  if (checkWinner(bd, PLAYER_O)) return { score: 10 };
  if (!empty.length) return { score: 0 };

  const moves = empty.map(i => {
    bd[i] = player;
    const { score } = minimax(bd, opponent);
    bd[i] = '';
    return { index: i, score };
  });

  return player === PLAYER_O
    ? moves.reduce((best, move) => move.score > best.score ? move : best, { score: -Infinity })
    : moves.reduce((best, move) => move.score < best.score ? move : best, { score: Infinity });
}

// Set bot difficulty and update visuals
function setDifficulty(level) {
  difficulty = level;

  // Apply container class for styling
  container.classList.remove('easy', 'medium', 'hard');
  container.classList.add(level);

  // Rotate the dial knob
  const angles = { easy: -45, medium: 0, hard: 45 };
  dialKnob.style.transform = `rotate(${angles[level]}deg)`;

  // Update mode label
  const icons = {
    easy: '😴 Easy',
    medium: '🧠 Medium',
    hard: '🤖 Hard'
  };
  if (modeLabel) modeLabel.textContent = icons[level];

  startGame();
}

// Toggle between two-player and bot mode
function togglePlayerMode() {
  twoPlayerMode = !twoPlayerMode;
  updateToggleText();
  startGame();
}

// Update mode toggle button text
function updateToggleText() {
  if (modeToggleBtn) {
    modeToggleBtn.textContent = twoPlayerMode ? 'Switch to VS Bot' : 'Switch to 2 Players';
  }
}

// Event listeners for dial ticks
['easy', 'medium', 'hard'].forEach(level => {
  const tick = dial.querySelector(`.${level}`);
  if (tick) {
    tick.addEventListener('click', () => setDifficulty(level));
  }
});

// Toggle button
if (modeToggleBtn) modeToggleBtn.addEventListener('click', togglePlayerMode);

// Initialize game
startGame();
