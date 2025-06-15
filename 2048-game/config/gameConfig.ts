/**
 * GAME CONFIGURATION SETTINGS
 *
 * This file contains all the settings and constants for our 2048 game.
 * By keeping all configuration in one place, we follow the KISS principle
 * and make it easy to modify game behavior without hunting through code.
 *
 * Think of this as the "control panel" for our game where we can adjust
 * how the game behaves without changing the core logic.
 */

// GRID CONFIGURATION
// These numbers define the size and behavior of our game board
export const GRID_CONFIG = {
  SIZE: 4, // Our game board is 4x4 (4 rows, 4 columns)
  WINNING_TILE: 2048, // The tile value needed to win the game
  INITIAL_TILES: 2, // How many tiles to start with when game begins
} as const

// TILE GENERATION PROBABILITIES
// These control what numbers appear when new tiles are created
export const TILE_CONFIG = {
  PROBABILITY_OF_2: 0.9, // 90% chance a new tile will be a "2"
  PROBABILITY_OF_4: 0.1, // 10% chance a new tile will be a "4"
  POSSIBLE_VALUES: [2, 4], // Only these numbers can appear as new tiles
} as const

// AUDIO CONFIGURATION
// Settings for the background music and sound effects
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.5, // Start at 50% volume (0 = silent, 1 = full volume)
  LOOP_AUDIO: true, // Should the music repeat when it ends?
  AUDIO_PATH:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beautiful%20Music%20With%20A%20Touch%20Of%20Sadness_%20_TREE%20OF%20LIFE_%20%E2%80%94%20Epicmasters-pFOH0Zy7rBKA0uX1YdmJOuaQxLlx3H.mp3", // Direct blob URL for production compatibility
  FALLBACK_AUDIO_PATH: "/audio/tree-of-life.mp3", // Fallback path if blob URL fails
} as const

// VISUAL STYLING CONFIGURATION
// These control how the game looks on screen
export const VISUAL_CONFIG = {
  TILE_SIZE: {
    MOBILE: 65, // Size of tiles on mobile devices (in pixels)
    DESKTOP: 80, // Size of tiles on desktop computers (in pixels)
  },
  GRID_GAP: 12, // Space between tiles (in pixels)
  ANIMATION_DURATION: 200, // How long tile movements take (in milliseconds)
} as const

// INPUT CONFIGURATION
// Settings for how the game responds to user input
export const INPUT_CONFIG = {
  SWIPE_THRESHOLD: 50, // How far user must swipe to register a move (in pixels)
  KEYBOARD_ENABLED: true, // Should arrow keys work?
  TOUCH_ENABLED: true, // Should touch/swipe work on mobile?
} as const

// NEON/FLUORESCENT COLOR SCHEME FOR DIFFERENT TILE VALUES
// This maps each tile number to its psychedelic, trippy visual appearance
// Think of it as a neon paint palette where each number gets its own glowing color
export const TILE_COLORS: Record<number, string> = {
  2: "bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/50 border border-pink-300", // Neon pink for small numbers
  4: "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-500/50 border border-purple-300", // Electric purple
  8: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/50 border border-blue-300", // Neon blue
  16: "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/50 border border-cyan-300", // Electric cyan
  32: "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/50 border border-green-300", // Neon green
  64: "bg-gradient-to-br from-lime-400 to-lime-600 text-white shadow-lg shadow-lime-500/50 border border-lime-300", // Electric lime
  128: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50 border border-yellow-300", // Neon yellow
  256: "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/50 border border-orange-300", // Electric orange
  512: "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/50 border border-red-300", // Neon red
  1024: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/50 border border-fuchsia-300", // Electric fuchsia
  2048: "bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 text-white shadow-xl shadow-violet-500/60 border-2 border-violet-300 animate-pulse", // Rainbow gradient for winning tile
}

// SPECIAL NEON COLORS FOR HIGHER VALUES (beyond 2048)
// These create an even more intense psychedelic experience for power players
export const SUPER_TILE_COLORS: Record<number, string> = {
  4096: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/60 border-2 border-emerald-300 animate-pulse",
  8192: "bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500 text-white shadow-xl shadow-rose-500/60 border-2 border-rose-300 animate-pulse",
  16384:
    "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 text-white shadow-xl shadow-indigo-500/60 border-2 border-indigo-300 animate-pulse",
}

// FONT SIZES FOR DIFFERENT TILE VALUES
// Larger numbers need smaller fonts to fit in the same space
export const TILE_FONT_SIZES: Record<string, string> = {
  small: "text-2xl font-black", // For numbers less than 100 - bold and prominent
  medium: "text-xl font-black", // For numbers 100-999 - still bold
  large: "text-lg font-black", // For numbers 1000 and above - compact but readable
}

// EMPTY TILE STYLING
// The background color for empty cells on the game board
export const EMPTY_TILE_COLOR = "bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 shadow-inner"

// GAME BOARD STYLING
// The overall styling for the game board container
export const GAME_BOARD_STYLE =
  "bg-black/20 backdrop-blur-md border border-purple-500/30 shadow-2xl shadow-purple-500/20"
