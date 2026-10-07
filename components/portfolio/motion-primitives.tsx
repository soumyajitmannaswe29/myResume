'use client'

import { animate, motion, useInView, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'
import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index?: string
  eyebrow: string
  title: ReactNode
  description?: string
}) {
  return (
    <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em]">
          {index && <span className="text-mint">{index}</span>}
          <span aria-hidden className="h-px w-10 bg-gradient-to-r from-mint to-transparent" />
          <span className="text-muted-foreground">{eyebrow}</span>
        </div>
        <h2 className="font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance md:text-6xl">{title}</h2>
      </div>
      {description && (
        <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground lg:pb-2 lg:text-right">{description}</p>
      )}
    </Reveal>
  )
}

export function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, decimals, suffix])

  return (
    <span ref={ref} className="tabular-nums">
      {`${(0).toFixed(decimals)}${suffix}`}
    </span>
  )
}

export function Magnetic({ children, className, strength = 0.3 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 })

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x, y }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glow = 'rgba(16,185,129,0.18)',
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  glow?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), { stiffness: 180, damping: 18 })
  const spotX = useTransform(px, (v) => `${v * 100}%`)
  const spotY = useTransform(py, (v) => `${v * 100}%`)
  const background = useTransform(
    [spotX, spotY],
    ([sx, sy]) => `radial-gradient(420px circle at ${sx} ${sy}, ${glow}, transparent 60%)`,
  )

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        px.set(0.5)
        py.set(0.5)
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn('group relative', className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      {children}
    </motion.div>
  )
}
