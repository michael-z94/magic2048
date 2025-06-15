/**
 * MAIN 2048 GAME COMPONENT
 *
 * This is the main component that orchestrates the entire 2048 game.
 * It follows the Single Responsibility Principle by focusing on coordinating
 * between different parts of the game rather than implementing game logic itself.
 *
 * Think of this as the "conductor" of an orchestra - it doesn't play any instruments
 * itself, but it coordinates all the different parts to create a harmonious experience.
 */

"use client"

import React from "react"

import { useToast } from "@/hooks/use-toast"
import { useGameLogic } from "@/hooks/useGameLogic"
import { useInputHandlers } from "@/hooks/useInputHandlers"
import GameGrid from "./GameGrid"
import GameControls from "./GameControls"
import GameInstructions from "./GameInstructions"

/**
 * MAIN GAME COMPONENT
 *
 * This component brings together all the pieces of the 2048 game:
 * - Game logic and state management
 * - User input handling
 * - Visual components
 * - User notifications
 *
 * How it works:
 * 1. Uses custom hooks to manage game state and input
 * 2. Provides feedback to the user through toast notifications
 * 3. Renders the game board and controls
 * 4. Coordinates between all the different parts
 *
 * @returns JSX element representing the complete 2048 game
 */
export default function Game2048() {
  // Get game state and controls from our game logic hook
  const { gameState, move, reset } = useGameLogic()

  // Get toast functionality for showing notifications to the user
  const { toast } = useToast()

  /**
   * HANDLES GAME MOVES WITH USER FEEDBACK
   *
   * This function wraps the basic move function to provide additional
   * user feedback when important game events happen.
   *
   * @param direction - The direction the player wants to move
   */
  const handleMove = (direction: Parameters<typeof move>[0]) => {
    // Remember the state before the move
    const previousWon = gameState.won
    const previousGameOver = gameState.gameOver

    // Execute the move
    move(direction)

    // Check if the game state changed in important ways
    // Note: We need to check this in the next render cycle
    // For now, we'll let the useEffect in the game logic handle notifications
  }

  /**
   * HANDLES STARTING A NEW GAME
   *
   * This function resets the game and can provide feedback to the user.
   */
  const handleNewGame = () => {
    reset()
    // Could add a toast notification here if desired
    // toast({ title: "New Game Started", description: "Good luck!" })
  }

  // Set up input handlers for keyboard and touch
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useInputHandlers({
    onMove: handleMove,
    enabled: !gameState.gameOver, // Disable input when game is over
  })

  /**
   * PROVIDES USER FEEDBACK FOR GAME EVENTS
   *
   * This effect watches for important game state changes and shows
   * appropriate notifications to the user.
   */
  React.useEffect(() => {
    // Show win notification
    if (gameState.won) {
      toast({
        title: "Congratulations! 🎉",
        description: "You've reached 2048! Continue playing to get a higher score.",
        duration: 5000,
      })
    }

    // Show game over notification
    if (gameState.gameOver) {
      toast({
        title: "Game Over",
        description: `Your final score is ${gameState.score}. Try again!`,
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [gameState.won, gameState.gameOver, gameState.score, toast])

  return (
    <div className="flex flex-col items-center">
      {/* GAME CONTROLS */}
      {/* Score display, audio controls, and new game button */}
      <GameControls score={gameState.score} onNewGame={handleNewGame} />

      {/* GAME BOARD */}
      {/* The 4x4 grid where the actual game is played */}
      <GameGrid
        grid={gameState.grid}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* GAME INSTRUCTIONS */}
      {/* Helpful text explaining how to play */}
      <GameInstructions />
    </div>
  )
}
