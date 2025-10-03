<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          @click.self="closeModal"
        >
          <div class="relative w-full max-w-5xl">
            <!-- Close Button -->
            <button
              class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              @click="closeModal"
              aria-label="Close video"
            >
              <Icon name="mdi:close" class="text-3xl" />
            </button>

            <!-- Video Player Container -->
            <div class="bg-black rounded-lg overflow-hidden">
              <div class="aspect-video">
                <video
                  v-if="videoSource"
                  :src="videoSource"
                  :poster="video?.videoThumb || undefined"
                  controls
                  autoplay
                  class="w-full h-full"
                />
              </div>
            </div>

            <!-- Video Info -->
            <div v-if="video" class="mt-4 text-white">
              <h3 class="text-xl font-semibold mb-2">{{ video.name }}</h3>
              <p v-if="video.university" class="text-gray-300">{{ video.university }}</p>
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
  video: MediaReview | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = computed(() => props.video !== null)

const videoSource = computed(() => {
  if (!props.video?.videoUrl) return null

  // Handle different video sources
  if (props.video.videoUrl.startsWith('youtube:')) {
    const youtubeId = props.video.videoUrl.replace('youtube:', '')
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  if (props.video.videoUrl.startsWith('vimeo:')) {
    const vimeoId = props.video.videoUrl.replace('vimeo:', '')
    return `https://vimeo.com/${vimeoId}`
  }

  // Local video file
  return props.video.videoUrl
})

function closeModal() {
  emit('close')
}

// Close on ESC key
onMounted(() => {
  if (typeof window === 'undefined') return

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      closeModal()
    }
  }
  window.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})

// Lock body scroll when modal is open
watch(isOpen, (open) => {
  if (typeof document === 'undefined') return

  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
