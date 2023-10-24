// Name: Frank Shi
// 
// Title: Rocket Patrol 2049
// 
// Completion Time: 10 hours
//
// Mods:
// 'FIRE' UI text from the original game (1)
// Looping background music (1)
// Speed increase that happens after 30 seconds in the original game (1)
// Allow the player to control the Rocket after it's fired (1)
// Display the time remaining (in seconds) on the screen (3)
// Parallax scrolling for the background (3)
// Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (5)
//
// Citations:
// Looped Timer: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/timer/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let scoreConfig

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;