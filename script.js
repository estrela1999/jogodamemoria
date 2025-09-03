const icons = ['🐶','🐱','🦊','🐻','🦁','🐼','🐨','🐵'];
let board = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const gameBoard = document.getElementById('gameBoard');
  board = shuffle([...icons, ...icons]);  // duplica e embaralha
  board.forEach((icon, index) => {
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
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

createBoard();

document.getElementById('restart-btn').addEventListener('click', restartGame);

function restartGame() {
  // Remove todas as classes flip
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard); // Reativa o clique
  });

  // Embaralha novamente
  shuffle();

  // Reseta o estado do jogo
  resetBoard();
}

