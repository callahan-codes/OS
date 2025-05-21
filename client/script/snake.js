// global vars
let snake;
let snakeDirection;
let food;
let gameOver;
let gridSize;
let canvasSizeX;
let canvasSizeY;
let score = 0;
let ctx;
let gameInterval;
let touchStartX = 0;
let touchStartY = 0;

// init game
export function initializeGame() {

    // canvas and context
    const canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvasSizeX = canvas.width;
    canvasSizeY = canvas.height;

    // grid size
    gridSize = Math.floor(canvas.width / 40);

    // snake starting pos and direction, food generation
    snake = [{x: Math.floor(canvasSizeX / 2 / gridSize) * gridSize, y: Math.floor(canvasSizeY / 2 / gridSize) * gridSize}];
    snakeDirection = 'RIGHT';
    food = generateFood();

    // gameOver and gameInterval values
    gameOver = false;
    gameInterval = setInterval(gameLoop, 100);

    // listeners (keyboard + mobile)
    document.addEventListener("keydown", changeDirection);
    canvas.addEventListener("touchstart", touchStartHandler);
    canvas.addEventListener("touchend", touchEndHandler);
}

// update canvas size
export function updateGameCanvasSize(newWidth, newHeight) {

    // canvas & size
    const canvas = document.getElementById("gameCanvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvasSizeX = newWidth;
    canvasSizeY = newHeight;

    // grid size
    gridSize = Math.floor(canvas.width / 40);

    // snake & food
    snake = [{x: Math.floor(canvasSizeX / 2 / gridSize) * gridSize, y: Math.floor(canvasSizeY / 2 / gridSize) * gridSize}];
    food = generateFood();
}

// main loop
function gameLoop() {

    // if game over
    if (gameOver) {

        // reset
        clearInterval(gameInterval);
        restartGame();
        return;
    }

    // game functions
    moveSnake();
    checkCollision();
    checkFoodCollision();
    clearCanvas();
    drawSnake();
    drawFood();
}

// mobile listener start handler
function touchStartHandler(event) {
    event.preventDefault();

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

// mobile listener end handler
function touchEndHandler(event) {

    event.preventDefault();

    // touch coords
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // change snake dir
    if (Math.abs(deltaX) > Math.abs(deltaY)) {

        if (deltaX > 0 && snakeDirection !== 'LEFT') {
            snakeDirection = 'RIGHT';
        } else if (deltaX < 0 && snakeDirection !== 'RIGHT') {
            snakeDirection = 'LEFT';
        }

    } else {

        if (deltaY > 0 && snakeDirection !== 'UP') {
            snakeDirection = 'DOWN';
        } else if (deltaY < 0 && snakeDirection !== 'DOWN') {
            snakeDirection = 'UP';
        }

    }
}

// change snake direction
function changeDirection(event) {

    // key touches - needs fine tuning
    if (event.key === 'ArrowUp' && snakeDirection !== 'DOWN') {
        snakeDirection = 'UP';
    } else if (event.key === 'ArrowDown' && snakeDirection !== 'UP') {
        snakeDirection = 'DOWN';
    } else if (event.key === 'ArrowLeft' && snakeDirection !== 'RIGHT') {
        snakeDirection = 'LEFT';
    } else if (event.key === 'ArrowRight' && snakeDirection !== 'LEFT') {
        snakeDirection = 'RIGHT';
    }
}

// move snake in direction
function moveSnake() {

    // copy of first snake bit
    const head = {...snake[0]};

    // based on snake dir, move head accordingly
    if (snakeDirection === 'UP') {
        head.y -= gridSize;
    } else if (snakeDirection === 'DOWN') {
        head.y += gridSize;
    } else if (snakeDirection === 'LEFT') {
        head.x -= gridSize;
    } else if (snakeDirection === 'RIGHT') {
        head.x += gridSize;
    }

    // if head meets boundary, end game
    if (head.x < 0 || head.x >= canvasSizeX || head.y < 0 || head.y >= canvasSizeY) {
        gameOver = true; 
        return; 
    }

    // align head's coords
    head.x = Math.floor(head.x / gridSize) * gridSize;
    head.y = Math.floor(head.y / gridSize) * gridSize;

    // add new head pos to array
    snake.unshift(head);

    // remove last snake bit 
    snake.pop();
}

// boundary collision check
function checkCollision() {

    // first snake bit
    const head = snake[0];

    // if collided with canvas boundaries, gameover
    if (head.x < 0 || head.x >= canvasSizeX || head.y < 0 || head.y >= canvasSizeY) {
        gameOver = true; 
        return; 
    }

    // if self-collides, gameover
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

// food collision check
function checkFoodCollision() {

    // first snake bit
    const head = snake[0];

    // if head and food coords align
    if (head.x === food.x && head.y === food.y) {

        // add new snake bit, + score, new food gen
        snake.push({x: food.x, y: food.y});
        score += 10;
        food = generateFood();
    }
}

// generate food bit
function generateFood() {

    // random coord in canvas grid
    const x = Math.floor(Math.random() * (canvasSizeX / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSizeY / gridSize)) * gridSize;
    return {x, y};
}

// clear canvas
function clearCanvas() {

    // reset context
    ctx.clearRect(0, 0, canvasSizeX, canvasSizeY);
}

// snake bits
function drawSnake() {

    // rectangle per
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'white' : 'gray';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// food bits
function drawFood() {

    // rectangle per
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// restart game
function restartGame() {

    // clear game interval, show menu and reset score
    clearInterval(gameInterval);
    showMenuScreen();
    score = 0;
}

// destroy game
export function destroyGame() {
    gameOver = true;
}

// menu screen
export function showMenuScreen() {

    // menu screen
    const menuScreen = document.getElementById('snake-menu_screen');
    if (menuScreen) {
        menuScreen.remove();
    }

    // app screen and content
    const appScreen = document.getElementById('snake-container');
    const html = `
        <div class="snake-menu_screen" id="snake-menu_screen">
            <div id="snake-con">
                <h1>SNAKE.io</h1>
                <div id="snake-menu-btn">Play</div>
                <div id="snake-score-container">
                    <p id="score">Score: ${score}</p>
                </div>
                <p id="timer"></p>
            </div>
        </div>
    `;

    // new div, append
    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = html;

    const appElement = menuDiv.firstElementChild;
    appScreen.appendChild(appElement);

    // add listener to start game button
    document.getElementById('snake-menu-btn').addEventListener('click', () => {
        const timer = document.getElementById("timer");
        const menuBtn = document.getElementById('snake-menu-btn');

        var time = 3;
        setInterval(() => {
            menuBtn.classList.add('hide');
            timer.innerHTML = `Starting in ${time}`;
            if (time === 0) {
                document.getElementById('snake-menu_screen').remove();
                initializeGame();
            }
            time--;
        }, 1000);
    });
}
