import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { Button } from '../components/Button'
import { TextAreaField, TextField } from '../components/Field'
import { PageHero } from '../components/PageHero'
import { Kicker, Mask, Reveal } from '../components/Reveal'
import { SubmitResultCard } from '../components/SubmitResult'
import { business, languages, regionsServed } from '../data/site'
import { ease } from '../lib/motion'
import { submitRequest, type SubmitResult } from '../lib/submit'
import { usePageMeta } from '../lib/usePageMeta'

export default function About() {
  usePageMeta(
    'About & Contact | LATS Black Cars, Columbus Ohio',
    'LATS is owned and operated by Getachew Woyessa, with more than 15 years in transportation and customer service. Call or text 614-483-5876, any hour.',
  )

  return (
    <>
      <PageHero
        kicker="About LATS"
        lines={['Led by experience.', 'Built on service.']}
        text="LATS is owned and operated by Getachew Woyessa, with more than 15 years in transportation and customer service."
        image="/images/skyline-portrait.webp"
        position="50% 64%"
      />
      <Story />
      <Speaks />
      <Contact />
    </>
  )
}

const timeline = [
  {
    title: 'More than 15 years on the road',
    text: 'Transportation and customer service have been Mr. Woyessa’s profession for more than fifteen years, an experience that informs every aspect of our service.',
  },
  {
    title: 'BWI Airport Taxi',
    text: 'Before moving to the Columbus area, he owned and operated BWI Airport Taxi, serving travellers at the airport.',
  },
  {
    title: 'LATS, in Columbus',
    text: 'Today he leads Lammi Airport Transportation Service, bringing the same standard to corporate and private clients across the Columbus area.',
  },
]

function Story() {
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Kicker>Our story</Kicker>
            <h2 className="t-h2 mt-6">
              <Mask>The company</Mask>
              <Mask delay={0.1} className="text-graphite">
                and its owner.
              </Mask>
            </h2>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="relative space-y-12 border-l border-ink/15 pl-8 sm:pl-10">
            {timeline.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.05}>
                <li className="relative">
                  <span className="absolute -left-[2.55rem] top-[0.45rem] h-3.5 w-3.5 rounded-full bg-green ring-4 ring-paper sm:-left-[3.05rem]" />
                  <h3 className="t-h3">{t.title}</h3>
                  <p className="mt-3 max-w-lg text-[1.08rem] leading-relaxed text-graphite">{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <p className="mt-14 text-[0.9rem] font-semibold">Regions served</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {regionsServed.map((r, i) => (
              <motion.li
                key={r}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.07 }}
                className="rounded-full bg-white px-4 py-2 text-[0.95rem] font-medium ring-1 ring-inset ring-ink/10"
              >
                {r}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const hello: Record<string, { word: string; lang: string }> = {
  Russian: { word: 'Здравствуйте', lang: 'ru' },
  Amharic: { word: 'ሰላም', lang: 'am' },
  'Afaan Oromo': { word: 'Akkam', lang: 'om' },
}

function Speaks() {
  return (
    <section className="px-3 sm:px-4">
      <div className="rounded-[1.75rem] bg-green-deep py-20 text-white sm:rounded-[2.5rem] sm:py-28">
        <div className="wrap">
          <Kicker tone="dark">Languages</Kicker>
          <h2 className="t-h2 mt-6">
            <Mask>Multilingual</Mask>
            <Mask delay={0.1} className="text-white/50">
              hospitality.
            </Mask>
          </h2>
          <ul className="mt-14 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {languages.map((l, i) => (
              <motion.li
                key={l}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, ease, delay: i * 0.1 }}
                className="rounded-[1.5rem] bg-white/[0.07] p-7 ring-1 ring-inset ring-white/12 sm:p-8"
              >
                <p lang={hello[l].lang} className="text-[clamp(2.2rem,3.6vw,3.2rem)] font-medium leading-none tracking-[-0.03em]">
                  {hello[l].word}
                </p>
                <p className="mt-10 text-[0.95rem] text-mist">{l}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [first, setFirst] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [errors, setErrors] = useState<{ first?: string; email?: string; message?: string }>({})

  const reset = () => {
    setResult(null)
    setFirst('')
    setEmail('')
    setMessage('')
    setStatus('idle')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!first.trim()) next.first = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Please enter a valid email address.'
    if (message.trim().length < 3) next.message = 'Please enter your message.'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      setResult(await submitRequest('Website message', { Name: first, Email: email, Message: message }))
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Kicker>Contact</Kicker>
          <h2 className="t-h2 mt-6">
            <Mask>Let us know what</Mask>
            <Mask delay={0.1} className="text-graphite">
              we can do for you.
            </Mask>
          </h2>

          <Reveal delay={0.1}>
            <a
              href={business.phoneHref}
              className="mt-10 block text-[clamp(2.2rem,4.4vw,3.4rem)] font-medium leading-none tracking-[-0.045em] transition-colors hover:text-green"
            >
              {business.phone}
            </a>
            <p className="mt-3 flex items-center gap-2 text-graphite">
              <Phone size={16} className="text-green" /> Call or text, 24/7. Reservations open seven days a week.
            </p>
            <a
              href={business.mapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex items-start gap-3 rounded-[1.5rem] bg-white p-5 ring-1 ring-inset ring-ink/5 transition-shadow hover:shadow-[0_24px_40px_-28px_rgba(13,15,13,0.4)]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-50 text-green">
                <MapPin size={18} />
              </span>
              <span>
                <span className="block font-semibold">{business.street}</span>
                <span className="block text-graphite">{business.cityLine}</span>
                <span className="mt-1 block text-[0.88rem] font-semibold text-green">Open in Maps</span>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-inset ring-ink/5 sm:rounded-[2rem] sm:p-10">
            {result ? (
              <SubmitResultCard
                result={result}
                sentTitle="Thanks, we have your message"
                sentBody="We will get back to you as soon as we can. For anything urgent, call or text any hour."
                onReset={reset}
                resetLabel="Send another message"
              />
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <p className="t-h3">Leave us a message</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="First name" required value={first} onChange={(e) => setFirst(e.target.value)} error={errors.first} autoComplete="given-name" />
                  <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
                </div>
                <TextAreaField label="Your message" required value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} placeholder="How may we assist you?" />
                {status === 'error' && (
                  <p role="alert" className="text-[0.92rem] font-medium text-[#b42318]">
                    That did not go through. Please try again, or call or text {business.phone}.
                  </p>
                )}
                <Button type="submit" variant="green" size="lg" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
