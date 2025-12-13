<template>
  <section v-if="hasContent" class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <!-- Gallery Carousel -->
      <template v-if="galleryItems.length">
        <BaseSectionHeader
          :title="t(ns('title'))"
          :subtitle="t(ns('subtitle'))"
          align="center"
          margin-bottom="lg"
        />

        <ClientOnly>
          <component
            :is="swiperComponent"
            v-if="isSwiperReady"
            :modules="swiperModules"
            :slides-per-view="1"
            :space-between="16"
            :loop="galleryItems.length > 3"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            :breakpoints="{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }"
            :pagination="{ clickable: true }"
            :navigation="true"
            class="campus-gallery-swiper"
          >
            <component
              :is="swiperSlideComponent"
              v-for="(item, index) in galleryItems"
              :key="index"
            >
              <div class="aspect-video rounded-xl overflow-hidden relative group">
                <!-- Video -->
                <template v-if="item.type === 'video'">
                  <NuxtImg
                    v-if="item.thumbnail"
                    class="w-full h-full object-cover"
                    :src="item.thumbnail"
                    :alt="item.alt"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon name="ph:video" class="text-4xl text-gray-400" />
                  </div>
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                  >
                    <div
                      class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center"
                    >
                      <Icon name="ph:play-fill" class="text-3xl text-primary ml-1" />
                    </div>
                  </div>
                </template>
                <!-- Image -->
                <template v-else>
                  <NuxtImg
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    :src="item.src"
                    :alt="item.alt"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    format="webp"
                  />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Icon name="ph:magnifying-glass-plus" class="text-3xl text-white" />
                  </div>
                </template>
              </div>
            </component>
          </component>
          <template #fallback>
            <div class="text-center py-8">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
              />
            </div>
          </template>
        </ClientOnly>
      </template>

      <!-- Facilities Grid -->
      <div v-if="realFacilities.length" :class="{ 'mt-16': galleryItems.length }">
        <h3 class="text-2xl font-bold text-secondary text-center mb-8">
          {{ t(ns('infrastructure')) }}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <div
            v-for="(facility, i) in realFacilities"
            :key="`facility-${i}`"
            class="bg-white rounded-xl shadow-custom p-3 md:p-6 text-center hover-lift"
          >
            <div
              class="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4"
              :class="getFacilityStyleForItem(facility).bg"
            >
              <Icon
                :name="getFacilityStyleForItem(facility).icon"
                class="text-lg md:text-2xl"
                :class="getFacilityStyleForItem(facility).color"
              />
            </div>
            <h4 class="font-semibold text-secondary text-sm md:text-base mb-1 md:mb-2 line-clamp-2">{{ facility.name }}</h4>
            <p class="text-gray-600 text-xs md:text-sm line-clamp-2 md:line-clamp-none">{{ facility.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail, UniversityCampusFacility } from '~~/lib/types'
import { getFacilityStyleWithIcon } from '~~/lib/domain/universities/constants'
import { namespace } from '~~/lib/i18n'

const ns = namespace('universities.detail.campusLife')

interface Props {
  university?: UniversityDetail
}

interface GalleryItem {
  type: 'image' | 'video'
  src: string
  alt: string
  thumbnail?: string
  videoUrl?: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const realFacilities = computed(() => props.university?.campusLife?.facilities ?? [])

const galleryItems = computed<GalleryItem[]>(() => {
  const gallery = props.university?.campusLife?.gallery ?? []
  return gallery
    .filter((item) => item.url?.trim())
    .map((item) => ({
      type: 'image' as const,
      src: item.url,
      alt: item.alt || item.title || '',
    }))
})

const hasContent = computed(() => galleryItems.value.length > 0 || realFacilities.value.length > 0)

const getFacilityStyleForItem = (facility: UniversityCampusFacility) => {
  return getFacilityStyleWithIcon(facility.icon)
}

// Swiper
const { swiperComponent, swiperSlideComponent, swiperModules, isReady: isSwiperReady } = useSwiper()
</script>

<style scoped>
.campus-gallery-swiper {
  padding-bottom: 3rem !important;
}

.campus-gallery-swiper :deep(.swiper-button-next),
.campus-gallery-swiper :deep(.swiper-button-prev) {
  color: #c62828;
  background: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.campus-gallery-swiper :deep(.swiper-button-next:after),
.campus-gallery-swiper :deep(.swiper-button-prev:after) {
  font-size: 20px;
  font-weight: bold;
}

.campus-gallery-swiper :deep(.swiper-button-next:hover),
.campus-gallery-swiper :deep(.swiper-button-prev:hover) {
  background: #c62828;
  color: white;
}

.campus-gallery-swiper :deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #d1d5db;
  opacity: 1;
}

.campus-gallery-swiper :deep(.swiper-pagination-bullet-active) {
  background: #c62828;
  width: 24px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .campus-gallery-swiper :deep(.swiper-button-next),
  .campus-gallery-swiper :deep(.swiper-button-prev) {
    display: none;
  }
}
</style>
