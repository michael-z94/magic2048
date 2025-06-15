/**
 * GAME INSTRUCTIONS COMPONENT
 *
 * This component displays helpful instructions for players on how to play the game.
 * It follows the Single Responsibility Principle by only handling the display
 * of instructional text, without any game logic or interactivity.
 *
 * Think of this as the instruction manual or help text that guides new players.
 */

"use client"

import { GRID_CONFIG } from "@/config/gameConfig"

/**
 * GAME INSTRUCTIONS COMPONENT
 *
 * This component renders helpful text that explains how to play 2048.
 * It provides clear, simple instructions for both desktop and mobile users.
 *
 * How it works:
 * 1. Displays control instructions (arrow keys for desktop, swipe for mobile)
 * 2. Explains the game objective (reach the 2048 tile)
 * 3. Uses styling that's readable against the background
 * 4. Highlights important information like the winning condition
 *
 * @returns JSX element with game instructions
 */
export default function GameInstructions() {
  return (
    <div className="mt-6 text-center text-white drop-shadow-lg">
      {/* CONTROL INSTRUCTIONS */}
      {/* Tell players how to move tiles */}
      <p className="mb-2 font-medium">Use arrow keys to move tiles. Swipe on mobile devices.</p>

      {/* GAME OBJECTIVE */}
      {/* Explain what the player is trying to achieve */}
      <p className="font-medium">
        Join the numbers and get to the <strong className="text-yellow-300">{GRID_CONFIG.WINNING_TILE} tile!</strong>
      </p>
    </div>
  )
}
