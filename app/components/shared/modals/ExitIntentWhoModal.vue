<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 md:mx-6 max-h-[90vh] overflow-y-auto"
      >
        <div
          class="flex items-start justify-between px-5 py-4 md:px-6 md:py-5 border-b border-gray-100"
        >
          <h2 class="text-lg md:text-2xl font-bold text-secondary pr-4">
            Подождите! Не уходите, не получив свой план поступления.
          </h2>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
            type="button"
            aria-label="Close exit intent modal"
            @click="close"
          >
            <Icon name="mdi:close" class="text-gray-500 text-xl" />
          </button>
        </div>
        <div class="pt-0 mt-6 px-4 pb-4 md:px-6 md:pb-6">
          <HomeWhoSection in-modal @view-universities-click="handleViewUniversitiesClick" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
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

onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.isOpen) {
      close()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
