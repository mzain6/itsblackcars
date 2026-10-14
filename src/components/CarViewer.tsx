import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

/** hotspot positions are percentages of the 640x390 cut-out, so they hold at any rendered size */
const spots = [
  {
    id: 'awd',
    x: 56,
    y: 77,
    title: 'All-wheel drive + traction control',
    text: 'Power is directed to the wheels with the most grip, providing confident handling on wet or wintry roads.',
  },
  {
    id: 'abs',
    x: 91,
    y: 61,
    title: 'ABS brakes',
    text: 'Anti-lock braking keeps the vehicle steady and controlled when braking suddenly.',
  },
  {
    id: 'rollover',
    x: 52,
    y: 44,
    title: 'Rated highly for rollover',
    text: 'The Suburban earns a high rollover rating, one of the reasons it was selected for our fleet.',
  },
  {
    id: 'six',
    x: 74,
    y: 21,
    title: 'Room for up to six',
    text: 'A spacious, comfortable cabin that seats up to six passengers comfortably.',
  },
]

/**
 * The Suburban with four pulsing hotspots. It steps through them on its own until someone takes over,
 * and each one explains a real feature of the vehicle.
 */
export function CarViewer({ className }: { className?: string }) {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const t = window.setInterval(() => setActive((a) => (a + 1) % spots.length), 4200)
    return () => window.clearInterval(t)
  }, [auto])

  const pick = (i: number) => {
    setAuto(false)
    setActive(i)
  }

  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[46rem]">
        {/* multiply blend: the photo's white studio backdrop vanishes into the panel, its shadow stays */}
        <img
          src="/images/suburban-photo.jpg"
          alt="A black Chevrolet Suburban SUV"
          width={1100}
          height={670}
          loading="lazy"
          className="block w-full mix-blend-multiply"
        />
        {spots.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => pick(i)}
            aria-label={s.title}
            aria-pressed={active === i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.5 + i * 0.12 }}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className="absolute -ml-4 -mt-4 grid h-8 w-8 place-items-center"
          >
            {active === i && (
              <span className="absolute inset-0 rounded-full bg-green/70 [animation:ping-soft_1.8s_ease-out_infinite]" />
            )}
            <span
              className={cn(
                'relative grid h-6 w-6 place-items-center rounded-full text-[0.7rem] font-bold ring-2 transition-colors duration-300',
                active === i ? 'bg-green text-white ring-white' : 'bg-white text-ink ring-ink/10',
              )}
            >
              {i + 1}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-[34rem]">
        <div className="relative min-h-[7.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={spots[active].id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="text-[1.35rem] font-semibold tracking-[-0.025em]">{spots[active].title}</p>
              <p className="mt-2 text-[1.02rem] leading-relaxed text-graphite">{spots[active].text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-2 flex gap-2" role="tablist" aria-label="Vehicle features">
          {spots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={s.title}
              onClick={() => pick(i)}
              className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink/12"
            >
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-green"
                initial={false}
                animate={{ scaleX: active === i ? 1 : 0 }}
                transition={{ duration: active === i && auto ? 4.2 : 0.4, ease: active === i && auto ? 'linear' : ease }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
