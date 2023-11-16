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

// Create global game objects 
var player = {
	width: 32,
	height: 32
};

var Enemies = [ // this is an array
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 }
];

//Canvas centre
let cX = canvas.width / 2;
let cY = canvas.height / 2;

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

// Handle keyboard controls
addEventListener("keydown", function (e) {
	//Keystrokes
	if (e.key == "z") { // UP
		vX = 0;
		vY = -speed;
	}
	if (e.key == "s") { // DOWN
		vX = 0;
		vY = speed;
	}
	if (e.key == "q") { // LEFT
		vX = -speed;
		vY = 0;
	}
	if (e.key == "d") { // RIGHT
		vX = speed;
		vY = 0;
	}

}, false);

addEventListener("keyup", function (e) {
	vX = 0;
	vY = 0;
});


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
		if (stage.x < cX - player.width/2 && stage.x > cX-stage.width + player.width/2) {
			stage.x -= vX;
		}
		else {
			stage.x += vX;
			vX = -vX;
			
		}
		if (stage.y < cY - player.height/2 && stage.y > cY-stage.height + player.height/2) {
			stage.y -= vY;
		}
		else {
			stage.y += vY;
			vY = -vY;
		}

		//check collisions
		for (var i in Enemies) {
		
			//move Enemies with stage
			Enemies[i].x -= vX;
			Enemies[i].y -= vY;
		
			if (checkCollision(player,Enemies[i])) {
				Enemies.splice(i,1);
			}
		}
		render();
		window.requestAnimationFrame(main);
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.fillStyle = "magenta";
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
	if (Enemies.length > 0) { 
		return false;
	} else { 
		return true;
	}
};

//Start the gameplay
init();
window.requestAnimationFrame(main);
