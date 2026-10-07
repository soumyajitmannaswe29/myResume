'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { education } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'
import { SectionHeading } from './motion-primitives'

function CgpaRing({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div className="relative size-24 shrink-0" role="img" aria-label={`CGPA ${value.toFixed(1)} out of ${max}`}>
      <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="cgpa-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r="33"
          fill="none"
          stroke="url(#cgpa-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: value / max }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
        <span className="font-display text-xl font-bold">{value.toFixed(1)}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">CGPA</span>
      </div>
    </div>
  )
}

export function Education() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="education" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="02"
        eyebrow="Education"
        title={
          <>
            An academic path <span className="text-muted-foreground">rooted in Hooghly.</span>
          </>
        }
        description="From village classrooms to one of Kolkata's leading engineering institutes."
      />

      <div ref={ref} className="relative">
        <div aria-hidden className="absolute top-3 bottom-3 left-3 w-px -translate-x-1/2 bg-white/10 md:left-[200px]" />
        <motion.div
          aria-hidden
          style={{ scaleY }}
          className="absolute top-3 bottom-3 left-3 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-mint via-emerald-glow to-cyan-neon shadow-[0_0_12px_rgba(0,245,160,0.8)] md:left-[200px]"
        />

        <ol className="space-y-6 md:space-y-10">
          {education.map((item, i) => (
            <motion.li
              key={item.institute}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[24px_1fr] gap-4 md:grid-cols-[180px_40px_1fr] md:gap-0"
            >
              <p
                className={cn(
                  'hidden pt-1 pr-6 text-right font-display text-3xl leading-none font-bold md:block lg:text-4xl',
                  item.current ? 'text-gradient' : 'text-outline-faint',
                )}
              >
                {item.period.split(' – ')[0]}
              </p>

              <div className="flex justify-center pt-2">
                <span
                  className={cn(
                    'relative flex size-4 items-center justify-center rounded-full border-2 bg-background',
                    item.current ? 'border-mint' : 'border-white/25',
                  )}
                >
                  {item.current && <span className="absolute -inset-1.5 animate-ping rounded-full bg-mint/30" aria-hidden />}
                  <span className={cn('size-1.5 rounded-full', item.current ? 'bg-mint' : 'bg-white/30')} />
                </span>
              </div>

              <article
                className={cn(
                  'glass group flex flex-col gap-6 rounded-3xl p-6 transition-colors sm:flex-row sm:items-center sm:justify-between md:p-8',
                  item.current ? 'border-mint/25 hover:border-mint/45' : 'hover:border-white/20',
                )}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{item.period}</span>
                    {item.current && (
                      <span className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mint">
                        In progress
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-tight font-bold text-balance md:text-2xl">{item.institute}</h3>
                  <p className="mt-2 text-muted-foreground">{item.degree}</p>
                </div>
                {item.cgpa !== undefined && <CgpaRing value={item.cgpa} />}
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
