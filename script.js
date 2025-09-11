// script.js

const icons = ['🍎','🍌','🍇','🍉','🍒','🥝','🍍','🥭','🍓','🥥','🥑','🍐'];

let currentLevel   = 1;
let maxLevel       = Math.ceil(icons.length / 4);
let deck           = [];
let firstCard      = null;
let secondCard     = null;
let lockBoard      = false;
let matchedCount   = 0;

// Temporizador
let timerElement, timeElapsed = 0, timerInterval = null;

// Status e controles
let levelElement, resetButton, gameBoard;

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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
  // Atualiza exibição de nível
  levelElement.textContent = `Nível: ${currentLevel}`;

  // Define número de pares (4 por nível até o limite)
  const pairs = Math.min(4 * currentLevel, icons.length);

  // Prepara e embaralha deck
  deck = icons.slice(0, pairs).concat(icons.slice(0, pairs));
  shuffle(deck);

  // Ajusta grade e estado
  gameBoard.className = `game-board level-${currentLevel}`;
  gameBoard.innerHTML = '';
  [firstCard, secondCard, lockBoard, matchedCount] = [null, null, false, 0];
  stopTimer();

  // Cria cartas
  deck.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');
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

  startTimer();
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedCount += 2;
  resetTurn();

  // Se terminou o nível, avança
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
    }, 300);
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
