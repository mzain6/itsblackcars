import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

/**
 * "smith" -> "Smith", "van der berg" -> "Van Der Berg". Done in code rather than with CSS `capitalize`,
 * which would treat every animated letter span as the start of a new word.
 */
const titleCase = (s: string) => s.replace(/(^|[\s'’-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())

/** letters rise into place one after another; flat, so the typeface never distorts mid-animation */
export function LetterRise({ text, className, stagger = 0.04 }: { text: string; className?: string; stagger?: number }) {
  return (
    <span className={cn('inline-block', className)} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${text}-${i}`}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: '30%' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: i * stagger }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * The black-and-white sign a LATS chauffeur holds at baggage claim: the passenger's last name and nothing else.
 * It is the one recurring motif on the site: hero, arrival story, and the live preview on the reservation form.
 * Kept level and square-cornered on purpose, and set in the same Albert Sans headline style as the rest of the site.
 */
export function Placard({
  name,
  className,
  placeholder = 'Surname',
}: {
  name: string
  className?: string
  placeholder?: string
}) {
  const typed = titleCase(name.trim())
  const shown = typed || placeholder
  const long = shown.length > 9

  return (
    <div
      className={cn(
        'relative bg-chalk px-6 py-6 text-center text-ink shadow-[0_36px_60px_-30px_rgba(0,0,0,0.55)] sm:px-8',
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-2 border border-ink" />
      <span aria-hidden className="pointer-events-none absolute inset-[0.65rem] border border-ink/25" />

      <div className="relative">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.34em] text-ink/55">LATS Black Cars</p>
        <span aria-hidden className="mx-auto mt-3 block h-px w-8 bg-ink/40" />
        <div className="mt-4 flex min-h-[4rem] items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={shown}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={cn(
                'w-full break-words pb-[0.1em] font-medium leading-[1.05] tracking-[-0.045em]',
                long ? 'text-[clamp(1.7rem,2.9vw,2.4rem)]' : 'text-[clamp(2.3rem,4.2vw,3.5rem)]',
                !typed && 'text-ink/25',
              )}
            >
              <LetterRise text={shown} stagger={0.035} />
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
