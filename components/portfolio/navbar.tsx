'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { navLinks } from '@/lib/portfolio-data'
import { Magnetic } from './motion-primitives'
import { playBlip, playSuccessChime } from '@/lib/sound-fx'

async function fireConfetti() {
  const confetti = (await import('canvas-confetti')).default
  const colors = ['#10B981', '#00F5A0', '#06B6D4', '#ffffff']
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.15 }, colors })
  setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.4 }, colors }), 150)
  setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.4 }, colors }), 300)
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  function hireMe() {
    playSuccessChime()
    fireConfetti()
    setOpen(false)
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 500)
  }

  function handleNavClick() {
    playBlip(560, 0.04, 'sine')
    setOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Primary"
        className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 pr-2 pl-5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
      >
        <a
          href="#top"
          onClick={() => playBlip(640, 0.04, 'sine')}
          className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          aria-label="Soumyajit Manna, home"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-mint" />
          </span>
          <span>
            SM<span className="text-mint">.ai</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <a
                href={link.href}
                onClick={handleNavClick}
                onMouseEnter={() => setHovered(link.href)}
                className="relative z-10 block px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
              {hovered === link.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-white/[0.06]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Magnetic>
            <button
              type="button"
              onClick={hireMe}
              className="inline-flex items-center gap-1.5 rounded-full bg-mint px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_rgba(0,245,160,0.6)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Sparkles className="size-4" aria-hidden />
              Hire Me
            </button>
          </Magnetic>
          <button
            type="button"
            onClick={() => {
              setOpen((v) => !v)
              playBlip(500, 0.04, 'sine')
            }}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="glass mx-auto mt-2 max-w-5xl rounded-3xl p-2 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
