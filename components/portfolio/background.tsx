export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-glow/15 blur-[140px]" />
      <div className="absolute top-[60%] -right-40 h-[420px] w-[520px] rounded-full bg-cyan-neon/10 blur-[140px]" />
      <svg className="animate-grain absolute -inset-[50%] h-[200%] w-[200%] opacity-[0.06]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  )
}
