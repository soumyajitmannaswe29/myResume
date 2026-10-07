'use client'

import { useEffect, useRef, useState } from 'react'

const GLYPHS = '01<>/\\[]{}=+*#%_'

export function ScrambleCycle({ words, interval = 2800, className }: { words: string[]; interval?: number; className?: string }) {
  const [text, setText] = useState(words[0])
  const currentRef = useRef(words[0])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let index = 0
    let raf = 0

    function scrambleTo(target: string) {
      const from = currentRef.current
      const length = Math.max(from.length, target.length)
      const queue = Array.from({ length }, (_, i) => {
        const start = Math.floor(Math.random() * 14)
        return { from: from[i] ?? '', to: target[i] ?? '', start, end: start + 8 + Math.floor(Math.random() * 14) }
      })
      let frame = 0

      const tick = () => {
        let output = ''
        let done = 0
        for (const q of queue) {
          if (frame >= q.end) {
            done++
            output += q.to
          } else if (frame >= q.start) {
            output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          } else {
            output += q.from
          }
        }
        currentRef.current = output
        setText(output)
        if (done < queue.length) {
          frame++
          raf = requestAnimationFrame(tick)
        } else {
          currentRef.current = target
        }
      }
      tick()
    }

    const id = setInterval(() => {
      index = (index + 1) % words.length
      if (reduceMotion) {
        currentRef.current = words[index]
        setText(words[index])
      } else {
        cancelAnimationFrame(raf)
        scrambleTo(words[index])
      }
    }, interval)

    return () => {
      clearInterval(id)
      cancelAnimationFrame(raf)
    }
  }, [words, interval])

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>{text}</span>
    </span>
  )
}
