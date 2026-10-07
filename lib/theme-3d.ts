'use client'

export type Background3DMode = 'synapse' | 'matrix' | 'quantum'

export type Background3DSettings = {
  mode: Background3DMode
  speed: number
  particles: number
  cameraParallax: boolean
}

const DEFAULT_SETTINGS: Background3DSettings = {
  mode: 'synapse',
  speed: 1,
  particles: 180,
  cameraParallax: true,
}

let currentSettings: Background3DSettings = { ...DEFAULT_SETTINGS }
const listeners = new Set<(settings: Background3DSettings) => void>()

export function getBackground3DSettings(): Background3DSettings {
  return currentSettings
}

export function setBackground3DMode(mode: Background3DMode) {
  currentSettings = { ...currentSettings, mode }
  listeners.forEach((listener) => listener(currentSettings))
}

export function toggleBackground3DMode(): Background3DMode {
  const modes: Background3DMode[] = ['synapse', 'matrix', 'quantum']
  const nextIndex = (modes.indexOf(currentSettings.mode) + 1) % modes.length
  setBackground3DMode(modes[nextIndex])
  return modes[nextIndex]
}

export function setBackground3DParallax(cameraParallax: boolean) {
  currentSettings = { ...currentSettings, cameraParallax }
  listeners.forEach((listener) => listener(currentSettings))
}

export function subscribeBackground3D(callback: (settings: Background3DSettings) => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}
