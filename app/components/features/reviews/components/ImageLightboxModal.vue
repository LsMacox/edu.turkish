<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          @click.self="close"
        >
          <button
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            @click="close"
            aria-label="Close image"
          >
            <Icon name="mdi:close" class="text-3xl" />
          </button>

          <div class="max-w-6xl w-full">
            <div class="bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <img
                v-if="image?.imageUrl"
                :src="image.imageUrl"
                :alt="image?.name || 'Image'"
                class="max-h-[80vh] w-auto h-auto object-contain select-none"
                loading="eager"
                decoding="async"
              />
            </div>

            <div v-if="image" class="mt-4 text-white">
              <h3 class="text-lg font-semibold">{{ image.name }}</h3>
              <p v-if="image.university" class="text-sm text-gray-300">{{ image.university }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
interface MediaReview {
  id: number
  type: string
  mediaType: 'video' | 'image' | 'text'
  name: string
  quote: string
  university: string
  rating: number | null
  year: number | null
  avatar: string | null
  videoUrl: string | null
  videoThumb: string | null
  videoDuration: string | null
  imageUrl: string | null
}

interface Props {
  image: MediaReview | null
}

const props = defineProps<Props>()

const emit = defineEmits<{ close: [] }>()

const isOpen = computed(() => props.image !== null)

function close() {
  emit('close')
}

// ESC close and body scroll lock
onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) close()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

watch(isOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
