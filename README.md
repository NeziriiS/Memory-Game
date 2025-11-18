Memory Card Game

A simple, accessible, and responsive memory game built with HTML, CSS, and JavaScript.
The goal is to match all card pairs using as few attempts as possible and achieve the best time.

-Features:
Modern & Clean UI
Responsive layout
Smooth flipping animations
Square cards using aspect-ratio

-Accessibility (A11y):
Keyboard playable
aria-label, aria-pressed, and aria-live updates
Clear status updates for screen readers
Cards behave like buttons for keyboard users

-Gameplay:
Timer with M:SS format
Best score saved in localStorage
WIN screen when all pairs are matched
Visual and ARIA updates for card states
Replay button

-How to Play:
Click or press Enter/Space on a card to flip it.
Flip two cards — if they match, they stay revealed.
If they don't match, they flip back after a short delay.
Clear all pairs to win!
Try to beat your best time.

-Accessibility Details:
Cards use role="button"
aria-label describes the card as "hidden" or "Card X" when revealed
aria-pressed shows whether a card is flipped
HUD uses aria-live="polite" for timer updates

Visual focus outlines are replaced with custom styles for clarity

📂 Folder Structure
📁 project
│── index.html
│── style.css
│── script.js
│── 📁 images
│      └── 1.jpeg, 2.jpeg, ...
│── README.md

-Technologies:
HTML5
CSS3 (flex, grid, responsive design, aspect-ratio)
JavaScript (DOM, events, timers, localStorage)

-Future Improvements:
Difficulty levels
Sound effects
Animated WIN screen
Card themes (animals, numbers, flags…)

-Authors:
Group5
