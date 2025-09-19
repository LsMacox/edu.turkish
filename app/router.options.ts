import type { RouterConfig } from '@nuxt/schema'

// Customize router scroll behavior to:
// - Always offset by sticky header height so anchors aren't hidden
// - Use a faster smooth scrolling animation
// - Respect saved positions on back/forward
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // SSR guard
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return savedPosition || { left: 0, top: 0 }
    }
    // Restore saved position (back/forward navigation)
    if (savedPosition) {
      return savedPosition
    }

    // Helper to get sticky header height and add a small extra gap
    const getOffset = () => {
      const header = document.querySelector('header.sticky') as HTMLElement | null
      const h = header?.getBoundingClientRect().height ?? 0
      // extra 12px gap so content doesn't touch the header
      return Math.round(h + 12)
    }

    // Basic immediate scroll (no hash)
    if (!to.hash) {
      return { left: 0, top: 0 }
    }

    // Helper: animate smooth scroll to element with header offset
    const animateToElement = (el: HTMLElement) => {
      const offset = getOffset()
      const rect = el.getBoundingClientRect()
      const currentY = window.pageYOffset
      const targetY = Math.max(0, Math.floor(currentY + rect.top - offset))

      const duration = 300
      const startTime = performance.now()
      const startY = currentY
      const deltaY = targetY - startY

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      return new Promise<void>((resolve) => {
        const step = (now: number) => {
          const elapsed = now - startTime
          const t = Math.min(1, elapsed / duration)
          const eased = easeInOutCubic(t)
          window.scrollTo({ left: 0, top: Math.round(startY + deltaY * eased) })
          if (t < 1) {
            requestAnimationFrame(step)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(step)
      })
    }

    // Helper: wait for anchor to appear (e.g., after route change/component mount)
    const waitForElement = (selector: string, timeoutMs = 1000): Promise<HTMLElement | null> => {
      return new Promise((resolve) => {
        const start = performance.now()
        const check = () => {
          const el = document.querySelector(selector) as HTMLElement | null
          if (el) {
            resolve(el)
            return
          }
          if (performance.now() - start >= timeoutMs) {
            resolve(null)
            return
          }
          requestAnimationFrame(check)
        }
        check()
      })
    }

    // Try immediate, otherwise wait briefly for element to mount, then scroll
    const immediate = document.querySelector(to.hash) as HTMLElement | null
    if (immediate) {
      return animateToElement(immediate)
    }

    return new Promise((resolve) => {
      waitForElement(to.hash, 1000).then((el) => {
        if (!el) {
          // Graceful fallback: scroll to top to avoid odd mid-page positions
          resolve({ left: 0, top: 0 } as any)
          return
        }
        animateToElement(el).then(() => resolve())
      })
    })
  },
}
