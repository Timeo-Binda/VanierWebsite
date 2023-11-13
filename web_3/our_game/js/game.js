// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector("#gameBox").appendChild(canvas);

// Load sprites
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.src = "images/background.png";
bgImage.onload = function () {
    bgReady = true;
};

// Win frame image
var winReady = false;
var winImage = new Image();
winImage.src = "images/win.png";
winImage.onload = function () {
    winReady = true;
};

// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.src = "images/player.png";
playerImage.onload = function () {
    playerReady = true;
};

// Enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.src = "images/enemy.png";
enemyImage.onload = function () {
    enemyReady = true;
};

// Create global game objects
var player = {
    speed: 5, // movement in pixels per tick
    width: 32,
    height: 32,
    x: (canvas.width - 32) / 2,
    y: (canvas.height - 32) / 2,
    lives: 5
};


// Create enemies
var enemies = [
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)), enemySpeed: 0.5, cooldown: 0 },
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)), enemySpeed: 0.5, cooldown: 0 },
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)), enemySpeed: 0.5, cooldown: 0 }
];


// View variables
var viewX = 0;
var viewY = 0;

// Handle keyboard controls
addEventListener("keydown", function (e) {
    // Keystrokes
    switch (e.key) {
        case "ArrowUp":
            player.y -= player.speed;
            break;
        case "ArrowDown":
            player.y += player.speed;
            break;
        case "ArrowLeft":
            player.x -= player.speed;
            break;
        case "ArrowRight":
            player.x += player.speed;
            break;
    }
}, false);

// Set initial state
var init = function () {
    for (var i in enemies) {
        enemies[i].x = (Math.random() * (canvas.width - enemies[i].width));
        enemies[i].y = (Math.random() * (canvas.height - enemies[i].height));
    }
};




// Facteur de zoom (augmentez cette valeur pour un zoom plus important)
var zoomFactor = 8; // Par exemple, pour un zoom 8 fois plus grand


// The main game loop
var main = function () {
    if (checkWin()) {
        if (winReady) {
            ctx.drawImage(winImage, (canvas.width - winImage.width) / 2, (canvas.height - winImage.height) / 2);
        }
    } else {
        viewX = player.x - (canvas.width / 2);
        viewY = player.y - (canvas.height / 2);

        // Vérification de collision avec les obstacles
        for (var i in obstacles) {
            if (checkCollision(player, obstacles[i])) {
                // Collision détectée, réinitialisez la position du joueur ici ou effectuez d'autres actions
                // Par exemple, pour empêcher le joueur de se déplacer vers le haut s'il touche un obstacle en bas :
                if (player.y + player.height >= obstacles[i].y && player.y < obstacles[i].y + obstacles[i].height && player.x + player.width > obstacles[i].x && player.x < obstacles[i].x + obstacles[i].width) {
                    player.y = obstacles[i].y + obstacles[i].height;
                }
                // Vous pouvez ajouter d'autres conditions pour gérer les collisions dans d'autres directions.
            }
        }


for (var i in enemies) {
    var angle = Math.atan2(player.y - enemies[i].y, player.x - enemies[i].x);
    enemies[i].x += Math.cos(angle) * enemies[i].enemySpeed; // utilisez enemySpeed au lieu de player.speed
    enemies[i].y += Math.sin(angle) * enemies[i].enemySpeed;
}

for (var i in enemies) {
        // Vérifiez la collision et gérez les vies du joueur uniquement si le cooldown de l'ennemi est épuisé
        if (enemies[i].cooldown === 0 && checkCollision(player, enemies[i])) {
            // Gérez la collision avec un ennemi ici
            player.lives--;

            // Réglez le cooldown de l'ennemi à une valeur appropriée (par exemple, 60 frames pour un cooldown d'une seconde)
            enemies[i].cooldown = 2000;

            // Vous pouvez ajouter d'autres actions ici en fonction de vos besoins
        }

        // Décrémentez le cooldown de l'ennemi
        if (enemies[i].cooldown > 0) {
            enemies[i].cooldown--;
        }
    
}




        render();
        window.requestAnimationFrame(main);
    }
};




// Draw everything
var render = function () {
    if (bgReady) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Ajustez la position de l'arrière-plan (bg) en fonction de la position du joueur
        ctx.drawImage(bgImage, -viewX, -viewY);
    }

    if (playerReady) {
        ctx.drawImage(playerImage, (canvas.width - player.width) / 2, (canvas.height - player.height) / 2, player.width, player.height);
    }

if (enemyReady) {
    for (var i in enemies) {
        ctx.drawImage(enemyImage, enemies[i].x - viewX, enemies[i].y - viewY);
    }
}

    if (obstacles.length > 0) {
        ctx.fillStyle = "rgb(100, 100, 100)"; // Gris foncé
        for (var i in obstacles) {
            ctx.fillRect(obstacles[i].x - viewX, obstacles[i].y - viewY, obstacles[i].width, obstacles[i].height);
        }
    }

    ctx.fillStyle = "rgb(0, 0,0)";
    ctx.fillText("Enemies left: " + enemies.length, 32, 32);
     ctx.fillText("Lives: " + player.lives, canvas.width - 100, 32);
};


var checkCollision = function (obj1, obj2) {
    if (obj1.x < (obj2.x + obj2.width) &&
        (obj1.x + obj1.width) > obj2.x &&
        obj1.y < (obj2.y + obj2.height) &&
        (obj1.y + obj1.height) > obj2.y
    ) {
        return true;
    }
};

var checkWin = function () {
    if (enemies.length > 0) {
        return false;
    } else {
        return true;
    }
};

var obstacles = [
    { width: 64, height: 64, x: 100, y: 100 }, // Premier obstacle
    { width: 64, height: 64, x: 200, y: 200 }, // Deuxième obstacle
    // Ajoutez plus d'obstacles selon vos besoins
];


init();
window.requestAnimationFrame(main);



