<template>
  <div
    class="bg-white rounded-3xl shadow-custom overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
  >
    <!-- Video Review -->
    <div
      v-if="review.mediaType === 'video'"
      class="relative group cursor-pointer"
      @click="handlePlayVideo"
    >
      <div class="relative aspect-square bg-gray-200">
        <img
          v-if="displayThumb"
          :src="displayThumb"
          :alt="review.name"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"
        >
          <Icon name="mdi:video" class="text-6xl text-gray-400" />
        </div>

        <!-- Play Button Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"
        >
          <div
            class="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
          >
            <Icon name="mdi:play" class="text-3xl text-white ml-1" />
          </div>
        </div>

        <!-- Duration Badge -->
        <div
          v-if="review.videoDuration"
          class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded"
        >
          {{ review.videoDuration }}
        </div>
      </div>
    </div>

    <!-- Image Review -->
    <div v-else-if="review.mediaType === 'image'" class="relative group cursor-zoom-in">
      <div class="aspect-square bg-gray-200" @click="handleOpenImage">
        <img
          v-if="review.imageUrl"
          :src="review.imageUrl"
          :alt="review.name"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-orange-100"
        >
          <Icon name="mdi:image" class="text-6xl text-gray-400" />
        </div>

        <!-- Zoom Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
        >
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-secondary rounded-full w-10 h-10 flex items-center justify-center shadow"
          >
            <Icon name="mdi:magnify-plus-outline" class="text-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="card-padding flex-1 flex flex-col">
      <!-- Rating -->
      <div v-if="review.rating" class="flex mb-2">
        <Icon
          v-for="star in 5"
          :key="star"
          name="mdi:star"
          :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
          class="text-sm"
        />
      </div>

      <!-- Quote -->
      <p v-if="review.quote" class="text-card-body mb-4 line-clamp-3 flex-1">
        "{{ review.quote }}"
      </p>

      <!-- Student Info -->
      <div class="mt-auto">
        <div class="flex items-center gap-3">
          <div v-if="review.avatar" class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img :src="review.avatar" :alt="review.name" class="w-full h-full object-cover" >
          </div>
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center flex-shrink-0"
          >
            <span class="text-white font-semibold text-sm">{{ getInitials(review.name) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-secondary text-sm truncate">{{ review.name }}</p>
            <p v-if="review.university" class="text-xs text-gray-600 truncate">
              {{ review.university }}
            </p>
            <p v-if="review.year" class="text-xs text-gray-500">
              {{ review.year }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  review: MediaReview
}

const props = defineProps<Props>()

const emit = defineEmits<{
  playVideo: [review: MediaReview]
  openImage: [review: MediaReview]
}>()

function handlePlayVideo() {
  if (props.review.mediaType === 'video') {
    emit('playVideo', props.review)
  }
}

function handleOpenImage() {
  if (props.review.mediaType === 'image') {
    emit('openImage', props.review)
  }
}

// Fallback: generate first-frame thumbnail for videos without videoThumb
const localThumb = ref<string | null>(null)

const displayThumb = computed(() => localThumb.value || props.review.videoThumb || null)

async function generateVideoThumbnail(url: string): Promise<string | null> {
  try {
    // Only attempt for same-origin or relative URLs
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
      video.addEventListener(
        'loadeddata',
        () => {
          try {
            video.currentTime = 0
          } catch {
            // ignore
          }
        },
        { once: true },
      )
      video.addEventListener('seeked', () => resolve(), { once: true })
    })

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    return dataUrl
  } catch {
    return null
  }
}

onMounted(async () => {
  if (typeof window === 'undefined') return
  if (props.review.mediaType === 'video' && !props.review.videoThumb && props.review.videoUrl) {
    localThumb.value = await generateVideoThumbnail(props.review.videoUrl)
  }
})

watch(
  () => props.review,
  async (val) => {
    if (typeof window === 'undefined') return
    if (val.mediaType === 'video' && !val.videoThumb && val.videoUrl) {
      localThumb.value = await generateVideoThumbnail(val.videoUrl)
    } else {
      localThumb.value = null
    }
  },
  { deep: true },
)

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
