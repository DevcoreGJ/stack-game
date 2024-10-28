const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let stack = [];
const blockHeight = 30; // Block height
const blockWidth = blockHeight; // Set width equal to height
let pos = 0;
let initialSpeed = 2; // Initial speed
let speed = initialSpeed; // Current speed
let direction = 1;
let score = 0; // Initialize score
let isAddingBlock = false; // Flag to manage block addition
let successfulStacks = 0; // Track successful stacks in this game session

// Initialize the game
function init() {
    resizeCanvas();
    stack.push({ size: blockWidth, pos: pos });
    speed = initialSpeed; // Reset speed on init
    gameLoop();
}

// Resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    // Center the blocks vertically in the canvas
    if (stack.length > 10) {
        let shiftAmount = (blockHeight * (stack.length - 10)); // Shift up when more than 10 blocks
        for (let block of stack) {
            block.posY -= shiftAmount; // Adjust Y position of all blocks
        }
    }

    requestAnimationFrame(gameLoop);
}

// Draw the blocks on the canvas
function drawBlocks() {
    stack.forEach((block, index) => {
        context.fillRect(block.pos, canvas.height - (index + 1) * blockHeight, blockWidth, blockHeight);
    });
    document.getElementById('score').innerText = `Score: ${score}`; // Update score display
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
    successfulStacks = 0; // Reset successful stacks count
    init(); // Restart the game
    speed = initialSpeed; // Reset speed to initial on game over
}

// Add a new block to the stack and update score
function addBlock() {
    if (isAddingBlock) return; // Prevent multiple clicks from adding blocks
    isAddingBlock = true; // Set the flag to prevent further clicks

    let lastBlock = stack[stack.length - 1];
    let newBlock = { size: lastBlock.size, pos: lastBlock.pos };
    stack.push(newBlock);
    score++; // Increment score

    // Increment speed for every 10 blocks stacked successfully
    successfulStacks++;
    if (successfulStacks % 10 === 0) {
        speed += 1; // Increase speed
    }

    // Update score display immediately after adding the block
    document.getElementById('score').innerText = `Score: ${score}`; 

    // Allow block addition again after a short delay
    setTimeout(() => {
        isAddingBlock = false;
    }, 300); // Delay to prevent rapid clicking
}

// Event listeners for user interactions
canvas.addEventListener('click', addBlock); // Only attach click to canvas
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    addBlock();
});
window.addEventListener('resize', resizeCanvas);

// Start the game
init();
