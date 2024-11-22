// Main game logic
import { gameState } from './game-state.js';
import { handleMusic } from './music-handler.js';
import { updateWordSpaces, updateUsedLetters, showMessage } from './ui-manager.js';
import { drawHangman } from './hangman-drawer.js';

// ... (previous code remains the same until updateTimer function)

function updateTimer() {
    if (gameState.currentTurn === 1) {
        gameState.team1TimeLeft--;
        document.getElementById('time-left').textContent = gameState.team1TimeLeft;
        if (gameState.team1TimeLeft <= 0) {
            gameState.team1Lives--;
            document.getElementById('team1-lives').textContent = gameState.team1Lives;
            drawHangman(gameState.team1Lives, 'team1-canvas');
            if (!checkGameOver()) {
                switchTurn();
                gameState.team1TimeLeft = gameState.turnTime; // Reset timer for next turn
            }
        }
    } else {
        gameState.team2TimeLeft--;
        document.getElementById('time-left').textContent = gameState.team2TimeLeft;
        if (gameState.team2TimeLeft <= 0) {
            gameState.team2Lives--;
            document.getElementById('team2-lives').textContent = gameState.team2Lives;
            drawHangman(gameState.team2Lives, 'team2-canvas');
            if (!checkGameOver()) {
                switchTurn();
                gameState.team2TimeLeft = gameState.turnTime; // Reset timer for next turn
            }
        }
    }
    
    // Update background color based on current turn
    document.body.style.backgroundColor = gameState.currentTurn === 1 ? '#ffebee' : '#e3f2fd';
}

// ... (rest of the code remains the same)