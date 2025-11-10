// DOM Elements 
const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const bestScoreEl = document.getElementById("best-score");
const newGameBtn = document.getElementById("newGameBtn");
const timeEl = document.getElementById("time");

// Base images (stored in /images folder)
const baseImages = [
  "images/1.jpeg",
  "images/2.jpeg",
  "images/3.jpeg",
  "images/4.jpeg",
  "images/5.jpeg",
  "images/6.jpeg",
  "images/7.jpeg",
  "images/8.jpg",
];

// Game state variables 
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedCount = 0;

//  Timer variables 
let seconds = 0;
let timerId = null;
let timerStarted = false;

// Load best score from localStorage 
const savedBest = localStorage.getItem("memory-best");
bestScoreEl.textContent = savedBest ? savedBest : "-";

//  Timer functions
function startTimer() {
  // Start counting only once
  if (timerStarted) return;
  timerStarted = true;
  timerId = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  // allow a fresh start after game ends (without forcing New Game)
  timerStarted = false;
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  timeEl.textContent = "0:00";
}

// Format seconds → M:SS (e.g., 1:05)
function formatTime(totalSeconds) {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

// Initialize / reset the game
function initGame() {
  gameBoard.innerHTML = ""; // clear board

  // Reset states
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedCount = 0;
  movesEl.textContent = moves;
  resetTimer();

  // Create card array (two of each image)
  cards = [...baseImages, ...baseImages];

  // Shuffle (Fisher–Yates)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Generate DOM elements for each card
  cards.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${imgSrc}" alt="">
        </div>
        <div class="card-back">?</div>
      </div>
    `;

    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
  });
}

//  Handle card click ===
function handleCardClick(e) {
  const card = e.currentTarget;

  // Ignore invalid clicks
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  // Start timer on first click
  startTimer();

  // Flip the card
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

// === Check if the two flipped cards match ===
function checkMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  // Every pair flipped = one move
  moves++;
  movesEl.textContent = moves;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCount += 2;
    resetTurn();

    // All cards matched → game complete
    if (matchedCount === cards.length) {
      stopTimer();
      updateBestScore(moves);
      // Optionally:
      // alert(`You won! Time: ${formatTime(seconds)} | Moves: ${moves}`);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

// === Reset temporary selections ===
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// === Update best score in localStorage ===
function updateBestScore(currentMoves) 
{
  const saved = localStorage.getItem("memory-best");
  if (!saved || currentMoves < Number(saved)) 
    {
    localStorage.setItem("memory-best", currentMoves);
    bestScoreEl.textContent = currentMoves;
  }
}

// === New game button ===
newGameBtn.addEventListener("click", initGame);

// === Start the game on page load ===
initGame();
