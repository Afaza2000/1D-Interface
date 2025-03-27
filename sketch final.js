/* /////////////////////////////////////

  DESIGN 6397: Design for Physical Interaction
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////


let displaySize = 30;   // how many pixels are visible in the game
let pixelSize = 30;     // how big each 'pixel' looks on screen

let playerOne;    // Adding 1 player to the game
let target;       // and one target for players to catch.

let display;      // Aggregates our final visual output before showing it on the screen

let controller;   // This is where the state machine and game logic lives

let collisionAnimation;   // Where we store and manage the collision animation

let score;        // Where we keep track of score and winner



function setup() {

  createCanvas((displaySize * pixelSize), pixelSize);     // dynamically sets canvas size

  display = new Display(displaySize, pixelSize);        // Initializing the display

  playerOne = new Player(color(255, 0, 0), parseInt(random(0, displaySize)), displaySize);   // Initializing player

  // Define possible target colors based on the provided RGB values
  const targetColors = [
    color(206, 0, 0),    // Dark Red
    color(115, 0, 45),   // Deep Purple-Red
    color(230, 245, 72), // Yellow-Green
    color(159, 120, 0),  // Brown-Yellow
    color(187, 0, 14),   // Crimson
    color(87, 70, 50),   // Dark Brown
    color(80, 0, 0),     // Deep Red
    color(69, 0, 0),     // Very Dark Red
    color(135, 115, 0),  // Olive
    color(25, 0, 0),     // Very Dark Maroon
    color(105, 55, 100), // Purple-Brown
    color(200, 45, 20),  // Bright Red-Orange
    color(142, 0, 10),   // Dark Crimson
    color(200, 0, 0),    // Bright Red
    color(87, 40, 94),   // Purple
    color(200, 60, 0)    // Orange-Red
  ];

  // Randomly select a target color from the list
  const randomTargetColor = targetColors[Math.floor(Math.random() * targetColors.length)];

  target = new Player(randomTargetColor, parseInt(random(0, displaySize)), displaySize);    // Initializing target with random color

  collisionAnimation = new Animation();     // Initializing animation

  controller = new Controller();            // Initializing controller

  score = { max: 3, winner: color(0, 0, 0) };     // score stores max number of points, and color 

}


