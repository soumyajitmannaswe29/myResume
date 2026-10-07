'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type NeuronNode = { x: number; y: number; bx: number; by: number; phase: number; act: number }
type Pulse = { edge: number; t: number; speed: number }

const MOUSE_RADIUS = 170

export function NeuralCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    let lastSpawn = 0
    let nodes: NeuronNode[] = []
    let edges: [number, number][] = []
    let outgoing: number[][] = []
    let inputNodes: number[] = []
    let pulses: Pulse[] = []
    const mouse = { x: -9999, y: -9999 }

    function build() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const layers = width < 768 ? [4, 6, 7, 5, 2] : [6, 10, 13, 13, 10, 6, 3]
      const tallest = Math.max(...layers)
      const starts: number[] = []
      nodes = []
      edges = []
      pulses = []

      layers.forEach((count, li) => {
        starts.push(nodes.length)
        const x = width * 0.05 + width * 0.9 * (li / (layers.length - 1))
        const span = height * 0.78 * (count / tallest)
        for (let i = 0; i < count; i++) {
          const y = height / 2 - span / 2 + span * (count === 1 ? 0.5 : i / (count - 1))
          nodes.push({ x, y, bx: x, by: y, phase: Math.random() * Math.PI * 2, act: 0 })
        }
      })

      outgoing = nodes.map(() => [])
      layers.forEach((count, li) => {
        if (li === layers.length - 1) return
        for (let a = 0; a < count; a++) {
          for (let b = 0; b < layers[li + 1]; b++) {
            if (Math.random() < 0.42) {
              const from = starts[li] + a
              outgoing[from].push(edges.length)
              edges.push([from, starts[li + 1] + b])
            }
          }
        }
      })
      inputNodes = Array.from({ length: layers[0] }, (_, i) => i)
    }

    function spawnFrom(nodeIndex: number) {
      const options = outgoing[nodeIndex]
      if (!options?.length || pulses.length > 70) return
      pulses.push({ edge: options[Math.floor(Math.random() * options.length)], t: 0, speed: 0.012 + Math.random() * 0.014 })
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height)

      for (const n of nodes) {
        let tx = n.bx
        let ty = n.by + (reduceMotion ? 0 : Math.sin(time * 0.0007 + n.phase) * 5)
        const dx = tx - mouse.x
        const dy = ty - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < 130 && d > 0) {
          const force = (1 - d / 130) * 22
          tx += (dx / d) * force
          ty += (dy / d) * force
        }
        n.x += (tx - n.x) * 0.1
        n.y += (ty - n.y) * 0.1
        n.act *= 0.955
      }

      ctx!.lineWidth = 1
      for (const [ai, bi] of edges) {
        const a = nodes[ai]
        const b = nodes[bi]
        const md = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y)
        const hover = md < MOUSE_RADIUS ? 1 - md / MOUSE_RADIUS : 0
        const energy = Math.max(a.act, b.act)
        const alpha = 0.05 + hover * 0.35 + energy * 0.14
        ctx!.strokeStyle = hover > 0.02 || energy > 0.2 ? `rgba(0,245,160,${alpha})` : `rgba(148,163,184,${alpha})`
        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y)
        ctx!.lineTo(b.x, b.y)
        ctx!.stroke()
      }

      if (!reduceMotion) {
        if (time - lastSpawn > 110) {
          spawnFrom(inputNodes[Math.floor(Math.random() * inputNodes.length)])
          lastSpawn = time
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i]
          p.t += p.speed
          const [ai, bi] = edges[p.edge]
          const a = nodes[ai]
          const b = nodes[bi]
          const x = a.x + (b.x - a.x) * p.t
          const y = a.y + (b.y - a.y) * p.t
          const tail = Math.max(0, p.t - 0.18)
          const gradient = ctx!.createLinearGradient(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail, x, y)
          gradient.addColorStop(0, 'rgba(6,182,212,0)')
          gradient.addColorStop(1, 'rgba(0,245,160,0.9)')
          ctx!.strokeStyle = gradient
          ctx!.lineWidth = 1.6
          ctx!.beginPath()
          ctx!.moveTo(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail)
          ctx!.lineTo(x, y)
          ctx!.stroke()
          ctx!.lineWidth = 1

          if (p.t >= 1) {
            b.act = 1
            pulses.splice(i, 1)
            if (Math.random() < 0.72) spawnFrom(bi)
          }
        }
      }

      for (const n of nodes) {
        const md = Math.hypot(n.x - mouse.x, n.y - mouse.y)
        const hover = md < MOUSE_RADIUS ? 1 - md / MOUSE_RADIUS : 0
        const glow = Math.min(1, n.act + hover)
        if (glow > 0.04) {
          ctx!.fillStyle = `rgba(0,245,160,${glow * 0.18})`
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, 9 + glow * 6, 0, Math.PI * 2)
          ctx!.fill()
        }
        ctx!.fillStyle = glow > 0.04 ? `rgba(160,255,220,${0.5 + glow * 0.5})` : 'rgba(148,163,184,0.45)'
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, 1.8 + glow * 1.6, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function loop(time: number) {
      draw(time)
      if (visible && !reduceMotion) raf = requestAnimationFrame(loop)
    }

    function start() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    }

    function handlePointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      if (reduceMotion) draw(performance.now())
    }

    function resetPointer() {
      mouse.x = -9999
      mouse.y = -9999
    }

    build()
    start()

    const resizeObserver = new ResizeObserver(() => {
      build()
      if (reduceMotion || !visible) draw(performance.now())
    })
    resizeObserver.observe(canvas)

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !reduceMotion) start()
    })
    intersection.observe(canvas)

    window.addEventListener('pointermove', handlePointer, { passive: true })
    document.addEventListener('pointerleave', resetPointer)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersection.disconnect()
      window.removeEventListener('pointermove', handlePointer)
      document.removeEventListener('pointerleave', resetPointer)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={cn('block', className)} />
}
