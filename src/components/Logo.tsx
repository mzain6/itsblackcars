import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

/** the road that makes the "L": comes down, turns the corner, heads off to the right */
export const ROAD = 'M21 12V35Q21 46 32 46H50'

/**
 * LATS mark — an L drawn as a road with a dashed centerline.
 * `animated` draws the road and then lays the centerline down (used by the intro).
 */
export function LogoMark({
  className,
  animated,
  delay = 0,
}: {
  className?: string
  animated?: boolean
  delay?: number
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <rect width="64" height="64" rx="14" fill="#2b5336" />
      {animated ? (
        <>
          <motion.path
            d={ROAD}
            fill="none"
            stroke="#fff"
            strokeWidth="12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease, delay }}
          />
          <motion.path
            d={ROAD}
            fill="none"
            stroke="#2b5336"
            strokeWidth="1.8"
            strokeDasharray="3.4 3"
            strokeDashoffset="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.85 }}
          />
        </>
      ) : (
        <>
          <path d={ROAD} fill="none" stroke="#fff" strokeWidth="12" />
          <path d={ROAD} fill="none" stroke="#2b5336" strokeWidth="1.8" strokeDasharray="3.4 3" strokeDashoffset="1" />
        </>
      )}
    </svg>
  )
}

/**
 * Header / footer lockup: mark + "LATS" + "Black Cars". The wordmark is live text so it stays sharp at any
 * size. The long legal name, Lammi Airport Transportation Service, lives in the footer.
 */
export function Logo({
  className,
  onClick,
  tone = 'light',
}: {
  className?: string
  onClick?: () => void
  tone?: 'light' | 'dark'
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="LATS Black Cars, Lammi Airport Transportation Service. Home"
      className={cn('group flex items-center gap-2.5', className)}
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-500 ease-expo group-hover:-rotate-6 group-hover:scale-105 sm:h-10 sm:w-10" />
      <span className="block leading-none">
        <span className={cn('block text-[1.18rem] font-extrabold tracking-[0.05em]', tone === 'light' ? 'text-white' : 'text-ink')}>
          LATS
        </span>
        <span
          className={cn(
            'mt-[0.28rem] block whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.24em]',
            tone === 'light' ? 'text-mist/80' : 'text-graphite',
          )}
        >
          Black Cars
        </span>
      </span>
    </Link>
  )
}
