/**
 * MAIN PAGE COMPONENT
 *
 * This is the root page component that sets up the overall layout and styling
 * for the 2048 game application. It follows the Single Responsibility Principle
 * by only handling the page layout and visual presentation.
 *
 * Think of this as the "stage" where our psychedelic game performance takes place -
 * it sets the trippy scene but doesn't participate in the actual game.
 */

import Game2048 from "@/components/Game2048"

/**
 * HOME PAGE COMPONENT
 *
 * This component creates the main page layout with the fantasy background
 * and positions the game in the center of the screen with enhanced neon styling.
 *
 * How it works:
 * 1. Sets up a full-screen background with the psychedelic mushroom image
 * 2. Creates a centered container with enhanced glass-morphism and neon effects
 * 3. Displays the game title with bright neon blue glowing text effects (no pulsing)
 * 4. Renders the main game component
 * 5. Includes a footer with copyright information and neon styling
 *
 * The layout is responsive and works well on both desktop and mobile devices,
 * with enhanced visual effects that complement the trippy theme.
 *
 * @returns JSX element representing the complete psychedelic page
 */
export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/fantasy-background.jpeg')" }}
    >
      {/* PSYCHEDELIC GAME CONTAINER */}
      {/* This container provides a neon-enhanced semi-transparent background for the game */}
      <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-purple-500/30 shadow-purple-500/20">
        {/* BRIGHT NEON BLUE GAME TITLE */}
        {/* Large, prominent title with intense blue glow effects (static, no animation) */}
        <h1
          className="text-5xl font-black mb-6 text-cyan-400 text-center drop-shadow-2xl"
          style={{
            textShadow: "0 0 20px #00bfff, 0 0 40px #00bfff, 0 0 60px #00bfff, 0 0 80px #00bfff",
            filter: "drop-shadow(0 0 15px rgba(0, 191, 255, 0.8))",
          }}
        >
          2048
        </h1>

        {/* MAIN GAME COMPONENT */}
        {/* This renders the entire 2048 game with neon styling */}
        <Game2048 />
      </div>

      {/* NEON FOOTER */}
      {/* Copyright information at the bottom with glowing effects */}
      <footer className="mt-8 text-center">
        <p
          className="text-purple-200 text-sm font-medium"
          style={{
            textShadow: "0 0 10px #a855f7",
            filter: "drop-shadow(0 0 5px rgba(168, 85, 247, 0.3))",
          }}
        >
          © 2025 Michał Zdunek. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
