const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let stack = [];
let size = 30; // Set both width and height to 30 pixels
let pos = 0;
let speed = 2;
let direction = 1;

function init() {
    resizeCanvas();
    stack.push({ size: size, pos: pos });
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

    stack.forEach((block, index) => {
        context.fillRect(block.pos, canvas.height - (index + 1) * block.size, block.size, block.size); // Use size for both width and height
    });

    let currentBlock = stack[stack.length - 1];
    currentBlock.pos += speed * direction;
    if (currentBlock.pos + currentBlock.size > canvas.width || currentBlock.pos < 0) {
        direction *= -1;
    }

    requestAnimationFrame(gameLoop);
}

function addBlock() {
    let lastBlock = stack[stack.length - 1];
    let newBlock = { size: lastBlock.size, pos: lastBlock.pos };
    stack.push(newBlock);
}

window.addEventListener('click', addBlock);
window.addEventListener('touchstart', addBlock);
window.addEventListener('resize', resizeCanvas);

init();
