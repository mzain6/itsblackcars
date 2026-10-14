import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Button } from '../components/Button'
import { CarViewer } from '../components/CarViewer'
import { CtaBand } from '../components/CtaBand'
import { Placard } from '../components/Placard'
import { CountUp, Kicker, Mask, ParallaxImage, Reveal, ScrollWords } from '../components/Reveal'
import { business, fleetFacts, languages, regionsServed, services, signNames, type ServiceItem } from '../data/site'
import { cn } from '../lib/cn'
import { ease, useIntroReady } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(
    'LATS Black Cars | Black Car & Airport Transportation in Columbus, Ohio',
    'Lammi Airport Transportation Service (LATS): corporate and private black car service across the Columbus area. Airport transfers, conventions, weddings and nights out in new Chevrolet Suburbans. Call or text 614-483-5876.',
  )

  return (
    <>
      <Hero />
      <Pledge />
      <ServicesCarousel />
      <Pickup />
      <FleetBlock />
      <Owner />
      <CtaBand />
    </>
  )
}

/* ───────────────────────────── hero ───────────────────────────── */

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const ready = useIntroReady()
  const d = 0.25

  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % signNames.length), 3800)
    return () => window.clearInterval(t)
  }, [])

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        ref={ref}
        className="relative flex h-[calc(100svh-1.5rem)] min-h-[40rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-ink text-white sm:h-[calc(100svh-2rem)] sm:rounded-[2.5rem]"
      >
        <motion.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={{ y: imgY }}>
          <motion.img
            src="/images/dusk-skyline.webp"
            srcSet="/images/dusk-skyline-sm.webp 1000w, /images/dusk-skyline.webp 2200w"
            sizes="100vw"
            alt="The Columbus, Ohio skyline at dusk, light trails crossing the foreground"
            fetchPriority="high"
            className="h-full w-full object-cover object-[32%_50%] saturate-[1.12] contrast-[1.04]"
            initial={{ scale: 1.2 }}
            animate={{ scale: ready ? 1 : 1.2 }}
            transition={{ duration: 2.6, ease }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,8,0.55)_0%,rgba(8,10,8,0)_20%,rgba(8,10,8,0.2)_38%,rgba(8,10,8,0.74)_62%,rgba(8,10,8,0.94)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,8,0.55)_0%,rgba(8,10,8,0)_62%)]" />

        {/* the chauffeur's name board: the site's one recurring motif, sitting on the same grid as the text */}
        <motion.div className="absolute inset-x-0 top-[19%] z-10 hidden lg:block" style={{ opacity: fade }}>
          <div className="wrap flex justify-end">
            <div className="w-[min(22rem,26vw)]">
              <motion.div
                initial={{ opacity: 0, y: -28 }}
                animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 1.1, ease, delay: d + 0.35 }}
              >
                <Placard name={signNames[i]} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 0.8, ease, delay: d + 0.9 }}
                className="mt-5 rounded-2xl bg-black/35 px-4 py-3 text-[0.85rem] leading-snug text-white/85 ring-1 ring-white/15 backdrop-blur-md"
              >
                Your chauffeur waits at baggage claim, at the bottom of the escalator nearest your carousel.
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div className="wrap relative z-10 pb-24 sm:pb-8" style={{ y: textY, opacity: fade }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease, delay: d }}
            className="kicker mb-5 text-white/85 [--kicker-dot:var(--color-sage)]"
          >
            Black car service · Columbus, Ohio
          </motion.p>

          <h1 className="t-hero">
            <Mask active={ready} delay={d + 0.05}>
              Arrive on time.
            </Mask>
            <Mask active={ready} delay={d + 0.17} className="text-white/60">
              Every time.
            </Mask>
          </h1>

          <div className="mt-7 flex flex-col gap-7 lg:mt-9 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, ease, delay: d + 0.4 }}
              className="max-w-[31rem] text-[1.1rem] leading-relaxed text-white/80 sm:text-[1.2rem]"
            >
              Corporate and private transportation across the Columbus area, in new Chevrolet Suburbans. We get you
              where you are going, safely and in style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, ease, delay: d + 0.55 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button to="/book" variant="green" size="lg" magnetic>
                Book a ride
              </Button>
              <Button href={business.phoneHref} variant="glass" size="lg" icon={false}>
                Call {business.phone}
              </Button>
            </motion.div>
          </div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, ease, delay: d + 0.75 }}
            className="mt-8 hidden grid-cols-4 gap-px overflow-hidden rounded-2xl bg-white/15 backdrop-blur-md sm:grid"
          >
            {[
              ['Fleet', 'New Chevrolet Suburbans'],
              ['Rates', 'Flat or hourly'],
              ['Waiting', '15 minutes courtesy wait'],
              ['Reach us', 'Call or text, 24/7'],
            ].map(([k, v]) => (
              <div key={k} className="bg-black/30 px-5 py-4">
                <dt className="text-[0.75rem] font-semibold text-sage">{k}</dt>
                <dd className="mt-0.5 text-[0.95rem] text-white/90">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────────── the promise ───────────────────────────── */

function Pledge() {
  return (
    <section className="py-24 sm:py-36">
      <div className="wrap">
        <Kicker>Our promise</Kicker>

        <ScrollWords
          className="mt-8 max-w-[22ch] text-[clamp(2.1rem,5.4vw,5rem)] font-medium leading-[1.04] tracking-[-0.045em] sm:max-w-[26ch]"
          text="We know that in today's world, [[time is money.]] That's why we promise to get you wherever you're going [[on time, every time.]]"
        />

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 sm:mt-24 lg:grid-cols-4">
          {fleetFacts.map((f, n) => (
            <Reveal key={f.label} delay={n * 0.08} className="bg-white p-6 sm:p-9">
              <dt className="text-[clamp(3rem,5.8vw,5.2rem)] font-medium leading-none tracking-[-0.06em]">
                <CountUp to={f.value} suffix={f.suffix} />
              </dt>
              <dd className="mt-4 text-[0.95rem] leading-snug text-graphite">{f.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ───────────────────────────── services ───────────────────────────── */

function ServiceCard({ s, i }: { s: ServiceItem; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease, delay: Math.min(i, 3) * 0.08 }}
      className="w-[80vw] shrink-0 snap-start sm:w-[24rem] lg:w-[26rem]"
    >
      <Link
        to={`/services#${s.id}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-coal"
      >
        <img
          src={s.image}
          alt=""
          loading="lazy"
          style={{ objectPosition: s.position }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />
        <span className="absolute left-5 top-5 rounded-full bg-white/18 px-3 py-1 text-[0.8rem] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md">
          {s.no}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 pr-20 text-white">
          <h3 className="t-h3">{s.title}</h3>
          <p className="mt-2 text-[0.98rem] leading-snug text-white/75">{s.line}</p>
        </div>
        <span className="absolute bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-expo group-hover:rotate-45">
          <ArrowUpRight size={20} strokeWidth={1.8} />
        </span>
      </Link>
    </motion.div>
  )
}

function ServicesCarousel() {
  const track = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: 1 | -1) =>
    track.current?.scrollBy({ left: dir * Math.min(track.current.clientWidth * 0.8, 440), behavior: 'smooth' })

  return (
    <section className="pb-24 sm:pb-36">
      <div className="wrap">
        <div className="mb-12 flex flex-col gap-8 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker>Our services</Kicker>
            <h2 className="t-h2 mt-6">
              <Mask>Transportation for</Mask>
              <Mask delay={0.1} className="text-graphite">
                every occasion.
              </Mask>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/services" className="group inline-flex items-center gap-2 font-semibold text-green">
              All services
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <div className="hidden gap-2 sm:flex">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => scrollBy(dir)}
                  aria-label={dir === -1 ? 'Previous services' : 'Next services'}
                  className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-inset ring-ink/20 transition-colors hover:bg-ink hover:text-white"
                >
                  {dir === -1 ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={track}
          className="no-scrollbar -mx-[clamp(1.25rem,4vw,3.5rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[clamp(1.25rem,4vw,3.5rem)] [scroll-padding-inline:clamp(1.25rem,4vw,3.5rem)]"
        >
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── the pick-up ───────────────────────────── */

const steps = [
  {
    no: 1,
    title: 'Reserve',
    body: 'Call or text 614-483-5876, or use the reservation page. Reservations are accepted seven days a week. Please share the date, the pick-up and drop-off locations, and whether you prefer a flat or an hourly rate.',
  },
  {
    no: 2,
    title: 'Meet your chauffeur',
    body: 'Proceed to baggage claim level. Your chauffeur will be waiting at the bottom of the escalator nearest your carousel, holding a black-and-white sign bearing your last name.',
    image: true,
  },
  {
    no: 3,
    title: 'Travel in comfort',
    body: 'A new Chevrolet Suburban with room for up to six passengers, all-wheel drive, traction control and ABS brakes, driven by an experienced chauffeur. A simple pick-up and drop-off includes fifteen minutes of courtesy wait.',
  },
]

function Pickup() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 75%'] })
  const line = useSpring(scrollYProgress, { stiffness: 110, damping: 26 })

  return (
    <section className="px-3 sm:px-4">
      <div className="rounded-[1.75rem] bg-ink py-20 text-white sm:rounded-[2.5rem] sm:py-32">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Kicker tone="dark">Your journey</Kicker>
              <h2 className="t-h1 mt-6 !text-[clamp(2.6rem,5vw,4.8rem)]">
                <Mask>Your arrival,</Mask>
                <Mask delay={0.1} className="text-white/50">
                  step by step.
                </Mask>
              </h2>
              <Reveal delay={0.2} className="mt-12 hidden max-w-[20rem] lg:block">
                <Placard name="Williams" />
              </Reveal>
            </div>
          </div>

          <div ref={ref} className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden className="absolute left-[1.05rem] top-3 h-[calc(100%-1.5rem)] w-px bg-white/12" />
            <motion.span
              aria-hidden
              className="absolute left-[1.05rem] top-3 h-[calc(100%-1.5rem)] w-px origin-top bg-sage"
              style={{ scaleY: line }}
            />
            <ol className="space-y-16 sm:space-y-28">
              {steps.map((s) => (
                <li key={s.no} className="relative pl-14 sm:pl-16">
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-0 grid h-[2.15rem] w-[2.15rem] place-items-center rounded-full text-[0.85rem] font-bold ring-1 ring-sage"
                    initial={{ backgroundColor: '#0d0f0d', color: '#8fb59b' }}
                    whileInView={{ backgroundColor: '#8fb59b', color: '#0d0f0d' }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    {s.no}
                  </motion.span>
                  <Reveal>
                    <h3 className="t-h2 !text-[clamp(2rem,3.8vw,3.4rem)]">{s.title}</h3>
                    <p className="mt-5 max-w-lg text-[1.1rem] leading-relaxed text-white/70">{s.body}</p>
                  </Reveal>
                  {s.image && (
                    <ParallaxImage
                      src="/images/airport.webp"
                      alt="An airliner banking overhead between glass towers"
                      className="mt-10 aspect-[4/5] w-full max-w-md rounded-[1.5rem]"
                      position="50% 35%"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── fleet ───────────────────────────── */

function FleetBlock() {
  return (
    <section className="px-3 py-3 sm:px-4 sm:py-4">
      <div className="overflow-hidden rounded-[1.75rem] bg-paper-2 py-20 sm:rounded-[2.5rem] sm:py-28">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Kicker>The fleet</Kicker>
            <h2 className="t-h2 mt-6">
              <Mask>New Chevrolet</Mask>
              <Mask delay={0.1}>Suburbans.</Mask>
              <Mask delay={0.2} className="text-graphite">
                Seating for six.
              </Mask>
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-[1.08rem] leading-relaxed text-graphite">
                Every vehicle in our fleet is a new Chevrolet Suburban: spacious, comfortable and rated highly for
                rollover safety, with all-wheel drive, traction control and ABS brakes.
              </p>
              <ul className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-[0.98rem]">
                {['Seats up to 6', 'All-wheel drive', 'Traction control', 'ABS brakes'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-green text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Button to="/fleet" variant="ink">
                  See the fleet
                </Button>
              </div>
            </Reveal>
          </div>
          <CarViewer className="lg:col-span-7" />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── owner ───────────────────────────── */

function Pill({ children, i, tone = 'light' }: { children: string; i: number; tone?: 'light' | 'green' }) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease, delay: i * 0.07 }}
      className={cn(
        'rounded-full px-4 py-2 text-[0.95rem] font-medium',
        tone === 'green' ? 'bg-green text-white' : 'bg-white text-ink ring-1 ring-inset ring-ink/10',
      )}
    >
      {children}
    </motion.li>
  )
}

function Owner() {
  return (
    <section className="py-24 sm:py-36">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <ParallaxImage
          src="/images/skyline-portrait.webp"
          alt="Downtown Columbus, with the Ohio Statehouse below the towers"
          className="aspect-[4/5] w-full rounded-[1.75rem] sm:rounded-[2.25rem] lg:col-span-5"
          position="50% 50%"
        />

        <div className="lg:col-span-6 lg:col-start-7">
          <Kicker>Our owner</Kicker>
          <h2 className="t-h2 mt-6">
            <Mask>More than fifteen</Mask>
            <Mask delay={0.1} className="text-graphite">
              years of experience.
            </Mask>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-[1.12rem] leading-relaxed text-graphite">
              LATS is owned and operated by <span className="font-semibold text-ink">{business.owner}</span>. Before
              moving to the Columbus area he owned and operated BWI Airport Taxi, and in all those years he has looked
              after riders across Maryland, the District of Columbia, Virginia, Delaware, Pennsylvania and New York City.
            </p>
          </Reveal>

          <p className="mt-9 text-[0.9rem] font-semibold">Languages</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {languages.map((l, i) => (
              <Pill key={l} i={i} tone="green">
                {l}
              </Pill>
            ))}
          </ul>

          <p className="mt-7 text-[0.9rem] font-semibold">Regions served</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {regionsServed.map((r, i) => (
              <Pill key={r} i={i}>
                {r}
              </Pill>
            ))}
          </ul>

          <div className="mt-10">
            <Button to="/about" variant="ink">
              Read the story
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
