const PLAYER_X = 'X';
const PLAYER_O = 'O';

let board = Array(9).fill('');
let currentPlayer = PLAYER_X;
let gameActive = true;
let twoPlayerMode = true;
let difficulty = 'medium'; // easy, medium, hard

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status-message');

function startGame() {
  board.fill('');
  currentPlayer = PLAYER_X;
  gameActive = true;
  statusElement.textContent = `${currentPlayer}'s turn`;
  renderBoard();
}

function togglePlayerMode() {
  twoPlayerMode = !twoPlayerMode;
  startGame();
}

function setDifficulty(level) {
  difficulty = level;
  startGame();
}

function renderBoard() {
  boardElement.innerHTML = ''; 
  board.forEach((cell, i) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.textContent = cell;
    if (gameActive && cell === '') {
      cellEl.addEventListener('click', () => handleCellClick(i));
      cellEl.style.cursor = 'pointer';
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
    statusElement.textContent = 'It\'s a tie!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  statusElement.textContent = `${currentPlayer}'s turn`;

  if (!twoPlayerMode && currentPlayer === PLAYER_O && gameActive) {
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
  winningCombo.forEach(i => cells[i].style.backgroundColor = 'lightgreen');
}

function makeBotMove() {
  let bestMove;
  if (difficulty === 'easy') {
    // Random move on easy
    const empty = getEmptyCells(board);
    bestMove = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'medium') {
    // 50% chance to do best move, 50% random
    if (Math.random() < 0.5) {
      const empty = getEmptyCells(board);
      bestMove = empty[Math.floor(Math.random() * empty.length)];
    } else {
      bestMove = minimax(board, currentPlayer).index;
    }
  } else {
    // Hard mode = perfect minimax
    bestMove = minimax(board, currentPlayer).index;
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

    if (player === PLAYER_O) {
      const result = minimax(newBoard, PLAYER_X);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, PLAYER_O);
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

// Example UI to set difficulty - just add buttons or dropdown that call setDifficulty('easy') etc.

// Initialize the game on page load
startGame();
