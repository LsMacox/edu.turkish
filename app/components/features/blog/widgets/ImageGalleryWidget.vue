<template>
  <div class="my-8">
    <!-- Title -->
    <h3 v-if="data.title" class="text-xl font-bold text-secondary mb-4">
      {{ data.title }}
    </h3>

    <!-- Image Grid 3x2 -->
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="(image, idx) in data.images"
        :key="idx"
        class="relative aspect-[4/3] rounded-lg overflow-hidden cursor-zoom-in group"
        @click="openLightbox(idx)"
      >
        <img
          :src="image.url"
          :alt="image.alt || data.title || 'Gallery image'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <!-- Hover overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-secondary rounded-full w-10 h-10 flex items-center justify-center shadow">
            <Icon name="mdi:magnify-plus-outline" class="text-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="lightboxIndex !== null"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 select-none"
            @click.self="closeLightbox"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <!-- Close Button -->
            <button
              class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
              @click="closeLightbox"
            >
              <Icon name="mdi:close" class="text-3xl" />
            </button>

            <!-- Prev Button -->
            <button
              v-if="data.images.length > 1"
              class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-secondary items-center justify-center shadow"
              aria-label="Previous"
              @click.stop="prev"
            >
              <Icon name="mdi:chevron-left" />
            </button>

            <!-- Next Button -->
            <button
              v-if="data.images.length > 1"
              class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-secondary items-center justify-center shadow"
              aria-label="Next"
              @click.stop="next"
            >
              <Icon name="mdi:chevron-right" />
            </button>

            <!-- Image -->
            <div class="max-w-6xl w-full">
              <div class="bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  v-if="currentImage"
                  :src="currentImage.url"
                  :alt="currentImage.alt || 'Image'"
                  class="max-h-[80vh] w-auto h-auto object-contain"
                />
              </div>

              <!-- Caption -->
              <p v-if="currentImage?.alt" class="mt-4 text-white text-center">
                {{ currentImage.alt }}
              </p>

              <!-- Counter -->
              <p v-if="data.images.length > 1" class="mt-2 text-gray-400 text-center text-sm">
                {{ (lightboxIndex ?? 0) + 1 }} / {{ data.images.length }}
              </p>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
export interface GalleryImage {
  url: string
  alt?: string
}

export interface ImageGalleryData {
  title?: string
  images: GalleryImage[]
}

const props = defineProps<{
  data: ImageGalleryData
}>()

const lightboxIndex = ref<number | null>(null)

const currentImage = computed(() => 
  lightboxIndex.value !== null ? props.data.images[lightboxIndex.value] : null
)

function openLightbox(idx: number) {
  lightboxIndex.value = idx
}

function closeLightbox() {
  lightboxIndex.value = null
}

function next() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % props.data.images.length
}

function prev() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + props.data.images.length) % props.data.images.length
}

// Keyboard navigation
onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (lightboxIndex.value === null) return
    if (e.key === 'ArrowRight') next()
    else if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'Escape') closeLightbox()
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
