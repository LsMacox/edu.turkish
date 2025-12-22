<template>
  <BaseCard
    padding="none"
    shadow="md"
    rounded="2xl"
    full-height
    hover="lift"
    class="group flex flex-col"
  >
    <!-- Video Review -->
    <div
      v-if="review.mediaType === 'video'"
      class="relative cursor-pointer"
      @click="handlePlayVideo"
    >
      <div class="relative aspect-square gradient-placeholder rounded-t-2xl overflow-hidden">
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
      <div class="aspect-square gradient-placeholder rounded-t-2xl overflow-hidden" @click="handleOpenImage">
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
    <div class="card-padding-lg flex-1 flex flex-col">
      <!-- Rating -->
      <div v-if="review.rating" class="flex gap-0.5 mb-component-xs">
        <Icon
          v-for="star in 5"
          :key="star"
          name="mdi:star"
          :class="star <= review.rating ? 'star-active' : 'star-inactive'"
          class="text-icon"
        />
      </div>

      <!-- Quote -->
      <p v-if="review.quote" class="text-body-sm leading-relaxed mb-component-sm line-clamp-3 flex-1">
        "{{ review.quote }}"
      </p>

      <!-- Student Info -->
      <div class="mt-auto pt-component-sm border-t border-default">
        <div class="flex items-center gap-component-md">
          <div v-if="review.avatar" :class="['avatar-md', RING_CLASSES.default]">
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
            class="avatar-md gradient-avatar flex items-center justify-center"
          >
            <span class="text-white font-semibold text-body-sm">{{ getInitials(review.name) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p :class="['font-semibold text-secondary text-body-sm truncate', TEXT_HOVER_CLASSES]">{{ review.name }}</p>
            <p v-if="review.university" class="text-body-sm text-meta truncate">
              {{ review.university }}
            </p>
            <p v-if="review.year" class="text-body-sm text-hint">
              {{ review.year }}
            </p>
          </div>
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

