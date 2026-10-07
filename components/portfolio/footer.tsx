import { ArrowUp, Code, ExternalLink } from 'lucide-react'
import { navLinks, profile } from '@/lib/portfolio-data'
import { GithubIcon } from './github-icon'

export function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-white/10 pt-16">
      <div aria-hidden className="absolute bottom-0 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-mint/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-mint">
              <span className="size-1.5 rounded-full bg-mint animate-pulse" />
              <span>{'// end of transmission · 3d webgl active'}</span>
            </div>
            <p className="mt-3 max-w-md text-pretty text-muted-foreground">
              Designed &amp; engineered by {profile.name} in Hooghly, West Bengal. Built with Next.js, Three.js 3D, Tailwind CSS &amp; Framer Motion.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-mint"
              >
                <GithubIcon className="size-3.5" />
                GitHub
              </a>
              <span className="text-white/20">·</span>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-mint"
              >
                <ExternalLink className="size-3.5" />
                LinkedIn
              </a>
              <span className="text-white/20">·</span>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-mint"
              >
                <Code className="size-3.5" />
                LeetCode
              </a>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-mint">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden
          className="mt-14 bg-gradient-to-b from-white/25 to-white/0 bg-clip-text text-center font-display text-[clamp(3rem,12.5vw,12.5rem)] leading-[0.8] font-extrabold tracking-tighter text-transparent select-none"
        >
          SOUMYAJIT
        </p>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{`© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`}</p>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-mint">
            Back to top
            <ArrowUp className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
