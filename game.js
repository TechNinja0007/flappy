const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -15, velocity: 0 };
let pipes = [];
let score = 0;
let gameSpeed = 2;
let earningPerPass = 10;
let gameInterval;

function startGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameSpeed = 2;
    earningPerPass = 10;
    scoreDisplay.textContent = `₹${score}`;
    gameOverDisplay.classList.add('hidden');
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        endGame();
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    ctx.fillStyle = '#ff0';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    if (Math.random() < 0.02) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - 100)) + 50;
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= gameSpeed;
        ctx.fillStyle = '#0f0';
        ctx.fillRect(pipe.x, 0, 20, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + 100, 20, canvas.height - pipe.y - 100);

        if (pipe.x + 20 < 0) {
            pipes.splice(index, 1);
        }

        if (pipe.x < bird.x + bird.width && !pipe.passed) {
            if (bird.y < pipe.y || bird.y + bird.height > pipe.y + 100) {
                endGame();
            } else {
                pipe.passed = true;
                score += earningPerPass;
                earningPerPass += 10;
                gameSpeed += 0.1;
                scoreDisplay.textContent = `₹${score}`;
            }
        }
    });

    if (pipes.length > 0 && pipes[0].x < bird.x - bird.width) {
        pipes[0].passed = true;
    }
}

function endGame() {
    clearInterval(gameInterval);
    gameOverDisplay.classList.remove('hidden');
}

document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

startGame();
