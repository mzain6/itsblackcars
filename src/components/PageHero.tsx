import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Kicker, Mask } from './Reveal'
import { ease, useIntroReady } from '../lib/motion'

/** timing for inner pages: the route curtain takes ~0.9s to lift, so the headline starts as it clears */
const START = 0.5

/**
 * Dark rounded hero shared by the inner pages. Headline lines rise out of a mask; the first line is
 * white, the rest are muted. An optional photo sits behind with a slow parallax drift.
 */
export function PageHero({
  kicker,
  lines,
  text,
  image,
  position,
  children,
}: {
  kicker: string
  lines: string[]
  text?: string
  image?: string
  position?: string
  children?: ReactNode
}) {
  const ready = useIntroReady()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        ref={ref}
        className="relative flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-ink text-white sm:min-h-[min(46rem,calc(100svh-2rem))] sm:rounded-[2.5rem]"
      >
        {image && (
          <>
            <motion.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={{ y }}>
              <motion.img
                src={image}
                alt=""
                className="h-full w-full object-cover saturate-[1.1]"
                style={{ objectPosition: position }}
                initial={{ scale: 1.15 }}
                animate={{ scale: ready ? 1 : 1.15 }}
                transition={{ duration: 2.2, ease }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,8,0.55)_0%,rgba(8,10,8,0.2)_30%,rgba(8,10,8,0.8)_72%,rgba(8,10,8,0.94)_100%)]" />
          </>
        )}

        <motion.div className="wrap relative z-10 pb-10 pt-36 sm:pb-14" style={{ opacity: fade }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease, delay: START }}
          >
            <Kicker tone="dark">{kicker}</Kicker>
          </motion.div>

          <h1 className="t-h1 mt-6">
            {lines.map((l, i) => (
              <Mask key={l} active={ready} delay={START + 0.05 + i * 0.12} className={i > 0 ? 'text-white/55' : undefined}>
                {l}
              </Mask>
            ))}
          </h1>

          {(text || children) && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, ease, delay: START + 0.45 }}
              className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
            >
              {text && <p className="max-w-[32rem] text-[1.12rem] leading-relaxed text-white/78 sm:text-[1.2rem]">{text}</p>}
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
