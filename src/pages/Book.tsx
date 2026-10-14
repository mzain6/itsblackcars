import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Phone } from 'lucide-react'
import { Button } from '../components/Button'
import { ChoiceChips, controlCls, Field, NumberStepper, TextAreaField, TextField } from '../components/Field'
import { Placard } from '../components/Placard'
import { Kicker, Mask } from '../components/Reveal'
import { SubmitResultCard } from '../components/SubmitResult'
import { business, serviceOptions, services, type ServiceOption } from '../data/site'
import { cn } from '../lib/cn'
import { ease, useIntroReady } from '../lib/motion'
import { submitRequest, type SubmitResult } from '../lib/submit'
import { usePageMeta } from '../lib/usePageMeta'

const rates = ['Flat rate', 'Hourly', 'Undecided'] as const
type Rate = (typeof rates)[number]

type Form = {
  service: ServiceOption | ''
  rate: Rate
  date: string
  time: string
  pickup: string
  dropoff: string
  hours: number
  flight: string
  first: string
  last: string
  email: string
  phone: string
  riders: number
  note: string
}

type Errors = Partial<Record<keyof Form, string>>

const steps = ['Journey', 'Passenger', 'Confirmation'] as const

const todayISO = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

const fmtPhone = (v: string) => {
  const d = v.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return ''
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const fmtDate = (d: string) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''

function validate(step: number, f: Form): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!f.service) e.service = 'Please select a service.'
    if (!f.date) e.date = 'Please select a date.'
    else if (f.date < todayISO()) e.date = 'Please select a date that has not passed.'
    if (!f.time) e.time = 'Please select a pick-up time.'
    if (f.pickup.trim().length < 3) e.pickup = 'Please enter the pick-up address.'
    if (f.rate !== 'Hourly' && f.dropoff.trim().length < 3) e.dropoff = 'Please enter the drop-off address.'
  }
  if (step === 1) {
    if (!f.first.trim()) e.first = 'Please enter your first name.'
    if (!f.last.trim()) e.last = 'Please enter your last name. It appears on your chauffeur’s sign.'
    if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a 10-digit phone number.'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  }
  return e
}

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 44 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -44 }),
}

export default function Book() {
  usePageMeta(
    'Book Now | LATS Black Cars, Columbus Ohio',
    'Reserve a black car in Columbus, Ohio: airport transfers, corporate, conventions, weddings and nights out. Tell us the trip and we will confirm the details and the rate.',
  )

  const ready = useIntroReady()
  const [params] = useSearchParams()
  const initial = useMemo<Form>(() => {
    const fromService = services.find((s) => s.id === params.get('service'))?.option ?? ''
    const riders = Math.min(6, Math.max(1, Number(params.get('riders')) || 1))
    return {
      service: fromService,
      rate: 'Flat rate',
      date: '',
      time: '',
      pickup: '',
      dropoff: '',
      hours: 3,
      flight: '',
      first: '',
      last: '',
      email: '',
      phone: '',
      riders,
      note: '',
    }
  }, [params])

  const [form, setForm] = useState<Form>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const card = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const go = (to: number) => {
    setDir(to > step ? 1 : -1)
    setStep(to)
    window.setTimeout(() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const next = () => {
    const e = validate(step, form)
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => card.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    go(step + 1)
  }

  const submit = async () => {
    setStatus('sending')
    try {
      const res = await submitRequest(`Booking request: ${form.last}, ${form.service}`, {
        Service: form.service,
        Rate: form.rate,
        Date: fmtDate(form.date),
        'Pick-up time': fmtTime(form.time),
        'Pick-up address': form.pickup,
        'Drop-off address': form.rate === 'Hourly' ? '' : form.dropoff,
        'Hours needed': form.rate === 'Hourly' ? String(form.hours) : '',
        'Flight number': form.service === 'Airport transfer' ? form.flight : '',
        Name: `${form.first} ${form.last}`,
        Phone: form.phone,
        Email: form.email,
        Passengers: String(form.riders),
        'Message for the chauffeur': form.note,
      })
      setResult(res)
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setForm(initial)
    setErrors({})
    setStep(0)
    setDir(1)
    setStatus('idle')
    setResult(null)
  }

  const isAirport = form.service === 'Airport transfer'

  const rows: { k: string; v: string; empty?: boolean }[] = [
    { k: 'Service', v: form.service || 'Not yet selected', empty: !form.service },
    {
      k: 'Date',
      v: form.date ? `${fmtDate(form.date)}${form.time ? ` · ${fmtTime(form.time)}` : ''}` : 'To be selected',
      empty: !form.date,
    },
    { k: 'From', v: form.pickup || 'Pick-up address', empty: !form.pickup },
    form.rate === 'Hourly'
      ? { k: 'Duration', v: `${form.hours} ${form.hours === 1 ? 'hour' : 'hours'}` }
      : { k: 'To', v: form.dropoff || 'Drop-off address', empty: !form.dropoff },
    { k: 'Passengers', v: String(form.riders) },
  ]

  return (
    <>
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="rounded-[1.75rem] bg-paper-2 pb-14 pt-36 sm:rounded-[2.5rem] sm:pb-20 sm:pt-44">
          <div className="wrap grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ duration: 0.9, ease, delay: 0.5 }}>
                <Kicker>Reservations</Kicker>
              </motion.div>
              <h1 className="t-h1 mt-6">
                <Mask active={ready} delay={0.55}>
                  Reserve your
                </Mask>
                <Mask active={ready} delay={0.67} className="text-graphite">
                  journey.
                </Mask>
              </h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, ease, delay: 0.9 }}
              className="max-w-sm text-[1.1rem] leading-relaxed text-graphite lg:col-span-4 lg:justify-self-end"
            >
              Reservations are accepted seven days a week. Please provide the details of your journey and we will confirm the arrangements and the rate.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-3 sm:pb-32 sm:pt-4">
        <div className="wrap grid gap-4 lg:grid-cols-12">
          {/* live summary: the sign, and the trip as it builds */}
          <aside className="lg:col-span-5">
            <div className="rounded-[1.75rem] bg-ink p-6 text-white sm:rounded-[2rem] sm:p-9 lg:sticky lg:top-28">
              <p className="kicker text-mist [--kicker-dot:var(--color-sage)]">Your chauffeur’s sign</p>
              <Placard name={form.last} placeholder="Surname" className="mt-6" />
              <p className="mt-6 text-[0.92rem] leading-relaxed text-white/60">
                {isAirport
                  ? 'Your chauffeur will be waiting at baggage claim level, at the bottom of the escalator nearest your carousel, holding this sign.'
                  : 'Your chauffeur will carry a black-and-white sign bearing your last name.'}
              </p>

              <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-[0.95rem]">
                {rows.map(({ k, v, empty }) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="shrink-0 text-white/50">{k}</dt>
                    <dd className={cn('truncate text-right', empty ? 'text-white/35' : 'text-white')}>{v}</dd>
                  </div>
                ))}
              </dl>

              <a href={business.phoneHref} className="mt-7 flex items-center justify-between gap-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/12">
                <span>
                  <span className="block text-[0.85rem] text-white/55">Prefer to speak with us? Call or text</span>
                  <span className="block text-[1.35rem] font-medium tracking-[-0.03em]">{business.phone}</span>
                </span>
                <Phone size={20} className="text-sage" />
              </a>
            </div>
          </aside>

          <div ref={card} className="scroll-mt-24 lg:col-span-7">
            <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-inset ring-ink/5 sm:rounded-[2rem] sm:p-10">
              {result ? (
                <SubmitResultCard
                  result={result}
                  sentTitle="Request received"
                  sentBody={`Thank you, ${form.first}. We will confirm your reservation, the details and the rate shortly. For urgent matters, please call or text ${business.phone}.`}
                  onReset={reset}
                  resetLabel="Make another reservation"
                />
              ) : (
                <>
                  {/* stepper */}
                  <ol className="mb-9 flex items-center gap-2 sm:gap-3" aria-label="Booking steps">
                    {steps.map((s, i) => (
                      <li key={s} className="flex flex-1 items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          disabled={i > step}
                          onClick={() => i < step && go(i)}
                          aria-current={i === step ? 'step' : undefined}
                          className="flex items-center gap-2 text-left disabled:cursor-default"
                        >
                          <span
                            className={cn(
                              'grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.82rem] font-bold transition-colors duration-500',
                              i <= step ? 'bg-green text-white' : 'bg-paper text-graphite',
                            )}
                          >
                            {i + 1}
                          </span>
                          <span className={cn('hidden text-[0.92rem] font-semibold sm:block', i <= step ? 'text-ink' : 'text-graphite')}>{s}</span>
                        </button>
                        {i < steps.length - 1 && (
                          <span className="relative h-px flex-1 bg-ink/12">
                            <motion.span
                              className="absolute inset-y-0 left-0 bg-green"
                              initial={false}
                              animate={{ width: i < step ? '100%' : '0%' }}
                              transition={{ duration: 0.6, ease }}
                            />
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>

                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease }}
                    >
                      {step === 0 && (
                        <div className="space-y-6">
                          <ChoiceChips label="Type of service" options={serviceOptions} value={form.service} onChange={(v) => set('service', v)} error={errors.service} required />
                          <ChoiceChips label="Rate preference" options={rates} value={form.rate} onChange={(v) => set('rate', v)} />
                          <div className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Date of service" type="date" required min={todayISO()} value={form.date} onChange={(e) => set('date', e.target.value)} error={errors.date} />
                            <TextField label="Pick-up time" type="time" required value={form.time} onChange={(e) => set('time', e.target.value)} error={errors.time} />
                          </div>
                          <TextField label="Pick-up address" required value={form.pickup} onChange={(e) => set('pickup', e.target.value)} error={errors.pickup} placeholder={isAirport ? 'Airport and terminal, or street address' : 'Street address or place'} autoComplete="street-address" />
                          {form.rate === 'Hourly' ? (
                            <NumberStepper label="Hours required" value={form.hours} min={1} max={12} onChange={(n) => set('hours', n)} unit="hour" />
                          ) : (
                            <TextField label="Drop-off address" required value={form.dropoff} onChange={(e) => set('dropoff', e.target.value)} error={errors.dropoff} placeholder="Street address or place" />
                          )}
                          {isAirport && (
                            <TextField label="Flight number" value={form.flight} onChange={(e) => set('flight', e.target.value)} placeholder="e.g. DL 1234" hint="Optional. Your chauffeur can plan around your arrival." />
                          )}
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-6">
                          <div className="grid gap-5 sm:grid-cols-2">
                            <TextField label="First name" required value={form.first} onChange={(e) => set('first', e.target.value)} error={errors.first} autoComplete="given-name" />
                            <TextField label="Last name" required value={form.last} onChange={(e) => set('last', e.target.value)} error={errors.last} autoComplete="family-name" hint="Appears on your chauffeur’s sign." />
                          </div>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <TextField label="Phone" type="tel" required value={form.phone} onChange={(e) => set('phone', fmtPhone(e.target.value))} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="(614) 555-0123" />
                            <TextField label="Email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} autoComplete="email" />
                          </div>
                          <NumberStepper label="Number of passengers" value={form.riders} min={1} max={6} onChange={(n) => set('riders', n)} unit="passenger" />
                          <p className="text-[0.92rem] text-graphite">One Suburban seats up to six passengers. If your party is larger, please note this on the next step.</p>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-6">
                          <TextAreaField label="Additional message for your chauffeur" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Luggage, a child seat, additional stops, a larger party, or any other requirement." />
                          <div className="rounded-2xl bg-paper p-5 text-[0.95rem] leading-relaxed text-graphite">
                            <p className="font-semibold text-ink">Please note</p>
                            <ul className="mt-2 list-disc space-y-1.5 pl-5">
                              <li>We will confirm your ride and quote the rate before the trip. We offer flat or hourly rates.</li>
                              <li>A simple pick-up and drop-off includes 15 minutes of courtesy wait. After that, wait-time fees apply in 30-minute increments.</li>
                            </ul>
                          </div>
                          <Field label="Reservation summary">
                            {(a) => (
                              <textarea
                                {...a}
                                readOnly
                                className={cn(controlCls, 'h-[9.5rem] resize-none bg-paper-2/60 text-[0.92rem] text-graphite')}
                                value={[
                                  `${form.service}${form.rate ? ` · ${form.rate}` : ''}`,
                                  `${fmtDate(form.date)} at ${fmtTime(form.time)}`,
                                  `From: ${form.pickup}`,
                                  form.rate === 'Hourly' ? `Hours: ${form.hours}` : `To: ${form.dropoff}`,
                                  `${form.first} ${form.last} · ${form.phone} · ${form.email}`,
                                  `${form.riders} ${form.riders === 1 ? 'passenger' : 'passengers'}`,
                                ].join('\n')}
                              />
                            )}
                          </Field>
                          {status === 'error' && (
                            <p role="alert" className="text-[0.92rem] font-medium text-[#b42318]">
                              That did not go through. Please try again, or call or text {business.phone}.
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex items-center justify-between gap-4">
                    {step > 0 ? (
                      <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-graphite transition-colors hover:text-ink">
                        <ArrowLeft size={17} /> Back
                      </button>
                    ) : (
                      <span />
                    )}
                    {step < 2 ? (
                      <Button onClick={next} variant="green" size="lg">
                        Continue
                      </Button>
                    ) : (
                      <Button onClick={submit} variant="green" size="lg" disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending…' : 'Submit reservation request'}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
