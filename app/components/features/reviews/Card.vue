<template>
  <BaseCard
    padding="none"
    shadow="none"
    rounded="2xl"
    full-height
    hover="lift"
    class="group flex flex-col border border-default md:shadow-md md:border-0"
  >
    <!-- Video Review -->
    <div
      v-if="review.mediaType === 'video'"
      class="relative cursor-pointer"
      @click="handlePlayVideo"
    >
      <div class="relative aspect-[4/3] gradient-placeholder rounded-t-2xl overflow-hidden">
        <NuxtImg
          v-if="isPageLoaded && displayThumb"
          :src="displayThumb"
          :alt="review.name"
          :class="['w-full h-full object-cover', IMAGE_HOVER_CLASSES]"
          loading="lazy"
          format="webp"
          sizes="300px"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center gradient-placeholder-media"
        >
          <Icon name="mdi:video" class="text-icon-3xl icon-placeholder" />
        </div>

        <!-- Play Button Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center gradient-overlay-media"
        >
          <BaseMediaButton icon="mdi:play" size="lg" variant="play" />
        </div>

        <!-- Duration Badge -->
        <div
          v-if="review.videoDuration"
          class="absolute bottom-3 right-3 duration-badge"
        >
          {{ review.videoDuration }}
        </div>
      </div>
    </div>

    <!-- Image Review -->
    <div v-else-if="review.mediaType === 'image'" class="relative cursor-zoom-in">
      <div class="aspect-[4/3] gradient-placeholder rounded-t-2xl overflow-hidden" @click="handleOpenImage">
        <NuxtImg
          v-if="isPageLoaded && review.imageUrl"
          :src="review.imageUrl"
          :alt="review.name"
          :class="['w-full h-full object-cover', IMAGE_HOVER_CLASSES]"
          loading="lazy"
          format="webp"
          sizes="300px"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center gradient-placeholder-image"
        >
          <Icon name="mdi:image" class="text-icon-3xl icon-placeholder" />
        </div>

        <!-- Zoom Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center gradient-overlay-media-hover opacity-0 group-hover:opacity-100 transition-default"
        >
          <BaseMediaButton icon="mdi:magnify-plus-outline" size="md" variant="zoom" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 flex-1 flex flex-col">
      <!-- Rating -->
      <div v-if="review.rating" class="flex gap-0.5 mb-1.5">
        <Icon
          v-for="star in 5"
          :key="star"
          name="mdi:star"
          :class="star <= review.rating ? 'star-active' : 'star-inactive'"
          class="text-icon-sm"
        />
      </div>

      <!-- Quote -->
      <p v-if="review.quote" class="text-body-xs leading-snug line-clamp-2 text-secondary flex-1">
        "{{ review.quote }}"
      </p>

      <!-- Student Info -->
      <div :class="['flex items-center gap-2 mt-auto', (review.rating || review.quote) && 'pt-2 border-t border-default']">
        <div v-if="review.avatar" :class="['w-8 h-8 rounded-full overflow-hidden flex-shrink-0', RING_CLASSES.default]">
          <NuxtImg
            v-if="isPageLoaded"
            :src="review.avatar"
            :alt="review.name"
            class="w-full h-full object-cover"
            loading="lazy"
            format="webp"
            width="32"
            height="32"
          />
        </div>
        <div
          v-else
          class="w-8 h-8 rounded-full gradient-avatar flex items-center justify-center flex-shrink-0"
        >
          <span class="text-white font-semibold text-body-xs">{{ getInitials(review.name) }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <p :class="['font-medium text-secondary text-body-xs truncate', TEXT_HOVER_CLASSES]">{{ review.name }}</p>
          <p v-if="review.university || review.year" class="text-body-xs text-meta truncate">
            <template v-if="review.university">{{ review.university }}</template>
            <span v-if="review.university && review.year" class="text-hint"> · </span>
            <span v-if="review.year" class="text-hint">{{ review.year }}</span>
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { MediaReview } from '~~/lib/types'
import { TEXT_HOVER_CLASSES, IMAGE_HOVER_CLASSES, RING_CLASSES } from '~/composables/ui'

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

