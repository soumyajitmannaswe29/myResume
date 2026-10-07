import { ArrowUpRight, GraduationCap, Landmark, Quote, Sprout } from 'lucide-react'
import { skills } from '@/lib/portfolio-data'
import { AiRings } from './ai-rings'
import { LocationWidget } from './location-widget'
import { Counter, Reveal, SectionHeading } from './motion-primitives'

const stats = [
  { value: 8, decimals: 1, suffix: '', label: 'CGPA at IEM' },
  { value: 3, decimals: 0, suffix: '+', label: 'Shipped projects' },
  { value: skills.length, decimals: 0, suffix: '', label: 'Technologies' },
  { value: 2029, decimals: 0, suffix: '', label: 'Graduating' },
]

export function AboutBento() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="01"
        eyebrow="About"
        title={
          <>
            Algorithms with discipline. <span className="text-muted-foreground">Models with purpose.</span>
          </>
        }
        description="A quick look at who I am, where I study, and how I think about intelligence."
      />

      <div className="grid gap-4 lg:grid-cols-6">
        <Reveal className="lg:col-span-4 lg:row-span-2">
          <article className="glass relative flex h-full flex-col justify-between gap-12 overflow-hidden rounded-3xl p-6 md:p-10">
            <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-mint/10 blur-3xl" />
            <div className="relative">
              <p className="font-mono text-xs text-mint">{'$ whoami'}</p>
              <p className="mt-5 font-display text-2xl leading-snug font-semibold text-balance md:text-4xl md:leading-[1.15]">
                {"I'm a second-year CSE undergraduate at "}
                <span className="text-gradient">IEM Kolkata</span>
                {' who writes Java like a craftsman and trains neural networks like a scientist.'}
              </p>
              <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                From the fields of Khanakul to the labs of Kolkata, I build intelligence for grounded problems: diagnosing crop
                disease from a single photo of a leaf, or converting currencies as fast as you can type.
              </p>
            </div>
            <dl className="relative grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-[#0b1019] p-4 md:p-5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{s.label}</dt>
                  <dd className="mt-2 font-display text-3xl font-bold">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.05}>
          <LocationWidget />
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.1}>
          <a
            href="#education"
            className="glass group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-3xl p-6 transition-colors hover:border-mint/30"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                <GraduationCap className="size-5" aria-hidden />
              </span>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint" aria-hidden />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Academic pedigree</p>
              <h3 className="mt-2 font-display text-xl font-bold">B.Tech CSE · IEM Kolkata</h3>
              <p className="mt-1 text-sm text-muted-foreground">Rooted in Hooghly: Arambagh HS · Sekendarpur HS</p>
            </div>
          </a>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={0.05}>
          <AiRings />
        </Reveal>

        <Reveal className="lg:col-span-3" delay={0.1}>
          <article className="glass relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl p-6 md:p-8">
            <Quote aria-hidden className="absolute -top-2 right-4 size-28 text-white/[0.04]" />
            <blockquote className="relative font-display text-xl leading-snug font-semibold text-balance md:text-2xl">
              {'“Intelligence is only as valuable as the '}
              <span className="text-mint">real-world problem</span>
              {' it solves.”'}
            </blockquote>
            <ul className="relative grid gap-3 sm:grid-cols-2">
              <li className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <Sprout className="size-5 text-mint" aria-hidden />
                <p className="mt-3 text-sm font-semibold">Agriculture</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">CNNs that flag leaf disease before it spreads.</p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <Landmark className="size-5 text-cyan-neon" aria-hidden />
                <p className="mt-3 text-sm font-semibold">Finance</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Live forex engines with instant conversions.</p>
              </li>
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
