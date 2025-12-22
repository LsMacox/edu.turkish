<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="base-modal-overlay fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleOverlayClick"
    >
      <div
        ref="modalContentRef"
        :class="[
          'base-modal-content bg-white rounded-t-card-lg md:rounded-card shadow-2xl w-full mx-auto overflow-y-auto overscroll-contain',
          maxWidthClass,
          maxHeightClass,
        ]"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Swipe indicator (mobile only) -->
        <div v-if="showSwipeIndicator" class="md:hidden flex justify-center pt-3 pb-2">
          <div class="w-10 h-1 bg-surface-muted rounded-full" />
        </div>

        <!-- Header -->
        <div
          v-if="$slots.header || title"
          :class="[
            'sticky top-0 bg-white z-10 flex items-center justify-between border-b border-default',
            headerPaddingClass,
          ]"
        >
          <slot name="header">
            <h2 class="text-section-title pr-2">
              {{ title }}
            </h2>
          </slot>
          <BaseButton
            v-if="showCloseButton"
            variant="icon-close-lg"
            icon="mdi:close"
            :aria-label="closeAriaLabel"
            no-focus-ring
            class="w-11 h-11 flex-shrink-0"
            @click="close"
          />
        </div>

        <!-- Body -->
        <div :class="bodyPaddingClass">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  showSwipeIndicator?: boolean
  closeAriaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  maxWidth: 'md',
  closeOnOverlay: true,
  closeOnEscape: true,
  showCloseButton: true,
  showSwipeIndicator: true,
  closeAriaLabel: 'Close modal',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalContentRef = ref<HTMLElement | null>(null)

const maxWidthClass = computed(() => {
  const widthMap: Record<string, string> = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
    '2xl': 'md:max-w-2xl',
    '4xl': 'md:max-w-4xl',
  }
  return widthMap[props.maxWidth] || 'md:max-w-md'
})

const maxHeightClass = computed(() => 'max-h-[95vh] md:max-h-[90vh]')

const headerPaddingClass = computed(() => 'px-5 pt-3 pb-3 md:p-6')

const bodyPaddingClass = computed(() => 'p-5 md:p-6')

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// Touch gesture handling for mobile swipe-to-close
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const isDragging = ref(false)

const handleTouchStart = (e: TouchEvent) => {
  const modalContent = e.currentTarget as HTMLElement
  const scrollTop = modalContent.scrollTop

  if (scrollTop === 0 && e.touches[0]) {
    touchStartY.value = e.touches[0].clientY
    isDragging.value = true
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !e.touches[0]) return

  touchCurrentY.value = e.touches[0].clientY
  const diff = touchCurrentY.value - touchStartY.value

  if (diff > 0) {
    const modalContent = e.currentTarget as HTMLElement
    modalContent.style.transform = `translateY(${diff}px)`
    modalContent.style.transition = 'none'
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const diff = touchCurrentY.value - touchStartY.value
  const modalContent = modalContentRef.value

  if (modalContent) {
    modalContent.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'

    if (diff > 100) {
      modalContent.style.transform = 'translateY(100%)'
      setTimeout(() => {
        close()
      }, 300)
    } else {
      modalContent.style.transform = 'translateY(0)'
    }
  }

  isDragging.value = false
  touchStartY.value = 0
  touchCurrentY.value = 0
}

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen && props.closeOnEscape) {
      close()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

watch(
  () => props.isOpen,
  (isOpen) => {
    if (import.meta.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  { immediate: true },
)
</script>

<style>
.base-modal-overlay {
  animation: baseModalFadeIn 0.25s ease-out;
}

@keyframes baseModalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.base-modal-content {
  animation: baseModalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

@keyframes baseModalSlideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  @keyframes baseModalSlideIn {
    from {
      transform: translateY(-20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
}

.base-modal-content {
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 767px) {
  .base-modal-content {
    touch-action: pan-y;
  }
}
</style>
