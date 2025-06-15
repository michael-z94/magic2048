/**
 * AUDIO SERVICE FOR BACKGROUND MUSIC
 *
 * This service handles all audio-related functionality in the game.
 * It follows the Single Responsibility Principle by only dealing with audio,
 * and implements the AudioController interface for consistency.
 *
 * Think of this as a dedicated music player that knows how to:
 * - Play and pause music
 * - Control volume
 * - Handle browser restrictions on audio playback
 * - Handle production deployment issues
 */

import type { AudioController } from "@/types/game"
import { AUDIO_CONFIG } from "@/config/gameConfig"

export class AudioService implements AudioController {
  private audio: HTMLAudioElement | null = null
  private isLoaded = false
  private currentVolume = AUDIO_CONFIG.DEFAULT_VOLUME
  private isMuted = false
  private loadAttempted = false
  private loadingTimeout: NodeJS.Timeout | null = null
  private currentAudioSrc: string

  /**
   * CREATES A NEW AUDIO SERVICE INSTANCE
   *
   * This constructor sets up the audio player with the specified music file.
   * It includes fallback mechanisms for production deployment issues.
   *
   * @param audioSrc - The path to the music file we want to play
   */
  constructor(private audioSrc: string) {
    this.currentAudioSrc = audioSrc
    this.initializeAudio()
  }

  /**
   * SETS UP THE AUDIO PLAYER WITH FALLBACK SUPPORT
   *
   * This method tries multiple audio sources to ensure compatibility
   * in both development and production environments.
   */
  private initializeAudio(): void {
    try {
      // Create a new audio element
      this.audio = new Audio()

      // Configure the audio settings
      this.audio.loop = AUDIO_CONFIG.LOOP_AUDIO
      this.audio.volume = this.currentVolume
      this.audio.preload = "metadata"
      this.audio.crossOrigin = "anonymous"

      // Set up event listeners
      this.setupEventListeners()

      // Try to load the audio with fallback
      this.loadAudioWithFallback()
    } catch (error) {
      console.error("Failed to initialize audio:", error)
      this.handleLoadSuccess()
    }
  }

  /**
   * ATTEMPTS TO LOAD AUDIO WITH FALLBACK OPTIONS
   *
   * This method tries the primary audio source first, then falls back
   * to alternative sources if the primary fails.
   */
  private loadAudioWithFallback(): void {
    if (!this.audio) return

    console.log("Attempting to load audio from:", this.currentAudioSrc)

    // Set up a timeout to try fallback if primary source fails
    this.loadingTimeout = setTimeout(() => {
      if (!this.isLoaded && this.audio) {
        console.log("Primary audio source failed, trying fallback...")
        this.tryFallbackAudio()
      }
    }, 5000)

    // Try to load the primary source
    this.audio.src = this.currentAudioSrc
    this.loadAttempted = true
    this.audio.load()
  }

  /**
   * TRIES FALLBACK AUDIO SOURCES
   *
   * This method attempts to load alternative audio sources if the primary fails.
   */
  private tryFallbackAudio(): void {
    if (!this.audio || this.isLoaded) return

    // Try the fallback path
    if (this.currentAudioSrc !== AUDIO_CONFIG.FALLBACK_AUDIO_PATH) {
      console.log("Trying fallback audio path:", AUDIO_CONFIG.FALLBACK_AUDIO_PATH)
      this.currentAudioSrc = AUDIO_CONFIG.FALLBACK_AUDIO_PATH
      this.audio.src = this.currentAudioSrc
      this.audio.load()

      // Set another timeout for the fallback
      setTimeout(() => {
        if (!this.isLoaded) {
          console.log("All audio sources failed, marking as loaded to prevent UI blocking")
          this.handleLoadSuccess()
        }
      }, 5000)
    } else {
      // All sources failed, mark as loaded to prevent UI blocking
      console.log("All audio sources exhausted, marking as loaded")
      this.handleLoadSuccess()
    }
  }

  /**
   * SETS UP ALL AUDIO EVENT LISTENERS
   *
   * This method configures all the event listeners needed to track audio state.
   */
  private setupEventListeners(): void {
    if (!this.audio) return

    this.audio.addEventListener("canplay", () => {
      console.log("Audio can start playing")
      this.handleLoadSuccess()
    })

    this.audio.addEventListener("canplaythrough", () => {
      console.log("Audio can play through without interruption")
      this.handleLoadSuccess()
    })

    this.audio.addEventListener("loadedmetadata", () => {
      console.log("Audio metadata loaded")
    })

    this.audio.addEventListener("loadeddata", () => {
      console.log("Audio data loaded")
      this.handleLoadSuccess()
    })

    this.audio.addEventListener("loadstart", () => {
      console.log("Audio loading started for:", this.currentAudioSrc)
    })

    this.audio.addEventListener("progress", () => {
      console.log("Audio loading progress")
    })

    this.audio.addEventListener("suspend", () => {
      console.log("Audio loading suspended")
      this.resumeLoading()
    })

    this.audio.addEventListener("stalled", () => {
      console.log("Audio loading stalled")
      this.resumeLoading()
    })

    this.audio.addEventListener("error", (event) => {
      this.handleLoadError(event)
    })
  }

  /**
   * HANDLES SUCCESSFUL AUDIO LOADING
   */
  private handleLoadSuccess(): void {
    if (!this.isLoaded) {
      this.isLoaded = true
      console.log("Audio marked as loaded successfully")

      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout)
        this.loadingTimeout = null
      }
    }
  }

  /**
   * HANDLES AUDIO LOADING ERRORS WITH DETAILED LOGGING
   */
  private handleLoadError(event: Event): void {
    const audioElement = event.target as HTMLAudioElement
    let errorMessage = "Unknown audio error"

    if (audioElement.error) {
      switch (audioElement.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio loading was aborted"
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error while loading audio"
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio decoding error"
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Audio format not supported or file not found"
          break
        default:
          errorMessage = `Audio error code: ${audioElement.error.code}`
      }
    }

    console.error("Audio loading failed:", errorMessage)
    console.error("Failed audio source:", this.currentAudioSrc)
    console.error("Current domain:", window.location.origin)

    // Try fallback if we haven't already
    if (this.currentAudioSrc !== AUDIO_CONFIG.FALLBACK_AUDIO_PATH) {
      this.tryFallbackAudio()
    } else {
      // All sources failed, mark as loaded anyway
      this.handleLoadSuccess()
    }
  }

  /**
   * ATTEMPTS TO RESUME AUDIO LOADING
   */
  private resumeLoading(): void {
    if (this.audio && !this.isLoaded) {
      setTimeout(() => {
        if (this.audio && !this.isLoaded) {
          console.log("Attempting to resume audio loading")
          try {
            this.audio.load()
          } catch (error) {
            console.log("Failed to resume loading:", error)
            this.handleLoadSuccess()
          }
        }
      }, 1000)
    }
  }

  /**
   * STARTS PLAYING THE BACKGROUND MUSIC
   */
  async play(): Promise<void> {
    if (!this.audio) {
      throw new Error("Audio not initialized")
    }

    try {
      console.log("Attempting to play audio from:", this.currentAudioSrc)
      await this.audio.play()
      console.log("Audio playback started successfully")

      if (!this.isLoaded) {
        this.handleLoadSuccess()
      }
    } catch (error) {
      console.log("Audio autoplay blocked or failed:", error)
      throw error
    }
  }

  /**
   * STOPS THE BACKGROUND MUSIC
   */
  pause(): void {
    if (this.audio) {
      this.audio.pause()
    }
  }

  /**
   * ADJUSTS THE MUSIC VOLUME
   */
  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume))

    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.currentVolume
    }
  }

  /**
   * MUTES OR UNMUTES THE MUSIC
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted

    if (this.audio) {
      this.audio.volume = muted ? 0 : this.currentVolume
    }
  }

  /**
   * GETS THE CURRENT LOADING STATE
   */
  isAudioLoaded(): boolean {
    return this.isLoaded
  }

  /**
   * FORCES THE AUDIO TO BE MARKED AS LOADED
   */
  forceLoad(): void {
    this.handleLoadSuccess()
  }

  /**
   * GETS DEBUGGING INFORMATION
   */
  getDebugInfo(): object {
    return {
      isLoaded: this.isLoaded,
      loadAttempted: this.loadAttempted,
      currentSrc: this.currentAudioSrc,
      originalSrc: this.audioSrc,
      audioElement: this.audio
        ? {
            src: this.audio.src,
            readyState: this.audio.readyState,
            networkState: this.audio.networkState,
            error: this.audio.error,
          }
        : null,
    }
  }

  /**
   * CLEANS UP THE AUDIO SERVICE
   */
  destroy(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout)
      this.loadingTimeout = null
    }

    if (this.audio) {
      this.audio.pause()
      this.audio.src = ""
      this.audio.load()
      this.audio = null
    }
    this.isLoaded = false
    this.loadAttempted = false
  }
}
