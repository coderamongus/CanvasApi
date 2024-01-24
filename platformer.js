const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 50,
    width: 30,
    height: 25,
    color: 'blue',
    velocityX: 0,
    velocityY: 0,
    acceleration: 10,
    friction: 0.8,
    jumpPower: 6,
    isJumping: false,
    isLeftKeyPressed: false,
    isRightKeyPressed: false,
    maxSpeed: 8,
    isAlive: true,
};

let level = 0;
let greenGatePosition = { x: 50, y: 50 }; 

const boxes = [
    [
        { x: 200, y: 100, width: 300, height: 20, color: 'brown' },
        { x: 400, y: 150, width: 200, height: 20, color: 'brown' },
        { x: 0, y: 210, width: 1150, height: 20, color: 'brown' },
        { x: 1550, y: 170, width: 50, height: 20, color: 'brown' },
        { x: 1210, y: 100, width: 100, height: 20, color: 'brown' },
        { x: 850, y: 20, width: 750, height: 10, color: 'red' },
        { x: 800, y: 150, width: 230, height: 20, color: 'brown' },
        { x: 800, y: 20, width: 50, height: 130, color: 'brown' },
        { x: 850, y: 210, width: 50, height: 80, color: 'brown' },
        { x: 1, y: 1, width: 1600, height: 20, color: 'brown' },
        { x: 1, y: 380, width: 1600, height: 20, color: 'brown' },
        { x: 600, y: 150, width: 200, height: 10, color: 'red' },
        { x: 850, y: 360, width: 50, height: 20, color: 'red' },
        { x: 850, y: 290, width: 50, height: 20, color: 'red' },
        { x: 100, y: 230, width: 50, height: 50, color: 'green' }, //x: 100, y: 230, normaalit
    ],
    [
        { x: 1, y: 1, width: 1600, height: 20, color: 'brown' },
        { x: 1, y: 380, width: 1600, height: 20, color: 'brown' },
        { x: 1450, y: 20, width: 50, height: 50, color: 'green' },
        { x: 75, y: 200, width: 150, height: 20, color: 'brown' },
        { x: 900, y: 250, width: 100, height: 20, color: 'brown' },
        { x: 1250, y: 281, width: 250, height: 20, color: 'brown' },
        { x: 1400, y: 100, width: 250, height: 20, color: 'brown' },
        { x: 1400, y: 120, width: 250, height: 10, color: 'red' },
        { x: 950, y: 300, width: 50, height: 250, color: 'brown ' },
        { x: 500, y: 200, width: 150, height: 20, color: 'brown ' },
        { x: 1200, y: 1, width: 50, height: 300, color: 'brown ' },
        { x: 0, y: 20, width: 1200, height: 10, color: 'red' },
    ],
];

const gravity = -0.2;

let isDeathScreenVisible = false;

function showRespawnMessage() {
    const respawnMessage = document.getElementById('respawnMessage');
    respawnMessage.style.display = 'block';
}

function hideRespawnMessage() {
    const respawnMessage = document.getElementById('respawnMessage');
    respawnMessage.style.display = 'none';
}

function handleCollision(entity1, entity2) {
    const playerCenterX = entity1.x + entity1.width / 2;
    const playerCenterY = entity1.y + entity1.height / 2;

    const boxCenterX = entity2.x + entity2.width / 2;
    const boxCenterY = entity2.y + entity2.height / 2;

    const dx = playerCenterX - boxCenterX;
    const dy = playerCenterY - boxCenterY;

    const combinedHalfWidths = entity1.width / 2 + entity2.width / 2;
    const combinedHalfHeights = entity1.height / 2 + entity2.height / 2;

    if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
        const overlapX = combinedHalfWidths - Math.abs(dx);
        const overlapY = combinedHalfHeights - Math.abs(dy);

        if (overlapX >= overlapY) {
            if (dy > 0) {
                entity1.y = entity2.y + entity2.height;
                entity1.velocityY = 0;
                entity1.isJumping = false;

                if (entity2.color === 'red') {
                    player.isAlive = false;
                    resetPlayerPosition();
                } else if (entity2.color === 'green') {
                    greenGatePosition = { x: entity2.x, y: entity2.y + entity2.height };
                    level++;
                    resetPlayerPosition();
                }
            } else {
                entity1.y = entity2.y - entity1.height;
                entity1.velocityY = 0;

                if (entity2.color === 'red') {
                    player.isAlive = false;
                    resetPlayerPosition();
                } else if (entity2.color === 'green') {
                    greenGatePosition = { x: entity2.x, y: entity2.y - entity1.height };
                    level++;
                    resetPlayerPosition();
                }
            }
        } else {
            if (dx > 0) {
                entity1.x = entity2.x + entity2.width;
            } else {
                entity1.x = entity2.x - entity1.width;
            }
            entity1.velocityX = 0;

            if (entity2.color === 'red') {
                player.isAlive = false;
                resetPlayerPosition();
            } else if (entity2.color === 'green') {
                greenGatePosition = { x: entity2.x + entity2.width, y: entity2.y };
                level++;
                resetPlayerPosition();
            }
        }
    }
}

function resetPlayerPosition() {
    player.x = greenGatePosition.x;
    player.y = greenGatePosition.y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
}

function update() {
    if (!player.isAlive) {
        return;
    }

    player.x += player.velocityX;
    player.y += player.velocityY;

    player.velocityY += gravity;

    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        player.velocityX = 0;
    }

    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
        player.isJumping = false;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.velocityY = 0;
    }

    for (const box of boxes[level]) {
        handleCollision(player, box);
    }

    player.velocityX *= player.friction;
}

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowLeft':
            player.isLeftKeyPressed = true;
            break;
        case 'ArrowRight':
            player.isRightKeyPressed = true;
            break;
        case 'Space':
            if (!player.isJumping) {
                player.velocityY = player.jumpPower;
                player.isJumping = true;
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowLeft':
            player.isLeftKeyPressed = false;
            break;
        case 'ArrowRight':
            player.isRightKeyPressed = false;
            break;
    }
});

ctx.transform(1, 0, 0, -1, 0, canvas.height);

function gameLoop() {
    if (!player.isAlive) {
        if (!isDeathScreenVisible) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            showRespawnMessage(); 
            isDeathScreenVisible = true;
        }
        return;
    }

    update();

    if (isDeathScreenVisible) {
        isDeathScreenVisible = false;
        hideRespawnMessage(); 
    }

    if (player.isLeftKeyPressed) {
        player.velocityX -= player.acceleration;
        if (player.velocityX < -player.maxSpeed) {
            player.velocityX = -player.maxSpeed;
        }
    } else if (player.isRightKeyPressed) {
        player.velocityX += player.acceleration;
        if (player.velocityX > player.maxSpeed) {
            player.velocityX = player.maxSpeed;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    for (const box of boxes[level]) {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y, box.width, box.height);
    }

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (event) => {
    if (isDeathScreenVisible) {
        resetPlayerPosition();
        isDeathScreenVisible = false;
        player.isAlive = true;
        hideRespawnMessage(); 
        requestAnimationFrame(gameLoop);
    }
});

requestAnimationFrame(gameLoop);