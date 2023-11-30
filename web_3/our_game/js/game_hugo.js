// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
document.querySelector("#gameBox").appendChild(canvas);

//Load sprites
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

var score = 0;

// Player image
var playerReady = false;
var playerImage = new Image(); 
playerImage.src = "images/player.png"; 
playerImage.onload = function () {
	playerReady = true; 
};


var ZombieReady = false;
var ZombieImage = new Image();
ZombieImage.src = "images/Zombie.png";
ZombieImage.onload = function () {
    ZombieReady = true;
};

var GiantReady = false;
var GiantImage = new Image();
GiantImage.src = "images/giant.png";  // Assurez-vous d'avoir le bon chemin d'accès à votre image
GiantImage.onload = function () {
    GiantReady = true;
};

var Giants = [
    { width: 64, height: 64, cooldown: 0, health: 2 },
    { width: 64, height: 64, cooldown: 0, health: 2 },
    { width: 64, height: 64, cooldown: 0, health: 2 }
];


// Tree image
var TreeReady = false;
var TreeImage = new Image(); 
TreeImage.src = "images/tree.png"; 
TreeImage.onload = function () {
	TreeReady = true; 
};


// Create global game objects 
var player = {
	width: 64,
	height: 64,
	lives: 5,
};

var Zombies = [
    { width: 32, height: 32, cooldown: 0 },
    { width: 32, height: 32, cooldown: 0 },
    { width: 32, height: 32, cooldown: 0 }
];

//enemy speed
var enemySpeed = 1;

var Trees = [ // this is an array
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 }
];

//Canvas centre
let cX = canvas.width / 2;
let cY = canvas.height / 2;


// Bullet image
var bulletReady = false;
var bulletImage = new Image();
bulletImage.src = "images/bullet.png";
bulletImage.onload = function () {
    bulletReady = true;
};



var bullet = {
	width: 32,
	height: 32,
    x: cX, // Initial position (center of canvas)
    y: cY,
    speed: 5, // Bullet speed
    visible: false, // Bullet starts invisible
    distanceTraveled: 0, // Track the distance traveled
	rotation: 0
};


var elapsedTime = 0;

var elapsedTimeInSeconds = 0;




//Background is an object, 
//we'll use it to frame the game, let's call it stage
//we start at the top left corner: 0,0
var stage = {
	x: 0,
	y: 0,
	width: 2500,
	height: 2000
};


//Speed is not player property, it is global
var speed = 3;

// Velocity variables
var vX = 0;
var vY = 0;

// Utilisez un objet pour suivre l'état des touches
var keysPressed = {};

// Handle keyboard controls
addEventListener("keydown", function (e) {
    // Enregistrez la touche actuellement enfoncée dans l'objet keysPressed
    keysPressed[e.key] = true;

    // Mettez à jour la direction en fonction des touches enfoncées
    updateDirection();
}, false);

addEventListener("keyup", function (e) {
    // Supprimez la touche relâchée de l'objet keysPressed
    delete keysPressed[e.key];

    // Mettez à jour la direction en fonction des touches enfoncées
    updateDirection();
});

// Fonction pour mettre à jour la direction en fonction des touches enfoncées
function updateDirection() {
    // Réinitialisez la direction
    vX = 0;
    vY = 0;

    // Vérifiez les touches enfoncées et ajoutez les vecteurs de déplacement en conséquence
for (var i in Trees) {
        if (!checkCollision(player, Trees[i])) {
			if (keysPressed["z"]) {
				vY -= speed;
			}
			if (keysPressed["s"]) {
				vY += speed;
			}
			if (keysPressed["q"]) {
				vX -= speed;
			}
			if (keysPressed["d"]) {
				vX += speed;
			}
	}
}

    // Normalisez le vecteur de déplacement pour maintenir la même vitesse en diagonale
    var length = Math.sqrt(vX * vX + vY * vY);
    if (length !== 0) {
        vX /= length;
        vY /= length;
    }

    // Multipliez par la vitesse pour obtenir le vecteur final
    vX *= speed;
    vY *= speed;
}


var bulletCooldown = 1500; // 1,5 secondes en millisecondes
var lastBulletTime = 0;

// Handle mouse click
canvas.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // Left mouse button
        var currentTime = new Date().getTime();

        // Vérifiez le cooldown du tir
        if (currentTime - lastBulletTime > bulletCooldown) {
            // Set bullet position to the center
            bullet.x = cX;
            bullet.y = cY;

            // Set bullet visibility to true
            bullet.visible = true;

            // Calculate the direction vector
            var directionX = event.clientX - cX;
            var directionY = event.clientY - cY;

            // Normalize the direction vector
            var length = Math.sqrt(directionX * directionX + directionY * directionY);
            directionX /= length;
            directionY /= length;

            // Update bullet velocity based on direction
            bullet.vX = directionX * bullet.speed;
            bullet.vY = directionY * bullet.speed;

            // Update bullet rotation based on direction
            bullet.rotation = Math.atan2(directionY, directionX);

            // Reset distance traveled
            bullet.distanceTraveled = 0;

            // Mettez à jour le temps du dernier tir
            lastBulletTime = currentTime;
        }
    }
});



var moveGiantsTowardsPlayer = function () {
    for (var i in Giants) {
        // Calculer la direction vers le joueur
        var directionX = player.x - Giants[i].x;
        var directionY = player.y - Giants[i].y;

        // Normaliser la direction (la ramener à une longueur de 1)
        var length = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= length;
        directionY /= length;

        // Déplacer le géant dans la direction du joueur avec une vitesse constante
        Giants[i].x += directionX * (enemySpeed / 2);  // Moitié de la vitesse des zombies
        Giants[i].y += directionY * (enemySpeed / 2);
    }
};


var moveZombiesTowardsPlayer = function () {
    for (var i in Zombies) {
        // Calculate direction towards the player
        var directionX = player.x - Zombies[i].x;
        var directionY = player.y - Zombies[i].y;

        // Normalize the direction
        var length = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= length;
        directionY /= length;

        // Move the zombie towards the player with a constant speed
        Zombies[i].x += directionX * enemySpeed;
        Zombies[i].y += directionY * enemySpeed;
    }
};



var waveDelay = 5000; // Délai initial entre les vagues en millisecondes

var startNewWave = function () {
    console.log("Starting new wave...");

    // Ajoutez un nouvel ennemi
    Zombies.push({
        width: 32,
        height: 32,
        cooldown: 0,
        x: Math.random() * (stage.width - 32),
        y: Math.random() * (stage.height - 32)
    });

    Giants.push({
        width: 64,
        height: 64,
        cooldown: 0,
        health: 2,
        x: Math.random() * (stage.width - 64),
        y: Math.random() * (stage.height - 64)
    });

    // Augmentez le délai avant de lancer la prochaine vague (ajustez le délai selon vos préférences)
    var nextWaveDelay = 10000;  // Délai initial avant la prochaine vague (5 secondes)
    setTimeout(startNewWave, nextWaveDelay);

    // Augmentez le délai pour la prochaine vague
    nextWaveDelay -= 100;  // Augmentation du délai par exemple de 2 secondes
};

// Ajoutez ces variables pour la barre de progression
var progressBarWidth = 200;
var progressBarHeight = 20;
var progressBarX = 32;
var progressBarY = 96;
var progressBarColor = "green";
var progressBarBgColor = "gray";










//Set initial state
var init = function () {
	//Put the player in the centre
	player.x = cX - (player.width / 2); 
	player.y = cY - (player.height / 2);
	//Place Enemies at random locations within the STAGE, not the canvas
	for (var i in Zombies) {
		Zombies[i].x = (Math.random() * 
			(stage.width - Zombies[i].width));
		Zombies[i].y = (Math.random() * 
			(stage.height - Zombies[i].height));
	}

    	for (var i in Giants) {
		Giants[i].x = (Math.random() * 
			(stage.width - Giants[i].width));
		Giants[i].y = (Math.random() * 
			(stage.height - Giants[i].height));
	}

    //Place Trees at random locations within the STAGE, not the canvas
    for (var i in Trees) {
        Trees[i].x = (Math.random() *
            (stage.width - Trees[i].width));
        Trees[i].y = (Math.random() *
            (stage.height - Trees[i].height));
    }
	startNewWave();


};


// The main game loop
var main = function () {
	elapsedTime += 16;

	    if (player.lives <= 0) {
        // Arrêtez le jeu car la vie du joueur est à zéro
        console.log("Game over!");
		 
		 alert("Bien joué ! Votre score est de " + (score) + " Points");
        return;
    }

	else{

        for (var i in Trees) {

            //move Trees with stage
            Trees[i].x -= vX;
            Trees[i].y -= vY;

            if (checkCollision(player,Trees[i])) {
                vX = 0;
                vY = 0;
            }
        }
		
		

    // Move bullet if visible
    if (bullet.visible) {
        bullet.x += bullet.vX;
        bullet.y += bullet.vY;
        bullet.distanceTraveled += bullet.speed;

        // Check if the bullet has traveled 300px
        if (bullet.distanceTraveled >= 300) {
            // Reset bullet visibility
            bullet.visible = false;
        }
    }
	
		//check collisions
// Update references to enemies with zombies in the collision check loop
for (var i = Zombies.length - 1; i >= 0; i--) {
    // Check if the zombie is defined and has a cooldown property
    if (Zombies[i] && typeof Zombies[i].cooldown !== 'undefined') {
        // Move zombies with stage
        Zombies[i].x -= vX;
        Zombies[i].y -= vY;

        if (bullet.visible) {
            if (checkCollision(bullet, Zombies[i])) {
                Zombies.splice(i, 1);
                bullet.visible = false;
                score += 1;
                continue; // Skip the rest of the loop for this iteration
            }
        }

        // Check if the zombie has a cooldown property
        if (Zombies[i].cooldown === 0 && checkCollision(player, Zombies[i])) {
            // Handle collision with a zombie here
            player.lives--;

            // Set the cooldown of the zombie to an appropriate value (e.g., 60 frames for a one-second cooldown)
            Zombies[i].cooldown = 2000;

            // You can add other actions here based on your needs
        }

        if (Zombies[i].cooldown > 0) {
            Zombies[i].cooldown--;
        }
    } else {
        // Log an error or take appropriate action if Zombies[i] is undefined or lacks the cooldown property
        console.error("Invalid zombie or missing cooldown property:", Zombies[i]);
    }
};


for (var i = Giants.length - 1; i >= 0; i--) {
    // Check if the zombie is defined and has a cooldown property
    if (Giants[i] && typeof Giants[i].cooldown !== 'undefined') {
        // Move Giants with stage
        Giants[i].x -= vX;
        Giants[i].y -= vY;

        if (bullet.visible) {
        if (checkCollision(bullet, Giants[i])) {
            Giants[i].health--;  // Réduire la santé du géant
            if (Giants[i].health <= 0) {
                Giants.splice(i, 1);
                score += 5;  // Supprimer le géant s'il n'a plus de santé
            }
            bullet.visible = false;
            continue;
        }
    }

        // Check if the zombie has a cooldown property
        if (Giants[i].cooldown === 0 && checkCollision(player, Giants[i])) {
            // Handle collision with a zombie here
            player.lives--;

            // Set the cooldown of the zombie to an appropriate value (e.g., 60 frames for a one-second cooldown)
            Giants[i].cooldown = 4000;

            // You can add other actions here based on your needs
        }

        if (Giants[i].cooldown > 0) {
            Giants[i].cooldown--;
        }
    } else {
        // Log an error or take appropriate action if Zombies[i] is undefined or lacks the cooldown property
        console.error("Invalid zombie or missing cooldown property:", Zombies[i]);
    }
};

//move stage
		console.log("stage.x: "+stage.x);
		if (stage.x < cX - player.width/2 && stage.x > cX-stage.width + player.width/2) {
			stage.x -= vX;
		}
		else {
			stage.x += vX*6;
			vX = 0;
			for (var i in Trees) {
                Trees[i].x -= vX*6;
                Trees[i].y -= 0;
				console.log("Trees[i].y: "+Trees[i].y);
            }
		}
		if (stage.y < cY - player.height/2 && stage.y > cY-stage.height + player.height/2) {
			stage.y -= vY;
		}
		else {
			stage.y += vY*6;
			vY = 0;
			for (var i in Trees) {
                Trees[i].x += vY*6;
                Trees[i].y -= 0;
            }
			
		}

        // Bouger les ennemis vers le joueur
        moveZombiesTowardsPlayer();
        moveGiantsTowardsPlayer();
		render();
		window.requestAnimationFrame(main);
	};
}

 elapsedTimeInSeconds = Math.floor(elapsedTime / 1000);

var newWaveStarted = false;  

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.fillStyle = "blue";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(bgImage, stage.x, stage.y);
	}
	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}
if (ZombieReady) {
    for (var i in Zombies) {
        ctx.drawImage(ZombieImage, Zombies[i].x, Zombies[i].y);
    }
}
if (GiantReady) {
    for (var i in Giants) {
        ctx.drawImage(GiantImage, Giants[i].x, Giants[i].y);
    }
}

    if (TreeReady) {
        for (var i in Trees) {
            ctx.drawImage(TreeImage, Trees[i].x, Trees[i].y);
        }
    }
    if (bulletReady && bullet.visible) {
        ctx.drawImage(bulletImage, bullet.x, bullet.y);
    }


// Calculer la progression de la balle
    var currentTime = new Date().getTime();
    var timeSinceLastBullet = currentTime - lastBulletTime;
    var progress = Math.min(1, timeSinceLastBullet / bulletCooldown);

    // Dessiner la barre de progression
    // Dessiner d'abord le rectangle de fond
    ctx.fillStyle = progressBarBgColor;
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    // Puis dessiner la barre de progression
    ctx.fillStyle = progressBarColor;
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);


	//Label
	 ctx.font = "24px Arial"
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillText("Enemies left: "+Zombies.length, 32, 32);
	 ctx.fillText("Lives: " + player.lives, 32, 64);
	 ctx.fillText("Score: " + score, 32, 96);

};

//Generic function to check for collisions 
var checkCollision = function (obj1,obj2) {
	if (obj1.x < (obj2.x + obj2.width) && 
		(obj1.x + obj1.width) > obj2.x && 
		obj1.y < (obj2.y + obj2.height) && 
		(obj1.y + obj1.height) > obj2.y
		) {
			return true;
	}
};

//Check if we have won
var checkWin = function () {
return Enemies.length === 0;
};

//Start the gameplay
init();
window.requestAnimationFrame(main);