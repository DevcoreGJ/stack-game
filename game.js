const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let stack = [];
const blockHeight = 30; // Block height
const blockWidth = blockHeight; // Set width equal to height
let pos = 0;
let speed = 2;
let direction = 1;
let score = 0; // Initialize score

// Initialize the game
function init() {
    resizeCanvas();
    stack.push({ size: blockWidth, pos: pos });
    gameLoop();
}

// Resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stack.forEach(block => {
        block.pos = (canvas.width - block.size) / 2;
    });
}

// Main game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    checkCollision(); // Check for collision

    let currentBlock = stack[stack.length - 1];
    currentBlock.pos += speed * direction;

    // Change direction when hitting canvas edges
    if (currentBlock.pos + blockWidth > canvas.width || currentBlock.pos < 0) {
        direction *= -1;
    }

    requestAnimationFrame(gameLoop);
}

// Draw the blocks on the canvas
function drawBlocks() {
    stack.forEach((block, index) => {
        context.fillRect(block.pos, canvas.height - (index + 1) * blockHeight, blockWidth, blockHeight);
    });
}

// Check for collisions with the last block
function checkCollision() {
    if (stack.length < 2) return; // No collision if there's only one block
    let lastBlock = stack[stack.length - 1];
    let prevBlock = stack[stack.length - 2];

    // Check if the current block overlaps with the previous one
    if (
        lastBlock.pos + blockWidth < prevBlock.pos || // To the left
        lastBlock.pos > prevBlock.pos + blockWidth // To the right
    ) {
        gameOver(); // Trigger game over if no collision
    }
}

// Handle game over logic
function gameOver() {
    alert(`Game Over! Your score was: ${score}`);
    // Reset the game
    stack = [];
    score = 0; // Reset score
    init(); // Restart the game
}

// Add a new block to the stack and update score
function addBlock() {
    let lastBlock = stack[stack.length - 1];
    let newBlock = { size: lastBlock.size, pos: lastBlock.pos };
    stack.push(newBlock);
    score++; // Increment score
}

// Event listeners for user interactions
window.addEventListener('click', addBlock);
window.addEventListener('touchstart', addBlock);
window.addEventListener('resize', resizeCanvas);

// Start the game
init();
