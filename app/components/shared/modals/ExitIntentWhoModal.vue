<template>
  <BaseModal
    :is-open="isOpen"
    :title="t(key('modal.exit_intent_title'))"
    max-width="4xl"
    close-aria-label="Close exit intent modal"
    :show-swipe-indicator="false"
    @close="close"
  >
    <div class="mt-1">
      <HomeWhoSection in-modal @view-universities-click="handleViewUniversitiesClick" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { key } from '~~/lib/i18n'

const { t } = useI18n()

interface Props {
  isOpen: boolean
}

defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const close = () => {
  emit('close')
}

const handleViewUniversitiesClick = () => {
  close()

  if (typeof window === 'undefined') return

  const scrollToSection = () => {
    const target = document.getElementById('universities')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(scrollToSection, 50)
  } else {
    window.addEventListener('load', () => {
      setTimeout(scrollToSection, 50)
    })
  }
}

</script>
