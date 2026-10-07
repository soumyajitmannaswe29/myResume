'use client'

// Lightweight Web Audio API synthesizer for futuristic tactile sound effects.
// 0 bytes external audio files needed!

let audioCtx: AudioContext | null = null
let soundEnabled = false

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function isSoundEnabled(): boolean {
  return soundEnabled
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled
  if (soundEnabled) {
    playBlip(660, 0.08, 'sine')
  }
  return soundEnabled
}

export function playBlip(freq = 540, duration = 0.06, type: OscillatorType = 'sine', volume = 0.08) {
  if (!soundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration)

    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Graceful fallback if audio is blocked
  }
}

export function playSuccessChime() {
  if (!soundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.07)
      gain.gain.setValueAtTime(0.06, now + i * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.07)
      osc.stop(now + i * 0.07 + 0.25)
    })
  } catch {
    // Ignore audio errors
  }
}

export function playTerminalKey() {
  if (!soundEnabled) return
  const freq = 400 + Math.random() * 250
  playBlip(freq, 0.03, 'sine', 0.03)
}
