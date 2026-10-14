import { business } from '../data/site'

/**
 * Set VITE_FORM_ENDPOINT (a Formspree / Web3Forms / Getform URL) in .env and requests land in the
 * owner's inbox. Until then we never fake a send: the page hands the visitor a pre-filled text
 * message to the dispatch number instead, so a booking is not lost.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

export type SubmitResult = { mode: 'sent' } | { mode: 'text'; smsHref: string; text: string }

export function formatRequest(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join('\n')
}

export async function submitRequest(subject: string, fields: Record<string, string>): Promise<SubmitResult> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, ...fields }),
    })
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    return { mode: 'sent' }
  }

  const text = `${subject}\n${formatRequest(fields)}`
  // "?&body=" is the form both iOS and Android messaging apps accept
  const smsHref = `sms:${business.smsNumber}?&body=${encodeURIComponent(text)}`
  return { mode: 'text', smsHref, text }
}
