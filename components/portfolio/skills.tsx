'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search, Sparkles, X } from 'lucide-react'
import { useRef, useState, type MouseEvent } from 'react'
import { skillFilters, skills, type SkillCategory } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'
import { SectionHeading } from './motion-primitives'
import { playBlip } from '@/lib/sound-fx'

const categoryLabel: Record<SkillCategory, string> = {
  ai: 'AI / ML / Data',
  java: 'Core Java & DSA',
  web: 'Web & APIs',
}

const coreCompetencies = [
  'Deep Learning & CNNs',
  'Java DSA (Trees, Graphs, DP)',
  'Feature Engineering & Pipelines',
  'REST APIs & Asynchronous State',
]

export function Skills() {
  const [active, setActive] = useState<'all' | SkillCategory>('all')
  const [query, setQuery] = useState('')
  const gridRef = useRef<HTMLUListElement>(null)

  const filtered = skills
    .filter((s) => (active === 'all' ? true : s.category === active))
    .filter((s) => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return (
        s.name.toLowerCase().includes(q) ||
        s.note.toLowerCase().includes(q) ||
        categoryLabel[s.category].toLowerCase().includes(q)
      )
    })

  function handleMove(e: MouseEvent<HTMLUListElement>) {
    gridRef.current?.querySelectorAll<HTMLElement>('[data-spot]').forEach((el) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--x', `${e.clientX - rect.left}px`)
      el.style.setProperty('--y', `${e.clientY - rect.top}px`)
    })
  }

  function handleSelectTab(tabId: 'all' | SkillCategory) {
    setActive(tabId)
    playBlip(540, 0.04, 'sine')
  }

  return (
    <section id="skills" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="04"
        eyebrow="Skill Matrix"
        title={
          <>
            A technical arsenal, <span className="text-muted-foreground">loaded and calibrated.</span>
          </>
        }
        description="Filter by domain or search by keyword. Move your cursor across the grid to light up synaptic pathways."
      />

      {/* Core Competencies highlights */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground mr-1">
          <Sparkles className="size-3.5 text-mint" />
          Specialisations:
        </span>
        {coreCompetencies.map((comp) => (
          <span
            key={comp}
            className="rounded-full border border-mint/25 bg-mint/[0.04] px-3 py-1 font-mono text-xs text-mint shadow-[0_0_15px_-4px_rgba(0,245,160,0.3)]"
          >
            {comp}
          </span>
        ))}
      </div>

      {/* Filters and Search Bar */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter skills" className="glass inline-flex w-fit flex-wrap gap-1 rounded-full p-1">
          {skillFilters.map((f) => {
            const selected = active === f.id
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handleSelectTab(f.id)}
                className="relative rounded-full px-4 py-2 text-sm"
              >
                {selected && (
                  <motion.span
                    layoutId="skill-tab"
                    className="absolute inset-0 rounded-full bg-mint shadow-[0_0_24px_-6px_rgba(0,245,160,0.8)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 transition-colors',
                    selected ? 'font-semibold text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Live Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skill (e.g. Java, CNN)..."
              className="w-full rounded-full border border-white/10 bg-white/[0.03] pl-9 pr-8 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-mint/50 focus:bg-white/[0.06]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <p className="hidden font-mono text-xs text-muted-foreground sm:block" aria-live="polite">
            <span className="text-mint font-bold">{filtered.length}</span>
            {` / ${skills.length} modules`}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">
          No skills matching <span className="text-mint font-bold">"{query}"</span> found in this category.
        </div>
      ) : (
        <motion.ul ref={gridRef} layout onMouseMove={handleMove} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((s) => {
              const filled = Math.round(s.level / 10)
              return (
                <motion.li
                  key={s.name}
                  layout
                  data-spot
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="spot-card group relative rounded-2xl p-px"
                >
                  <div className="relative h-full overflow-hidden rounded-[15px] bg-[#0b111c] p-5">
                    <div aria-hidden className="spot-fill pointer-events-none absolute inset-0" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {categoryLabel[s.category]}
                        </p>
                        <h3 className="mt-1.5 font-display text-lg leading-tight font-semibold">{s.name}</h3>
                      </div>
                      <span className="font-mono text-sm tabular-nums text-mint">{s.level}%</span>
                    </div>
                    <p className="relative mt-1 text-sm text-muted-foreground">{s.note}</p>
                    <div
                      className="relative mt-5 flex gap-1"
                      role="meter"
                      aria-valuenow={s.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${s.name} proficiency`}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scaleY: 0.2, opacity: 0 }}
                          whileInView={{ scaleY: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                          className={cn(
                            'h-2 flex-1 rounded-sm',
                            i < filled ? 'bg-mint shadow-[0_0_8px_rgba(0,245,160,0.5)]' : 'bg-white/10',
                          )}
                          style={i < filled ? { opacity: 0.45 + (i / filled) * 0.55 } : undefined}
                        />
                      ))}
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  )
}
