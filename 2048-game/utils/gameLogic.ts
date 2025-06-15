/**
 * CORE GAME LOGIC FOR 2048
 *
 * This file contains the pure game logic - the mathematical rules that make 2048 work.
 * It's completely separated from the user interface, following the Single Responsibility Principle.
 *
 * Think of this as the "brain" of the game that knows all the rules but doesn't care
 * about how the game looks or how the user interacts with it.
 */

import type { Grid, Cell, Direction, GameState } from "@/types/game"
import { GRID_CONFIG, TILE_CONFIG } from "@/config/gameConfig"

/**
 * CREATES AN EMPTY GAME GRID
 *
 * This function creates a fresh, empty 4x4 grid for starting a new game.
 * It's like setting up a blank game board before placing any pieces.
 *
 * How it works:
 * 1. Create an array with 4 empty slots (for 4 rows)
 * 2. Fill each slot with another array of 4 empty slots (for 4 columns)
 * 3. Each cell starts as 'null' meaning it's empty
 *
 * @returns A 4x4 grid filled with null values (empty cells)
 */
export function createEmptyGrid(): Grid {
  // Array(4) creates an array with 4 undefined elements
  // .fill(null) replaces undefined with null
  // .map() transforms each null into a new array of 4 nulls
  return Array(GRID_CONFIG.SIZE)
    .fill(null)
    .map(() => Array(GRID_CONFIG.SIZE).fill(null))
}

/**
 * FINDS ALL EMPTY POSITIONS ON THE GRID
 *
 * This function scans the entire game board and makes a list of all empty spaces.
 * It's like looking at a parking lot and noting which spaces are available.
 *
 * How it works:
 * 1. Go through each row (top to bottom)
 * 2. Go through each column in that row (left to right)
 * 3. If a cell is empty (null), add its position to our list
 * 4. Return the list of all empty positions
 *
 * @param grid - The current game board to examine
 * @returns Array of [row, column] coordinates where cells are empty
 */
export function getEmptyCells(grid: Grid): [number, number][] {
  const emptyCells: [number, number][] = []

  // Loop through each row (0, 1, 2, 3)
  for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
    // Loop through each column in this row (0, 1, 2, 3)
    for (let col = 0; col < GRID_CONFIG.SIZE; col++) {
      // If this cell is empty, remember its position
      if (grid[row][col] === null) {
        emptyCells.push([row, col])
      }
    }
  }

  return emptyCells
}

/**
 * ADDS A RANDOM TILE TO THE GRID
 *
 * This function places a new tile (either 2 or 4) in a random empty spot on the board.
 * It's like dropping a new game piece onto the board after each move.
 *
 * How it works:
 * 1. Find all empty spaces on the board
 * 2. If no empty spaces exist, return the grid unchanged
 * 3. Pick a random empty space
 * 4. Decide whether to place a 2 (90% chance) or 4 (10% chance)
 * 5. Place the new tile in the chosen spot
 *
 * @param grid - The current game board
 * @returns A new grid with one additional tile placed randomly
 */
export function addRandomTile(grid: Grid): Grid {
  // Create a copy of the grid so we don't modify the original
  // This is important for maintaining predictable behavior
  const newGrid = grid.map((row) => [...row])

  // Find all the empty spots where we can place a new tile
  const emptyCells = getEmptyCells(newGrid)

  // If the board is full, we can't add a new tile
  if (emptyCells.length === 0) {
    return newGrid
  }

  // Pick a random empty cell from our list
  // Math.random() gives us a number between 0 and 1
  // We multiply by the length and round down to get a valid index
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const [randomRow, randomCol] = emptyCells[randomIndex]

  // Decide what number to place (2 or 4)
  // 90% of the time it's a 2, 10% of the time it's a 4
  const newTileValue = Math.random() < TILE_CONFIG.PROBABILITY_OF_2 ? 2 : 4

  // Place the new tile in the chosen position
  newGrid[randomRow][randomCol] = newTileValue

  return newGrid
}

/**
 * MOVES AND MERGES TILES IN A SINGLE LINE
 *
 * This is the core logic that handles how tiles slide and combine.
 * It processes one row or column at a time, moving all tiles in one direction
 * and merging tiles with the same value.
 *
 * Think of it like sliding coins on a table - they all move in one direction
 * until they hit something, and identical coins stick together.
 *
 * How it works:
 * 1. Remove all empty spaces (slide tiles together)
 * 2. Merge adjacent tiles with the same value
 * 3. Fill the remaining spaces with empty cells
 * 4. Calculate the score gained from merging
 *
 * @param line - Array of 4 cells representing one row or column
 * @returns Object containing the new line, whether it changed, and points scored
 */
export function processLine(line: Cell[]): {
  newLine: Cell[]
  changed: boolean
  scoreGained: number
} {
  // Remember what the line looked like before we started
  const originalLine = [...line]

  // Step 1: Remove all empty spaces (null values)
  // This is like sliding all the tiles to one side
  const filteredLine = line.filter((cell) => cell !== null) as number[]

  // Step 2: Merge adjacent tiles with the same value
  const mergedLine: Cell[] = []
  let scoreGained = 0
  let i = 0

  // Go through each tile in the filtered line
  while (i < filteredLine.length) {
    // Check if this tile can merge with the next one
    if (i < filteredLine.length - 1 && filteredLine[i] === filteredLine[i + 1]) {
      // Merge the two tiles by doubling the value
      const mergedValue = filteredLine[i] * 2
      mergedLine.push(mergedValue)

      // Add the merged value to our score
      scoreGained += mergedValue

      // Skip the next tile since we just merged it
      i += 2
    } else {
      // This tile doesn't merge, just move it as-is
      mergedLine.push(filteredLine[i])
      i++
    }
  }

  // Step 3: Fill the remaining spaces with empty cells
  // Our line must always have exactly 4 cells
  while (mergedLine.length < GRID_CONFIG.SIZE) {
    mergedLine.push(null)
  }

  // Check if anything actually changed
  const changed = JSON.stringify(originalLine) !== JSON.stringify(mergedLine)

  return {
    newLine: mergedLine,
    changed,
    scoreGained,
  }
}

/**
 * MOVES THE ENTIRE GRID IN A SPECIFIED DIRECTION
 *
 * This function handles moving all tiles on the board in one of four directions.
 * It's like tilting the entire game board so all tiles slide in that direction.
 *
 * How it works:
 * 1. For each direction, extract the appropriate lines (rows or columns)
 * 2. Process each line using our processLine function
 * 3. Put the processed lines back into the grid
 * 4. Keep track of the total score gained and whether anything moved
 *
 * @param grid - The current game board
 * @param direction - Which way to move the tiles
 * @returns Object with the new grid, whether it changed, and score gained
 */
export function moveGrid(
  grid: Grid,
  direction: Direction,
): {
  newGrid: Grid
  moved: boolean
  scoreGained: number
} {
  // Create a copy of the grid to avoid modifying the original
  const newGrid = grid.map((row) => [...row])
  let totalMoved = false
  let totalScoreGained = 0

  if (direction === "left") {
    // For left movement, process each row from left to right
    for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
      const { newLine, changed, scoreGained } = processLine(newGrid[row])
      if (changed) {
        newGrid[row] = newLine
        totalMoved = true
        totalScoreGained += scoreGained
      }
    }
  } else if (direction === "right") {
    // For right movement, reverse each row, process it, then reverse back
    for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
      const reversedRow = [...newGrid[row]].reverse()
      const { newLine, changed, scoreGained } = processLine(reversedRow)
      if (changed) {
        newGrid[row] = newLine.reverse()
        totalMoved = true
        totalScoreGained += scoreGained
      }
    }
  } else if (direction === "up") {
    // For up movement, process each column from top to bottom
    for (let col = 0; col < GRID_CONFIG.SIZE; col++) {
      // Extract the column as an array
      const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]]
      const { newLine, changed, scoreGained } = processLine(column)
      if (changed) {
        // Put the processed column back into the grid
        for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
          newGrid[row][col] = newLine[row]
        }
        totalMoved = true
        totalScoreGained += scoreGained
      }
    }
  } else if (direction === "down") {
    // For down movement, reverse each column, process it, then reverse back
    for (let col = 0; col < GRID_CONFIG.SIZE; col++) {
      // Extract and reverse the column
      const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]].reverse()
      const { newLine, changed, scoreGained } = processLine(column)
      if (changed) {
        // Reverse the result and put it back
        const reversedLine = newLine.reverse()
        for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
          newGrid[row][col] = reversedLine[row]
        }
        totalMoved = true
        totalScoreGained += scoreGained
      }
    }
  }

  return {
    newGrid,
    moved: totalMoved,
    scoreGained: totalScoreGained,
  }
}

/**
 * CHECKS IF THE GAME IS OVER
 *
 * The game ends when the board is full AND no more moves are possible.
 * This function checks both conditions to determine if the player is stuck.
 *
 * How it works:
 * 1. Check if there are any empty cells (if yes, game continues)
 * 2. Check if any adjacent tiles can merge horizontally
 * 3. Check if any adjacent tiles can merge vertically
 * 4. If no empty cells AND no possible merges, game is over
 *
 * @param grid - The current game board to check
 * @returns true if the game is over, false if moves are still possible
 */
export function isGameOver(grid: Grid): boolean {
  // First, check if there are any empty cells
  // If there are empty cells, the game can continue
  for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
    for (let col = 0; col < GRID_CONFIG.SIZE; col++) {
      if (grid[row][col] === null) {
        return false // Found an empty cell, game is not over
      }
    }
  }

  // Check for possible horizontal merges (left-right)
  // Look at each tile and see if it matches the tile to its right
  for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
    for (let col = 0; col < GRID_CONFIG.SIZE - 1; col++) {
      if (grid[row][col] === grid[row][col + 1]) {
        return false // Found a possible merge, game is not over
      }
    }
  }

  // Check for possible vertical merges (up-down)
  // Look at each tile and see if it matches the tile below it
  for (let row = 0; row < GRID_CONFIG.SIZE - 1; row++) {
    for (let col = 0; col < GRID_CONFIG.SIZE; col++) {
      if (grid[row][col] === grid[row + 1][col]) {
        return false // Found a possible merge, game is not over
      }
    }
  }

  // No empty cells and no possible merges - game is over
  return true
}

/**
 * CHECKS IF THE PLAYER HAS WON
 *
 * The player wins when they create a tile with the value 2048.
 * This function scans the entire board looking for the winning tile.
 *
 * @param grid - The current game board to check
 * @returns true if a 2048 tile exists, false otherwise
 */
export function hasWon(grid: Grid): boolean {
  // Look through every cell on the board
  for (let row = 0; row < GRID_CONFIG.SIZE; row++) {
    for (let col = 0; col < GRID_CONFIG.SIZE; col++) {
      // If we find the winning tile value, player has won
      if (grid[row][col] === GRID_CONFIG.WINNING_TILE) {
        return true
      }
    }
  }

  // No winning tile found
  return false
}

/**
 * INITIALIZES A NEW GAME
 *
 * This function sets up a fresh game by creating an empty grid
 * and adding the initial tiles that players start with.
 *
 * @returns A new game state ready for the player to begin
 */
export function initializeGame(): GameState {
  // Start with a completely empty grid
  let grid = createEmptyGrid()

  // Add the initial tiles (usually 2 tiles)
  for (let i = 0; i < GRID_CONFIG.INITIAL_TILES; i++) {
    grid = addRandomTile(grid)
  }

  // Return the initial game state
  return {
    grid,
    score: 0,
    gameOver: false,
    won: false,
  }
}
