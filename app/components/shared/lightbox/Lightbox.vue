<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div
          v-if="modelValue !== null"
          class="fixed inset-0 z-50 flex items-center justify-center md:p-4 select-none"
          :style="backdropStyle"
          @click.self="close"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend.passive="onTouchEnd"
        >
          <!-- Close Button -->
          <BaseButton
            variant="lightbox-close"
            icon="mdi:close"
            aria-label="Close"
            no-focus-ring
            class="absolute top-4 right-4 z-10 w-10 h-10"
            @click="close"
          />

          <!-- Prev Button -->
          <BaseButton
            v-if="items.length > 1"
            variant="lightbox-nav"
            icon="mdi:chevron-left"
            aria-label="Previous"
            no-focus-ring
            class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12"
            @click.stop="prev"
          />

          <!-- Next Button -->
          <BaseButton
            v-if="items.length > 1"
            variant="lightbox-nav"
            icon="mdi:chevron-right"
            aria-label="Next"
            no-focus-ring
            class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12"
            @click.stop="next"
          />

          <!-- Carousel -->
          <div
            class="max-w-6xl w-full overflow-hidden relative"
            :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
            :style="contentStyle"
          >
            <div
              class="lightbox-slider flex"
              :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
              :style="{ transform: sliderTransform }"
            >
              <div
                v-for="(item, idx) in items"
                :key="idx"
                class="lightbox-slide flex-shrink-0 w-full flex items-center justify-center"
              >
                <slot name="slide" :item="item" :index="idx" :is-active="idx === displayIndex" />
              </div>
            </div>

            </div>

          <!-- Info Bar - Fixed to viewport bottom -->
          <div class="absolute left-0 right-0 bottom-0 flex items-center justify-between px-4 py-3 md:py-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
            <!-- Caption -->
            <Transition name="lightbox-caption" mode="out-in">
              <div :key="displayIndex">
                <slot name="caption" :item="currentItem" :index="displayIndex" />
              </div>
            </Transition>

            <!-- Counter -->
            <div 
              v-if="items.length > 1" 
              class="text-white/80 text-sm bg-black/50 px-2.5 py-1 rounded-full"
            >
              {{ displayIndex + 1 }}/{{ items.length }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  modelValue: number | null
  items: T[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const displayIndex = ref(0)

const currentItem = computed(() =>
  props.modelValue !== null ? props.items[props.modelValue] : null,
)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== null) {
      displayIndex.value = Math.min(Math.max(0, val), Math.max(0, props.items.length - 1))
    }
  },
  { immediate: true },
)

function close() {
  emit('update:modelValue', null)
}

function next() {
  if (!props.items.length) return
  const newIndex = (displayIndex.value + 1) % props.items.length
  displayIndex.value = newIndex
  emit('update:modelValue', newIndex)
}

function prev() {
  if (!props.items.length) return
  const newIndex = (displayIndex.value - 1 + props.items.length) % props.items.length
  displayIndex.value = newIndex
  emit('update:modelValue', newIndex)
}

// Keyboard navigation
function onKey(e: KeyboardEvent) {
  if (props.modelValue === null) return
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// Touch drag swipe
let touchStartX = 0
let touchStartY = 0
let sliderWidth = 0
let swipeDirection: 'horizontal' | 'vertical' | null = null
const isDragging = ref(false)
const dragOffset = ref(0)
const dragOffsetY = ref(0)

const sliderTransform = computed(() => {
  const baseOffset = displayIndex.value * 100
  const dragPercent = sliderWidth > 0 ? (dragOffset.value / sliderWidth) * 100 : 0
  return `translateX(calc(-${baseOffset}% + ${dragPercent}%))`
})

const backdropStyle = computed(() => {
  const opacity = Math.max(0.5, 0.9 - Math.abs(dragOffsetY.value) / 400)
  return { backgroundColor: `rgba(0, 0, 0, ${opacity})` }
})

const contentStyle = computed(() => {
  return { transform: `translateY(${dragOffsetY.value}px)` }
})

function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0]?.clientX || 0
  touchStartY = e.changedTouches[0]?.clientY || 0
  isDragging.value = true
  dragOffset.value = 0
  dragOffsetY.value = 0
  swipeDirection = null
  // Get slider width for percentage calculation
  const target = e.currentTarget as HTMLElement
  const slider = target.querySelector('.lightbox-slider')
  sliderWidth = slider?.clientWidth || window.innerWidth
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  const currentX = e.changedTouches[0]?.clientX || 0
  const currentY = e.changedTouches[0]?.clientY || 0
  let dx = currentX - touchStartX
  const dy = currentY - touchStartY

  // Determine swipe direction on first significant move
  if (!swipeDirection && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
    swipeDirection = Math.abs(dy) > Math.abs(dx) ? 'vertical' : 'horizontal'
  }

  if (swipeDirection === 'vertical') {
    // Vertical swipe - for closing
    dragOffsetY.value = dy
    return
  }

  // Horizontal swipe - for navigation
  // Add resistance at edges
  const isAtStart = displayIndex.value === 0 && dx > 0
  const isAtEnd = displayIndex.value === props.items.length - 1 && dx < 0
  if (isAtStart || isAtEnd) {
    dx = dx * 0.3 // Rubber band effect
  }

  dragOffset.value = dx
}

function onTouchEnd() {
  isDragging.value = false

  // Check vertical swipe for close
  if (swipeDirection === 'vertical') {
    const dy = dragOffsetY.value
    const threshold = 100 // pixels to trigger close
    if (Math.abs(dy) > threshold) {
      close()
    }
    dragOffsetY.value = 0
    swipeDirection = null
    return
  }

  // Horizontal swipe for navigation
  const dx = dragOffset.value
  const threshold = sliderWidth * 0.15 // 15% of width to trigger slide change

  if (Math.abs(dx) > threshold) {
    if (dx < 0) next()
    else prev()
  }

  dragOffset.value = 0
  swipeDirection = null
}

// Expose for parent components
defineExpose({ next, prev, close })
</script>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-caption-enter-active,
.lightbox-caption-leave-active {
  transition: opacity 0.15s ease;
}
.lightbox-caption-enter-from,
.lightbox-caption-leave-to {
  opacity: 0;
}

.lightbox-slider {
  width: 100%;
}

.lightbox-slide {
  min-width: 100%;
  width: 100%;
  min-height: 50vh;
}

@media (min-width: 768px) {
  .lightbox-slide {
    min-height: 60vh;
  }
}
</style>
