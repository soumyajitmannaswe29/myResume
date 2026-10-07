'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-mint via-emerald-glow to-cyan-neon"
    />
  )
}

export function CursorGlow() {
  const x = useSpring(-100, { stiffness: 600, damping: 45, mass: 0.3 })
  const y = useSpring(-100, { stiffness: 600, damping: 45, mass: 0.3 })
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)

    function handleMove(e: PointerEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as Element | null
      setHovering(Boolean(target?.closest('a, button, input, textarea, [role="tab"]')))
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-[100]">
      <motion.div
        animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 1 : 0.7 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="-translate-x-1/2 -translate-y-1/2 size-8 rounded-full border border-mint/60 bg-mint/5 shadow-[0_0_24px_rgba(0,245,160,0.35)]"
      />
    </motion.div>
  )
}
