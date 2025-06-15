"use client"

/**
 * CUSTOM REACT HOOK FOR GAME STATE MANAGEMENT
 *
 * This hook manages all the game state and logic using React's built-in state management.
 * It follows the Single Responsibility Principle by only handling game state,
 * and provides a clean interface for components to interact with the game.
 *
 * Think of this as the "game controller" that keeps track of everything
 * happening in the game and provides buttons for the UI to press.
 */

import { useState, useCallback } from "react"
import type { GameState, Direction } from "@/types/game"
import { initializeGame, moveGrid, addRandomTile, isGameOver, hasWon } from "@/utils/gameLogic"

/**
 * GAME LOGIC HOOK
 *
 * This hook provides all the functionality needed to play 2048.
 * It manages the game state and provides functions to interact with the game.
 *
 * How it works:
 * 1. Maintains the current game state (grid, score, etc.)
 * 2. Provides functions to move tiles, reset the game, etc.
 * 3. Handles all the complex logic internally
 * 4. Returns simple functions that components can call
 *
 * @returns Object containing game state and functions to control the game
 */
export function useGameLogic() {
  // Initialize the game state with a fresh game
  const [gameState, setGameState] = useState<GameState>(() => initializeGame())

  /**
   * MOVES TILES IN A SPECIFIED DIRECTION
   *
   * This function handles what happens when a player tries to move tiles.
   * It's wrapped in useCallback to prevent unnecessary re-renders.
   *
   * How it works:
   * 1. Check if the game is over (if so, ignore the move)
   * 2. Try to move the tiles in the specified direction
   * 3. If tiles actually moved, add a new random tile
   * 4. Check if the game is now over or if the player won
   * 5. Update the game state with all the changes
   *
   * @param direction - Which direction to move the tiles
   */
  const move = useCallback(
    (direction: Direction) => {
      // Don't allow moves if the game is already over
      if (gameState.gameOver) {
        return
      }

      // Try to move the tiles in the specified direction
      const { newGrid, moved, scoreGained } = moveGrid(gameState.grid, direction)

      // If nothing moved, don't change anything
      if (!moved) {
        return
      }

      // Add a new random tile since the player made a valid move
      const gridWithNewTile = addRandomTile(newGrid)

      // Calculate the new score
      const newScore = gameState.score + scoreGained

      // Check if the game is now over or if the player won
      const gameOver = isGameOver(gridWithNewTile)
      const won = gameState.won || hasWon(gridWithNewTile)

      // Update the game state with all the changes
      setGameState({
        grid: gridWithNewTile,
        score: newScore,
        gameOver,
        won,
      })
    },
    [gameState],
  )

  /**
   * RESETS THE GAME TO START OVER
   *
   * This function starts a completely new game with a fresh board.
   * It's like clearing the board and starting from scratch.
   */
  const reset = useCallback(() => {
    setGameState(initializeGame())
  }, [])

  // Return the current game state and the functions to control it
  return {
    gameState,
    move,
    reset,
  }
}
