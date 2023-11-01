// Create the canvas
var cvs = document.createElement("canvas");
var ctx = cvs.getContext("2d");
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;
document.querySelector("#gameBox").appendChild(cvs);

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
// Goodies image
var goodyReady = false;
var goodyImage = new Image(); 
goodyImage.src = "images/goody.png"; 
goodyImage.onload = function () {
	goodyReady = true; 
};

// Create global game objects 
var player = {
	speed: 5, // movement in pixels per second 
	width: 32,
	height: 32
};
var goodies = [ // this is an array
	{ width: 32, height: 32 },
	{ width: 32, height: 32 },
	{ width: 32, height: 32 }
];

// Velocity variables
var vX = 0;
var vY = 0;

// Handle keyboard controls
addEventListener("keydown", function (e) {
	//Keystrokes
	if (e.keyCode == 38) { // UP
		vX = 0;
		vY = -player.speed;
	}
	if (e.keyCode == 40) { // DOWN
		vX = 0;
		vY = player.speed;
	}
	if (e.keyCode == 37) { // LEFT
		vX = -player.speed;
		vY = 0;
	}
	if (e.keyCode == 39) { // RIGHT
		vX = player.speed;
		vY = 0;
	}
	if (e.keyCode == 32) { // STOP spacebar
		vX = 0;
		vY = 0;
	}
}, false);

// Handle touch controls
addEventListener("touchstart", function (e) {
	if (e.target.id == "uArrow") { // UP
		vX = 0;
		vY = -player.speed;
	}
	else if (e.target.id == "dArrow") { // DOWN
		vX = 0;
		vY = player.speed;
	}
	else if (e.target.id == "lArrow") { // LEFT
		vX = -player.speed;
		vY = 0;
	}
	else if (e.target.id == "rArrow") { //RIGHT
		vX = player.speed;
		vY = 0;
	}
	else { // STOP This stops if you touch anywhere else
		vX = 0;
		vY = 0;
	}
});

//Set initial state
var init = function () {
	//Put the player in the centre
	player.x = (cvs.width - player.width) / 2; 
	player.y = (cvs.height - player.height) / 2;
	//Place goodies at random locations 
	for (var i in goodies) {
		goodies[i].x = (Math.random() * 
			(cvs.width - goodies[i].width));
		goodies[i].y = (Math.random() * 
			(cvs.height - goodies[i].height));
	}
};


// The main game loop 
var main = function () {
	//move player
	if (player.x > 0 && player.x < cvs.width - player.width) {
		player.x += vX;
	}
	else {
		player.x -= vX;
		vX = -vX; //bounce horizontal
	}
	if (player.y > 0 && player.y < cvs.height - player.height) {
		player.y += vY
	}
	else {
		player.y -= vY;
		vY = -vY; //bounce vertical
	}

	render();
	window.requestAnimationFrame(main); 
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.fillStyle = ctx.createPattern(bgImage, 'repeat');
		ctx.fillRect(0,0,cvs.width,cvs.height);
	}
	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}
	if (goodyReady) {
		for (var i in goodies) {
			ctx.drawImage(goodyImage, goodies[i].x, goodies[i].y);
		}
	}

	//Label
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillText(player.x+" "+player.y, 32, 32);
};

//Start the gameplay
init();
window.requestAnimationFrame(main);







/*This is the control file for state C written by Hugo L. Casanova. You are breaking copyright law if you use this file. I have good lawyers. :-) */