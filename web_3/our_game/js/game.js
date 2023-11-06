// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
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
    height: 32,
    x: (canvas.width - 32) / 2,
    y: (canvas.height - 32) / 2
};

var goodies = [
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)) }, // one goody
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)) }, // two goodies
    { width: 32, height: 32, x: (Math.random() * (canvas.width - 32)), y: (Math.random() * (canvas.height - 32)) }  // three goodies
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
    for (var i in goodies) {
        goodies[i].x = (Math.random() * (canvas.width - goodies[i].width));
        goodies[i].y = (Math.random() * (canvas.height - goodies[i].height));
    }
};




// Facteur de zoom (augmentez cette valeur pour un zoom plus important)
var zoomFactor = 8; // Par exemple, pour un zoom 8 fois plus grand


// The main game loop
var main = function () {
    if (checkWin()) {
        if (winReady) {
            ctx.drawImage(winImage, (canvas.width - winImage.width) / 2,
                (canvas.height - winImage.height) / 2);
        }
    }
    else {
        viewX = player.x - (canvas.width / 2);
        viewY = player.y - (canvas.height / 2);

        for (var i in goodies) {
            if (checkCollision(player, goodies[i])) {
                goodies.splice(i, 1);
            }
        }

        render();
        window.requestAnimationFrame(main);
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the old background
        ctx.drawImage(bgImage, -viewX, -viewY, canvas.width, canvas.height);
    }

    if (playerReady) {
        ctx.drawImage(playerImage, (canvas.width - player.width) / 2, (canvas.height - player.height) / 2, player.width, player.height);
    }

    if (goodyReady) {
        for (var i in goodies) {
            ctx.drawImage(goodyImage, goodies[i].x - viewX, goodies[i].y - viewY);
        }
    }

    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.fillText("Goodies left: " + goodies.length, 32, 32);
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
    if (goodies.length > 0) {
        return false;
    } else {
        return true;
    }
};

init();
window.requestAnimationFrame(main);



