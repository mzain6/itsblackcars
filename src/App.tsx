import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Intro } from './components/Intro'
import { MobileBar } from './components/MobileBar'
import { ease } from './lib/motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// The inner pages load on demand so the first visit downloads less; they are prefetched once the page is idle.
const loadServices = () => import('./pages/Services')
const loadFleet = () => import('./pages/Fleet')
const loadAbout = () => import('./pages/About')
const loadBook = () => import('./pages/Book')
const Services = lazy(loadServices)
const Fleet = lazy(loadFleet)
const About = lazy(loadAbout)
const Book = lazy(loadBook)

/** green panel that wipes up to reveal a new page, and back down to leave the old one */
function Curtain() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] bg-green"
      initial={{ scaleY: 1, originY: 0 }}
      animate={{ scaleY: 0, originY: 0, transition: { duration: 0.85, ease, delay: 0.08 } }}
      exit={{
        scaleY: 1,
        originY: 1,
        transition: { scaleY: { duration: 0.6, ease }, originY: { duration: 0 } },
      }}
    >
    </motion.div>
  )
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div>
      <Curtain />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-sage"
      style={{ scaleX }}
    />
  )
}

/** hash links (e.g. /services#weddings) glide to their section once the new page has mounted */
function HashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 900)
    return () => window.clearTimeout(t)
  }, [pathname, hash])
  return null
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const t = window.setTimeout(() => {
      loadServices()
      loadFleet()
      loadAbout()
      loadBook()
    }, 2500)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-paper px-5 py-3 font-semibold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Intro />
      <ScrollProgress />
      <Header />
      <HashScroll />

      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <PageShell key={location.pathname}>
          <Suspense fallback={null}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/about" element={<About />} />
            <Route path="/book" element={<Book />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </PageShell>
      </AnimatePresence>

      <MobileBar />
    </>
  )
}
