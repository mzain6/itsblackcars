import { Button } from '../components/Button'
import { Mask } from '../components/Reveal'
import { useIntroReady } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found | LATS Black Cars', 'That page could not be found.')
  const ready = useIntroReady()
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="flex min-h-[calc(100svh-2rem)] flex-col justify-end rounded-[1.75rem] bg-ink pb-16 text-white sm:rounded-[2.5rem]">
        <div className="wrap">
          <p className="kicker text-mist [--kicker-dot:var(--color-sage)]">Error 404</p>
          <h1 className="t-hero mt-6 text-[clamp(4rem,16vw,14rem)]">
            <Mask active={ready}>Page not found.</Mask>
          </h1>
          <p className="mt-6 max-w-md text-[1.1rem] text-white/70">The page you requested could not be found. Please return to the homepage.</p>
          <div className="mt-8">
            <Button to="/" variant="green" size="lg">
              Back to the homepage
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
