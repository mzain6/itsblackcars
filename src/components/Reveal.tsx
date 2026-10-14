import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

/** fade + rise when scrolled into view */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * One line of a headline rising out of a mask.
 * The in-view trigger sits on the outer, unclipped span: observing the inner one would never fire,
 * because it starts translated out of its own overflow mask and reports 0% visible.
 */
export function Mask({
  children,
  className,
  delay = 0,
  active,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** drive the line from a flag (e.g. "intro finished") instead of scroll position */
  active?: boolean
}) {
  const trigger =
    active === undefined
      ? { whileInView: 'show', viewport: { once: true, amount: 0.6 } }
      : { animate: active ? 'show' : 'hidden' }
  return (
    <motion.span className={cn('-mb-[0.14em] block overflow-hidden pb-[0.14em]', className)} initial="hidden" {...trigger}>
      <motion.span
        className="block"
        variants={{
          hidden: { y: '112%' },
          show: { y: 0, transition: { duration: 1.1, ease, delay } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/** the small dotted lead-in above a heading */
export function Kicker({
  children,
  tone = 'light',
  className,
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className={cn(
        'kicker',
        tone === 'dark' ? 'text-mist [--kicker-dot:var(--color-sage)]' : 'text-graphite',
        className,
      )}
    >
      {children}
    </motion.p>
  )
}

/** image that wipes open on entry and drifts slower than the page while you scroll */
export function ParallaxImage({
  src,
  alt,
  className,
  amount = 7,
  position,
  priority,
}: {
  src: string
  alt: string
  className?: string
  amount?: number
  position?: string
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0 bg-paper-2"
        variants={{
          hidden: { clipPath: 'inset(100% 0 0 0)' },
          show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.3, ease } },
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ y, objectPosition: position }}
          className="absolute -top-[10%] left-0 h-[120%] w-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

function Word({
  word,
  progress,
  range,
  accent,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
  accent: boolean
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className={cn('mr-[0.22em] inline-block', accent && 'text-green')}>
      {word}
    </motion.span>
  )
}

/** a statement whose words light up one by one as you scroll through it. [[double brackets]] turn green. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.55'] })

  const words: { w: string; accent: boolean }[] = []
  let accent = false
  for (const raw of text.split(/\s+/)) {
    let w = raw
    if (w.startsWith('[[')) {
      accent = true
      w = w.slice(2)
    }
    const closes = w.endsWith(']]')
    if (closes) w = w.slice(0, -2)
    words.push({ w, accent })
    if (closes) accent = false
  }

  return (
    <p ref={ref} className={className}>
      {words.map(({ w, accent: a }, i) => {
        const start = i / words.length
        const end = Math.min(1, start + 1.8 / words.length)
        return <Word key={i} word={w} progress={scrollYProgress} range={[start, end]} accent={a} />
      })}
    </p>
  )
}

/** number that counts up the first time it scrolls into view */
export function CountUp({ to, suffix = '', className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  )
}
