import { Button } from '../components/Button'
import { Accordion } from '../components/Accordion'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { Kicker, Mask, ParallaxImage, Reveal } from '../components/Reveal'
import { business, policies, services } from '../data/site'
import { cn } from '../lib/cn'
import { usePageMeta } from '../lib/usePageMeta'

export default function Services() {
  usePageMeta(
    'Services | LATS Black Cars, Columbus Ohio',
    'Airport transfers, corporate and executive black car service, conventions, weddings, concerts, sports and nights out across the Columbus area. Flat or hourly rates. Call or text 614-483-5876.',
  )

  return (
    <>
      <PageHero
        kicker="Services"
        lines={['Transportation for', 'every occasion.']}
        text="Corporate and black car service, airport transfers, executive transportation, conventions, weddings and special occasions across the Columbus area."
        image="/images/aerial-dusk.webp"
        position="50% 60%"
      >
        <nav aria-label="Jump to a service" className="flex max-w-xl flex-wrap gap-2 lg:justify-end">
          {services.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="rounded-full bg-white/12 px-4 py-2 text-[0.9rem] font-medium text-white ring-1 ring-inset ring-white/25 backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="pb-8 pt-16 sm:pt-24">
        <div className="wrap divide-y divide-ink/10">
          {services.map((s, i) => {
            const flip = i % 2 === 1
            return (
              <article
                key={s.id}
                id={s.id}
                className="grid scroll-mt-24 items-center gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24"
              >
                <ParallaxImage
                  src={s.image}
                  alt=""
                  position={s.position}
                  className={cn(
                    'aspect-[5/4] w-full rounded-[1.75rem] sm:rounded-[2.25rem] lg:col-span-6',
                    flip && 'lg:order-2 lg:col-start-7',
                  )}
                />
                <div className={cn('lg:col-span-5', flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8')}>
                  <Kicker>{s.no}</Kicker>
                  <h2 className="t-h2 mt-5 !text-[clamp(2.1rem,4vw,3.6rem)]">
                    <Mask>{s.title}</Mask>
                  </h2>
                  <Reveal delay={0.1}>
                    <p className="mt-4 text-[1.25rem] font-medium tracking-[-0.02em] text-green">{s.line}</p>
                    <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed text-graphite">{s.body}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <li key={t} className="rounded-full bg-white px-3.5 py-1.5 text-[0.88rem] font-medium ring-1 ring-inset ring-ink/10">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button to={`/book?service=${s.id}`} variant="ink">
                        Book this ride
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Kicker>Pricing &amp; policies</Kicker>
              <h2 className="t-h2 mt-6">
                <Mask>Clear terms,</Mask>
                <Mask delay={0.1} className="text-graphite">
                  transparent rates.
                </Mask>
              </h2>
              <Reveal delay={0.15}>
                <div className="mt-9 rounded-[1.75rem] bg-green p-7 text-white sm:p-9">
                  <p className="text-[1.6rem] font-semibold leading-tight tracking-[-0.03em]">
                    Please contact us for pricing.
                  </p>
                  <p className="mt-3 text-[1.02rem] text-white/75">We offer flat or hourly rates.</p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button to="/book" variant="white">
                      Request a quote
                    </Button>
                    <Button href={business.phoneHref} variant="glass" icon={false}>
                      Call {business.phone}
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <Accordion items={policies} initialOpen="airport" />
          </Reveal>
        </div>
      </section>

      <CtaBand note="Please share the details of your plans with us. We will return with a proposal and the rate." />
    </>
  )
}
