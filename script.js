const icons      = ['🐶','🐱','🦊','🐻','🦁','🐼','🐨','🐵'];
let board        = [];
let firstCard    = null;
let secondCard   = null;
let lockBoard    = false;

function shuffle(array) {
  // Faz uma cópia e embaralha
  return [...array].sort(() => Math.random() - 0.5);
}

function createBoard() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';

  // Duplica e embaralha
  board = shuffle([...icons, ...icons]);

  board.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.icon = icon;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${icon}</div>
        <div class="card-back">?</div>
      </div>
    `;

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard(e) {
  if (lockBoard) return;
  const clicked = e.currentTarget;

  // evita clicar duas vezes na mesma carta
  if (clicked === firstCard) return;

  clicked.classList.add('flipped');

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  checkForMatch();
}

function checkForMatch() {
  const match = firstCard.dataset.icon === secondCard.dataset.icon;

  match ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoardState();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoardState();
  }, 1000);
}

function resetBoardState() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function restartGame() {
  resetBoardState();
  createBoard();
}

// Inicializa o jogo
createBoard();
document
  .getElementById('restart-btn')
  .addEventListener('click', restartGame);
