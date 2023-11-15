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

// Variables pour suivre la position de la souris
var mouseX = 0;
var mouseY = 0;

addEventListener("mousemove", function (e) {
    mouseX = e.clientX - canvas.getBoundingClientRect().left;
    mouseY = e.clientY - canvas.getBoundingClientRect().top;
});
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

// Bullet image
var bulletReady = false;
var bulletImage = new Image();
bulletImage.src = "images/weapon.png"; // Remplacez "images/bullet.png" par le chemin de votre image de balle
bulletImage.onload = function () {
    bulletReady = true;
};

bulletImage.onerror = function () {
    console.error("Erreur de chargement de l'image de la balle.");
};
bulletImage.onload = function () {
    bulletReady = true;
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
    width: 64,
    height: 64,
    x: (canvas.width - 64) / 2,
    y: (canvas.height - 64) / 2,
    lives: 5
};

var bullet = {
    speed: 30, // vitesse de la balle en pixels par tick
    width: 32,
    height: 32,
    x: 0,
    y: 0,
    visible: false // la balle n'est pas visible au début
};



// Create enemies
var enemies = [
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)), enemySpeed: 0.2, cooldown: 0 },
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)), enemySpeed: 0.8, cooldown: 0 },
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)), enemySpeed: 0.5, cooldown: 0 }
];

var gameOver = function () {
    alert("Game Over!");
    location.reload(); // Rechargez la page pour recommencer le jeu
};


// View variables
var viewX = 0;
var viewY = 0;

// Handle keyboard controls
addEventListener("keydown", function (e) {
    // Keystrokes
    switch (e.key) {
        case "z":
            player.y -= player.speed;
            break;
        case "s":
            player.y += player.speed;
            break;
        case "q":
            player.x -= player.speed;
            break;
        case "d":
            player.x += player.speed;
            break;
    }
}, false);









// Modifiez le code de tir de la balle
addEventListener("keydown", function (e) {
    // Keystrokes
    switch (e.key) {
        case " ": // Barre d'espace pour tirer
            if (!bullet.visible) {
                // Si la balle n'est pas déjà visible, la positionner sur le joueur et la rendre visible
                bullet.x = player.x + (player.width - bullet.width) / 2;
                bullet.y = player.y + (player.height - bullet.height) / 2;

                // Calculez la direction de la souris par rapport au joueur
                var angle = Math.atan2(mouseY - bullet.y, mouseX - bullet.x);

                // Normalisez la direction pour une précision accrue
                var normalizedX = Math.cos(angle);
                var normalizedY = Math.sin(angle);

                // Définissez la vitesse de la balle en fonction de la direction de la souris
                bullet.speedX = normalizedX * bullet.speed;
                bullet.speedY = normalizedY * bullet.speed;

                bullet.visible = true;
            }
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




var updateBullet = function () {
    if (bullet.visible) {
        // Mettez à jour la position de la balle en fonction de sa vitesse
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;

        // Vérifiez les collisions de la balle avec les ennemis
        for (var i in enemies) {
            if (checkCollision(bullet, enemies[i])) {
                // Gérez la collision avec un ennemi ici
                // Par exemple, supprimez l'ennemi ou réduisez sa vie
                enemies.splice(i, 1);
                bullet.visible = false; // Cachez la balle après la collision
                // Vous pouvez ajouter d'autres actions ici en fonction de vos besoins
            }
        }

        // Cacher la balle si elle sort de l'écran ou a parcouru une certaine distance
        var maxDistance = 500; // Changez la distance maximale selon vos besoins
        if (bullet.x > canvas.width || bullet.y > canvas.height || bullet.x < 0 || bullet.y < 0 || distance(player, bullet) > maxDistance) {
            bullet.visible = false;
        }
    }
};


var distance = function (obj1, obj2) {
    var dx = obj1.x - obj2.x;
    var dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
};


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
        // Vérifiez la collision entre les ennemis et les obstacles
        for (var j in obstacles) {
            if (checkCollision(enemies[i], obstacles[j])) {
                // Si une collision est détectée, ajustez la position de l'ennemi en conséquence
                // Par exemple, si l'ennemi touche un obstacle, réduisez sa vitesse à 0
                enemies[i].enemySpeed = 0;
            }
        }

        if (enemies[i].enemySpeed !== 0) {
            var angle = Math.atan2(player.y - enemies[i].y, player.x - enemies[i].x);
            enemies[i].x += Math.cos(angle) * enemies[i].enemySpeed;
            enemies[i].y += Math.sin(angle) * enemies[i].enemySpeed;
        }
        
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


if (player.lives <= 0) {
        // Mettez en œuvre les actions de "Game Over" ici
        // Par exemple, réinitialisez le jeu ou affichez un écran de fin de partie.
        gameOver()// Réinitialiser le jeu
    }

    updateBullet();



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
    if (bulletReady && bullet.visible) {
        ctx.drawImage(bulletImage, bullet.x - viewX, bullet.y - viewY, bullet.width, bullet.height);
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
    { width: 64, height: 256, x: 100, y: 100 }, // Premier obstacle
    { width: 64, height: 64, x: 200, y: 200 },
    { width: 64, height: 64, x: 200, y: 600 }, // Deuxième obstacle
    
];


init();
window.requestAnimationFrame(main);



