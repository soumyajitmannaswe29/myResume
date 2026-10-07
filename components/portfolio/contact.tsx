'use client'

import { Check, Copy, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react'
import { GithubIcon as Github } from './github-icon'
import { useState, type FormEvent } from 'react'
import { profile } from '@/lib/portfolio-data'
import { Magnetic, Reveal, SectionHeading } from './motion-primitives'
import { playBlip, playSuccessChime } from '@/lib/sound-fx'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(profile.phone)
      setCopied(true)
      playBlip(680, 0.05, 'triangle')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    playSuccessChime()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '')
    const from = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${from})`)
    setSubmitted(true)
    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    }, 400)
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-mint/50 focus:bg-white/[0.05]'

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="06"
        eyebrow="Contact"
        title={
          <>
            {"Let's build something "}
            <span className="text-gradient">intelligent.</span>
          </>
        }
        description="Open to internships, research collaborations and ambitious engineering roles."
      />

      <Reveal>
        <div className="glass grid overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.3fr]">
          <div className="relative flex flex-col justify-between gap-10 border-b border-white/10 p-6 md:p-10 lg:border-r lg:border-b-0">
            <div aria-hidden className="absolute -top-20 -left-20 size-64 rounded-full bg-mint/10 blur-3xl" />
            <ul className="relative space-y-6">
              <li>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                <div className="flex items-center gap-3">
                  <a
                    href={profile.phoneHref}
                    onClick={() => playBlip(550, 0.04, 'sine')}
                    className="inline-flex items-center gap-2 font-display text-xl font-semibold hover:text-mint"
                  >
                    <Phone className="size-4 text-mint" aria-hidden />
                    {profile.phone}
                  </a>
                  <button
                    type="button"
                    onClick={copyPhone}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
                    aria-label={copied ? 'Phone number copied' : 'Copy phone number'}
                  >
                    {copied ? <Check className="size-4 text-mint" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </li>
              <li>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <a
                  href={`mailto:${profile.email}`}
                  onClick={() => playBlip(550, 0.04, 'sine')}
                  className="inline-flex items-center gap-2 break-all hover:text-mint"
                >
                  <Mail className="size-4 shrink-0 text-mint" aria-hidden />
                  {profile.email}
                </a>
              </li>
              <li>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                <p className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-mint" aria-hidden />
                  {profile.shortLocation}
                </p>
              </li>
            </ul>

            {/* Profile Links */}
            <div className="relative flex flex-wrap gap-2 pt-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-mint/50 hover:bg-white/5 hover:text-foreground"
              >
                <Github className="size-3.5" aria-hidden />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-mint/50 hover:bg-white/5 hover:text-foreground"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                LinkedIn
              </a>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-mint/50 hover:bg-white/5 hover:text-foreground"
              >
                LeetCode
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 md:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">Name</label>
                <input id="name" name="name" required autoComplete="name" placeholder="Ada Lovelace" className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm text-muted-foreground">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Tell me about the role, internship or project…"
                className={`${inputClass} resize-none`}
              />
            </div>
            <Magnetic strength={0.15}>
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint to-cyan-neon px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-8px_rgba(0,245,160,0.7)] transition-transform hover:scale-105 active:scale-95"
              >
                {submitted ? 'Opening Mail Client...' : 'Send Message'}
                <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </button>
            </Magnetic>
          </form>
        </div>
      </Reveal>
    </section>
  )
}
