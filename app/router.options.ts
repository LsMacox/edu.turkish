import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (typeof window === 'undefined') {
      return savedPosition || { left: 0, top: 0 }
    }

    if (savedPosition) return savedPosition
    if (!to.hash) return { left: 0, top: 0 }

    const getOffset = () => {
      const header = document.querySelector('header.sticky') as HTMLElement | null
      return (header?.getBoundingClientRect().height ?? 0) + 12
    }

    const scrollToEl = (el: HTMLElement) => {
      const top = el.getBoundingClientRect().top + window.scrollY - getOffset()
      window.scrollTo({ left: 0, top: Math.max(0, top), behavior: 'smooth' })
    }

    const getEl = (hash: string) => {
      try {
        return document.querySelector(hash) as HTMLElement | null
      } catch {
        return document.getElementById(hash.slice(1)) as HTMLElement | null
      }
    }

    const el = getEl(to.hash)
    if (el) {
      scrollToEl(el)
      return
    }

    return new Promise((resolve) => {
      const start = performance.now()
      const check = () => {
        const el = getEl(to.hash)
        if (el) {
          scrollToEl(el)
          resolve(undefined)
          return
        }
        if (performance.now() - start >= 1000) {
          resolve({ left: 0, top: 0 })
          return
        }
        requestAnimationFrame(check)
      }
      check()
    })
  },
}
