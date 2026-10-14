import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, MessageSquare, Phone } from 'lucide-react'
import { Button } from './Button'
import { business } from '../data/site'
import type { SubmitResult } from '../lib/submit'
import { ease } from '../lib/motion'

function DrawnCheck() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="#2b5336"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease }}
      />
      <motion.path
        d="M19 33l9 9 17-19"
        fill="none"
        stroke="#2b5336"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease, delay: 0.55 }}
      />
    </svg>
  )
}

/**
 * What the visitor sees after pressing send. When a form endpoint is configured the request is already
 * with us. Otherwise we hand over a pre-filled text message to the dispatch number, and say so plainly.
 */
export function SubmitResultCard({
  result,
  sentTitle,
  sentBody,
  onReset,
  resetLabel,
}: {
  result: SubmitResult
  sentTitle: string
  sentBody: string
  onReset: () => void
  resetLabel: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (result.mode !== 'text') return
    try {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard can be blocked; the text button above still works */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="py-6 text-center sm:py-10"
      role="status"
    >
      <div className="mx-auto grid w-fit place-items-center">
        <DrawnCheck />
      </div>

      {result.mode === 'sent' ? (
        <>
          <h3 className="t-h3 mt-6 !text-[1.9rem]">{sentTitle}</h3>
          <p className="mx-auto mt-3 max-w-md text-graphite">{sentBody}</p>
        </>
      ) : (
        <>
          <h3 className="t-h3 mt-6 !text-[1.9rem]">One final step: send your request</h3>
          <p className="mx-auto mt-3 max-w-md text-graphite">
            Your request is prepared. Select the button below to send it by text message to {business.phone}, and we
            will confirm from there. You may also copy the details or call us.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={result.smsHref} variant="green" size="lg" icon={false}>
              <span className="flex items-center gap-2">
                <MessageSquare size={17} /> Send by text message
              </span>
            </Button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full px-6 py-[0.95rem] font-semibold ring-1 ring-inset ring-ink/20 transition-colors hover:bg-ink hover:text-white"
            >
              <Copy size={16} /> {copied ? 'Copied' : 'Copy details'}
            </button>
            <a
              href={business.phoneHref}
              className="inline-flex items-center gap-2 rounded-full px-6 py-[0.95rem] font-semibold ring-1 ring-inset ring-ink/20 transition-colors hover:bg-ink hover:text-white"
            >
              <Phone size={16} /> Call
            </a>
          </div>
        </>
      )}

      <button type="button" onClick={onReset} className="mt-8 text-[0.95rem] font-semibold text-green underline-offset-4 hover:underline">
        {resetLabel}
      </button>
    </motion.div>
  )
}
