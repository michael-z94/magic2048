/**
 * TYPE DEFINITIONS FOR THE 2048 GAME
 *
 * This file contains all the type definitions used throughout the game.
 * Think of types as "contracts" that define what shape our data should have.
 * It's like having a blueprint that tells us exactly what properties an object should contain.
 */

// A cell can either contain a number (like 2, 4, 8, etc.) or be empty (null)
// This is like a single square on our game board
export type Cell = number | null

// A grid is a 2D array representing our 4x4 game board
// Think of it as a table with 4 rows and 4 columns
export type Grid = Cell[][]

// These are the four directions a player can move tiles
// Like the four arrow keys on a keyboard
export type Direction = "up" | "down" | "left" | "right"

// This represents the current state of our game
// It's like a snapshot of everything happening in the game at any moment
export interface GameState {
  grid: Grid // The current arrangement of tiles on the board
  score: number // The player's current score
  gameOver: boolean // Whether the game has ended (no more moves possible)
  won: boolean // Whether the player has reached the 2048 tile
}

// This defines what actions can happen in our game
// Think of it as a list of all the things a player can do
export interface GameActions {
  move: (direction: Direction) => void // Move tiles in a direction
  reset: () => void // Start a new game
  addRandomTile: () => void // Add a new tile to the board
}

// This interface defines how audio should behave in our game
// It's like a contract that any audio system must follow
export interface AudioController {
  play: () => Promise<void> // Start playing music
  pause: () => void // Stop playing music
  setVolume: (volume: number) => void // Change the volume (0 to 1)
  setMuted: (muted: boolean) => void // Mute or unmute the audio
}

// This defines what input handlers should be able to do
// Input handlers are responsible for detecting user actions (keyboard, touch, etc.)
export interface InputHandler {
  onMove: (direction: Direction) => void // What to do when user wants to move
  enable: () => void // Start listening for input
  disable: () => void // Stop listening for input
}
