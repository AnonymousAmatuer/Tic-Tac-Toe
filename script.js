const PLAYER_X = 'X';
const PLAYER_O = 'O';
let currentPlayer;
let board;
let isGameOver = false;
let currentDifficulty = 'easy'; 

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const difficultyDial = document.getElementById('difficulty');
const difficultyText = document.getElementById('difficultyText');

function startGame() {
  board = Array(9).fill(null);
  currentPlayer = PLAYER_X;
  isGameOver = false;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('disabled');
  });
  message.textContent = `Player ${currentPlayer}'s turn`;
  if (currentPlayer === PLAYER_O) {
    makeBotMove();
  }
}

function makeMove(index) {
  if (isGameOver || board[index]) return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add('disabled');

  if (checkWinner(board, currentPlayer)) {
    message.textContent = `Player ${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (!board.includes(null)) {
    message.textContent = "It's a draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  message.textContent = `Player ${currentPlayer}'s turn`;

  if (currentPlayer === PLAYER_O) {
    setTimeout(makeBotMove, 300);
  }
}

function makeBotMove() {
  console.log("Current difficulty:", currentDifficulty); // Debug

  let move;
  if (currentDifficulty === 'easy') {
    move = getAvailableMoves()[Math.floor(Math.random() * getAvailableMoves().length)];
  } else if (currentDifficulty === 'medium') {
    if (Math.random() < 0.5) {
      move = getAvailableMoves()[Math.floor(Math.random() * getAvailableMoves().length)];
    } else {
      move = minimax(board, PLAYER_O).index;
    }
  } else {
    move = minimax(board, PLAYER_O).index;
  }

  makeMove(move);
}

function getAvailableMoves() {
  return board.map((cell, index) => (cell === null ? index : null)).filter(i => i !== null);
}

function checkWinner(board, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function minimax(newBoard, player) {
  const availSpots = getAvailableMoves();

  if (checkWinner(newBoard, PLAYER_X)) return { score: -10 };
  if (checkWinner(newBoard, PLAYER_O)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === PLAYER_O) {
      const result = minimax(newBoard, PLAYER_X);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, PLAYER_O);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === PLAYER_O) {
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

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => makeMove(index));
});

restartButton.addEventListener('click', startGame);

difficultyDial.addEventListener('click', () => {
  currentDifficulty =
    currentDifficulty === 'easy' ? 'medium' :
    currentDifficulty === 'medium' ? 'hard' : 'easy';

  difficultyDial.className = `dial ${currentDifficulty}`;
  difficultyText.textContent = `Difficulty: ${capitalize(currentDifficulty)}`;
});

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Start the game on load
startGame();
