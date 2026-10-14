import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from './Button'
import { Kicker, Mask } from './Reveal'
import { business } from '../data/site'
import { ease } from '../lib/motion'

/** the closing reservation panel: a dusk skyline, a clear call to action, two ways to respond */
export function CtaBand({
  lines = ['Plan your', 'journey.'],
  note,
}: {
  lines?: string[]
  note?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="px-3 py-3 sm:px-4 sm:py-4">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink text-white sm:rounded-[2.5rem]">
        <motion.img
          src="/images/aerial-dusk.webp"
          alt=""
          loading="lazy"
          style={{ y }}
          className="absolute -top-[10%] left-0 h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,8,0.86)_0%,rgba(8,10,8,0.6)_55%,rgba(8,10,8,0.34)_100%)]" />

        <div className="wrap relative z-10 py-24 sm:py-32">
          <Kicker tone="dark">Reservations</Kicker>
          <h2 className="t-h1 mt-6">
            {lines.map((l, i) => (
              <Mask key={l} delay={i * 0.1} className={i > 0 ? 'text-white/55' : undefined}>
                {l}
              </Mask>
            ))}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease, delay: 0.25 }}
            className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-md text-[1.12rem] leading-relaxed text-white/80">
              {note ??
                'Please provide the date, the pick-up and the drop-off locations. We will confirm the details and the rate.'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/book" variant="white" size="lg" magnetic>
                Book now
              </Button>
              <Button href={business.phoneHref} variant="glass" size="lg" icon={false}>
                Call {business.phone}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
