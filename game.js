const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('currentScore');
const finalScoreDisplay = document.getElementById('finalScore');

const BLOCK_HEIGHT = 30;
const INITIAL_SIZE = 200;
const INITIAL_SPEED = 2;
const CANVAS_BACKGROUND_COLOR = '#333';

let stack = [];
let size = INITIAL_SIZE;
let pos = 0;
let speed = INITIAL_SPEED;
let direction = 1;
let score = 0;
let isGameOver = false;

function init() {
    resizeCanvas();
    stack = [{ size: size, pos: pos }];
    score = 0;
    isGameOver = false;
    scoreDisplay.innerText = score;
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'none';
    gameLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stack.forEach(block => {
        block.pos = (canvas.width - block.size) / 2;
    });
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = CANVAS_BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    renderStack();

    if (!isGameOver) {
        updateCurrentBlock();
        requestAnimationFrame(gameLoop);
    }
}

function renderStack() {
    context.fillStyle = 'white';
    stack.forEach((block, index) => {
        context.fillRect(block.pos, canvas.height - (index + 1) * BLOCK_HEIGHT, block.size, BLOCK_HEIGHT);
    });
}

function updateCurrentBlock() {
    let currentBlock = stack[stack.length - 1];
    currentBlock.pos += speed * direction;
    if (currentBlock.pos + currentBlock.size > canvas.width || currentBlock.pos < 0) {
        direction *= -1;
    }
}

function addBlock() {
    if (isGameOver) return;
    let lastBlock = stack[stack.length - 1];
    let newBlock = { size: lastBlock.size, pos: lastBlock.pos };

    if (Math.abs(lastBlock.pos - newBlock.pos) > 10) {
        endGame();
        return;
    }

    newBlock.size -= Math.abs(lastBlock.pos - newBlock.pos);
    stack.push(newBlock);
    score++;
    scoreDisplay.innerText = score;

    if (newBlock.size <= 0) {
        endGame();
    }
}

function endGame() {
    isGameOver = true;
    finalScoreDisplay.innerText = score;
    gameOverScreen.style.display = 'block';
}

function startGame() {
    startScreen.style.display = 'none';
    init();
}

window.addEventListener('click', addBlock);
window.addEventListener('touchstart', addBlock);
window.addEventListener('resize', resizeCanvas);

document.addEventListener('DOMContentLoaded', () => {
    startScreen.style.display = 'block';
});