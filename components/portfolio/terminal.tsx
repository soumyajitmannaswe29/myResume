'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { education, profile, projects, skills } from '@/lib/portfolio-data'
import { SectionHeading, Reveal } from './motion-primitives'
import { setBackground3DMode, Background3DMode } from '@/lib/theme-3d'
import { playTerminalKey, playSuccessChime } from '@/lib/sound-fx'

type Line = { type: 'input' | 'output' | 'accent' | 'success' | 'warn'; text: string }

const QUICK_COMMANDS = ['help', 'skills', 'projects', 'predict', 'education', 'socials', 'mode quantum', 'matrix', 'sudo']

const welcome: Line[] = [
  { type: 'accent', text: 'SM.ai interactive shell v2.0 [Three.js 3D Engine Linked]' },
  { type: 'output', text: "Type 'help' to see all commands, or click any command chip below." },
]

function run(cmd: string): Line[] | 'clear' {
  const parts = cmd.trim().split(/\s+/)
  const primary = parts[0]?.toLowerCase()
  const arg = parts[1]?.toLowerCase()

  switch (primary) {
    case 'help':
      return [
        { type: 'accent', text: 'COMMAND DIRECTORY:' },
        { type: 'output', text: '  skills           list categorized technical stack' },
        { type: 'output', text: '  projects         inspect deep learning & web projects' },
        { type: 'output', text: '  predict          simulate CNN plant pathology inference' },
        { type: 'output', text: '  education        display academic milestones & CGPA' },
        { type: 'output', text: '  contact          copy phone & email to clipboard' },
        { type: 'output', text: '  socials          links to GitHub, LinkedIn, LeetCode' },
        { type: 'output', text: '  mode <type>      switch 3D background: synapse | matrix | quantum' },
        { type: 'output', text: '  matrix           initiate cyber code rain stream' },
        { type: 'output', text: '  whoami           engineer overview' },
        { type: 'output', text: '  sudo             recruiter priority override' },
        { type: 'output', text: '  clear            purge terminal screen' },
      ]

    case 'projects':
      return projects.flatMap((p) => [
        { type: 'accent' as const, text: `▸ ${p.title} [${p.category}]` },
        { type: 'output' as const, text: `  ${p.description}` },
        { type: 'output' as const, text: `  Stack: ${p.stack.join(', ')}` },
      ])

    case 'predict':
      return [
        { type: 'accent', text: 'Initiating CNN Feature Extraction Pipeline...' },
        { type: 'output', text: '  [✓] Input Tensor: (1, 224, 224, 3) normalized' },
        { type: 'output', text: '  [✓] Layer 1: Conv2D(32, 3x3) -> BatchNorm -> ReLU' },
        { type: 'output', text: '  [✓] Layer 2: MaxPool2D(2, 2) -> Conv2D(64, 3x3)' },
        { type: 'output', text: '  [✓] Dense Layer: Dropout(0.25) -> Softmax(4 classes)' },
        { type: 'success', text: 'RESULT: Tomato Leaf — Early Blight (Confidence: 97.4%)' },
        { type: 'output', text: 'Treatment: Copper hydroxide spray recommended.' },
      ]

    case 'mode':
    case 'theme': {
      if (arg === 'synapse' || arg === 'matrix' || arg === 'quantum') {
        setBackground3DMode(arg as Background3DMode)
        return [
          { type: 'success', text: `✓ 3D Background mode switched to '${arg}'. Look around!` },
        ]
      }
      return [
        { type: 'warn', text: `Usage: mode <synapse | matrix | quantum>` },
      ]
    }

    case 'matrix':
      return [
        { type: 'success', text: '01000001 01001001 00100000 01001101 01001111 01000100 01000101 01001100' },
        { type: 'success', text: 'Wake up, recruiter... Follow the white rabbit.' },
        { type: 'success', text: 'Soumyajit Manna :: Neural Systems Architect.' },
      ]

    case 'skills': {
      const groups = { ai: 'AI / ML / Data', java: 'Core Java & DSA', web: 'Web & APIs' } as const
      return (Object.keys(groups) as (keyof typeof groups)[]).flatMap((k) => [
        { type: 'accent' as const, text: `▸ ${groups[k]}` },
        { type: 'output' as const, text: `  ${skills.filter((s) => s.category === k).map((s) => s.name).join(', ')}` },
      ])
    }

    case 'education':
      return education.flatMap((e) => [
        { type: 'accent' as const, text: `▸ ${e.period}  ${e.institute}` },
        { type: 'output' as const, text: `  ${e.degree}${e.highlight ? ` — ${e.highlight}` : ''}` },
      ])

    case 'contact': {
      const payload = `Email: ${profile.email}\nPhone: ${profile.phone}`
      navigator.clipboard?.writeText(payload).catch(() => {})
      return [
        { type: 'output', text: `Email: ${profile.email}` },
        { type: 'output', text: `Phone: ${profile.phone}` },
        { type: 'success', text: '✓ Copied contact info to clipboard.' },
      ]
    }

    case 'socials':
      return [
        { type: 'output', text: `GitHub:   ${profile.github}` },
        { type: 'output', text: `LinkedIn: ${profile.linkedin}` },
        { type: 'output', text: `LeetCode: ${profile.leetcode}` },
        { type: 'output', text: `Email:    ${profile.email}` },
      ]

    case 'sudo':
      playSuccessChime()
      return [
        { type: 'accent', text: '[sudo] password for visitor: **********' },
        { type: 'success', text: 'ACCESS GRANTED: Full recruiter privileges unlocked!' },
        { type: 'success', text: 'Soumyajit Manna has been fast-tracked for interview scheduling.' },
      ]

    case 'whoami':
      return [{ type: 'output', text: `${profile.name} — ${profile.role}, CSE @ IEM Kolkata. Passionate about Deep Learning and High-Performance Java Systems.` }]

    case 'clear':
      return 'clear'

    case '':
      return []

    default:
      return [{ type: 'warn', text: `command not found: '${cmd}'. Type 'help' to inspect available commands.` }]
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(welcome)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  function execute(raw: string) {
    const cmd = raw.trim()
    const result = run(cmd)
    if (cmd) setHistory((h) => [...h, cmd])
    setCursor(-1)
    if (result === 'clear') setLines([])
    else setLines((l) => [...l, { type: 'input', text: raw }, ...result])
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    execute(value)
    setValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    playTerminalKey()
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown' && cursor !== -1) {
      e.preventDefault()
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(-1)
        setValue('')
      } else {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'Tab') {
      const match = QUICK_COMMANDS.find((c) => c.startsWith(value.trim().toLowerCase()))
      if (match && value) {
        e.preventDefault()
        setValue(match)
      }
    }
  }

  return (
    <section id="terminal" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="05"
        eyebrow="Interactive CLI"
        title={
          <>
            Prefer the command line? <span className="text-muted-foreground">So do I.</span>
          </>
        }
        description="Recruiters and engineers: take it for a spin. Try 'predict', 'mode quantum', 'matrix', or 'sudo'."
      />

      <Reveal>
        <div
          className="glass overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Mac-style Window Titlebar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden />
              <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden />
              <span className="size-3 rounded-full bg-[#28c840]" aria-hidden />
              <p className="ml-3 font-mono text-xs text-muted-foreground">soumyajit@sm-ai: ~ (zsh)</p>
            </div>
            <span className="font-mono text-[10px] text-mint uppercase tracking-widest hidden sm:inline">
              interactive shell
            </span>
          </div>

          {/* Quick Clickable Command Pills */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/5 bg-white/[0.01] px-4 py-2.5">
            <span className="font-mono text-[10px] text-muted-foreground py-1 pr-1 hidden sm:inline">Quick commands:</span>
            {QUICK_COMMANDS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  execute(c)
                  playTerminalKey()
                }}
                className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-xs text-muted-foreground transition-all hover:border-mint/50 hover:bg-mint/10 hover:text-mint"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Terminal Output Body */}
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed md:h-96 md:p-6" aria-live="polite">
            {lines.map((line, i) => (
              <p
                key={i}
                className={`whitespace-pre-wrap break-words ${
                  line.type === 'accent'
                    ? 'text-cyan-neon font-semibold'
                    : line.type === 'success'
                    ? 'text-mint font-semibold'
                    : line.type === 'warn'
                    ? 'text-amber-400'
                    : line.type === 'input'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {line.type === 'input' && <span className="text-mint">{'❯ '}</span>}
                {line.text}
              </p>
            ))}

            <form onSubmit={handleSubmit} className="mt-1 flex items-center">
              <label htmlFor="terminal-input" className="text-mint font-bold">
                {'❯ '}
                <span className="sr-only">Terminal command</span>
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="type a command, e.g. 'predict' or 'help'..."
                className="ml-1.5 flex-1 bg-transparent text-foreground caret-mint outline-none placeholder:text-muted-foreground/30 font-mono"
              />
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
