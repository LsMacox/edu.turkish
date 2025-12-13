<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden transform transition-transform duration-300"
    :class="{ 'translate-y-full': !isVisible }"
  >
    <div class="flex items-center gap-3">
      <div class="flex-1">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
          {{ t(ns('mobile_label')) }}
        </p>
        <p class="text-sm font-bold text-secondary leading-tight">
          {{ t(ns('mobile_title')) }}
        </p>
      </div>
      <button
        class="px-6 py-3 text-sm font-bold text-white bg-primary rounded-full shadow-lg hover:bg-primary-dark whitespace-nowrap"
        @click="onCtaClick"
      >
        {{ t(ns('consult')) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const ns = namespace('blog.powerPage.cta')
const { t } = useI18n()
const emit = defineEmits<{
  (e: 'click'): void
}>()

const isVisible = ref(false)
let lastScrollY = 0

const onScroll = () => {
  if (import.meta.client) {
    const currentScrollY = window.scrollY
    const heroHeight = window.innerHeight * 0.8

    if (currentScrollY > heroHeight) {
      const visible =
        currentScrollY < lastScrollY ||
        window.innerHeight + currentScrollY >= document.body.offsetHeight - 100
      isVisible.value = visible
      document.body.classList.toggle('has-sticky-cta', visible)
    } else {
      isVisible.value = false
      document.body.classList.remove('has-sticky-cta')
    }
    lastScrollY = currentScrollY
  }
}

const onCtaClick = () => {
  emit('click')
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', onScroll)
    document.body.classList.remove('has-sticky-cta')
  }
})
</script>
