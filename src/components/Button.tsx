import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/cn'
import { useFinePointer } from '../lib/motion'

type Variant = 'green' | 'ink' | 'white' | 'glass' | 'outline'

const styles: Record<Variant, string> = {
  green: 'bg-green text-white hover:bg-green-600',
  ink: 'bg-ink text-white hover:bg-coal',
  white: 'bg-white text-ink hover:bg-paper',
  glass: 'bg-white/12 text-white ring-1 ring-inset ring-white/30 backdrop-blur-md hover:bg-white/22',
  outline: 'text-ink ring-1 ring-inset ring-ink/20 hover:bg-ink hover:text-white',
}

type Props = {
  children: ReactNode
  variant?: Variant
  className?: string
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  size?: 'md' | 'lg'
  icon?: boolean
  magnetic?: boolean
}

/** pill button; on mouse devices the primary ones lean toward the cursor */
export function Button({
  children,
  variant = 'green',
  className,
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  size = 'md',
  icon = true,
  magnetic,
}: Props) {
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 })

  const body = (
    <span className="flex items-center gap-2.5">
      <span>{children}</span>
      {icon && (
        <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-current/15">
          <ArrowUpRight
            size={14}
            strokeWidth={2.2}
            className="col-start-1 row-start-1 transition-transform duration-500 ease-expo group-hover/btn:translate-x-[160%] group-hover/btn:-translate-y-[160%]"
          />
          <ArrowUpRight
            size={14}
            strokeWidth={2.2}
            aria-hidden
            className="col-start-1 row-start-1 -translate-x-[160%] translate-y-[160%] transition-transform duration-500 ease-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
          />
        </span>
      )}
    </span>
  )

  const cls = cn(
    'group/btn inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-semibold tracking-[-0.005em] transition-colors duration-300',
    size === 'lg' ? 'py-[0.95rem] pl-7 pr-[1.1rem] text-[1rem]' : 'py-2.5 pl-5 pr-3 text-[0.92rem]',
    !icon && (size === 'lg' ? '!px-7' : '!px-5'),
    styles[variant],
    disabled && 'pointer-events-none opacity-50',
    className,
  )

  const inner = to ? (
    <Link to={to} onClick={onClick} className={cls}>
      {body}
    </Link>
  ) : href ? (
    <a href={href} onClick={onClick} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {body}
    </a>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {body}
    </button>
  )

  if (!magnetic || !fine) return inner

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.2)
        my.set((e.clientY - (r.top + r.height / 2)) * 0.26)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {inner}
    </motion.div>
  )
}
