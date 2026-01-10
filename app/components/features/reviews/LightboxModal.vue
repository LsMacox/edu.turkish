<template>
  <LightboxLightbox v-model="currentIndex" :items="safeItems" @update:model-value="onIndexChange">
    <template #slide="{ item }">
      <!-- Image -->
      <NuxtImg
        v-if="item.mediaType === 'image' && item.imageUrl"
        :src="item.imageUrl"
        :alt="item.name || 'Image'"
        class="max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-button"
        format="webp"
        quality="90"
      />

      <!-- Video -->
      <div
        v-else-if="item.mediaType === 'video' && item.videoId"
        class="w-full max-w-4xl"
      >
        <BunnyVideoPlayer
          :video-id="item.videoId"
          :library-id="bunnyLibraryId"
          aspect-ratio="16/9"
          rounded="lg"
          :title="item.name"
        />
      </div>

      <!-- Fallback -->
      <div v-else class="h-[60vh] flex items-center justify-center text-white/70">
        <Icon name="mdi:alert" class="text-icon-lg mr-2" />
        <span>Media unavailable</span>
      </div>
    </template>

    <template #caption="{ item }">
      <div v-if="item" class="bg-black/40 px-3 py-1.5 rounded-full">
        <span class="font-medium text-white text-sm">{{ item.name }}</span>
        <span v-if="item.university" class="text-white/70 text-sm"> · {{ item.university }}</span>
      </div>
    </template>
  </LightboxLightbox>
</template>

<script setup lang="ts">
import type { MediaReview } from '~~/lib/types'
import LightboxLightbox from '~/components/shared/lightbox/Lightbox.vue'

const props = defineProps<{
  items: MediaReview[]
  index: number | null
}>()

const emit = defineEmits<{ close: [] }>()

const bunnyLibraryId = parseInt(useRuntimeConfig().public.bunnyLibraryId)
const currentIndex = ref<number | null>(props.index)
const safeItems = computed(() => props.items || [])

watch(
  () => props.index,
  (val) => {
    currentIndex.value = val
  },
)

function onIndexChange(val: number | null) {
  if (val === null) {
    emit('close')
  }
}
</script>
