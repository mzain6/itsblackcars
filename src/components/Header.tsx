import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Phone } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './Button'
import { business, nav } from '../data/site'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

/** floating pill navigation: slides away while you read down, returns the moment you scroll up */
export function Header() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  // these pages open on a light panel, where a see-through dark pill would turn muddy gray
  const lightTop = pathname === '/fleet' || pathname === '/book'

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > 220 && y > prev && !open)
  })

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-140%' : 0 }}
        transition={{ duration: 0.55, ease }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
      >
        {/* same margins and container as the page panels, so the pill's edges sit exactly on the content grid */}
        <div className="wrap">
        <div
          className={cn(
            'flex items-center justify-between rounded-full py-2 pl-4 pr-2 ring-1 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 sm:pl-6 lg:grid lg:grid-cols-[1fr_auto_1fr]',
            solid || open || lightTop
              ? 'bg-ink/90 ring-white/10 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]'
              : 'bg-ink/30 ring-white/15',
          )}
        >
          <Logo onClick={() => setOpen(false)} className="justify-self-start" />

          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-4 py-2 text-[0.93rem] font-medium transition-colors',
                    isActive ? 'text-white' : 'text-white/65 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/14"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-2">
            <a
              href={business.phoneHref}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.93rem] font-medium text-white/75 transition-colors hover:text-white xl:flex"
            >
              <Phone size={15} strokeWidth={2} className="text-sage" />
              {business.phone}
            </a>
            {/* wrapped, because the button's own display class would otherwise beat a `hidden` on it */}
            <div className="hidden sm:block">
              <Button to="/book" variant="green" magnetic>
                Book now
              </Button>
            </div>

            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-white/10 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  className="absolute left-0 top-0 h-[1.5px] w-full rounded bg-white"
                  animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-white"
                  animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease }}
                />
              </span>
            </button>
          </div>
        </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 text-white lg:hidden"
          >
            <div className="wrap flex flex-1 flex-col justify-between pb-8 pt-4">
              <ul>
                {[...nav, { to: '/book', label: 'Book now' }].map((item, i) => (
                  <li key={item.to} className="overflow-hidden border-b border-white/10">
                    <motion.div
                      initial={{ y: '105%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '105%' }}
                      transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.06 }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          cn(
                            'flex items-baseline justify-between py-4 text-[clamp(2.4rem,11vw,3.6rem)] font-medium tracking-[-0.045em]',
                            isActive ? 'text-white' : 'text-white/50',
                            item.to === '/book' && 'text-sage',
                          )
                        }
                      >
                        {item.label}
                        <span className="text-[0.8rem] font-medium tracking-normal text-smoke">0{i + 1}</span>
                      </NavLink>
                    </motion.div>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease }}
                className="space-y-2"
              >
                <a href={business.phoneHref} className="block text-[2rem] font-medium tracking-[-0.03em] text-white">
                  {business.phone}
                </a>
                <p className="text-[0.95rem] leading-relaxed text-smoke">
                  Call or text, any hour.
                  <br />
                  {business.street}, {business.cityLine}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
