const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let stack = [];
let size = 200;  // Initial size of the block
let pos = 0;     // Initial position of the block
let speed = 2;   // Speed of the block movement
let direction = 1;  // Direction of block movement (1 for right, -1 for left)
let lastClickTime = 0;  // To prevent rapid clicks

function init() {
    resizeCanvas();
    addInitialBlock();  // Add the starting block
    gameLoop();  // Start the game loop
}

// Function to add the initial block on game launch
function addInitialBlock() {
    stack.push({ size: size, pos: pos });
}

// Resize the canvas and adjust block positions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stack.forEach(block => {
        block.pos = (canvas.width - block.size) / 2;  // Center the block
    });
}

// Main game loop to update and render the game
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    // Draw each block in the stack
    stack.forEach((block, index) => {
        context.fillRect(block.pos, canvas.height - (index + 1) * 30, block.size, 30);
    });

    // Update the position of the current block
    let currentBlock = stack[stack.length - 1];
    currentBlock.pos += speed * direction;
    if (currentBlock.pos + currentBlock.size > canvas.width || currentBlock.pos < 0) {
        direction *= -1;  // Reverse direction if the block hits the edges
    }

    requestAnimationFrame(gameLoop);  // Request next frame
}

// Function to add a new block to the stack
function addBlock() {
    const currentTime = Date.now();
    
    // Prevent adding blocks if clicked too quickly
    if (currentTime - lastClickTime < 200) {
        logMessage("Rapid click detected, ignoring.");
        return;  
    }
    lastClickTime = currentTime;

    let lastBlock = stack[stack.length - 1];
    let newBlock = { size: lastBlock.size, pos: lastBlock.pos };

    // Check if the new block size is too large
    if (newBlock.size > canvas.width) {
        logMessage("Block size too large, adjusting.");
        newBlock.size = canvas.width;  // Adjust to fit within canvas
    }

    // Check for duplicate blocks (only allow if the position is different)
    if (stack.length > 0 && stack[stack.length - 1].pos === newBlock.pos) {
        logMessage("Duplicate block position detected, not adding.");
        return;  // Prevent duplicate block at the same position
    }

    stack.push(newBlock);  // Add new block
    logMessage("Block added.");
}

// Function to log messages to the UI and potentially to a server
function logMessage(message) {
    const logElement = document.getElementById('log');
    if (logElement) {
        const newLog = document.createElement('div');
        newLog.textContent = message;
        logElement.appendChild(newLog);
    }

    // Optional: Send logs to a server
    fetch('http://localhost:3000/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    }).catch(error => console.error('Error logging message:', error));
}

// Event listeners for mouse and touch interactions
window.addEventListener('click', addBlock);
window.addEventListener('touchstart', addBlock);
window.addEventListener('resize', resizeCanvas);

// Initialize the game
init();
