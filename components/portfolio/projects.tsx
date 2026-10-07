'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { projects, type Project } from '@/lib/portfolio-data'
import { GithubIcon } from './github-icon'
import { SectionHeading } from './motion-primitives'
import { ProjectModal } from './project-modal'
import { playBlip } from '@/lib/sound-fx'

const accents = ['#00F5A0', '#06B6D4', '#34D399']

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia('(min-width: 768px)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia('(min-width: 768px)').matches,
    () => false,
  )
}

export function Projects() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })
  const isDesktop = useIsDesktop()
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'ai' | 'web'>('all')

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'ai') return p.category.toLowerCase().includes('learning') || p.category.toLowerCase().includes('vision')
    if (filter === 'web') return p.category.toLowerCase().includes('api') || p.category.toLowerCase().includes('financial')
    return true
  })

  function handleOpenModal(project: Project) {
    setActiveModalProject(project)
    playBlip(750, 0.08, 'triangle')
  }

  return (
    <section id="projects" className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-32">
      <SectionHeading
        index="03"
        eyebrow="Featured Work"
        title={
          <>
            Projects that <span className="text-gradient">think</span>, ship and scale.
          </>
        }
        description="Three builds spanning computer vision, real-time APIs and financial tooling. Click 'Interactive Lab' on any project to test it live!"
      />

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter projects">
        <button
          type="button"
          onClick={() => {
            setFilter('all')
            playBlip(520, 0.04, 'sine')
          }}
          className={`rounded-full px-4 py-2 font-mono text-xs transition-all ${
            filter === 'all'
              ? 'border border-mint/40 bg-mint/15 font-semibold text-mint shadow-[0_0_16px_-4px_rgba(0,245,160,0.5)]'
              : 'border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setFilter('ai')
            playBlip(520, 0.04, 'sine')
          }}
          className={`rounded-full px-4 py-2 font-mono text-xs transition-all ${
            filter === 'ai'
              ? 'border border-mint/40 bg-mint/15 font-semibold text-mint shadow-[0_0_16px_-4px_rgba(0,245,160,0.5)]'
              : 'border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground'
          }`}
        >
          Deep Learning &amp; Vision (1)
        </button>
        <button
          type="button"
          onClick={() => {
            setFilter('web')
            playBlip(520, 0.04, 'sine')
          }}
          className={`rounded-full px-4 py-2 font-mono text-xs transition-all ${
            filter === 'web'
              ? 'border border-cyan-neon/40 bg-cyan-neon/15 font-semibold text-cyan-neon shadow-[0_0_16px_-4px_rgba(6,182,212,0.5)]'
              : 'border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground'
          }`}
        >
          Web, Real-Time &amp; FinTech (2)
        </button>
      </div>

      <div ref={container} className="relative space-y-6 md:space-y-0">
        {filteredProjects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            total={filteredProjects.length}
            progress={scrollYProgress}
            sticky={isDesktop}
            onOpenModal={() => handleOpenModal(project)}
          />
        ))}
      </div>

      {/* Interactive Modal */}
      <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
    </section>
  )
}

function ProjectCard({
  project,
  index,
  total,
  progress,
  sticky,
  onOpenModal,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
  sticky: boolean
  onOpenModal: () => void
}) {
  const targetScale = 1 - (total - 1 - index) * 0.05
  const scale = useTransform(progress, [index / Math.max(1, total), 1], [1, targetScale])
  const accent = accents[index % accents.length]

  return (
    <div className="md:sticky md:top-0 md:flex md:h-svh md:items-center">
      <motion.article
        style={{ ...(sticky ? { scale, top: index * 28 } : {}), '--accent': accent } as CSSProperties}
        className="group relative grid w-full origin-top overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0f19] shadow-[0_-30px_80px_-30px_rgba(0,0,0,0.95)] md:h-[min(76vh,600px)] md:grid-cols-2"
      >
        <div className="relative min-h-64 overflow-hidden md:min-h-0">
          <Image
            src={project.image}
            alt={`${project.title} interface preview`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0a0f19] via-[#0a0f19]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0a0f19]" />
          <div aria-hidden className="scanlines absolute inset-0 opacity-50" />
          <span
            aria-hidden
            className="absolute top-4 left-5 font-display text-7xl leading-none font-bold text-white/15 md:text-9xl"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="relative flex flex-col p-6 md:p-10">
          <div
            aria-hidden
            className="absolute -top-32 -right-32 size-72 rounded-full opacity-20 blur-3xl"
            style={{ background: accent }}
          />
          <div className="relative flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="text-[var(--accent)]">{project.category}</span>
            <span className="text-muted-foreground">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <h3 className="relative mt-5 font-display text-3xl leading-[1.05] font-bold text-balance md:text-4xl">{project.title}</h3>
          <p className="relative mt-4 text-pretty leading-relaxed text-muted-foreground">{project.description}</p>

          <div className="relative mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Architecture highlights</p>
            <ul className="mt-3 space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <ul className="relative mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>

          <div className="relative mt-8 flex flex-wrap gap-3 md:mt-auto md:pt-8">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <GithubIcon className="size-4" aria-hidden />
              Source
            </a>
            <button
              type="button"
              onClick={onOpenModal}
              className="group/btn inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_rgba(0,245,160,0.6)] transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="size-4" aria-hidden />
              Interactive Lab
              <ArrowUpRight className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden />
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
