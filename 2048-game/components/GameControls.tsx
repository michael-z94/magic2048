/**
 * GAME CONTROLS COMPONENT
 *
 * This component provides the user interface for game controls like score display,
 * new game button, and audio controls. It follows the Single Responsibility
 * Principle by only handling the control UI, not the game logic itself.
 *
 * Think of this as the control panel of the game - it shows important information
 * and provides buttons for the player to control their experience.
 */

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AudioControls from "./AudioControls"
import { AUDIO_CONFIG } from "@/config/gameConfig"

interface GameControlsProps {
  score: number // Current player score to display
  onNewGame: () => void // Function to call when player wants to start over
}

/**
 * GAME CONTROLS COMPONENT
 *
 * This component renders the top section of the game with score display,
 * audio controls, and the new game button, all styled to match the
 * psychedelic neon theme.
 *
 * How it works:
 * 1. Displays the current score in a neon-styled card
 * 2. Provides audio controls for background music
 * 3. Offers a "New Game" button to restart with neon styling
 * 4. Arranges everything in a clean, responsive layout with trippy effects
 *
 * @param props - Component props containing score and new game handler
 * @returns JSX element with psychedelic game controls
 */
export default function GameControls({ score, onNewGame }: GameControlsProps) {
  return (
    <div className="flex justify-between w-full max-w-md mb-4">
      {/* NEON SCORE DISPLAY */}
      {/* This card shows the player's current score with fluorescent styling */}
      <Card className="p-4 flex flex-col items-center bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm border border-purple-400/50 shadow-lg shadow-purple-500/30">
        <span className="text-sm font-bold text-purple-200 uppercase tracking-wider">SCORE</span>
        <span className="text-2xl font-black text-white drop-shadow-lg" style={{ textShadow: "0 0 10px #a855f7" }}>
          {score}
        </span>
      </Card>

      {/* NEON CONTROL BUTTONS */}
      {/* This section contains the audio controls and new game button with trippy styling */}
      <div className="flex items-center gap-2">
        {/* AUDIO CONTROLS */}
        {/* Component for controlling background music with neon theme */}
        <AudioControls audioSrc={AUDIO_CONFIG.AUDIO_PATH} />

        {/* PSYCHEDELIC NEW GAME BUTTON */}
        {/* Button to restart the game with fluorescent styling */}
        <Button
          onClick={onNewGame}
          className="h-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/30 border border-cyan-300/50 transition-all duration-200 hover:scale-105"
          style={{ textShadow: "0 0 5px currentColor" }}
        >
          New Game
        </Button>
      </div>
    </div>
  )
}
