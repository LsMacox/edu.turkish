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
      <video
        v-else-if="item.mediaType === 'video' && getVideoSource(item)"
        :ref="(el) => setVideoRef(el, item.id)"
        :src="getVideoSource(item)!"
        :poster="item.videoThumb || undefined"
        controls
        playsinline
        class="max-h-[80vh] max-w-full w-auto h-auto rounded-button"
      />

      <!-- Fallback -->
      <div v-else class="h-[60vh] flex items-center justify-center text-white/70">
        <Icon name="mdi:alert" class="text-icon-lg mr-2" />
        <span>Media unavailable</span>
      </div>
    </template>

    <template #caption="{ item }">
      <template v-if="item">
        <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
        <p v-if="item.university" class="text-body-sm text-white/70 mt-1">
          {{ item.university }}
        </p>
      </template>
    </template>
  </LightboxLightbox>
</template>

<script setup lang="ts">
import type { MediaReview } from '~~/lib/types'
import LightboxLightbox from '~/components/shared/lightbox/Lightbox.vue'

const { getCdnUrl } = useCdn()

const props = defineProps<{
  items: MediaReview[]
  index: number | null
}>()

const emit = defineEmits<{ close: [] }>()

const currentIndex = ref<number | null>(props.index)
const safeItems = computed(() => props.items || [])

// Sync with parent
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

// Video refs for auto-play
const videoRefs = ref<Map<number, HTMLVideoElement>>(new Map())

function setVideoRef(el: Element | ComponentPublicInstance | null, id: number) {
  if (el && el instanceof HTMLVideoElement) {
    videoRefs.value.set(id, el)
  } else {
    videoRefs.value.delete(id)
  }
}

// Auto-play current video
watch(
  currentIndex,
  (newIdx, oldIdx) => {
    // Pause previous
    if (typeof oldIdx === 'number' && safeItems.value[oldIdx]) {
      const prevVideo = videoRefs.value.get(safeItems.value[oldIdx].id)
      prevVideo?.pause()
    }
    // Play current
    if (typeof newIdx === 'number' && safeItems.value[newIdx]) {
      nextTick(() => {
        const item = safeItems.value[newIdx]
        if (item) {
          const currentVideo = videoRefs.value.get(item.id)
          currentVideo?.play().catch(() => {})
        }
      })
    }
  },
  { immediate: true },
)

// Video source helper
function getVideoSource(item: MediaReview): string | null {
  if (!item || item.mediaType !== 'video' || !item.videoUrl) return null
  if (item.videoUrl.startsWith('youtube:') || item.videoUrl.startsWith('vimeo:')) return null
  return getCdnUrl(item.videoUrl)
}
</script>
