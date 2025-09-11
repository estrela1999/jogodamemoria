// 1. Lista de emojis ampliada para suportar vários níveis
const iconsMaster = [
  '🐶','🐱','🦊','🐻','🦁','🐼','🐨','🐵',
  '🐷','🐸','🐔','🐴','🐮','🐥','🦉','🦄'
];

let level         = 1;
const initialPairs  = 4;   // começa com 4 pares (8 cartas)
const pairsIncrement = 2;  // adiciona 2 pares a cada nível

let board           = [];
let firstCard       = null;
let secondCard      = null;
let lockBoard       = false;
let matchesFound    = 0;

// Embaralha cópia de um array
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Atualiza título com o nível atual
function updateTitle() {
  const title = document.getElementById('game-title');
  title.textContent = `Jogo da Memória – Nível ${level}`;
}

// Cria o tabuleiro de acordo com o nível
function createBoard() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';

  // Quantos pares teremos neste nível?
  const currentPairs = initialPairs + (level - 1) * pairsIncrement;

  // Seleciona e duplica os ícones para formar pares
  const iconsForLevel = shuffle(iconsMaster).slice(0, currentPairs);
  board = shuffle([...iconsForLevel, ...iconsForLevel]);

  // Ajusta colunas para um layout mais quadrado
  const totalCards = board.length;
  const cols = Math.min(6, Math.ceil(Math.sqrt(totalCards)));
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  // Renderiza cada carta
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

  // Reseta variáveis de controle
  matchesFound = 0;
  resetBoardState();
  updateTitle();
}

// Quando o jogador vira uma carta
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

// Verifica se formou par
function checkForMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
  isMatch ? disableCards() : unflipCards();
}

// Desabilita cartas que deram match e confere fim de nível
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  matchesFound++;

  // Se todos os pares foram encontrados, avança de nível
  const currentPairs = initialPairs + (level - 1) * pairsIncrement;
  if (matchesFound === currentPairs) {
    setTimeout(() => nextLevel(), 500);
  }

  resetBoardState();
}

// Revira cartas que não formaram par
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoardState();
  }, 1000);
}

// Reseta ponteiros e desbloqueia o tabuleiro
function resetBoardState() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Avança para o próximo nível e recria o tabuleiro
function nextLevel() {
  level++;
  createBoard();
}

// Reinicia o jogo do nível 1
function restartGame() {
  level = 1;
  createBoard();
}

// Inicialização
createBoard();
document
  .getElementById('restart-btn')
  .addEventListener('click', restartGame);
  