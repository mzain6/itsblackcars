import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, Phone } from 'lucide-react'
import { business } from '../data/site'
import { ease, useIntroReady } from '../lib/motion'

/** thumb-reach call / book bar for phones (the header's Book button is hidden at that width) */
export function MobileBar() {
  const { pathname } = useLocation()
  const ready = useIntroReady()
  if (pathname === '/book') return null
  return (
    <motion.div
      initial={{ y: '140%' }}
      animate={{ y: ready ? 0 : '140%' }}
      transition={{ duration: 0.8, ease, delay: 0.9 }}
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-1 rounded-full bg-ink/90 p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl sm:hidden"
    >
      <a href={business.phoneHref} className="flex items-center justify-center gap-2 rounded-full py-3.5 text-[0.95rem] font-semibold text-white">
        <Phone size={16} className="text-sage" /> Call us
      </a>
      <Link to="/book" className="flex items-center justify-center gap-2 rounded-full bg-green py-3.5 text-[0.95rem] font-semibold text-white">
        <CalendarCheck size={16} /> Book now
      </Link>
    </motion.div>
  )
}
