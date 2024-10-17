const player = document.getElementById('player');
let posX = 50;
let posY = 50;
let direction = 'right';
const monsters = [];
const maxMonsters = Math.floor(Math.random() * (10 - 3 + 1)) + 3;

// Function to move player
const move = () => {
    player.style.top = `${posY}%`;
    player.style.left = `${posX}%`;
};

// Player movement functions
const up = () => {
    if (posY > 0) {
        posY -= 5;
        direction = 'up';
        move();
    }
};

const down = () => {
    if (posY < 100) {
        posY += 5;
        direction = 'down';
        move();
    }
};

const left = () => {
    if (posX > 0) {
        posX -= 2.5;
        direction = 'left';
        move();
    }
};

const right = () => {
    if (posX < 100) {
        posX += 2.5;
        direction = 'right';
        move();
    }
};

// Keyboard event listener for player movement
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            up();
            break;
        case "ArrowDown":
            down();
            break;
        case "ArrowLeft":
            left();
            break;
        case "ArrowRight":
            right();
            break;
        case "Enter":
            fire();
            break;
    }
});

// Fireball functionality
const fire = () => {
    const fireball = document.createElement("div");
    fireball.className = "fireball bg-red-600 w-4 h-4 rounded-full absolute";
    
    const playerRect = player.getBoundingClientRect();
    fireball.style.top = `${playerRect.top + playerRect.height / 2 - 2}px`;
    fireball.style.left = `${playerRect.left + playerRect.width / 2 - 2}px`;
    
    document.body.appendChild(fireball);

    const moveFireball = () => {
        switch (direction) {
            case 'up':
                fireball.style.top = `${parseFloat(fireball.style.top) - 5}px`;
                break;
            case 'down':
                fireball.style.top = `${parseFloat(fireball.style.top) + 5}px`;
                break;
            case 'left':
                fireball.style.left = `${parseFloat(fireball.style.left) - 5}px`;
                break;
            case 'right':
                fireball.style.left = `${parseFloat(fireball.style.left) + 5}px`;
                break;
        }

        // Collision detection with monsters
        monsters.forEach((monster, index) => {
            if (isCollision(fireball, monster)) {
                monster.remove(); // Remove monster
                fireball.remove(); // Remove fireball
                monsters.splice(index, 1); // Remove from monsters array

                // If all monsters are gone, create new set of monsters
                if (monsters.length === 0) {
                    createNewSetOfMonsters();
                }
            }
        });

        // Boundary check for fireball
        if (parseFloat(fireball.style.top) < 0 || parseFloat(fireball.style.top) > window.innerHeight || 
            parseFloat(fireball.style.left) < 0 || parseFloat(fireball.style.left) > window.innerWidth) {
            fireball.remove();
        } else {
            requestAnimationFrame(moveFireball);
        }
    };

    requestAnimationFrame(moveFireball);
};

// Function to create monsters
const createMonster = () => {
    const monster = document.createElement("img");
    monster.src = "https://cf-sparkai-live.s3.amazonaws.com/users/2nZ7cvcKGptiOSdCdNhOHupGTJI/spark_ai/o_bg-remover-gen_2nZF1aeznVktbfPzPuUWjMeg0YH.png"; // Placeholder image
    monster.className = "monster absolute";
    monster.style.width = "40px";
    monster.style.height = "40px";

    // Randomly position the monster
    const monsterX = Math.random() * 90;
    const monsterY = Math.random() * 90;
    monster.style.top = `${monsterY}%`;
    monster.style.left = `${monsterX}%`;

    document.body.appendChild(monster);
    monsters.push(monster);

    // Move the monster
    moveMonster(monster);
};

// Move the Monster randomly
const moveMonster = (monster) => {
    const move = () => {
        const monsterRect = monster.getBoundingClientRect();
        const randomDirection = Math.random();
        let deltaX = 0;
        let deltaY = 0;

        if (randomDirection < 0.25) {
            deltaY = -1;
        } else if (randomDirection < 0.5) {
            deltaY = 1;
        } else if (randomDirection < 0.75) {
            deltaX = -1;
        } else {
            deltaX = 1;
        }

        monster.style.top = `${Math.min(Math.max(monsterRect.top + deltaY, 0), window.innerHeight - monsterRect.height)}px`;
        monster.style.left = `${Math.min(Math.max(monsterRect.left + deltaX, 0), window.innerWidth - monsterRect.width)}px`;

        if (isCollision(player, monster)) {
            alert("Game Over! Monster touched the player.");
        } else {
            requestAnimationFrame(move);
        }
    };

    requestAnimationFrame(move);
};

// Collision detection function
const isCollision = (a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    return !(
        rectA.top > rectB.bottom ||
        rectA.bottom < rectB.top ||
        rectA.left > rectB.right ||
        rectA.right < rectB.left
    );
};

// Create a new set of monsters
const createNewSetOfMonsters = () => {
    const newMonsterCount = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
    for (let i = 0; i < newMonsterCount; i++) {
        createMonster();
    }
};

// Create initial monsters
createNewSetOfMonsters();

// Create new monsters every few seconds, up to the maximum
setInterval(() => {
    if (monsters.length >= maxMonsters) return;
    createMonster();
}, 3000);
