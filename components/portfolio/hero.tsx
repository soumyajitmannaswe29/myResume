'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Code, Download, ExternalLink } from 'lucide-react'
import { profile } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'
import { HoloCard } from './holo-card'
import { Counter, Magnetic } from './motion-primitives'
import { ScrambleCycle } from './scramble-text'
import { GithubIcon } from './github-icon'
import { playBlip } from '@/lib/sound-fx'

const ease = [0.22, 1, 0.36, 1] as const

const headline: { word: string; className?: string }[] = [
  { word: 'Crafting' },
  { word: 'Intelligent', className: 'text-gradient' },
  { word: 'Systems', className: 'text-gradient' },
  { word: 'from', className: 'text-muted-foreground' },
  { word: 'Neural', className: 'text-outline' },
  { word: 'Networks', className: 'text-outline' },
  { word: 'to', className: 'text-muted-foreground' },
  { word: 'Full-Stack' },
  { word: 'Architectures.' },
]

const roles = ['AI/ML Engineer', 'Full-Stack Java Dev', 'CNN Specialist', 'DSA Problem Solver']

const kpis = [
  { value: 8, decimals: 1, suffix: '', label: 'CGPA at IEM' },
  { value: 3, decimals: 0, suffix: '+', label: 'Production Projects' },
  { value: 100, decimals: 0, suffix: '%', label: 'Passion for AI' },
]

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden pt-28 pb-10 md:pt-32">
      {/* Soft gradient mask for text contrast against the 3D background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full md:w-3/4 bg-gradient-to-r from-background/90 via-background/60 to-transparent"
      />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-16 px-5 md:px-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-xs font-medium text-mint shadow-[0_0_20px_-6px_rgba(0,245,160,0.6)]">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-mint" />
              </span>
              {profile.status}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base md:text-lg"
          >
            <span className="font-semibold text-foreground">{"Hi, I'm Soumyajit Manna"}</span>
            <span aria-hidden className="text-muted-foreground">/</span>
            <ScrambleCycle words={roles} className="font-mono text-sm text-mint md:text-base" />
          </motion.p>

          <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.98] font-bold tracking-tight">
            <span className="sr-only">Crafting Intelligent Systems from Neural Networks to Full-Stack Architectures.</span>
            <span aria-hidden>
              {headline.map((w, i) => (
                <span key={w.word} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span
                    className={cn('inline-block', w.className)}
                    initial={{ y: '110%', rotate: 4 }}
                    animate={{ y: '0%', rotate: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease }}
                  >
                    {w.word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
            className="mt-7 max-w-xl text-pretty leading-relaxed text-muted-foreground md:text-lg"
          >
            I pair the precision of <span className="text-foreground">Java data structures &amp; algorithms</span> with{' '}
            <span className="text-foreground">deep-learning innovation</span>, training CNNs that can spot disease in a single
            leaf and building the full-stack systems that put them to work.
          </motion.p>

          {/* Action buttons & socials */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.25}>
              <a
                href="#projects"
                onClick={() => playBlip(620, 0.05, 'triangle')}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_44px_-8px_rgba(0,245,160,0.8)] transition-transform hover:scale-105 active:scale-95"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative">Explore Projects</span>
                <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href={profile.resume}
                download
                onClick={() => playBlip(540, 0.04, 'sine')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-all hover:border-mint/50 hover:bg-white/[0.08]"
              >
                <Download className="size-4" aria-hidden />
                Resume
              </a>
            </Magnetic>

            {/* Quick profile links */}
            <div className="flex items-center gap-2 pl-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub Profile"
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-muted-foreground transition-all hover:border-mint/40 hover:bg-white/5 hover:text-mint"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn Profile"
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-muted-foreground transition-all hover:border-mint/40 hover:bg-white/5 hover:text-mint"
              >
                <ExternalLink className="size-4" />
              </a>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noreferrer"
                title="LeetCode Profile"
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-muted-foreground transition-all hover:border-mint/40 hover:bg-white/5 hover:text-mint"
              >
                <Code className="size-4" />
              </a>
            </div>
          </motion.div>

          {/* KPI metrics */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10"
          >
            {kpis.map((k) => (
              <div key={k.label} className="px-4 py-4 first:pl-0">
                <dt className="sr-only">{k.label}</dt>
                <dd className="font-display text-3xl font-bold md:text-4xl">
                  <Counter value={k.value} decimals={k.decimals} suffix={k.suffix} />
                </dd>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground md:text-[11px]">
                  {k.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="lg:col-span-5">
          <HoloCard />
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-between px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:px-8">
        <a href="#about" className="group flex items-center gap-3 hover:text-foreground">
          <span className="relative h-10 w-px overflow-hidden bg-white/15" aria-hidden>
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-mint"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            />
          </span>
          Scroll to explore 3D space
        </a>
        <span className="hidden sm:inline">{'22.79°N · 87.86°E — Hooghly, WB'}</span>
      </div>
    </section>
  )
}
