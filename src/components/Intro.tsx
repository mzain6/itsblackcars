import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from './Logo'
import { business } from '../data/site'
import { ease, intro } from '../lib/motion'

/**
 * Loading screen, shown on every fresh load of the site.
 * The L draws itself as a road while a progress line tracks the real thing: web fonts and every asset the
 * page has requested. It holds for a minimum time so it never flashes, gives up waiting after six seconds
 * on a slow connection, then lifts like a curtain.
 */
export function Intro() {
  const [show, setShow] = useState(intro.pending)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!intro.pending) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const MIN = reduced ? 700 : 2000
    const MAX = 6000
    const start = performance.now()

    let assetsReady = false
    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve()
        else window.addEventListener('load', () => resolve(), { once: true })
      }),
    ]).then(() => {
      assetsReady = true
    })

    let raf = 0
    let value = 0
    let last = start
    const tick = (now: number) => {
      const t = now - start
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      const finished = (assetsReady && t >= MIN) || t >= MAX
      // creep toward 88% while things load, then run the last stretch once everything is in.
      // Smoothing is time-based, so it behaves the same at 30 or 120 frames per second.
      const target = finished ? 100 : Math.min(88, (t / MIN) * 88)
      value += (target - value) * (1 - Math.exp(-dt * (finished ? 11 : 4.5)))
      setPct(value)

      if (finished && value > 99.4) {
        setPct(100)
        intro.finish()
        setShow(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[100] grid place-items-center bg-ink px-6 text-white"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="flex w-[min(26rem,86vw)] flex-col items-center">
            <LogoMark animated delay={0.1} className="h-20 w-20 sm:h-24 sm:w-24" />

            <div className="mt-7 overflow-hidden">
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.6 }}
                className="text-[2rem] font-extrabold leading-none tracking-[0.08em]"
              >
                LATS
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-mist/80"
            >
              Black Cars
            </motion.p>

            <div className="mt-12 w-full">
              <div className="h-px w-full bg-white/15">
                <div className="h-px origin-left bg-sage" style={{ transform: `scaleX(${pct / 100})` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-[0.78rem] text-smoke">
                <span>{business.legalName}</span>
                <span className="font-medium tabular-nums text-white/80">{Math.round(pct)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
