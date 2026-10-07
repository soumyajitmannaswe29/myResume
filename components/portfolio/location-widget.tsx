'use client'

import { MapPin } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { profile } from '@/lib/portfolio-data'

function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000)
  return () => clearInterval(id)
}

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: profile.timezone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
})

const hourFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: profile.timezone, hour: 'numeric', hour12: false })

function getSnapshot() {
  return Math.floor(Date.now() / 1000)
}

export function LocationWidget() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, () => 0)
  const date = new Date(seconds * 1000)
  const ready = seconds !== 0
  const hour = ready ? Number(hourFormatter.format(date)) : 12
  const isAwake = hour >= 7 && hour < 24

  return (
    <article className="glass relative h-full overflow-hidden rounded-3xl p-6">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60 [background-size:24px_24px]" />
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-10 animate-ping rounded-full bg-mint/10 [animation-duration:3s]" />
        <span className="absolute -inset-5 rounded-full border border-mint/30" />
        <span className="relative block size-3 rounded-full bg-mint shadow-[0_0_20px_rgba(0,245,160,0.9)]" />
      </div>

      <div className="relative flex h-full min-h-56 flex-col justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-4 text-mint" aria-hidden />
          <h3 className="font-mono uppercase tracking-[0.2em]">Live Location</h3>
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Khanakul, Hooghly</p>
          <p className="text-sm text-muted-foreground">West Bengal, India · 712406</p>
          <div className="mt-3 flex items-center justify-between font-mono text-sm">
            <time aria-live="off" className="tabular-nums text-foreground">
              {ready ? timeFormatter.format(date) : '--:--:--'} <span className="text-muted-foreground">IST</span>
            </time>
            <span className="text-xs text-muted-foreground">{isAwake ? 'Likely coding' : 'Likely asleep'}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
