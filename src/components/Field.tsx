import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../lib/cn'

export const controlCls =
  'w-full rounded-2xl bg-paper px-4 py-3.5 text-[1rem] text-ink outline-none ring-1 ring-inset ring-ink/10 transition placeholder:text-ink/35 focus:bg-white focus:ring-2 focus:ring-green aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#b42318]'

type A11y = { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }

/** label + control + error line; the control comes in as a render prop so ids and aria stay wired */
export function Field({
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: (a11y: A11y) => ReactNode
}) {
  const id = useId()
  const msgId = `${id}-msg`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.9rem] font-semibold">
        {label}
        {required ? (
          <span className="text-green" aria-hidden>
            {' '}
            *
          </span>
        ) : (
          <span className="ml-1.5 text-[0.82rem] font-normal text-graphite">optional</span>
        )}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error || hint ? msgId : undefined })}
      {(error || hint) && (
        <motion.p
          id={msgId}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role={error ? 'alert' : undefined}
          className={cn('mt-1.5 text-[0.85rem]', error ? 'font-medium text-[#b42318]' : 'text-graphite')}
        >
          {error ?? hint}
        </motion.p>
      )}
    </div>
  )
}

type TextFieldProps = {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>

export function TextField({ label, error, hint, required, className, ...input }: TextFieldProps) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(a) => <input {...a} {...input} required={required} className={controlCls} />}
    </Field>
  )
}

type AreaProps = {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>

export function TextAreaField({ label, error, hint, required, className, ...area }: AreaProps) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(a) => <textarea {...a} {...area} required={required} className={cn(controlCls, 'min-h-[7.5rem] resize-y')} />}
    </Field>
  )
}

/** single-choice pills (a radio group underneath) */
export function ChoiceChips<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  required,
}: {
  label: string
  options: readonly T[]
  value: T | ''
  onChange: (v: T) => void
  error?: string
  required?: boolean
}) {
  const id = useId()
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <p id={id} className="mb-2.5 text-[0.9rem] font-semibold">
        {label}
        {required && (
          <span className="text-green" aria-hidden>
            {' '}
            *
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o)}
              className={cn(
                'rounded-full px-4 py-2.5 text-[0.93rem] font-medium ring-1 ring-inset transition-all duration-300',
                on ? 'bg-green text-white ring-green' : 'bg-paper text-ink ring-ink/10 hover:bg-white hover:ring-ink/30',
              )}
            >
              {o}
            </button>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-[0.85rem] font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  )
}

export function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
  unit,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  unit: string
}) {
  const id = useId()
  return (
    <div>
      <p id={id} className="mb-2 text-[0.9rem] font-semibold">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className="inline-flex items-center gap-1 rounded-full bg-paper p-1 ring-1 ring-inset ring-ink/10">
        <button
          type="button"
          aria-label={`Fewer ${unit}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-ink"
        >
          <Minus size={16} />
        </button>
        <span className="min-w-[6.2rem] text-center text-[1rem] font-semibold tabular-nums" aria-live="polite">
          {value} {value === 1 ? unit : `${unit}s`}
        </span>
        <button
          type="button"
          aria-label={`More ${unit}s`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-ink"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
