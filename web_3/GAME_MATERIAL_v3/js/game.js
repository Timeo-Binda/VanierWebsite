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

// Goodies image
var goodyReady = false;
var goodyImage = new Image(); 
goodyImage.src = "images/goody.png"; 
goodyImage.onload = function () {
    goodyReady = true; 
};

// Create global game objects 
var player = {
    speed: 5, // movement in pixels per tick 
    width: 32,
    height: 32
};

var goodies = [ // this is an array
    { width: 32, height: 32 }, // one goody
    { width: 32, height: 32 }, // two goodies
    { width: 32, height: 32 }  // three goodies
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
    player.x = (canvas.width - player.width) / 2; 
    player.y = (canvas.height - player.height) / 2;

    //Place goodies at random locations 
    for (var i in goodies) {
        goodies[i].x = (Math.random() * (canvas.width - goodies[i].width));
        goodies[i].y = (Math.random() * (canvas.height - goodies[i].height));
    }
};

// The main game loop
var main = function () {
    if (checkWin()) {
        //WIN display win frame
        if (winReady) {
            ctx.drawImage(winImage, (canvas.width - winImage.width)/2, 
                (canvas.height - winImage.height)/2);
        }
    }
    else {
        //Not yet won, play game
        //move player
        if (player.x > 0 && player.x < canvas.width - player.width) {
            player.x += vX;
        }
        else {
            player.x -= vX;
            vX = -vX; //bounce
        }
        if (player.y > 0 && player.y < canvas.height - player.height) {
            player.y += vY
        }
        else {
            player.y -= vY;
            vY = -vY; //bounce
        }
        //check collisions
        for (var i in goodies) {
            if (checkCollision(player,goodies[i])) {
                goodies.splice(i,1);
            }
        }

        render();
        window.requestAnimationFrame(main);
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.fillStyle = ctx.createPattern(bgImage, 'repeat');
        ctx.fillRect(0,0,canvas.width,canvas.height);
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
    ctx.fillText("Goodies left: "+goodies.length, 32, 32);
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
    if (goodies.length > 0) { 
        return false;
    } else { 
        return true;
    }
};

init();

//Start the gameplay
window.requestAnimationFrame(main);