document.addEventListener("DOMContentLoaded", function() {
const timerElement = document.getElementById("timer");
const gameBoard = document.getElementById("game-board");    
const playButton = document.getElementById("play-button");


const blockSize = 20;
const speed = 100; // Milliseconds

let snake = [{ x: 5, y: 5 }];
let direction = "right";
let gameInterval = null;
let startTime = 0;
let currentTime = 0;
let food = {};

function update() {
    currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = currentTime;
    moveSnake();
    checkCollision();
    draw();
}
function draw() {
    gameBoard.innerHTML = "";
    snake.forEach(segment => {
        const snakeSegment = document.createElement("div");
        snakeSegment.className = "snake";
        snakeSegment.style.left = `${segment.x * blockSize}px`;
        snakeSegment.style.top = `${segment.y * blockSize}px`;
        gameBoard.appendChild(snakeSegment);
    });

}

function generateFood() {
    const maxX = Math.floor(gameBoard.clientWidth / blockSize);
    const maxY = Math.floor(gameBoard.clientHeight / blockSize);

    do {
        food.x = Math.floor(Math.random() * maxX);
        food.y = Math.floor(Math.random() * maxY);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function moveSnake() {
    const newHead = { ...snake[0] };

    switch (direction) {
        case "up":
            newHead.y -= 1;
            break;
        case "down":
            newHead.y += 1;
            break;
        case "left":
            newHead.x -= 1;
            break;
        case "right":
            newHead.x += 1;
            break;
    }

    snake.unshift(newHead);
}

function checkCollision() {
    const head = snake[0];

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        // Agregar un nuevo segmento en la dirección actual de la cola de la serpiente
        const newTail = { ...snake[snake.length - 1] };
        snake.push(newTail);
        generateFood();
    } 
    
    else {
        // Mover la culebra sin agregar ni quitar segmentos
        const newHead = { ...head };
        switch (direction) {
            case "up":
                newHead.y -= 1;
                break;
            case "down":
                newHead.y += 1;
                break;
            case "left":
                newHead.x -= 1;
                break;
            case "right":
                newHead.x += 1;
                break;
        }

        // Check for collision with walls
        if (
            newHead.x < 0 ||
            newHead.x >= gameBoard.clientWidth / blockSize ||
            newHead.y < 0 ||
            newHead.y >= gameBoard.clientHeight / blockSize
        ) {
            gameOver();
            return;
        }

        // Check for collision with self
        for (let i = 1; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        snake.pop();
        snake.unshift(newHead);
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert("Game Over!");
    playButton.disabled = false;
    timerElement.textContent = "0";
}

let lastDirection = "right"; // Agrega esta línea fuera de cualquier función

function handleKeyDown(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado de desplazamiento
    if (event.key === "ArrowRight" && lastDirection !== "left") {
        direction = "right";
    } else if (event.key === "ArrowLeft" && lastDirection !== "right") {
        direction = "left";
    } else if (event.key === "ArrowDown" && lastDirection !== "up") {
        direction = "down";
    } else if (event.key === "ArrowUp" && lastDirection !== "down") {
        direction = "up";
    }

    lastDirection = direction; // Actualiza la última dirección
}

playButton.addEventListener("click", () => {
    playButton.disabled = true;
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    startTime = Date.now();

    gameInterval = setInterval(update, speed);
});

document.addEventListener("keydown", handleKeyDown);

});