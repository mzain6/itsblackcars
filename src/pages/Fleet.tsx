import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Disc3, Route, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { Button } from '../components/Button'
import { CarViewer } from '../components/CarViewer'
import { CtaBand } from '../components/CtaBand'
import { NumberStepper } from '../components/Field'
import { Kicker, Mask, Reveal } from '../components/Reveal'
import { ease, useIntroReady } from '../lib/motion'
import { cn } from '../lib/cn'
import { usePageMeta } from '../lib/usePageMeta'

export default function Fleet() {
  usePageMeta(
    'Fleet | New Chevrolet Suburbans | LATS Black Cars',
    'Our fleet is new Chevrolet Suburban SUVs: spacious, comfortable, up to 6 passengers, all-wheel drive, traction control, ABS brakes and a high rollover rating.',
  )

  return (
    <>
      <Hero />
      <Features />
      <SeatPlanner />
      <CtaBand lines={['Reserve your', 'Suburban.']} note="Please tell us how many passengers are travelling and where to. We will confirm the vehicle, the pick-up and the rate." />
    </>
  )
}

function Hero() {
  const ready = useIntroReady()
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="overflow-hidden rounded-[1.75rem] bg-paper-2 pb-16 pt-36 sm:rounded-[2.5rem] sm:pb-24 sm:pt-44">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.5 }}
            >
              <Kicker>The fleet</Kicker>
            </motion.div>
            <h1 className="t-h1 mt-6">
              <Mask active={ready} delay={0.55}>
                The Chevrolet
              </Mask>
              <Mask active={ready} delay={0.67}>
                Suburban.
              </Mask>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, ease, delay: 0.95 }}
              className="mt-7 max-w-md text-[1.12rem] leading-relaxed text-graphite"
            >
              Every LATS journey is made in a new Chevrolet Suburban: spacious, comfortable and able to carry up to six
              passengers. Your safety and security are our highest priority, and the vehicle was chosen accordingly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, ease, delay: 1.1 }}
              className="mt-8"
            >
              <Button to="/book" variant="green" size="lg" magnetic>
                Book a Suburban
              </Button>
            </motion.div>
          </div>
          <CarViewer className="lg:col-span-7" />
        </div>
      </div>
    </section>
  )
}

const features: { icon: LucideIcon; title: string; text: string; wide?: boolean }[] = [
  {
    icon: Users,
    title: 'Room for six',
    text: 'A spacious, comfortable cabin that seats up to six passengers, so a family, a client delegation or a wedding party can arrive together.',
    wide: true,
  },
  { icon: Route, title: 'All-wheel drive', text: 'Confident handling on wet roads and in winter conditions.' },
  { icon: Activity, title: 'Traction control', text: 'Helps the vehicle maintain its grip when road conditions change.' },
  { icon: Disc3, title: 'ABS brakes', text: 'Anti-lock braking for controlled, confident stops.' },
  {
    icon: ShieldCheck,
    title: 'Rated highly for rollover',
    text: 'Safety and security come first, so we selected a vehicle with a high rollover rating.',
  },
]

function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap">
        <Kicker>Built for the trip</Kicker>
        <h2 className="t-h2 mt-6">
          <Mask>Comfort and safety,</Mask>
          <Mask delay={0.1} className="text-graphite">
            by design.
          </Mask>
        </h2>

        <div className="mt-14 grid gap-3 sm:gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease, delay: (i % 3) * 0.08 }}
              className={cn(
                'group rounded-[1.75rem] bg-white p-7 ring-1 ring-inset ring-ink/5 transition-shadow duration-500 hover:shadow-[0_30px_50px_-30px_rgba(13,15,13,0.35)] sm:p-9',
                f.wide && 'md:col-span-2',
              )}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-green-50 text-green transition-colors duration-500 group-hover:bg-green group-hover:text-white">
                <f.icon size={22} strokeWidth={1.7} />
              </span>
              <h3 className="t-h3 mt-14 sm:mt-20">{f.title}</h3>
              <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-graphite">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Illustrative top-down layout: one front passenger seat, two in the middle, three in the back. */
const seats = [
  { x: 142, y: 120, w: 56, h: 58 },
  { x: 62, y: 214, w: 56, h: 54 },
  { x: 142, y: 214, w: 56, h: 54 },
  { x: 50, y: 314, w: 48, h: 52 },
  { x: 106, y: 314, w: 48, h: 52 },
  { x: 162, y: 314, w: 48, h: 52 },
]

function SeatPlanner() {
  const [n, setN] = useState(4)

  return (
    <section className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="rounded-[1.75rem] bg-ink py-20 text-white sm:rounded-[2.5rem] sm:py-28">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Kicker tone="dark">Seating</Kicker>
            <h2 className="t-h2 mt-6">
              <Mask>Select the size</Mask>
              <Mask delay={0.1} className="text-white/50">
                of your party.
              </Mask>
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-[1.08rem] leading-relaxed text-white/70">
                A single Suburban accommodates up to six passengers. Select your party size to see the seating
                arrangement. The layout shown is illustrative.
              </p>
              <div className="mt-9 [&_p]:text-white [&_div[role=group]]:bg-white/10 [&_div[role=group]]:ring-white/15 [&_div[role=group]_span]:text-white">
                <NumberStepper label="Passengers" value={n} min={1} max={6} onChange={setN} unit="passenger" />
              </div>
              <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-white/60">
                For parties of more than six, or for convention groups, please include the headcount in your reservation
                and we will arrange the appropriate number of vehicles.
              </p>
              <div className="mt-8">
                <Button to={`/book?riders=${n}`} variant="white">
                  Reserve for {n}
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <svg viewBox="0 0 260 440" role="img" aria-label={`Top-down Suburban cabin with ${n} of 6 passenger seats filled`} className="mx-auto h-auto w-full max-w-[22rem]">
              {/* wheels */}
              {[62, 312].flatMap((y) => [20, 226].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="58" rx="6" fill="#2a2e2a" />))}
              {/* body */}
              <rect x="30" y="14" width="200" height="412" rx="64" fill="#161916" stroke="#ffffff22" strokeWidth="2" />
              <path d="M52 96 Q130 70 208 96" fill="none" stroke="#ffffff1f" strokeWidth="2" />
              <rect x="52" y="352" width="156" height="58" rx="14" fill="none" stroke="#ffffff14" strokeWidth="2" strokeDasharray="5 6" />
              {/* driver */}
              <rect x="62" y="120" width="56" height="58" rx="16" fill="#3a3f3a" />
              <circle cx="90" cy="108" r="13" fill="none" stroke="#ffffff55" strokeWidth="3" />
              {seats.map((s, i) => {
                const on = i < n
                return (
                  <motion.rect
                    key={i}
                    x={s.x}
                    y={s.y}
                    width={s.w}
                    height={s.h}
                    rx="14"
                    initial={false}
                    animate={{ fill: on ? '#8fb59b' : '#262a26', scale: on ? 1 : 0.94, opacity: on ? 1 : 0.8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: on ? i * 0.04 : 0 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
