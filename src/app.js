"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe.js');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
var startPipe = new Pipe({x: 5, y: 79}, 'assets/startPipe.png', 0);
var endingPipe = new Pipe({x: canvas.width - 62, y: 79}, 'assets/endingPipe.png', 0);
var currentPipe = new Pipe({x: 5, y: 5}, 'assets/startPipe.png', 0);
var laidPipe = [];
currentPipe.startPipe = true;
var level = 1;
var score = 0;
var selection = 0;
var rotatedPipeX;
var rotatedPipeY;

var startingX;
var startingY;

var backgroundMusic = new Audio('assets/background_music.mp3');
var winning = new Audio('assets/winning.wav');
var turningPipe = new Audio('assets/turningPipe.wav');
var placingPipeDown = new Audio('assets/placingPipeDown.wav');
var losing = new Audio('assets/losing.wav');
image.src = 'assets/pipes.png';
backgroundMusic.play();

var currentIndex, currentX, currentY;

canvas.onclick = function(event) {
  console.log(event.which);
  event.preventDefault();
  // TODO: Place or rotate pipe tile
  switch(event.which){
  		case 1:
        currentX = event.offsetX;
        currentY = event.offsetY;
        var x = Math.floor((currentX + 3) / 74);
        var y = Math.floor((currentY + 3) / 74);
        var validMove = true;
        var tempX = x * 74 + 6;
        var tempY = y * 74 + 6;
        laidPipe.forEach(function(laidPipe){
          if(tempX == laidPipe.x && tempY == laidPipe.y)
          {
            validMove = false;
          }
        });

        if(validMove)
        {
          backgroundMusic.pause();
          placingPipeDown.play();
          currentPipe.x = tempX;
          currentPipe.y = tempY;
          console.log(currentPipe.x);
          console.log(currentPipe.startPipe)
          console.log(currentPipe.CurvedPipe);
          console.log(currentPipe.fourWayPipe);
          laidPipe.push(new Pipe({
            x: currentPipe.x,
            y: currentPipe.y,
          }, currentPipe.spritesheet.src, currentPipe.maxFrame));


          var selection = Math.floor(Math.random() * 10 + 1);
          if(selection <= 4)
          {
            currentPipe = new Pipe({x: 5, y: 5}, 'assets/startPipe.png', 1);
            currentPipe.startPipe = true;
          }
          else if(selection <= 8)
          {
            currentPipe = new Pipe({x: 5, y: 5}, 'assets/CurvedPipe.png', 3);
            currentPipe.CurvedPipe = true;
          }
          else
          {
            currentPipe = new Pipe({x: 5, y: 5}, 'assets/fourWayPipe.png', 0);
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
      console.log(laidPipe.frame);
      console.log(laidPipe.maxFrame);
      if(laidPipe.frame == laidPipe.maxFrame)
      {
        backgroundMusic.pause();
        turningPipe.play();
        laidPipe.frame = 0;
      }
      else
      {
        backgroundMusic.pause();
        turningPipe.play();
        laidPipe.frame++;
      }
    }
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
  startingX = 80;
  startingY = 80;
  laidPipe.forEach(function(pipe)
  {
    if(pipe.startPipe && pipe.x == startingX && pipe.y == startingY)
    {
      console.log("Inside the straight pipe");
      if(pipe.frame == 0)
      {
        startingX += 74;
      }
      else
      {
        startingY -= 74;
      }
    }
    else if(pipe.CurvedPipe && pipe.x == startingX && pipe.y == startingY)
    {
      console.log("Inside the curved pipe");
      if(pipe.frame == 0)
      {
        startingX += 74;
      }
      else if(pipe.frame == 1)
      {
        startingY -= 74;
      }
      else if(pipe.frame == 2)
      {
        startingX += 74;
      }
      else
      {
        startingY += 74;
      }
    }
    else
    {

    }
  });
  if(startingY == endingPipe.y && startingX == endingPipe.x)
  {
    console.log("You won");
    winning.play();
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


   startPipe.render(elapsedTime, ctx);
   endingPipe.render(elapsedTime, ctx);
   currentPipe.render(elapsedTime, ctx);
   laidPipe.forEach(function(pipe){pipe.render(elapsedTime, ctx);});
   ctx.fillStyle = "black";
   ctx.fillText("Score:" + score, canvas.width - 80, 10);
   ctx.fillText("Level:" + level, 10, 10);

}
