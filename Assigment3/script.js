// DOM elements
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

// Timer state
let seconds = 0;
let timerId = null;
let timerStarted = false;

// Load best score from localStorage
const savedBest = localStorage.getItem("memory-best");

// Show saved best score (or "-" if it does not exist)
bestScoreEl.textContent = savedBest ? savedBest : "-";

// Start the timer (only once, on the first move)
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  timerId = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

// Stop the timer
function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  // Allow the timer to start again in a new game
  timerStarted = false;
}

// Reset timer display and value
function resetTimer() {
  stopTimer();
  seconds = 0;
  timeEl.textContent = "0:00";
}

// Convert seconds to M:SS (e.g. "1:05")
function formatTime(totalSeconds) {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

// Initialize / reset the game
function initGame() {
  // Clear the board
  gameBoard.innerHTML = "";

  // Reset state
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedCount = 0;
  movesEl.textContent = moves;
  resetTimer();

  // Build the array of cards (two of each image)
  cards = [...baseImages, ...baseImages];

  // Shuffle array (Fisher–Yates shuffle)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Create DOM elements for each card
  cards.forEach((imgSrc, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    // Extract filename (e.g. "1" from "images/1.jpeg")
    const filename = imgSrc.split("/").pop().split(".")[0];

    // Accessibility attributes: make the card keyboard-focusable and button-like
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", `Hidden card ${index + 1}`);

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${imgSrc}" alt="Card image ${filename}">
        </div>
        <div class="card-back" aria-hidden="true">?</div>
      </div>
    `;

    // Mouse click handler
    card.addEventListener("click", handleCardClick);

    // Keyboard handler: Enter or Space acts like a click
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    gameBoard.appendChild(card);
  });
}

// Handle a card being clicked / selected
function handleCardClick(e) {
  const card = e.currentTarget;

  // Ignore invalid clicks
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  // Start timer on the very first move
  startTimer();

  // Flip the card visually
  card.classList.add("flipped");
  card.setAttribute("aria-pressed", "true");

  const filename = card.dataset.image.split("/").pop().split(".")[0];
  card.setAttribute("aria-label", `Revealed card showing image ${filename}`);

  if (!firstCard) {
    // This is the first card in the pair
    firstCard = card;
  } else {
    // This is the second card in the pair
    secondCard = card;
    checkMatch();
  }
}

// Check if the two currently flipped cards match
function checkMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  // Every attempt with two flipped cards counts as one move
  moves++;
  movesEl.textContent = moves;

  if (isMatch) {
    // Mark cards as matched and disable them
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.setAttribute("aria-disabled", "true");
    secondCard.setAttribute("aria-disabled", "true");

    matchedCount += 2;
    resetTurn();

    // If all cards are matched, the game is complete
    if (matchedCount === cards.length) {
      stopTimer();
      updateBestScore(moves);
      showWinScreen();
    }
  } else {
    // Cards do not match: temporarily lock the board, then flip them back
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.setAttribute("aria-pressed", "false");
      secondCard.setAttribute("aria-pressed", "false");

      // Restore labels to "hidden" state
      const firstIndex = Array.prototype.indexOf.call(gameBoard.children, firstCard);
      const secondIndex = Array.prototype.indexOf.call(gameBoard.children, secondCard);
      firstCard.setAttribute("aria-label", `Hidden card ${firstIndex + 1}`);
      secondCard.setAttribute("aria-label", `Hidden card ${secondIndex + 1}`);

      resetTurn();
    }, 800);
  }
}

// Clear temporary selection (currently flipped pair)
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Save best (lowest) move count in localStorage
function updateBestScore(currentMoves) {
  const saved = localStorage.getItem("memory-best");
  if (!saved || currentMoves < Number(saved)) {
    localStorage.setItem("memory-best", currentMoves);
    bestScoreEl.textContent = currentMoves;
  }
}

// New game button
newGameBtn.addEventListener("click", initGame);

// Win screen + confetti

// Create JSConfetti instance (the library is loaded in index.html)
const jsConfetti = new JSConfetti();

// Show win overlay and trigger confetti
function showWinScreen() {
  const winScreenElement = document.getElementById("win-screen");
  winScreenElement.classList.add("show");

  jsConfetti.addConfetti({
    emojis: ["🎉", "✨", "🎊", "⭐"],
  });
}

// "Play again" button reloads the page
const playAgainButton = document.getElementById("play-again-btn");
playAgainButton.addEventListener("click", () => {
  window.location.reload();
});

// Start the game when the page loads
initGame();
