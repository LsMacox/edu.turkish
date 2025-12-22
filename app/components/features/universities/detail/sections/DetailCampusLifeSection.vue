<template>
  <BaseSection v-if="hasContent" padding="lg" bg="white">
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
              <div class="aspect-video rounded-button overflow-hidden relative group">
                <!-- Video -->
                <template v-if="item.type === 'video'">
                  <NuxtImg
                    v-if="item.thumbnail"
                    class="w-full h-full object-cover"
                    :src="item.thumbnail"
                    :alt="item.alt"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full gradient-placeholder-media flex items-center justify-center">
                    <Icon name="ph:video" class="text-icon-2xl text-hint" />
                  </div>
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-color"
                  >
                    <div
                      class="icon-container-md bg-white/90"
                    >
                      <Icon name="ph:play-fill" class="text-icon-xl text-primary ml-1" />
                    </div>
                  </div>
                </template>
                <!-- Image -->
                <template v-else>
                  <NuxtImg
                    :class="['w-full h-full object-cover', IMAGE_HOVER_CLASSES]"
                    :src="item.src"
                    :alt="item.alt"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    format="webp"
                  />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-color flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Icon name="ph:magnifying-glass-plus" class="text-icon-xl text-white" />
                  </div>
                </template>
              </div>
            </component>
          </component>
          <template #fallback>
            <div class="text-center section-py-sm">
              <div
                class="inline-block animate-spin rounded-badge h-8 w-8 border-b-2 border-primary"
              />
            </div>
          </template>
        </ClientOnly>
      </template>

      <!-- Facilities Grid -->
      <div v-if="realFacilities.length" :class="{ 'mt-component-lg': galleryItems.length }">
        <h3 class="text-section-title text-center mb-component-md">
          {{ t(ns('infrastructure')) }}
        </h3>
        <BaseGrid :cols="2" :lg="3" gap="md">
          <BaseCard
            v-for="(facility, i) in realFacilities"
            :key="`facility-${i}`"
            padding="md"
            shadow="md"
            rounded="lg"
            hover="lift"
            class="text-center"
          >
            <div
              class="w-10 h-10 md:w-16 md:h-16 rounded-responsive flex items-center justify-center mx-auto mb-component-xs md:mb-component-sm"
              :class="getFacilityStyleForItem(facility).bg"
            >
              <Icon
                :name="getFacilityStyleForItem(facility).icon"
                class="text-icon-lg md:text-icon-lg"
                :class="getFacilityStyleForItem(facility).color"
              />
            </div>
            <h4 class="text-card-title mb-inline-sm md:mb-component-xs line-clamp-2">{{ facility.name }}</h4>
            <p class="text-body-sm line-clamp-2 md:line-clamp-none">{{ facility.description }}</p>
          </BaseCard>
        </BaseGrid>
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import type { UniversityDetail, UniversityCampusFacility } from '~~/lib/types'
import { getFacilityStyleWithIcon } from '~/composables/domain'
import { namespace } from '~~/lib/i18n'
import { IMAGE_HOVER_CLASSES } from '~/composables/ui/useHover'

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
