'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Box, ChevronDown, ChevronUp, Cpu, Eye, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Background3DMode,
  getBackground3DSettings,
  setBackground3DMode,
  subscribeBackground3D,
} from '@/lib/theme-3d'
import { isSoundEnabled, playBlip, toggleSound } from '@/lib/sound-fx'

const MODES: { id: Background3DMode; label: string; icon: typeof Cpu; desc: string }[] = [
  { id: 'synapse', label: 'Neural Synapses', icon: Cpu, desc: 'Synaptic nodes & dynamic 3D graph' },
  { id: 'matrix', label: 'Cyber Matrix', icon: Box, desc: 'Undulating cyber terrain & cubes' },
  { id: 'quantum', label: 'Quantum Field', icon: Sparkles, desc: '2000+ cosmic particle vortex' },
]

export function ThreeHud() {
  const [mode, setMode] = useState<Background3DMode>('synapse')
  const [expanded, setExpanded] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  useEffect(() => {
    setMode(getBackground3DSettings().mode)
    setSoundOn(isSoundEnabled())
    const unsubscribe = subscribeBackground3D((settings) => {
      setMode(settings.mode)
    })
    return () => unsubscribe()
  }, [])

  function switchMode(newMode: Background3DMode) {
    setBackground3DMode(newMode)
    playBlip(720, 0.08, 'triangle')
  }

  function handleSoundToggle() {
    const nextState = toggleSound()
    setSoundOn(nextState)
  }

  const activeModeObj = MODES.find((m) => m.id === mode) ?? MODES[0]
  const IconComponent = activeModeObj.icon

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass mb-2.5 w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#090d16]/90 p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                3D Engine Modes
              </span>
              <button
                type="button"
                onClick={handleSoundToggle}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-mint"
                title={soundOn ? 'Sound FX On (Click to Mute)' : 'Sound FX Off (Click to Enable)'}
              >
                {soundOn ? <Volume2 className="size-3 text-mint" /> : <VolumeX className="size-3" />}
                <span>{soundOn ? 'SFX ON' : 'SFX OFF'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {MODES.map((m) => {
                const isSelected = m.id === mode
                const MIcon = m.icon
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => switchMode(m.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl p-2 text-left text-xs transition-all ${
                      isSelected
                        ? 'border border-mint/40 bg-mint/10 text-mint shadow-[0_0_20px_-6px_rgba(0,245,160,0.5)]'
                        : 'border border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-mint/20 text-mint' : 'bg-white/5 text-muted-foreground'
                      }`}
                    >
                      <MIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{m.label}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{m.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main compact HUD pill button */}
      <button
        type="button"
        onClick={() => {
          setExpanded((prev) => !prev)
          playBlip(520, 0.05, 'sine')
        }}
        className="glass group flex items-center gap-2.5 rounded-full border border-white/15 bg-[#090d16]/85 px-3.5 py-2 text-xs font-mono shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all hover:border-mint/50 hover:shadow-[0_0_24px_-6px_rgba(0,245,160,0.4)]"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-mint" />
        </span>

        <span className="text-muted-foreground transition-colors group-hover:text-foreground">
          3D: <span className="font-semibold text-mint">{activeModeObj.label}</span>
        </span>

        <span className="rounded bg-white/10 px-1 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
          60FPS
        </span>

        {expanded ? (
          <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:text-mint" />
        ) : (
          <ChevronUp className="size-3.5 text-muted-foreground transition-transform group-hover:text-mint" />
        )}
      </button>
    </div>
  )
}
