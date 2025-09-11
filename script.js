// script.js

const PREVIEW_TIME = 5000;      // 5 segundos de pré-visualização
const icons = [
  '🍎','🍌','🍇','🍉','🍒','🥝',
  '🍍','🥭','🍓','🥥','🥑','🍐'
];

let currentLevel = 1;
const maxLevel = Math.ceil(icons.length / 4);
let deck = [], firstCard = null, secondCard = null;
let lockBoard = false, matchedCount = 0;

let levelElement, timerElement;
let timeElapsed = 0, timerInterval = null;
let resetButton, gameBoard;

document.addEventListener('DOMContentLoaded', () => {
  levelElement  = document.getElementById('level');
  timerElement  = document.getElementById('timer');
  resetButton   = document.getElementById('resetButton');
  gameBoard     = document.getElementById('gameBoard');

  resetButton.addEventListener('click', () => {
    currentLevel = 1;
    setupLevel();
  });

  setupLevel();
});

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timeElapsed = 0;
  timerElement.textContent = `Tempo: 0s`;
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerElement.textContent = `Tempo: ${timeElapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function setupLevel() {
  // Exibe nível
  levelElement.textContent = `Nível: ${currentLevel}`;

  // Quantidade de pares
  const pairs = Math.min(currentLevel * 4, icons.length);

  // Prepara deck
  deck = icons.slice(0, pairs).concat(icons.slice(0, pairs));
  shuffle(deck);

  // Renderiza grid
  gameBoard.className = `game-board level-${currentLevel}`;
  gameBoard.innerHTML = '';
  [firstCard, secondCard, lockBoard, matchedCount] = [null, null, false, 0];
  stopTimer();

  // Cria cartas
  deck.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.icon = icon;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${icon}</div>
        <div class="card-back"></div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });

  // PRÉ-VISUALIZAÇÃO: cartas pra cima por PREVIEW_TIME ms
  const cards = gameBoard.querySelectorAll('.card');
  cards.forEach(c => c.classList.add('flipped'));

  setTimeout(() => {
    cards.forEach(c => c.classList.remove('flipped'));
    startTimer();
  }, PREVIEW_TIME);
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add('flipped');
  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkForMatch();
  }
}

function checkForMatch() {
  if (firstCard.dataset.icon === secondCard.dataset.icon) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedCount += 2;
  resetTurn();
  if (matchedCount === deck.length) {
    stopTimer();
    setTimeout(() => {
      if (currentLevel < maxLevel) {
        alert(`Nível ${currentLevel} concluído em ${timeElapsed}s! Próximo nível.`);
        currentLevel++;
        setupLevel();
      } else {
        alert(`Parabéns! Você completou todos os níveis em ${timeElapsed}s.`);
      }
    }, 500);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetTurn();
  }, 1000);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
