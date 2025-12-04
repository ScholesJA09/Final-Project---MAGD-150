// Variables
let currentState = 0;
let gameTitleX = 175;
let gameMakerX = 400;
let highScoreX = 20;
let rectY = 200;
let enemyspeed = 2;
let spawnRate = 60;
let ammo = 10;
let score = 0;
let highScore = 0;
let projectiles = []; // Store Projectiles
let enemies = []; // Store Enemies

// UI Start Game Button
let testButton = new Button("box", 200, 225);
testButton.width = 200
testButton.height = 50

testButton.cornerSize = 20
testButton.cornerDistance = 0
testButton.shrink = 0

testButton.Pdist = 0
testButton.Pshrink = 0

testButton.col1 = [0,230,180]
testButton.col2 = [0,30,30]

testButton.stroke = [0,230,180]
testButton.strokeWeight = 2
testButton.fill = testButton.col1

testButton.Pfill = testButton.fill
testButton.Pstroke = testButton.stroke

testButton.text = "Start Game"
testButton.textSize = 20
testButton.textColor = testButton.col2
testButton.PtextColor = testButton.col2

testButton.render = function(){
  // animations
  let Ptimer = this.timeSincePressedChange
  let Htimer = min(this.timeSinceHoverChange, Ptimer)

  if(this.hover && !this.pressed){ // when hovered over
    this.cornerDistance = Clerp(this.Pdist, 10, sin(min(Htimer*2,1)*PI/2))
    this.shrink = Clerp(this.Pshrink, 3, Htimer*5)
    this.fill = ClerpColor(this.Pfill, this.col2, Htimer*5)
    this.textColor = ClerpColor(this.PtextColor, this.col1, Htimer*5)
  } else if(this.pressed){ // when clicked
    this.cornerDistance = Clerp(this.Pdist, 15, sin(min(Ptimer*4,1)*PI/2))
    this.shrink = Clerp(this.Pshrink, 5, Ptimer*5)
    this.fill = ClerpColor(this.Pfill, this.col1, Ptimer*5)
    this.textColor = ClerpColor(this.PtextColor, this.col2, Htimer*5)
    // don't set currentState here; we set it onPressEnd for reliability
  } else { // when not hovered or clicked
    this.cornerDistance = Clerp(this.Pdist, 0, sin(min(Htimer*2,1)*PI/2))
    this.shrink = Clerp(this.Pshrink, 0, Htimer*5)
    this.fill = ClerpColor(this.Pfill, this.col1, Htimer*5)
    this.textColor = ClerpColor(this.PtextColor, this.col2, Htimer*5)
  }

  fill(this.fill)
  stroke(this.fill)
  rect(this.x + this.shrink, this.y + this.shrink, this.width - 2*this.shrink, this.height - 2*this.shrink)

  textAlign(CENTER,CENTER)
  noStroke()
  fill(this.textColor)
  textSize(this.textSize)
  text(this.text,this.x + this.shrink, this.y + this.shrink, this.width - 2*this.shrink, this.height - 2*this.shrink)

  let x = this.x
  let y = this.y
  let w = this.width
  let h = this.height
  let d = this.cornerDistance
  let s = this.cornerSize

  stroke(this.stroke)
  strokeWeight(this.strokeWeight)

  // top left corner
  line(x - d, y - d, x - d + s, y - d)
  line(x - d, y - d, x - d, y - d + s)

  // top right corner
  line(x + w + d, y - d, x + w + d - s, y - d)
  line(x + w + d, y - d, x + w + d, y - d + s)

  // bottom left corner
  line(x - d, y + h + d, x - d + s, y + h + d)
  line(x - d, y + h + d, x - d, y + h + d - s)

  // bottom right corner
  line(x + w + d, y + h + d, x + w + d - s, y + h + d)
  line(x + w + d, y + h + d, x + w + d, y + h + d - s)
}

testButton.onHoverBegin = function(){
  this.Pdist = this.cornerDistance
  this.Pshrink = this.shrink
  this.Pfill = this.fill
  this.PtextColor = this.textColor
  cursor(HAND)
}

testButton.onPressBegin = function(){
  this.Pdist = this.cornerDistance
  this.Pshrink = this.shrink
  this.Pfill = this.fill
  this.PtextColor = this.textColor
}

// set game-start on press END (more reliable than inside render)
testButton.onPressEnd = function(){
  this.Pdist = this.cornerDistance
  this.Pshrink = this.shrink
  this.Pfill = this.fill
  this.PtextColor = this.textColor
  currentState = 1;
}

testButton.onHoverEnd = function(){
  this.Pdist = this.cornerDistance
  this.Pshrink = this.shrink
  this.Pfill = this.fill
  this.PtextColor = this.textColor
  cursor()
}

// UI Controls Button
let controlsButton = new Button("controls", 200, 300);
controlsButton.width = 200;
controlsButton.height = 50;
controlsButton.cornerSize = 20;
controlsButton.cornerDistance = 0;
controlsButton.shrink = 0;

controlsButton.Pdist = 0;
controlsButton.Pshrink = 0;

controlsButton.col1 = [0,230,180];
controlsButton.col2 = [0,30,30];

controlsButton.stroke = [0,230,180];
controlsButton.strokeWeight = 2;
controlsButton.fill = controlsButton.col1;

controlsButton.Pfill = controlsButton.fill;
controlsButton.Pstroke = controlsButton.stroke;

controlsButton.text = "Controls";
controlsButton.textSize = 20;
controlsButton.textColor = controlsButton.col2;
controlsButton.PtextColor = controlsButton.col2;

// Use the SAME render logic:
controlsButton.render = testButton.render;
controlsButton.onHoverBegin = testButton.onHoverBegin;
controlsButton.onHoverEnd = testButton.onHoverEnd;
controlsButton.onPressBegin = testButton.onPressBegin;

controlsButton.onPressEnd = function() {
	this.Pdist = this.cornerDistance;
    this.Pshrink = this.shrink;
    this.Pfill = this.fill;
    this.PtextColor = this.textColor;
    currentState = 2;
}

// Other Variables
let col1 = [0,230,180]
let col2 = [0,30,30]
let time = 0

// P5 Setup and Draw
function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(600,400);
}

function startGame() {
  // The Player Rectangle
  noStroke();
  fill("palegreen");
  rect(20, rectY, 20, 20);
}

function gameOver(){
	currentState = 3;
}

function resetGame() {
	currentState = 0; // Return to menu
	 
	// Reset Game Variables
	rectY = 200;
	ammo = 10;
	enemyspeed = 2;
	spawnRate = 60;
	
	// Sets Highscore if beaten and Resets Score to 0
	if (score > highScore)
	{
		highScore = score;
	}
	score = 0;
	
	//Reset UI Button Visibility
	
	testButton.width = 200;
	testButton.height = 50;
	testButton.cornerSize = 20;
	testButton.strokeWeight = 2;
	controlsButton.width = 200;
	controlsButton.height = 50;
	controlsButton.cornerSize = 20;
	controlsButton.strokeWeight = 2;
	
	
	// Move Text back
	
	gameTitleX = 175;
	gameMakerX = 400;
	highScoreX = 20;
}
function draw() 
{
  // Title Screen
  if (currentState == 0) {
    background(0,10,10);

    noStroke();
    fill(255);
    textSize(12);
    textAlign(LEFT,TOP);

    // Title Text
    fill("palegreen");
    textFont("Courier New", 10);
    textSize(40);
    strokeWeight(5);
    text("Pixel Panic", gameTitleX, 70);
	textSize(15);
	text("High Score: " + highScore, highScoreX, 380);
    text("Made by Jacob Scholes", gameMakerX, 380);

    // Rendering Buttons to Title Screen
    testButton.render();
	controlsButton.render();
  }

    // Game Screen
    else if (currentState == 1) {
    background(10);
    // Hiding Buttons and Text Visually
    gameTitleX = 600;
    gameMakerX = 600;
	highScoreX = 600;
    testButton.width = 0;
    testButton.height = 0;
    testButton.cornerSize = 0;
    testButton.strokeWeight = 0;
	controlsButton.width = 0;
    controlsButton.height = 0;
    controlsButton.cornerSize = 0;
    controlsButton.strokeWeight = 0;
	

	//Show HUD Display with ammo and score count
	fill("palegreen");
	textSize(20);
	strokeWeight(2);
	textAlign(LEFT,TOP);
	text("Ammo: " + ammo, 15,10);
	textAlign(RIGHT,TOP);
	text("Score: " + score, 585,10);
	
    // Draw Player
    startGame();
  }

	// Controls Screen 
	else if (currentState == 2){
	background(0);
	fill("palegreen");
	textAlign(CENTER, CENTER);
	textSize(26);
	text("CONTROLS",width/2,40);
	textSize(18);
	text("Move Up:	Up Arrow\nMove Down:	Down Arrow\nShoot: Spacebar\n\n\nPress ESC to return to Main Menu", width/2, 200);
	
	// Hiding Buttons and Text Visually
	testButton.width = 0;
    testButton.height = 0;
    testButton.cornerSize = 0;
    testButton.strokeWeight = 0;
	controlsButton.width = 0;
    controlsButton.height = 0;
    controlsButton.cornerSize = 0;
    controlsButton.strokeWeight = 0;
	}
	
	else if (currentState == 3){
	// Clear Objects
	enemies = [];
	projectiles = [];
	
	//Game Over Text
	background(0);
	fill("red");
	textAlign(CENTER, CENTER);
	textSize(30);
	text("GAME OVER!",width/2,100);
	textSize(20);
	text("Score: " + score + "\n\nPress ESC to return to Main Menu",width/2,240);
	}

  // Movement
  if (keyIsDown(UP_ARROW) && rectY > 0) {
    rectY -= 2;
  }
  if (keyIsDown(DOWN_ARROW) && rectY < 380) {
    rectY += 2;
  }

  // Projectiles
  if (currentState == 1)
  {
	for (let i = projectiles.length - 1; i >= 0; i--) {
		let p = projectiles[i];
		p.x += p.speed;

		// Draw Projectile
		noStroke();
		fill("blue");
		rect(p.x, p.y, 10, 5);

		// Remove if off Screen
		if (p.x > width + 20) {
		projectiles.splice(i, 1);
		}
	}
  }
 enemyspeed += 0.005; // Increase Enemy Speed After Each Spawn
 spawnRate -= 0.1; // Increase Enemy Spawn Rate Over Time
 spawnRate = max(15, spawnRate);
 
  //Enemies
  if (frameCount % floor(spawnRate) === 0 && currentState == 1)
  {
	enemies.push({
		x: width,
		y: random(0, height-20),
		size: 20,
		speed: enemyspeed
	});
  }
  
  for (let i = enemies.length - 1; i>=0; i--)
  {
	  let e = enemies[i];
	  e.x -= e.speed;
	  fill("red");
	  rect(e.x,e.y,e.size,e.size);
	  
	  //Checks if Enemy hits Player
	  if (20 < e.x + e.size && 20 + 20 > e.x && rectY < e.y + e.size && rectY + 20 > e.y)
	  {
		  gameOver();
		  return;
	  }
	  
	  //Checks if Projectile Hits Enemy, If True, Both Disappear and Rewards 500 Points
	  for (let j = projectiles.length - 1; j>=0; j--)
	  {
		  let p = projectiles[j];
		  if (p.x < e.x + e.size && p.x + 10 > e.x && p.y < e.y + e.size && p.y + 5 > e.y)
		  {
			  enemies.splice(i,1);
			  projectiles.splice(j,1);
			  score += 500;
			  break;
		  }
	  }
	  if (e.x + e.size < 0) //Delete Enemies when past Player, Rewards 100 Points
	  {
		enemies.splice(i,1);
		score += 100;
	  }
  }
}

// Key Pressed Functions
function keyPressed()
{
  // Escaping Controls Menu With ESC
  if(currentState === 2 && keyCode === ESCAPE)
	{
		currentState = 0;
		testButton.width = 200;
		testButton.height = 50;
		testButton.cornerSize = 20;
		testButton.strokeWeight = 2;
		controlsButton.width = 200;
		controlsButton.height = 50;
		controlsButton.cornerSize = 20;
		controlsButton.strokeWeight = 2;
		return;
	}

  // Escaping Game Over Screen With ESC and Reseting the Game
  else if(currentState === 3 && keyCode === ESCAPE)
  {
	resetGame();
  }
	
  // Spawning Projectiles
  if (key === ' ' && ammo > 0 && currentState == 1) 
  {
	ammo -= 1;
    let startX = 20 + 20 + 2;
    let startY = rectY + 7;
    projectiles.push({
      x: startX,
      y: startY,
      speed: 6
    });
  }
}