const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let stack = [];
const blockHeight = 30; // Block height
const blockWidth = blockHeight; // Set width equal to height
let pos = 0;
let speed = 2;
let direction = 1;

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

    stack.forEach((block, index) => {
        context.fillRect(block.pos, canvas.height - (index + 1) * blockHeight, blockWidth, blockHeight);
    });

    let currentBlock = stack[stack.length - 1];
    currentBlock.pos += speed * direction;

    // Change direction when hitting canvas edges
    if (currentBlock.pos + blockWidth > canvas.width || currentBlock.pos < 0) {
        direction *= -1;
    }

    requestAnimationFrame(gameLoop);
}

// Add a new block to the stack
function addBlock() {
    let lastBlock = stack[stack.length - 1];
    let newBlock = { size: lastBlock.size, pos: lastBlock.pos };
    stack.push(newBlock);
}

// Event listeners for user interactions
window.addEventListener('click', addBlock);
window.addEventListener('touchstart', addBlock);
window.addEventListener('resize', resizeCanvas);

// Start the game
init();
