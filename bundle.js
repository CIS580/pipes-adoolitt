(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe.js');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
var startPipe = new Pipe({x: 5, y: 79}, 'assets/endingPipe.png', 0, 4, 2);
var endingPipe = new Pipe({x: canvas.width - 62, y: 79}, 'assets/endingPipe.png', 0, 4, 2);
var currentPipe = new Pipe({x: 5, y: 5}, 'assets/startPipe.png', 1, 4, 2);

var laidPipe = [];
currentPipe.startPipe = true;
startPipe.canRotate = false;
endingPipe.canRotate = false;
var notFound = true;
var win = true;
var validMove;
var gameOver = false;
var level = 1;
var score = 0;
var selection = 0;
var rotatedPipeX;
var rotatedPipeY;

var fluid =
{
	x: 6,
	y: 80,
	speed: 1/50,
  direction: 2,
  fillPercentage: 0,
  startingFlow: 4
}

var backgroundMusic = new Audio('assets/background_music.mp3');
var winning = new Audio('assets/winning.wav');
var turningPipe = new Audio('assets/turningPipe.wav');
var placingPipeDown = new Audio('assets/placingPipeDown.wav');
var losing = new Audio('assets/losing.wav');
image.src = 'assets/pipes.png';
backgroundMusic.play();

var currentIndex, currentX, currentY;

canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
  switch(event.which){
  		case 1:
        currentX = event.offsetX;
        currentY = event.offsetY;
        var x = Math.floor((currentX + 3) / 74);
        var y = Math.floor((currentY + 3) / 74);
        validMove = true;
        var tempX = x * 74 + 6;
        var tempY = y * 74 + 6;
        laidPipe.forEach(function(laidPipe){
          if(tempX == laidPipe.x && tempY == laidPipe.y || tempX == 6 && tempY == 80 || tempX == 968 && tempY == 80 )
          {
            validMove = false;
          }
        });

        if(validMove)
        {
          //console.log(currentPipe.startDirection);
          //console.log(currentPipe.endDirection);
          backgroundMusic.pause();
          placingPipeDown.play();
          currentPipe.x = tempX;
          currentPipe.y = tempY;
          laidPipe.push(new Pipe({
            x: currentPipe.x,
            y: currentPipe.y,
          }, currentPipe.spritesheet.src, currentPipe.maxFrame, currentPipe.startDirection,currentPipe.endDirection));

					var selection = 1;
          //var selection = Math.floor(Math.random() * 10 + 1);
          if(selection <= 4)
          {
            currentPipe = new Pipe({x: 5, y: 5}, 'assets/startPipe.png', 1, 4, 2);
            currentPipe.startPipe = true;
          }
          else if(selection <= 10)
          {
            currentPipe = new Pipe({x: 5, y: 5}, 'assets/CurvedPipe.png', 3, 3, 2);
            currentPipe.CurvedPipe = true;
          }
          else
          {
            currentPipe = new Pipe({x: 5, y: 5}, 'assets/fourWayPipe.png', 0, 0, 0);
            currentPipe.fourWayPipe = true;
          }
        }
    		break;
  		default : console.log('aqui');
    }
  }


canvas.oncontextmenu = function(event)
{
  event.preventDefault();
  //console.log("Right mouse click.")

  //find the pipe selected
  currentX = event.offsetX;
  currentY = event.offsetY;
  var x = Math.floor((currentX + 3) / 74);
  var y = Math.floor((currentY + 3) / 74);
  rotatedPipeX = x * 74 + 6;
  rotatedPipeY = y * 74 + 6;

  //search through the pipes to find it in the array
  laidPipe.forEach(function(laidPipe){
    if(laidPipe.x == rotatedPipeX && rotatedPipeY == laidPipe.y && laidPipe.canRotate)
    {
      if(laidPipe.frame == laidPipe.maxFrame)
      {
        backgroundMusic.pause();
        turningPipe.play();
        laidPipe.frame = 0;
        if(laidPipe.startPipe)
        {
          laidPipe.startDirection = 4;
          laidPipe.endDirection = 2;
        }
        else
        {
          laidPipe.startDirection = 3;
          laidPipe.endDirection = 2;
        }
      }
      else
      {
        backgroundMusic.pause();
        turningPipe.play();
        laidPipe.frame++;
        if(laidPipe.startPipe)
        {
          laidPipe.startDirection = 1;
          laidPipe.endDirection = 3;
        }
        else
        {
          if(laidPipe.frame == 1)
          {
            laidPipe.startDirection = 4;
            laidPipe.endDirection = 3;
          }
          else if (laidPipe.frame == 2)
          {
            laidPipe.startDirection = 1;
            laidPipe.endDirection = 2;
          }
          else
          {
            laidPipe.startDirection = 4;
            laidPipe.endDirection = 1;
          }
        }
      }
    }
    //console.log(laidPipe.startDirection);
    //console.log(laidPipe.endDirection);
  })
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
  if(placingPipeDown.ended && backgroundMusic.paused)
  {
    //console.log("Got in the if statement.");
    backgroundMusic.play();
  }

    fluid.fillPercentage += fluid.speed * elapsedTime;
    if(fluid.fillPercentage >= 64 && !startPipe.fullOfWater && win)
    {
			win = false;
      fluid.x = 80;
      fluid.y = 80;
      startPipe.fullOfWater = true;
      fluid.fillPercentage = 0;
      //console.log(laidPipe);
      if(laidPipe.length == 0)
      {
        gameOver = true;
      }
      laidPipe.forEach(function(pipe)
      {
        //console.log("In the list of pipes.")
          if(pipe.x == fluid.x && pipe.y == fluid.y && pipe.startDirection == 4)
          {
            fluid.direction = pipe.endDirection;
            fluid.startingFlow = pipe.startDirection;
            console.log(fluid.direction);
            console.log(pipe.endDirection);
            pipe.canRotate = false;
            notFound = false;
          }
      });
			if(notFound)
			{
				gameOver = true;
			}
    }
    if(fluid.fillPercentage >= 64 && startPipe.fullOfWater && !win)
    {
			console.log(startPipe.fullOfWater);
      laidPipe.forEach(function(pipe)
      {
        if(fluid.x == pipe.x && fluid.y == pipe.y)
        {
          pipe.fullOfWater = true;
        }
      });
      if(fluid.direction == 1)
      {
        fluid.y -= 74;
      }
      else if(fluid.direction == 2)
      {
        fluid.x += 74
      }
      else if(fluid.direction == 3)
      {
        fluid.y += 74
      }
      else
      {
        fluid.x -= 74;
      }
      //console.log(fluid.direction);
			notFound = true;
      laidPipe.forEach(function(pipe)
      {
          if(fluid.x == pipe.x && fluid.y == pipe.y)
          {
            console.log("Found pipe");
            if(fluid.direction == 2 && pipe.startDirection == 4)
            {
              console.log("Entered in first if");
              fluid.direction = pipe.endDirection;
              fluid.startingFlow = pipe.startDirection;
              pipe.canRotate = false;
              fluid.fillPercentage = 0;
              gameOver = false;
							notFound = false;
            }
            else if (fluid.direction == 1 && pipe.endDirection == 3 && pipe.startPipe)
            {
              console.log("Entered in second if");
              fluid.direction = pipe.startDirection;
              fluid.startingFlow = pipe.startDirection;
              pipe.canRotate = false
              fluid.fillPercentage = 0;
              gameOver = false;
							notFound = false;
            }
            else if (fluid.direction == 3 && pipe.startDirection == 1)
            {
              console.log("enterd in third if");
              fluid.startingFlow = pipe.startDirection;
              fluid.direction = pipe.endDirection;
              pipe.canRotate = false;
              gameOver = false;
							notFound = false;
              fluid.fillPercentage = 0;
            }
            else if(fluid.direction == 4 && pipe.startDirection == 2)
            {
              console.log("entered in forth if");
                fluid.direction = pipe.endDirection;
                fluid.startingFlow = pipe.startDirection;
                pipe.canRotate = false;
                fluid.fillPercentage = 0;
                gameOver = false;
								notFound = false;
            }
            else if(fluid.direction == 1 && pipe.startDirection == 3)
            {
              fluid.direction = pipe.endDirection;
              fluid.startingFlow = pipe.startDirection;
              pipe.canRotate = false;
              fluid.fillPercentage = 0;
              gameOver = false;
							notFound = false;
            }
            else
            {

            }
          }
					if(fluid.x >= 968 && fluid.y == 80)
					{
						notFound = false;
					}
      });
			if(notFound)
			{
				gameOver = true;
			}
    }
    if(gameOver)
    {
      losing.play();
      fluid.fillPercentage = 0;
      validMove = false;
    }
    if(fluid.x >= 968 && fluid.y == 80 )
    {
      winning.play();
      score += 100;
      level++;
      laidPipe = [];
      fluid.direction = 2;
			fluid.startingFlow = 4;
			startPipe.fullOfWater = false;
      fluid.speed += 1/5000;
			fluid.fillPercentage = 0;
			notFound = false;
			console.log(startPipe.fullOfWater);
			fluid.x = 6;
      fluid.y = 80;
			win = true;
    }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // TODO: Render the board
  for(var y = 0; y < 11; y++) {
   for(var x = 0; x < 15; x++) {
       // draw the back of the card (212x212px)
       ctx.fillStyle = "white";
       ctx.fillRect(x * 74 + 3, y * 74 + 3, 69, 69);
     }
   }

   ctx.fillStyle = "blue";
   if(fluid.startingFlow == 1)
   {
     //console.log("In fluid direction 1");
     ctx.fillRect(fluid.x, fluid.y, 64, fluid.fillPercentage);
   }
   else if(fluid.startingFlow == 4)
   {
     //console.log("In fluid direction 2");
     ctx.fillRect(fluid.x, fluid.y, fluid.fillPercentage, 64);
   }
   else if(fluid.startingFlow == 2)
   {
    // console.log("In fluid direction 4");
     ctx.fillRect(fluid.x + 64, fluid.y, (- fluid.fillPercentage), 64);
   }
   else
   {
     //console.log("In fluid direction 3");
     ctx.fillRect(fluid.x, (fluid.y + 64), 64, ( -fluid.fillPercentage ));
   }

   if(startPipe.fullOfWater)
   {
     ctx.fillRect(startPipe.x, startPipe.y, startPipe.width, startPipe.height);
   }
   startPipe.render(elapsedTime, ctx);
   endingPipe.render(elapsedTime, ctx);
   currentPipe.render(elapsedTime, ctx);
   laidPipe.forEach(function(pipe)
   {
     if(pipe.fullOfWater)
     {
       ctx.fillRect(pipe.x,pipe.y, pipe.width, pipe.height);
     }
     pipe.render(elapsedTime, ctx);
   });
   ctx.fillStyle = "black";
   ctx.fillText("Score:" + score, canvas.width - 80, 10);
   ctx.fillText("Level:" + level, 10, 10);
	 if(gameOver)
	 {
	 	ctx.fillText("Game over!", canvas.width / 2, canvas.height / 2);
	}

}

},{"./game":2,"./pipe.js":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Pipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Pipe(position, image, totalframes, startDirection, endDirection) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI(image);
  this.timer = 0;
  this.frame = 0;
  this.canRotate = true;
  this.CurvedPipe = false;
  this.startPipe = false;
  this.fourWayPipe = false;
  this.maxFrame = totalframes;
  this.startDirection = startDirection;
  this.endDirection = endDirection;
  this.fullOfWater = false;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pipe.prototype.update = function(time) {

}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Pipe.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
  }

},{}]},{},[1]);
