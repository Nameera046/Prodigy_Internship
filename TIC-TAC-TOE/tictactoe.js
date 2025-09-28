document.addEventListener('DOMContentLoaded', function() {
    const cells = document.querySelectorAll('.cell');
    const playerTurn = document.getElementById('playerTurn');
    const resetBtn = document.getElementById('resetBtn');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.dataset.index;

        if (gameBoard[index] !== '' || !gameActive) return;

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWin()) {
            gameActive = false;
            playerTurn.textContent = `Player ${currentPlayer} Wins!`;
            scores[currentPlayer]++;
            updateScores();
            highlightWinningCells();
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            playerTurn.textContent = "It's a Draw!";
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerTurn.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameBoard[index] === currentPlayer;
            });
        });
    }

    function checkDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    function highlightWinningCells() {
        winningCombinations.forEach(combination => {
            if (combination.every(index => gameBoard[index] === currentPlayer)) {
                combination.forEach(index => {
                    cells[index].classList.add('winning-cell');
                });
            }
        });
    }

    function updateScores() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
    }

    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        playerTurn.textContent = `Player ${currentPlayer}'s Turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
});