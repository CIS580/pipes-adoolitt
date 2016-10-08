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
	speed: 1/500,
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
          console.log(currentPipe.startDirection);
          console.log(currentPipe.endDirection);
          backgroundMusic.pause();
          placingPipeDown.play();
          currentPipe.x = tempX;
          currentPipe.y = tempY;
          laidPipe.push(new Pipe({
            x: currentPipe.x,
            y: currentPipe.y,
          }, currentPipe.spritesheet.src, currentPipe.maxFrame, currentPipe.startDirection,currentPipe.endDirection));


          var selection = Math.floor(Math.random() * 10 + 1);
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
  console.log("Right mouse click.")

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
    console.log(laidPipe.startDirection);
    console.log(laidPipe.endDirection);
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
    console.log("Got in the if statement.");
    backgroundMusic.play();
  }

    fluid.fillPercentage += fluid.speed * elapsedTime;
    if(fluid.fillPercentage >= 64 && !startPipe.fullOfWater)
    {
      fluid.x = 80;
      fluid.y = 80;
      startPipe.fullOfWater = true;
      fluid.fillPercentage = 0;
      console.log(laidPipe);
      if(laidPipe.length == 0)
      {
        gameOver = true;
      }
      laidPipe.forEach(function(pipe)
      {
        console.log("In the list of pipes.")
          if(pipe.x == fluid.x && pipe.y == fluid.y && pipe.startDirection == 4)
          {
            fluid.direction = pipe.endDirection;
            fluid.startingFlow = pipe.startDirection;
            console.log(fluid.direction);
            console.log(pipe.endDirection);
            pipe.canRotate = false;
            gameOver = false;
          }
          else
          {
              gameOver = true;
          }
      });
    }
    console.log(gameOver);
    if(fluid.fillPercentage >= 64 && startPipe.fullOfWater)
    {
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
      console.log(fluid.direction);
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
            }
            else if (fluid.direction == 1 && pipe.endDirection == 3 && pipe.startPipe)
            {
              console.log("Entered in second if");
              fluid.direction = pipe.startDirection;
              fluid.startingFlow = pipe.startDirection;
              pipe.canRotate = false
              fluid.fillPercentage = 0;
              gameOver = false;
            }
            else if (fluid.direction == 3 && pipe.startDirection == 1)
            {
              console.log("enterd in third if");
              fluid.startingFlow = pipe.startDirection;
              fluid.direction = pipe.endDirection;
              pipe.canRotate = false;
              gameOver = false;
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
            }
            else if(fluid.direction == 1 && pipe.startDirection == 3)
            {
              fluid.direction = pipe.endDirection;
              fluid.startingFlow = pipe.startDirection;
              pipe.canRotate = false;
              fluid.fillPercentage = 0;
              gameOver = false;
            }
            else
            {

            }
          }
          else
          {
            gameOver = true;
          }
      });
    }
    if(gameOver)
    {
      losing.play();
      fluid.fillPercentage = o;
      validMove = false;
    }
    if(fluid.x >= 968 && fluid.y == 80 )
    {
      console.log("Got into the winning condition");
      winning.play();
      score += 100;
      level++;
      var startOver = [];
      laidPipe = startOver;
      fluid.x = 6;
      fluid.y = 80;
      direction = 2;
      fluid.speed += 5/50;
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

}
