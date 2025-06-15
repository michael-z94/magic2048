/**
 * GAME GRID COMPONENT
 *
 * This component is responsible for rendering the 4x4 game board and all the tiles.
 * It follows the Single Responsibility Principle by only handling the visual
 * representation of the game grid, without any game logic.
 *
 * Think of this as the physical game board - it shows where all the pieces are
 * but doesn't know the rules of how they move.
 */

"use client"

import type React from "react"

import type { Grid } from "@/types/game"
import {
  TILE_COLORS,
  SUPER_TILE_COLORS,
  TILE_FONT_SIZES,
  VISUAL_CONFIG,
  EMPTY_TILE_COLOR,
  GAME_BOARD_STYLE,
} from "@/config/gameConfig"

interface GameGridProps {
  grid: Grid // The current state of the game board
  onTouchStart?: (e: React.TouchEvent) => void // Handler for touch start (mobile)
  onTouchMove?: (e: React.TouchEvent) => void // Handler for touch move (mobile)
  onTouchEnd?: (e: React.TouchEvent) => void // Handler for touch end (mobile)
}

/**
 * GETS THE APPROPRIATE NEON COLOR STYLING FOR A TILE
 *
 * This function determines what psychedelic, fluorescent color and styling
 * a tile should have based on its numeric value. Higher numbers get more
 * intense neon effects and glowing shadows.
 *
 * @param value - The numeric value of the tile (or null for empty)
 * @returns CSS class string for styling the tile with neon effects
 */
function getTileColor(value: number | null): string {
  // Empty tiles get a dark, translucent appearance
  if (value === null) {
    return EMPTY_TILE_COLOR
  }

  // Check for super high values first (beyond 2048)
  if (value >= 4096 && SUPER_TILE_COLORS[value]) {
    return SUPER_TILE_COLORS[value]
  }

  // Look up the neon color for this tile value
  if (TILE_COLORS[value]) {
    return TILE_COLORS[value]
  }

  // For extremely high values not in our config, create a rainbow effect
  return "bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 text-white shadow-xl shadow-rainbow animate-pulse border-2 border-white"
}

/**
 * GETS THE APPROPRIATE FONT SIZE FOR A TILE
 *
 * This function determines what font size to use based on the tile's value.
 * Larger numbers need smaller fonts to fit in the same space, but we keep
 * them bold and prominent for the neon aesthetic.
 *
 * @param value - The numeric value of the tile (or null for empty)
 * @returns CSS class string for the font size and weight
 */
function getTileFontSize(value: number | null): string {
  if (value === null) return TILE_FONT_SIZES.small
  if (value < 100) return TILE_FONT_SIZES.small
  if (value < 1000) return TILE_FONT_SIZES.medium
  return TILE_FONT_SIZES.large
}

/**
 * GETS SPECIAL GLOW EFFECTS FOR HIGH-VALUE TILES
 *
 * This function adds extra visual effects for tiles with high values
 * to make them stand out more in the psychedelic theme.
 *
 * @param value - The numeric value of the tile
 * @returns Additional CSS classes for special effects
 */
function getSpecialEffects(value: number | null): string {
  if (value === null) return ""

  // Add pulsing animation for the winning tile
  if (value === 2048) {
    return "animate-pulse"
  }

  // Add subtle glow for high-value tiles
  if (value >= 512) {
    return "animate-pulse"
  }

  return ""
}

/**
 * GAME GRID COMPONENT
 *
 * This component renders the visual game board with all tiles in a
 * psychedelic, neon style that matches the trippy background.
 *
 * How it works:
 * 1. Creates a container with neon-styled grid layout
 * 2. Maps through each row and column of the game grid
 * 3. Renders each cell as a styled div with fluorescent colors
 * 4. Applies appropriate neon colors, glows, and fonts based on tile values
 * 5. Handles touch events for mobile gameplay
 * 6. Uses gradients, shadows, and borders for the trippy aesthetic
 *
 * @param props - Component props containing grid data and event handlers
 * @returns JSX element representing the psychedelic game board
 */
export default function GameGrid({ grid, onTouchStart, onTouchMove, onTouchEnd }: GameGridProps) {
  return (
    <div
      className={`${GAME_BOARD_STYLE} p-4 rounded-xl`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* NEON GRID CONTAINER */}
      {/* This creates a 4x4 grid layout for our fluorescent tiles */}
      <div className="grid grid-cols-4 gap-3 w-[300px] sm:w-[350px]">
        {/* RENDER EACH PSYCHEDELIC TILE */}
        {/* We map through each row, then each column to create all 16 glowing tiles */}
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`} // Unique key for React
              className={`
                w-[65px] h-[65px] sm:w-[80px] sm:h-[80px] 
                flex items-center justify-center 
                rounded-lg font-black
                transition-all duration-${VISUAL_CONFIG.ANIMATION_DURATION}
                transform hover:scale-105
                ${getTileColor(cell)}
                ${getSpecialEffects(cell)}
              `}
            >
              {/* NEON TILE CONTENT */}
              {/* Show the number with appropriate neon styling if the cell has a value */}
              {cell && (
                <span
                  className={`${getTileFontSize(cell)} drop-shadow-lg`}
                  style={{
                    textShadow: cell >= 128 ? "0 0 10px currentColor" : "none",
                  }}
                >
                  {cell}
                </span>
              )}
            </div>
          )),
        )}
      </div>
    </div>
  )
}
