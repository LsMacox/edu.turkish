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
        @click="lightboxIndex = idx"
      >
        <img
          :src="image.url"
          :alt="image.alt || data.title || 'Gallery image'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
        >
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-secondary rounded-full w-10 h-10 flex items-center justify-center shadow"
          >
            <Icon name="mdi:magnify-plus-outline" class="text-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <UiLightbox v-model="lightboxIndex" :items="data.images">
      <template #slide="{ item }">
        <img
          :src="item.url"
          :alt="item.alt || 'Image'"
          class="max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-lg"
        />
      </template>
      <template #caption="{ item }">
        <p v-if="item?.alt" class="text-xl font-semibold text-white">
          {{ item.alt }}
        </p>
      </template>
    </UiLightbox>
  </div>
</template>

<script setup lang="ts">
import type { ImageGalleryData } from '~/types/features/blog/widgets'

defineProps<{
  data: ImageGalleryData
}>()

const lightboxIndex = ref<number | null>(null)
</script>
