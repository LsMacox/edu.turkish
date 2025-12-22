<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 card-padding-sm bg-white border-t border-default shadow-fixed md:hidden transform transition-scale"
    :class="{ 'translate-y-full': !isVisible }"
  >
    <div class="flex items-center gap-component-md">
      <div class="flex-1">
        <p class="text-label-sm uppercase tracking-wider mb-0.5">
          {{ t(ns('mobile_label')) }}
        </p>
        <p class="text-body-sm font-bold text-secondary leading-tight">
          {{ t(ns('mobile_title')) }}
        </p>
      </div>
      <BaseButton
        variant="primary"
        size="sm"
        rounded="full"
        class="shadow-card"
        @click="onCtaClick"
      >
        {{ t(ns('consult')) }}
      </BaseButton>
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
