'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const rings = [
  {
    id: 'ai',
    short: 'AI',
    label: 'Artificial Intelligence',
    definition: 'The umbrella goal: machines that perceive, reason and act toward an objective.',
    example: 'Search, planning, expert systems',
    inset: 'inset-0',
  },
  {
    id: 'ml',
    short: 'ML',
    label: 'Machine Learning',
    definition: 'A subset of AI that learns patterns from data instead of following hand-written rules.',
    example: 'Regression, decision trees, SVMs',
    inset: 'inset-[17%]',
  },
  {
    id: 'dl',
    short: 'DL',
    label: 'Deep Learning',
    definition: 'A subset of ML: stacked neural layers, like CNNs, that learn features straight from raw pixels.',
    example: 'CNNs detecting leaf disease',
    inset: 'inset-[34%]',
  },
]

export function AiRings() {
  const [active, setActive] = useState('dl')
  const ring = rings.find((r) => r.id === active) ?? rings[2]

  return (
    <article className="glass flex h-full flex-col gap-8 rounded-3xl p-6 sm:flex-row sm:items-center md:p-8">
      <div className="relative mx-auto aspect-square w-48 shrink-0" role="group" aria-label="How AI, ML and Deep Learning relate">
        {rings.map((r, i) => {
          const isActive = r.id === active
          return (
            <button
              key={r.id}
              type="button"
              onMouseEnter={() => setActive(r.id)}
              onFocus={() => setActive(r.id)}
              onClick={() => setActive(r.id)}
              aria-pressed={isActive}
              aria-label={r.label}
              className={cn(
                'absolute flex justify-center rounded-full border font-mono text-[11px] font-medium transition-all duration-300',
                r.inset,
                i === rings.length - 1 ? 'items-center' : 'items-start pt-2.5',
                isActive
                  ? 'border-mint bg-mint/10 text-mint shadow-[0_0_40px_-8px_rgba(0,245,160,0.7)]'
                  : 'border-white/15 bg-white/[0.02] text-muted-foreground hover:text-foreground',
              )}
            >
              {r.short}
            </button>
          )
        })}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {'AI ⊃ ML ⊃ DL'} <span className="text-mint">· hover the rings</span>
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={ring.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
          >
            <h3 className="mt-3 font-display text-2xl font-bold">{ring.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ring.definition}</p>
            <p className="mt-4 font-mono text-xs text-cyan-neon">{`→ e.g. ${ring.example}`}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </article>
  )
}
