type RevealElement = HTMLElement & { _observer?: IntersectionObserver }

export default defineNuxtPlugin((nuxtApp) => {
  const prefersReducedMotion =
    import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nuxtApp.vueApp.directive('scroll-reveal', {
    mounted(el: RevealElement, { value }: { value?: number | { delay?: number } }) {
      const delay = typeof value === 'number' ? value : (value?.delay ?? 0)

      el.classList.add('animate-on-scroll')

      if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        el.classList.add('in-view')
        return
      }

      if (delay) el.style.transitionDelay = `${delay}ms`

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            el.classList.add('in-view')
            observer.disconnect()
          }
        },
        { threshold: 0.15 },
      )

      observer.observe(el)
      el._observer = observer
    },

    beforeUnmount(el: RevealElement) {
      el._observer?.disconnect()
    },
  })
})
