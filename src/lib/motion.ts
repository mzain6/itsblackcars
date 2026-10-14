import { useEffect, useState, useSyncExternalStore } from 'react'

/** one easing curve for the whole site so everything moves with the same feel */
export const ease = [0.22, 1, 0.36, 1] as const

/**
 * The loading screen plays on every fresh page load. Until it starts to lift, `intro.pending` is true and
 * each page holds its entrance animations, so headlines rise as the screen opens instead of behind it.
 */
const listeners = new Set<() => void>()

export const intro = {
  pending: typeof window !== 'undefined',
  finish() {
    if (!this.pending) return
    this.pending = false
    listeners.forEach((l) => l())
  },
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** false while the loading screen is up, true from the moment it begins to lift (and always true afterwards) */
export function useIntroReady() {
  return !useSyncExternalStore(
    subscribe,
    () => intro.pending,
    () => false,
  )
}

/** true on mouse / trackpad devices; false on phones and tablets */
export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}
