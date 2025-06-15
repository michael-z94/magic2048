"use client"

import type React from "react"

/**
 * CUSTOM REACT HOOK FOR INPUT HANDLING
 *
 * This hook manages all user input for the game, including keyboard and touch events.
 * It follows the Single Responsibility Principle by only handling input detection
 * and translating it into game actions.
 *
 * Think of this as the "ears" of the game that listen for what the player wants to do.
 */

import { useEffect, useState, useCallback } from "react"
import type { Direction } from "@/types/game"
import { INPUT_CONFIG } from "@/config/gameConfig"

interface UseInputHandlersProps {
  onMove: (direction: Direction) => void // Function to call when player wants to move
  enabled: boolean // Whether input should be active
}

/**
 * INPUT HANDLING HOOK
 *
 * This hook sets up event listeners for keyboard and touch input,
 * and translates user actions into game moves.
 *
 * @param props - Configuration for the input handlers
 * @returns Object with touch event handlers for mobile support
 */
export function useInputHandlers({ onMove, enabled }: UseInputHandlersProps) {
  // State for tracking touch gestures on mobile devices
  const [touchStart, setTouchStart] = useState<[number, number] | null>(null)
  const [touchEnd, setTouchEnd] = useState<[number, number] | null>(null)

  /**
   * HANDLES KEYBOARD INPUT
   *
   * This effect sets up keyboard event listeners to detect arrow key presses.
   * It only responds to input when the game is enabled (not game over).
   */
  useEffect(() => {
    // Don't set up keyboard listeners if input is disabled or not configured
    if (!enabled || !INPUT_CONFIG.KEYBOARD_ENABLED) {
      return
    }

    /**
     * PROCESSES KEYBOARD EVENTS
     *
     * This function translates keyboard presses into game moves.
     * It only responds to arrow keys and ignores other keys.
     *
     * @param event - The keyboard event from the browser
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // Map arrow keys to movement directions
      switch (event.key) {
        case "ArrowUp":
          onMove("up")
          break
        case "ArrowDown":
          onMove("down")
          break
        case "ArrowLeft":
          onMove("left")
          break
        case "ArrowRight":
          onMove("right")
          break
        // Ignore all other keys
        default:
          return
      }
    }

    // Start listening for keyboard events
    window.addEventListener("keydown", handleKeyDown)

    // Cleanup function - stop listening when component unmounts or effect re-runs
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onMove, enabled])

  /**
   * HANDLES TOUCH START EVENTS
   *
   * This function records where the user first touches the screen.
   * It's the beginning of a swipe gesture on mobile devices.
   *
   * @param e - The touch event from the browser
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!INPUT_CONFIG.TOUCH_ENABLED) return

    // Record the starting position of the touch
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    setTouchStart([touchX, touchY])
  }, [])

  /**
   * HANDLES TOUCH MOVE EVENTS
   *
   * This function tracks where the user's finger moves during a swipe.
   * It updates the end position as the user drags their finger.
   *
   * @param e - The touch event from the browser
   */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!INPUT_CONFIG.TOUCH_ENABLED) return

    // Record the current position of the touch
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    setTouchEnd([touchX, touchY])
  }, [])

  /**
   * HANDLES TOUCH END EVENTS
   *
   * This function processes the completed swipe gesture and determines
   * which direction the user swiped, then triggers the appropriate move.
   *
   * How it works:
   * 1. Calculate the distance swiped in X and Y directions
   * 2. Determine if the swipe was primarily horizontal or vertical
   * 3. Check if the swipe was long enough to count as a move
   * 4. Trigger the appropriate game move
   * 5. Reset the touch tracking state
   */
  const handleTouchEnd = useCallback(() => {
    if (!INPUT_CONFIG.TOUCH_ENABLED || !touchStart || !touchEnd) {
      return
    }

    // Calculate how far the user swiped in each direction
    const deltaX = touchEnd[0] - touchStart[0] // Horizontal distance
    const deltaY = touchEnd[1] - touchStart[1] // Vertical distance

    // Determine the primary direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe (left or right)
      if (deltaX > INPUT_CONFIG.SWIPE_THRESHOLD) {
        onMove("right") // Swiped right
      } else if (deltaX < -INPUT_CONFIG.SWIPE_THRESHOLD) {
        onMove("left") // Swiped left
      }
    } else {
      // Vertical swipe (up or down)
      if (deltaY > INPUT_CONFIG.SWIPE_THRESHOLD) {
        onMove("down") // Swiped down
      } else if (deltaY < -INPUT_CONFIG.SWIPE_THRESHOLD) {
        onMove("up") // Swiped up
      }
    }

    // Reset touch tracking for the next gesture
    setTouchStart(null)
    setTouchEnd(null)
  }, [touchStart, touchEnd, onMove])

  // Return the touch event handlers for components to use
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
