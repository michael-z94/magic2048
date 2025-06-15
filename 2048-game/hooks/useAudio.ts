"use client"

/**
 * CUSTOM REACT HOOK FOR AUDIO MANAGEMENT
 *
 * This hook manages the background music for the game using our AudioService.
 * It handles the React lifecycle and provides a simple interface for components
 * to control audio without worrying about the technical details.
 *
 * Think of this as a remote control for the music that React components can use.
 */

import { useState, useEffect, useRef, useCallback } from "react"
import { AudioService } from "@/services/AudioService"
import { AUDIO_CONFIG } from "@/config/gameConfig"

/**
 * AUDIO MANAGEMENT HOOK
 *
 * This hook provides audio controls and manages the audio service lifecycle.
 * It automatically handles cleanup when the component unmounts.
 *
 * @param audioSrc - Path to the audio file to play
 * @returns Object with audio controls and current audio state
 */
export function useAudio(audioSrc: string) {
  // State to track audio settings
  const [volume, setVolume] = useState(AUDIO_CONFIG.DEFAULT_VOLUME)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Use a ref to store the audio service so it persists across renders
  const audioServiceRef = useRef<AudioService | null>(null)
  const userInteractionAttempted = useRef(false)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * INITIALIZE AUDIO SERVICE WHEN COMPONENT MOUNTS
   *
   * This effect runs once when the component first loads.
   * It sets up the audio service and handles browser autoplay restrictions.
   */
  useEffect(() => {
    try {
      // Create the audio service
      audioServiceRef.current = new AudioService(audioSrc)
      setHasError(false)

      // Set up a timeout to force loading completion if it takes too long
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("Forcing audio to be marked as loaded due to timeout")
        if (audioServiceRef.current) {
          audioServiceRef.current.forceLoad()
          setIsLoaded(true)
        }
      }, 5000) // 5 second timeout

      // Check loading status periodically
      const checkLoadingInterval = setInterval(() => {
        if (audioServiceRef.current && audioServiceRef.current.isAudioLoaded()) {
          setIsLoaded(true)
          clearInterval(checkLoadingInterval)
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current)
            loadingTimeoutRef.current = null
          }
        }
      }, 500) // Check every 500ms

      // Cleanup function
      return () => {
        clearInterval(checkLoadingInterval)
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
          loadingTimeoutRef.current = null
        }
      }
    } catch (error) {
      console.error("Failed to create audio service:", error)
      setHasError(true)
      setIsLoaded(true) // Mark as loaded to prevent UI from getting stuck
    }
  }, [audioSrc])

  /**
   * HANDLES USER INTERACTION TO START AUDIO
   *
   * Modern browsers block audio from playing automatically.
   * We need to wait for the user to interact with the page first.
   */
  const attemptPlayback = useCallback(async () => {
    if (!audioServiceRef.current || userInteractionAttempted.current || isPlaying || hasError) {
      return
    }

    userInteractionAttempted.current = true

    try {
      await audioServiceRef.current.play()
      setIsPlaying(true)
      setIsLoaded(true) // Mark as loaded if play succeeds
      console.log("Audio playback started successfully")
    } catch (error) {
      console.log("Audio playback failed, this is normal if user hasn't interacted yet:", error)
      // Reset the flag so we can try again on next interaction
      userInteractionAttempted.current = false
    }
  }, [isPlaying, hasError])

  /**
   * SET UP USER INTERACTION LISTENERS
   *
   * This effect sets up listeners for user interactions that can trigger audio playback.
   */
  useEffect(() => {
    if (isPlaying || hasError) {
      return
    }

    // List of events that indicate user interaction
    const events = ["click", "keydown", "touchstart"]

    events.forEach((event) => {
      document.addEventListener(event, attemptPlayback, { passive: true })
    })

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, attemptPlayback)
      })
    }
  }, [attemptPlayback, isPlaying, hasError])

  /**
   * CLEANUP WHEN COMPONENT UNMOUNTS
   *
   * This effect handles cleanup when the component is destroyed.
   */
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      if (audioServiceRef.current) {
        audioServiceRef.current.destroy()
        audioServiceRef.current = null
      }
    }
  }, [])

  /**
   * UPDATES AUDIO VOLUME WHEN STATE CHANGES
   *
   * This effect runs whenever the volume or mute state changes.
   * It keeps the audio service in sync with the component state.
   */
  useEffect(() => {
    if (audioServiceRef.current) {
      audioServiceRef.current.setVolume(volume)
      audioServiceRef.current.setMuted(isMuted)
    }
  }, [volume, isMuted])

  /**
   * TOGGLES MUTE ON/OFF
   *
   * This function switches between muted and unmuted audio.
   * It's like pressing a mute button on a remote control.
   */
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
  }, [isMuted])

  /**
   * CHANGES THE VOLUME LEVEL
   *
   * This function updates the audio volume.
   * The volume should be a number between 0 (silent) and 1 (full volume).
   *
   * @param newVolume - The desired volume level (0-1)
   */
  const changeVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)))
  }, [])

  /**
   * MANUALLY ATTEMPTS TO START PLAYBACK
   *
   * This function can be called to manually try starting audio playback.
   */
  const tryPlay = useCallback(async () => {
    if (audioServiceRef.current && !isPlaying && !hasError) {
      try {
        await audioServiceRef.current.play()
        setIsPlaying(true)
        setIsLoaded(true)
      } catch (error) {
        console.log("Manual play attempt failed:", error)
      }
    }
  }, [isPlaying, hasError])

  /**
   * FORCES THE LOADING STATE TO COMPLETE
   *
   * This function can be called to force the audio to be marked as loaded.
   */
  const forceLoad = useCallback(() => {
    if (audioServiceRef.current) {
      audioServiceRef.current.forceLoad()
      setIsLoaded(true)
    }
  }, [])

  // Return the audio controls and current state
  return {
    volume,
    isMuted,
    isPlaying,
    isLoaded,
    hasError,
    toggleMute,
    changeVolume,
    tryPlay,
    forceLoad,
  }
}
