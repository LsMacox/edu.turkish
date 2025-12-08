<template>
  <div
    class="group bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col
           transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-gray-200"
  >
    <!-- Video Review -->
    <div
      v-if="review.mediaType === 'video'"
      class="relative cursor-pointer"
      @click="handlePlayVideo"
    >
      <div class="relative aspect-square bg-gray-100">
        <NuxtImg
          v-if="isPageLoaded && displayThumb"
          :src="displayThumb"
          :alt="review.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          format="webp"
          sizes="300px"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
        >
          <Icon name="mdi:video" class="text-5xl text-gray-300" />
        </div>

        <!-- Play Button Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/20 to-transparent"
        >
          <div
            class="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg
                   transition-all duration-300 group-hover:scale-110 group-hover:bg-primary"
          >
            <Icon name="mdi:play" class="text-2xl text-primary ml-0.5 group-hover:text-white transition-colors" />
          </div>
        </div>

        <!-- Duration Badge -->
        <div
          v-if="review.videoDuration"
          class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg"
        >
          {{ review.videoDuration }}
        </div>
      </div>
    </div>

    <!-- Image Review -->
    <div v-else-if="review.mediaType === 'image'" class="relative cursor-zoom-in">
      <div class="aspect-square bg-gray-100" @click="handleOpenImage">
        <NuxtImg
          v-if="isPageLoaded && review.imageUrl"
          :src="review.imageUrl"
          :alt="review.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          format="webp"
          sizes="300px"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50"
        >
          <Icon name="mdi:image" class="text-5xl text-gray-300" />
        </div>

        <!-- Zoom Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div
            class="bg-white/95 backdrop-blur-sm text-secondary rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          >
            <Icon name="mdi:magnify-plus-outline" class="text-xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col">
      <!-- Rating -->
      <div v-if="review.rating" class="flex gap-0.5 mb-3">
        <Icon
          v-for="star in 5"
          :key="star"
          name="mdi:star"
          :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
          class="text-base"
        />
      </div>

      <!-- Quote -->
      <p v-if="review.quote" class="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-1">
        "{{ review.quote }}"
      </p>

      <!-- Student Info -->
      <div class="mt-auto pt-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div v-if="review.avatar" class="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
            <NuxtImg
              v-if="isPageLoaded"
              :src="review.avatar"
              :alt="review.name"
              class="w-full h-full object-cover"
              loading="lazy"
              format="webp"
              width="44"
              height="44"
            />
          </div>
          <div
            v-else
            class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center flex-shrink-0"
          >
            <span class="text-white font-semibold text-sm">{{ getInitials(review.name) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-secondary text-sm truncate group-hover:text-primary transition-colors">{{ review.name }}</p>
            <p v-if="review.university" class="text-xs text-gray-500 truncate">
              {{ review.university }}
            </p>
            <p v-if="review.year" class="text-xs text-gray-400">
              {{ review.year }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaReview } from '~~/server/types/api'

interface Props {
  review: MediaReview
}

const props = defineProps<Props>()

const isPageLoaded = ref(false)

onMounted(() => {
  isPageLoaded.value = true
})

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

const displayThumb = computed(() => props.review.videoThumb || null)

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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
