import { Asterisk } from 'lucide-react'

const primary = ['Java', 'Data Structures', 'Python', 'CNNs', 'NumPy', 'Pandas', 'Seaborn', 'SQL', 'JavaScript', 'REST APIs']
const secondary = ['Neural Networks', 'Computer Vision', 'Model Evaluation', 'Algorithms', 'Data Pipelines', 'Linux', 'Tailwind', 'Git']

function Track({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      {[...items, ...items].map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-6 pr-6 font-display text-2xl font-bold uppercase md:text-4xl">
          {item}
          <Asterisk className="size-6 shrink-0 md:size-8" />
        </span>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <div aria-hidden className="relative overflow-hidden py-16">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2.5deg] border-y border-white/10 bg-surface py-4 text-muted-foreground/60">
        <Track items={secondary} reverse />
      </div>
      <div className="relative -mx-[5%] w-[110%] -rotate-[2deg] bg-mint py-4 text-primary-foreground shadow-[0_20px_60px_-20px_rgba(0,245,160,0.5)]">
        <Track items={primary} />
      </div>
    </div>
  )
}
