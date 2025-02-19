let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let twoPlayerMode = true;

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status-message');

function startGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  displayBoard();
  statusElement.textContent = `${currentPlayer}'s turn`;
}

function togglePlayerMode() {
  twoPlayerMode = !twoPlayerMode;
  startGame();
}

function displayBoard() {
  boardElement.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = board[i];
    cell.addEventListener('click', () => handleCellClick(i));
    boardElement.appendChild(cell);
  }
}

function handleCellClick(index) {
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  displayBoard();

  if (checkWinner()) {
    statusElement.textContent = `${currentPlayer} wins!`;
    gameActive = false;
  } else if (board.every(cell => cell !== '')) {
    statusElement.textContent = 'It\'s a tie!';
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `${currentPlayer}'s turn`;

    if (!twoPlayerMode && currentPlayer === 'O' && gameActive) {
      setTimeout(makeBotMove, 500);
    }
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
}

function makeBotMove() {
  const bestMove = minimax(board, currentPlayer).index;
  handleCellClick(bestMove);
}

function minimax(newBoard, player) {
  const availableMoves = getEmptyCells(newBoard);

  if (checkWinner(newBoard, 'X')) {
    return { score: -1 };
  } else if (checkWinner(newBoard, 'O')) {
    return { score: 1 };
  } else if (availableMoves.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableMoves.length; i++) {
    const move = {};
    move.index = availableMoves[i];
    newBoard[availableMoves[i]] = player;

    if (player === 'O') {
      move.score = minimax(newBoard, 'X').score;
    } else {
      move.score = minimax(newBoard, 'O').score;
    }

    newBoard[availableMoves[i]] = '';

    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function getEmptyCells(newBoard) {
  return newBoard.reduce((acc, cell, index) => {
    if (cell === '') {
      acc.push(index);
    }
    return acc;
  }, []);
}
