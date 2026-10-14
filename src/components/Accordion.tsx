import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { ease } from '../lib/motion'

export type AccordionItem = { id: string; title: string; body: string[] }

/** one open at a time; the panel height animates and the plus turns into a cross */
export function Accordion({ items, initialOpen }: { items: AccordionItem[]; initialOpen?: string }) {
  const [open, setOpen] = useState<string | null>(initialOpen ?? items[0]?.id ?? null)

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((it) => {
        const isOpen = open === it.id
        return (
          <div key={it.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${it.id}`}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[1.3rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-green sm:text-[1.45rem]">
                  {it.title}
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-ink/15 transition-colors group-hover:bg-ink group-hover:text-white">
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.4, ease }}>
                    <Plus size={18} strokeWidth={1.8} />
                  </motion.span>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${it.id}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-7 pr-14 text-[1.05rem] leading-relaxed text-graphite">
                    {it.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
