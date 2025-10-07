<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 select-none"
          @click.self="close"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
            @click="close"
          >
            <Icon name="mdi:close" class="text-3xl" />
          </button>

          <!-- Prev Button -->
          <button
            class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-secondary items-center justify-center shadow"
            aria-label="Previous"
            @click.stop="prev"
          >
            <Icon name="mdi:chevron-left" />
          </button>

          <!-- Next Button -->
          <button
            class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-secondary items-center justify-center shadow"
            aria-label="Next"
            @click.stop="next"
          >
            <Icon name="mdi:chevron-right" />
          </button>

          <div class="max-w-6xl w-full">
            <div class="bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <!-- Image -->
              <img
                v-if="current?.mediaType === 'image' && current?.imageUrl"
                :src="current.imageUrl"
                :alt="current?.name || 'Image'"
                class="max-h-[80vh] w-auto h-auto object-contain"
                loading="eager"
                decoding="async"
              >

              <!-- Video -->
              <video
                v-else-if="current?.mediaType === 'video' && videoSource"
                :src="videoSource"
                :poster="displayPoster"
                controls
                autoplay
                class="max-h-[80vh] w-auto h-auto"
              />

              <!-- Fallback -->
              <div v-else class="h-[60vh] flex items-center justify-center text-white/70">
                <Icon name="mdi:alert" class="text-2xl mr-2" />
                <span>Media unavailable</span>
              </div>
            </div>

            <!-- Info -->
            <div v-if="current" class="mt-4 text-white">
              <h3 class="text-lg font-semibold">{{ current.name }}</h3>
              <p v-if="current.university" class="text-sm text-gray-300">{{ current.university }}</p>
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
  items: MediaReview[]
  index: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const isOpen = computed(() => props.index !== null)
const currentIndex = ref<number>(props.index ?? 0)

watch(
  () => props.index,
  (val) => {
    if (val === null || val === undefined) return
    currentIndex.value = Math.min(Math.max(0, val), Math.max(0, (props.items?.length || 1) - 1))
  },
  { immediate: true },
)

const safeItems = computed(() => props.items || [])
const current = computed<MediaReview | null>(() => safeItems.value[currentIndex.value] || null)

function next() {
  if (!safeItems.value.length) return
  currentIndex.value = (currentIndex.value + 1) % safeItems.value.length
}

function prev() {
  if (!safeItems.value.length) return
  currentIndex.value = (currentIndex.value - 1 + safeItems.value.length) % safeItems.value.length
}

function close() {
  emit('close')
}

// Keyboard navigation
onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (!isOpen.value) return
    if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'Escape') close()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

// Touch swipe (mobile)
let touchStartX = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0]?.clientX || 0
}
function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX || 0) - touchStartX
  if (Math.abs(dx) > 40) {
    if (dx < 0) next()
    else prev()
  }
}

// Video helpers
const videoSource = computed(() => {
  const v = current.value
  if (!v || v.mediaType !== 'video' || !v.videoUrl) return null
  if (v.videoUrl.startsWith('youtube:')) return null
  if (v.videoUrl.startsWith('vimeo:')) return null
  return v.videoUrl
})

const localPoster = ref<string | null>(null)
const displayPoster = computed(() => current.value?.videoThumb || localPoster.value || undefined)

async function generateVideoThumbnail(url: string): Promise<string | null> {
  try {
    const isAbsolute = /^(https?:)?\/\//i.test(url)
    if (isAbsolute) return null
    const video = document.createElement('video')
    video.src = url
    video.muted = true
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    await new Promise<void>((resolve, reject) => {
      const onError = () => reject(new Error('video error'))
      video.addEventListener('error', onError, { once: true })
      video.addEventListener('loadeddata', () => {
        try { video.currentTime = 0 } catch {}
      }, { once: true })
      video.addEventListener('seeked', () => resolve(), { once: true })
    })
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.8)
  } catch {
    return null
  }
}

watch(current, async (val) => {
  localPoster.value = null
  if (val?.mediaType === 'video' && !val.videoThumb && val.videoUrl && !val.videoUrl.startsWith('youtube:') && !val.videoUrl.startsWith('vimeo:')) {
    localPoster.value = await generateVideoThumbnail(val.videoUrl)
  }
}, { immediate: true })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
