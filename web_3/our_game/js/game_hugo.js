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
// Player image
var playerReady = false;
var playerImage = new Image(); 
playerImage.src = "images/player.png"; 
playerImage.onload = function () {
	playerReady = true; 
};
// Enemies image
var EnemyReady = false;
var EnemyImage = new Image(); 
EnemyImage.src = "images/Enemy.png"; 
EnemyImage.onload = function () {
	EnemyReady = true; 
};

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
	height: 64
};

var Enemies = [ // this is an array
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 }
];

//enemy speed
var enemySpeed = 1;

var Trees = [ // this is an array
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
    x: cX, // Initial position (center of canvas)
    y: cY,
    speed: 5, // Bullet speed
    visible: false, // Bullet starts invisible
    distanceTraveled: 0 // Track the distance traveled
};




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


// Handle mouse click
canvas.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // Left mouse button
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

        // Reset distance traveled
        bullet.distanceTraveled = 0;
    }
});






var moveEnemiesTowardsPlayer = function () {
    for (var i in Enemies) {
        // Calculer la direction vers le joueur
        var directionX = player.x - Enemies[i].x;
        var directionY = player.y - Enemies[i].y;

        // Normaliser la direction (la ramener à une longueur de 1)
        var length = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= length;
        directionY /= length;

        // Déplacer l'ennemi dans la direction du joueur avec une vitesse constante
        Enemies[i].x += directionX * enemySpeed;
        Enemies[i].y += directionY * enemySpeed;
    }
};





//Set initial state
var init = function () {
	//Put the player in the centre
	player.x = cX - (player.width / 2); 
	player.y = cY - (player.height / 2);
	//Place Enemies at random locations within the STAGE, not the canvas
	for (var i in Enemies) {
		Enemies[i].x = (Math.random() * 
			(stage.width - Enemies[i].width));
		Enemies[i].y = (Math.random() * 
			(stage.height - Enemies[i].height));
	}
    //Place Trees at random locations within the STAGE, not the canvas
    for (var i in Trees) {
        Trees[i].x = (Math.random() *
            (stage.width - Trees[i].width));
        Trees[i].y = (Math.random() *
            (stage.height - Trees[i].height));
    }


};


// The main game loop
var main = function () {
	if (checkWin()) {
		//WIN display win frame
		if (winReady) {
			//ctx.drawImage(winImage, 0, 0);
			ctx.drawImage(winImage, 
				(canvas.width-winImage.width)/2, 
				(canvas.height-winImage.height)/2);
		}
	}
	else {
		//Not yet won, play game
		
		//move stage
		console.log("stage.x: "+stage.x);
		if (stage.x < cX - player.width/2 && stage.x > cX-stage.width + player.width/2) {
			stage.x -= vX;
		}
		else {
			stage.x += vX*6;
			vX = 0;

			
		}
		if (stage.y < cY - player.height/2 && stage.y > cY-stage.height + player.height/2) {
			stage.y -= vY;
		}
		else {
			stage.y += vY*6;
			vY = 0;
		}

        // Bouger les ennemis vers le joueur
        moveEnemiesTowardsPlayer();

		//check collisions
		for (var i in Enemies) {
		
			//move Enemies with stage
			Enemies[i].x -= vX;
			Enemies[i].y -= vY;
		
			if (checkCollision(player,Enemies[i])) {
				Enemies.splice(i,1);
			}
		}

        //check collisions  with Trees
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

		render();
		window.requestAnimationFrame(main);
	}
};

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
	if (EnemyReady) {
		for (var i in Enemies) {
			ctx.drawImage(EnemyImage, Enemies[i].x, Enemies[i].y);
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

	//Label
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillText("Enemies left: "+Enemies.length, 32, 32);
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
	if (Enemies.length > -1) { 
		return false;
	} else { 
		return true;
	}
};

//Start the gameplay
init();
window.requestAnimationFrame(main);