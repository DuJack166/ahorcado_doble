// Variables globales
let team1Name = "Equipo 1";
let team2Name = "Equipo 2";
let turnTime = 20;
let team1Word = "";
let team2Word = "";
let team1Lives = 10;
let team2Lives = 10;
let team1UsedLetters = [];
let team2UsedLetters = [];
let currentTurn = 1;
let team1TimeLeft = turnTime;
let team2TimeLeft = turnTime;
let timer;
let isPaused = false;
let gameMusic = null;

document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const playBtn = document.getElementById('playBtn');
    const optionsBtn = document.getElementById('optionsBtn');
    const saveOptionsBtn = document.getElementById('saveOptionsBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const guessBtn = document.getElementById('guessBtn');
    const guessInput = document.getElementById('guess-input');

    // Initialize password toggles
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    function updateBackground() {
        document.body.classList.remove('team1-turn', 'team2-turn');
        document.body.classList.add(currentTurn === 1 ? 'team1-turn' : 'team2-turn');
    }

    function createWordSpaces(word) {
        const spaces = document.createElement('div');
        spaces.className = 'word-spaces';
        word.split('').forEach(() => {
            const space = document.createElement('span');
            space.className = 'letter-space';
            space.textContent = '_';
            spaces.appendChild(space);
        });
        return spaces;
    }

    function updateWordSpaces(container, word, usedLetters) {
        container.innerHTML = '';
        const spaces = document.createElement('div');
        spaces.className = 'word-spaces';
        
        word.split('').forEach(letter => {
            const space = document.createElement('span');
            space.className = 'letter-space';
            space.textContent = usedLetters.includes(letter) ? letter : '_';
            spaces.appendChild(space);
        });
        
        container.appendChild(spaces);
    }

    function updateUsedLetters(container, letters) {
        container.innerHTML = '<h4>Letras Usadas:</h4>';
        const lettersList = document.createElement('div');
        lettersList.className = 'letters-list';
        
        letters.forEach(letter => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'used-letter';
            letterSpan.textContent = letter;
            lettersList.appendChild(letterSpan);
        });
        
        container.appendChild(lettersList);
    }

    function drawHangman(lives, canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // Base
        ctx.beginPath();
        ctx.moveTo(20, 180);
        ctx.lineTo(180, 180);
        ctx.stroke();

        if (lives <= 9) {
            // Poste vertical
            ctx.beginPath();
            ctx.moveTo(60, 180);
            ctx.lineTo(60, 20);
            ctx.stroke();
        }

        if (lives <= 8) {
            // Poste horizontal
            ctx.beginPath();
            ctx.moveTo(60, 20);
            ctx.lineTo(140, 20);
            ctx.stroke();
        }

        if (lives <= 7) {
            // Cuerda
            ctx.beginPath();
            ctx.moveTo(140, 20);
            ctx.lineTo(140, 40);
            ctx.stroke();
        }

        if (lives <= 6) {
            // Cabeza
            ctx.beginPath();
            ctx.arc(140, 55, 15, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (lives <= 5) {
            // Cuerpo
            ctx.beginPath();
            ctx.moveTo(140, 70);
            ctx.lineTo(140, 120);
            ctx.stroke();
        }

        if (lives <= 4) {
            // Brazo izquierdo
            ctx.beginPath();
            ctx.moveTo(140, 80);
            ctx.lineTo(120, 100);
            ctx.stroke();
        }

        if (lives <= 3) {
            // Brazo derecho
            ctx.beginPath();
            ctx.moveTo(140, 80);
            ctx.lineTo(160, 100);
            ctx.stroke();
        }

        if (lives <= 2) {
            // Pierna izquierda
            ctx.beginPath();
            ctx.moveTo(140, 120);
            ctx.lineTo(120, 150);
            ctx.stroke();
        }

        if (lives <= 1) {
            // Pierna derecha
            ctx.beginPath();
            ctx.moveTo(140, 120);
            ctx.lineTo(160, 150);
            ctx.stroke();
        }
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            if (!isPaused) {
                if (currentTurn === 1) {
                    team1TimeLeft--;
                    document.getElementById('time-left').textContent = team1TimeLeft;
                    if (team1TimeLeft <= 0) {
                        team1Lives--;
                        document.getElementById('team1-lives').textContent = team1Lives;
                        drawHangman(team1Lives, 'team1-canvas');
                        if (!checkGameOver()) {
                            switchTurn();
                            team1TimeLeft = turnTime; // Reset timer for next turn
                        }
                    }
                } else {
                    team2TimeLeft--;
                    document.getElementById('time-left').textContent = team2TimeLeft;
                    if (team2TimeLeft <= 0) {
                        team2Lives--;
                        document.getElementById('team2-lives').textContent = team2Lives;
                        drawHangman(team2Lives, 'team2-canvas');
                        if (!checkGameOver()) {
                            switchTurn();
                            team2TimeLeft = turnTime; // Reset timer for next turn
                        }
                    }
                }
            }
        }, 1000);
    }

    function showMessage(message) {
        isPaused = true;
        alert(message);
        isPaused = false;
    }

    function checkWin(word, usedLetters) {
        return word.split('').every(letter => usedLetters.includes(letter));
    }

    function checkGameOver() {
        if (team1Lives <= 0) {
            showMessage(`¡${team2Name} ha ganado! La palabra era: ${team1Word}`);
            resetGame();
            return true;
        }
        if (team2Lives <= 0) {
            showMessage(`¡${team1Name} ha ganado! La palabra era: ${team2Word}`);
            resetGame();
            return true;
        }
        return false;
    }

    function resetGame() {
        if (gameMusic) {
            gameMusic.pause();
            gameMusic = null;
        }
        team1Lives = 10;
        team2Lives = 10;
        team1TimeLeft = turnTime;
        team2TimeLeft = turnTime;
        team1UsedLetters = [];
        team2UsedLetters = [];
        currentTurn = 1;
        clearInterval(timer);
        showScreen('main-menu');
        document.body.classList.remove('team1-turn', 'team2-turn');
    }

    function switchTurn() {
        currentTurn = currentTurn === 1 ? 2 : 1;
        updateGameScreen();
        updateBackground();
        if (guessInput) {
            guessInput.value = '';
            guessInput.focus();
        }
    }

    function updateGameScreen() {
        const turnIndicator = document.getElementById('current-turn');
        turnIndicator.textContent = `Turno de: ${currentTurn === 1 ? team1Name : team2Name}`;

        updateWordSpaces(
            document.getElementById('team1-word-container'),
            team2Word,
            team1UsedLetters
        );
        updateWordSpaces(
            document.getElementById('team2-word-container'),
            team1Word,
            team2UsedLetters
        );

        updateUsedLetters(
            document.getElementById('team1-used-letters'),
            team1UsedLetters
        );
        updateUsedLetters(
            document.getElementById('team2-used-letters'),
            team2UsedLetters
        );

        document.getElementById('team1-lives').textContent = team1Lives;
        document.getElementById('team2-lives').textContent = team2Lives;
        drawHangman(team1Lives, 'team1-canvas');
        drawHangman(team2Lives, 'team2-canvas');

        document.getElementById('time-left').textContent = 
            currentTurn === 1 ? team1TimeLeft : team2TimeLeft;
            
        updateBackground();
    }

    playBtn.addEventListener('click', () => showScreen('game-setup'));

    optionsBtn.addEventListener('click', () => {
        document.getElementById('team1-name').value = team1Name;
        document.getElementById('team2-name').value = team2Name;
        document.getElementById('turn-time').value = turnTime;
        showScreen('options-menu');
    });

    saveOptionsBtn.addEventListener('click', () => {
        team1Name = document.getElementById('team1-name').value || "Equipo 1";
        team2Name = document.getElementById('team2-name').value || "Equipo 2";
        turnTime = parseInt(document.getElementById('turn-time').value) || 20;
        team1TimeLeft = turnTime;
        team2TimeLeft = turnTime;

        const musicFile = document.getElementById('game-music-file').files[0];
        if (musicFile) {
            gameMusic = new Audio(URL.createObjectURL(musicFile));
            gameMusic.loop = true;
        }

        const setupTeam1 = document.getElementById('setup-team1');
        const setupTeam2 = document.getElementById('setup-team2');
        setupTeam1.textContent = `Palabra para ${team1Name}:`;
        setupTeam2.textContent = `Palabra para ${team2Name}:`;

        showMessage("¡Opciones guardadas!");
        showScreen('main-menu');
    });

    startGameBtn.addEventListener('click', () => {
        const team1WordInput = document.getElementById('team1-word');
        const team2WordInput = document.getElementById('team2-word');

        team1Word = team1WordInput.value.toUpperCase();
        team2Word = team2WordInput.value.toUpperCase();

        if (!team1Word || !team2Word) {
            showMessage("¡Ambos equipos deben ingresar una palabra!");
            return;
        }

        if (!/^[A-ZÁÉÍÓÚÑ]+$/.test(team1Word) || !/^[A-ZÁÉÍÓÚÑ]+$/.test(team2Word)) {
            showMessage("¡Las palabras solo deben contener letras!");
            return;
        }

        if (gameMusic) {
            gameMusic.play().catch(error => {
                console.error('Error al reproducir música:', error);
            });
        }

        document.getElementById('team1-title').textContent = team1Name;
        document.getElementById('team2-title').textContent = team2Name;

        team1Lives = 10;
        team2Lives = 10;
        team1TimeLeft = turnTime;
        team2TimeLeft = turnTime;
        team1UsedLetters = [];
        team2UsedLetters = [];
        currentTurn = 1;

        showScreen('game-screen');
        updateGameScreen();
        startTimer();
    });

    guessBtn.addEventListener('click', () => {
        if (!guessInput) return;

        const letter = guessInput.value.toUpperCase();

        if (!letter || !/^[A-ZÁÉÍÓÚÑ]$/.test(letter)) {
            showMessage("¡Ingresa una letra válida!");
            return;
        }

        const currentWord = currentTurn === 1 ? team2Word : team1Word;
        const usedLetters = currentTurn === 1 ? team1UsedLetters : team2UsedLetters;

        if (usedLetters.includes(letter)) {
            showMessage("¡Esta letra ya fue utilizada!");
            return;
        }

        usedLetters.push(letter);

        if (!currentWord.includes(letter)) {
            if (currentTurn === 1) {
                team1Lives--;
            } else {
                team2Lives--;
            }
        }

        updateGameScreen();

        if (checkWin(currentWord, usedLetters)) {
            showMessage(`¡${currentTurn === 1 ? team1Name : team2Name} ha ganado!`);
            resetGame();
            return;
        }

        if (!checkGameOver()) {
            switchTurn();
        }
    });

    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            guessBtn.click();
        }
    });
});