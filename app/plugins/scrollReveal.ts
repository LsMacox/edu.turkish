import type { DirectiveBinding } from 'vue'

interface ScrollRevealOptions {
  delay?: number
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function createObserver(el: HTMLElement) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      }
    },
    {
      threshold: 0.15,
    },
  )

  observer.observe(el)
  ;(el as any)._scrollRevealObserver = observer
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('scroll-reveal', {
    mounted(el: HTMLElement, binding: DirectiveBinding<ScrollRevealOptions | number | undefined>) {
      const value = binding.value
      const delay =
        typeof value === 'number' ? value : typeof value === 'object' && value?.delay ? value.delay : 0

      // Base animation class
      el.classList.add('animate-on-scroll')

      if (delay && !prefersReducedMotion) {
        el.style.transitionDelay = `${delay}ms`
      }

      if (prefersReducedMotion) {
        // Пользователь просит уменьшить анимацию — сразу показываем контент без эффекта
        el.classList.add('in-view')
        return
      }

      if (typeof IntersectionObserver === 'undefined') {
        // Fallback: сразу показать контент
        el.classList.add('in-view')
        return
      }

      createObserver(el)
    },
    beforeUnmount(el: HTMLElement) {
      const observer = (el as any)._scrollRevealObserver as IntersectionObserver | undefined
      if (observer) {
        observer.unobserve(el)
      }
      delete (el as any)._scrollRevealObserver
    },
  })
})
