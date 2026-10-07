'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BrainCircuit, Code2, RefreshCw, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { TiltCard } from './motion-primitives'
import { HoloOrb3D } from './holo-orb-3d'
import { playBlip } from '@/lib/sound-fx'

const predictions = [
  { label: 'Tomato · Early Blight', confidence: 97.4, latency: '18ms', leafCode: 'SOLA-LYC-EB' },
  { label: 'Potato · Late Blight', confidence: 94.1, latency: '22ms', leafCode: 'SOLA-TUB-LB' },
  { label: 'Apple · Healthy Leaf', confidence: 99.2, latency: '14ms', leafCode: 'MALU-DOM-HL' },
  { label: 'Corn · Common Rust', confidence: 92.8, latency: '19ms', leafCode: 'ZEA-MAYS-CR' },
]

const layers = ['conv', 'pool', 'conv', 'pool', 'dense', 'softmax']

const chips = [
  { label: 'CNN Classifier', icon: BrainCircuit, className: 'top-14 -left-3 sm:-left-10', delay: 0 },
  { label: 'Java DSA', icon: Code2, className: 'top-[36%] -right-3 sm:-right-9', delay: 0.9 },
  { label: 'API Sync', icon: RefreshCw, className: 'bottom-40 -left-3 sm:-left-12', delay: 1.8 },
]

export function HoloCard() {
  const [index, setIndex] = useState(0)
  const [isManual, setIsManual] = useState(false)

  useEffect(() => {
    if (isManual) return
    const id = setInterval(() => setIndex((i) => (i + 1) % predictions.length), 3400)
    return () => clearInterval(id)
  }, [isManual])

  const prediction = predictions[index]

  function selectPrediction(idx: number) {
    setIsManual(true)
    setIndex(idx)
    playBlip(680, 0.07, 'triangle')
    // Reset manual override after 8 seconds of inactivity
    setTimeout(() => setIsManual(false), 8000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[420px]"
    >
      <div aria-hidden className="absolute -inset-12 -z-10 rounded-full bg-mint/15 blur-[90px]" />

      <TiltCard maxTilt={9} className="rounded-[28px]" glow="rgba(0,245,160,0.18)">
        <div className="holo-border rounded-[28px] p-px shadow-[0_40px_120px_-40px_rgba(0,245,160,0.45)]">
          <div className="relative overflow-hidden rounded-[27px] bg-[#060a12]">
            {/* 3D Neural Core Hologram */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#080d18] to-[#04070d]">
              {/* Fallback image behind 3D canvas */}
              <Image
                src="/images/neural-orb.png"
                alt="Glowing holographic neural network orb"
                fill
                priority
                sizes="(min-width: 1024px) 400px, 90vw"
                className="object-cover opacity-25"
              />

              {/* Real-time 3D Three.js Holographic Core */}
              <div className="absolute inset-0">
                <HoloOrb3D pulseKey={prediction.label} className="size-full" />
              </div>

              <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />
              <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#060a12]/80 via-transparent to-[#060a12]" />
            </div>

            {/* Header info */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-mint" />
                neural_core // 3d
              </span>
              <span className="flex items-center gap-1.5 text-mint">
                <span className="size-1.5 animate-pulse rounded-full bg-mint" aria-hidden />
                inference: {prediction.latency}
              </span>
            </div>

            {/* Interactive Model Inference Panel */}
            <div className="glass absolute inset-x-3 bottom-3 rounded-2xl p-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>
                  <span className="text-cyan-neon">cnn_leaf_model</span>.infer({prediction.leafCode})
                </span>
                <span className="rounded border border-mint/30 bg-mint/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-mint">
                  interactive 3d
                </span>
              </div>

              {/* Sample Selector Tabs */}
              <div className="mt-2.5 flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Sample test leaves">
                {predictions.map((p, i) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => selectPrediction(i)}
                    className={`rounded-md px-2 py-0.5 font-mono text-[9px] whitespace-nowrap transition-all ${
                      i === index
                        ? 'border border-mint/50 bg-mint/20 text-mint shadow-[0_0_12px_rgba(0,245,160,0.4)]'
                        : 'border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p.label.split(' · ')[0]}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex items-end justify-between gap-3" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={prediction.label}
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-base font-semibold"
                  >
                    {prediction.label}
                  </motion.p>
                </AnimatePresence>
                <span className="font-mono text-sm tabular-nums text-mint font-bold">{prediction.confidence.toFixed(1)}%</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={index}
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.confidence}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-mint to-cyan-neon"
                />
              </div>

              <ol className="mt-2.5 flex flex-wrap gap-1 font-mono text-[9px] uppercase tracking-wider">
                {layers.map((layer, i) => (
                  <motion.li
                    key={`${layer}-${i}`}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.18 }}
                    className="rounded border border-mint/20 bg-mint/5 px-1.5 py-0.5 text-mint"
                  >
                    {layer}
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </TiltCard>

      {chips.map(({ label, icon: Icon, className, delay }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.9 + delay * 0.3, duration: 0.5 },
            scale: { delay: 0.9 + delay * 0.3, duration: 0.5 },
            y: { duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay },
          }}
          className={`glass pointer-events-none absolute z-20 flex items-center gap-2 rounded-full bg-[#0a1220]/80 px-3 py-2 text-xs font-medium shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] ${className}`}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-mint/15 text-mint">
            <Icon className="size-3" aria-hidden />
          </span>
          {label}
        </motion.div>
      ))}
    </motion.div>
  )
}
