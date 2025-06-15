/**
 * AUDIO CONTROLS COMPONENT
 *
 * This component provides a user interface for controlling the background music.
 * It includes enhanced debugging information for production deployment issues.
 */

"use client"

import { Volume2, VolumeX, Play, AlertCircle, RotateCcw, Info } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/useAudio"
import { useEffect, useState } from "react"
import { AUDIO_CONFIG } from "@/config/gameConfig"

interface AudioControlsProps {
  audioSrc: string
}

export default function AudioControls({ audioSrc }: AudioControlsProps) {
  const { volume, isMuted, isPlaying, isLoaded, hasError, toggleMute, changeVolume, tryPlay, forceLoad } =
    useAudio(audioSrc)

  const [loadingTime, setLoadingTime] = useState(0)
  const [showDebug, setShowDebug] = useState(false)

  // Track loading time
  useEffect(() => {
    if (!isLoaded && !hasError) {
      const interval = setInterval(() => {
        setLoadingTime((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setLoadingTime(0)
    }
  }, [isLoaded, hasError])

  // Auto-force load if stuck
  useEffect(() => {
    if (loadingTime >= 8 && !isLoaded && !hasError) {
      console.log("Auto-forcing load due to extended loading time")
      forceLoad()
    }
  }, [loadingTime, isLoaded, hasError, forceLoad])

  // Debug function to log audio information
  const logDebugInfo = () => {
    console.log("=== AUDIO DEBUG INFO ===")
    console.log("Primary audio source:", AUDIO_CONFIG.AUDIO_PATH)
    console.log("Fallback audio source:", AUDIO_CONFIG.FALLBACK_AUDIO_PATH)
    console.log("Current domain:", window.location.origin)
    console.log("Audio state:", { volume, isMuted, isPlaying, isLoaded, hasError })
    console.log("Loading time:", loadingTime)
    setShowDebug(!showDebug)
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm p-2 rounded-lg border border-indigo-400/50 shadow-lg shadow-indigo-500/30">
      {/* AUDIO STATUS AND CONTROL BUTTON */}
      {hasError ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          aria-label="Audio error"
          disabled
        >
          <AlertCircle size={18} />
        </Button>
      ) : !isLoaded ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={forceLoad}
          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200"
          aria-label="Force audio load"
          title="Click if audio is stuck loading"
        >
          <RotateCcw size={18} />
        </Button>
      ) : !isPlaying ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={tryPlay}
          className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-all duration-200"
          aria-label="Start audio"
        >
          <Play size={18} />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-200"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
      )}

      {/* VOLUME SLIDER */}
      <div className="w-24">
        <Slider
          value={[volume * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => changeVolume(value[0] / 100)}
          className="w-full"
          aria-label="Adjust volume level"
          disabled={hasError}
        />
      </div>

      {/* DEBUG BUTTON (only show in development or when there are issues) */}
      {(process.env.NODE_ENV === "development" || !isLoaded || hasError) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={logDebugInfo}
          className="h-8 w-8 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 transition-all duration-200"
          aria-label="Debug audio"
          title="Click to log audio debug information"
        >
          <Info size={18} />
        </Button>
      )}

      {/* STATUS INDICATOR */}
      {!isLoaded && !hasError && (
        <span className="text-xs text-purple-300 font-medium">{loadingTime > 5 ? "Click ↻" : "Loading..."}</span>
      )}
    </div>
  )
}
