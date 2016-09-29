"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe.js');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
var startPipe = new Pipe({x: 5, y: 79}, 'assets/startPipe.png');
var endingPipe = new Pipe({x: canvas.width - 62, y: 79}, 'assets/endingPipe.png');

var level = 1;
var score = 0;
var backgroundMusic = new Audio('assets/background_music.mp3');
var winning = new Audio('assets/winning.wav');
var turningPipe = new Audio('assets/turningPope.wav');
var placingPipeDown = new Audio('assets/placingPipeDown.wav');
var losing = new Audio('assets/losing.wav');
image.src = 'assets/pipes.png';
backgroundMusic.play();

canvas.onclick = function(event) {
  console.log(event.which);
  event.preventDefault();
  // TODO: Place or rotate pipe tile
  switch(event.which){
  		case 1:
        console.log("Left mouse click")
        backgroundMusic.pause();
        placingPipeDown.play();
  			break;
  		case 3:
        console.log("Right mouse click.")
        backgroundMusic.pause();
        turningPipe.play();
  		 break;
  		default : console.log('aqui');
    }
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
  for(var y = 0; y < 12; y++) {
   for(var x = 0; x < 15; x++) {
       // draw the back of the card (212x212px)
       ctx.fillStyle = "#3333ff";
       ctx.fillRect(x * 74 + 3, y * 74 + 3, 69, 69);
     }
   }


   startPipe.render(elapsedTime, ctx);
   endingPipe.render(elapsedTime, ctx);
   ctx.fillStyle = "black";
   ctx.fillText("Score:" + score, canvas.width - 80, 10);
   ctx.fillText("Level:" + level, 10, 10);

}
