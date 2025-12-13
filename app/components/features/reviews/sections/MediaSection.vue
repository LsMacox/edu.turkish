<template>
  <section id="media-reviews" class="py-8 md:py-10 bg-white">
    <div class="container mx-auto container-padding-narrow">
      <!-- Header -->
      <div class="text-center mb-6 md:mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-secondary mb-2">
          {{ t(mediaReviewsNs('title')) }}
          <span class="text-primary">{{ t(mediaReviewsNs('titleAccent')) }}</span>
        </h2>
        <p class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          {{ t(mediaReviewsNs('description')) }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block rounded-full h-12 w-12 border-b-2 border-primary" />
        <p class="text-gray-500 mt-4">{{ t(key('common.loading')) }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <Icon name="mdi:alert-circle" class="text-5xl text-red-500 mb-4" />
        <p class="text-red-500">{{ t(mediaReviewsNs('error')) }}</p>
      </div>

      <!-- Carousel -->
      <ClientOnly v-else-if="mediaReviewItems.length > 0">
        <component
          :is="swiperComponent"
          v-if="isSwiperReady"
          :modules="swiperModules"
          :slides-per-view="1"
          :space-between="16"
          :loop="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }"
          :breakpoints="{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }"
          :pagination="{ clickable: true }"
          :navigation="true"
          class="media-reviews-swiper"
        >
          <component
            :is="swiperSlideComponent"
            v-for="(review, idx) in mediaReviewItems"
            :key="review.id"
          >
            <ReviewsCard
              :review="review"
              @play-video="() => openLightboxAt(idx)"
              @open-image="() => openLightboxAt(idx)"
            />
          </component>
        </component>
        <div v-else class="text-center py-12">
          <p class="text-gray-500">{{ t(key('common.loading')) }}</p>
        </div>

        <template #fallback>
          <div class="text-center py-12">
            <p class="text-gray-500">{{ t(key('common.loading')) }}</p>
          </div>
        </template>
      </ClientOnly>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="mdi:video-off" class="text-5xl text-gray-400 mb-4" />
        <p class="text-gray-500">{{ t(mediaReviewsNs('empty')) }}</p>
      </div>
    </div>

    <!-- Unified Media Lightbox (images + videos with navigation) -->
    <ReviewsLightboxModal :items="mediaReviewItems" :index="activeIndex" @close="closeLightbox" />
  </section>
</template>

<script setup lang="ts">
import { useFetch } from '#app'
import type { MediaReviewResponse } from '~~/lib/types'
import { namespace, key } from '~~/lib/i18n'

const mediaReviewsNs = namespace('reviews.mediaReviews')
const { locale, t } = useI18n()

const activeIndex = ref<number | null>(null)

const {
  data: mediaReviews,
  pending: loading,
  error,
  refresh,
} = await useFetch<MediaReviewResponse>('/api/v1/reviews/media', {
  query: computed(() => ({
    featured: true,
    limit: 12,
  })),
  headers: computed(() => ({
    'Accept-Language': locale.value,
  })),
})

const mediaReviewItems = computed(() => mediaReviews.value?.data ?? [])

const { swiperComponent, swiperSlideComponent, swiperModules, isReady: isSwiperReady } = useSwiper()

watch(
  () => locale.value,
  () => {
    refresh()
  },
)

function openLightboxAt(idx: number) {
  activeIndex.value = idx
}

function closeLightbox() {
  activeIndex.value = null
}
</script>

<style scoped>
.media-reviews-swiper {
  padding-bottom: 3rem !important;
}

.media-reviews-swiper :deep(.swiper-button-next),
.media-reviews-swiper :deep(.swiper-button-prev) {
  color: #c62828;
  background: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-reviews-swiper :deep(.swiper-navigation-icon) {
  height: 30px;
  padding-left: 3px;
}

.media-reviews-swiper :deep(.swiper-button-next:after),
.media-reviews-swiper :deep(.swiper-button-prev:after) {
  font-size: 20px;
  font-weight: bold;
}

.media-reviews-swiper :deep(.swiper-button-next:hover),
.media-reviews-swiper :deep(.swiper-button-prev:hover) {
  background: #c62828;
  color: white;
}

.media-reviews-swiper :deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #d1d5db;
  opacity: 1;
}

.media-reviews-swiper :deep(.swiper-pagination-bullet-active) {
  background: #c62828;
  width: 24px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .media-reviews-swiper :deep(.swiper-button-next),
  .media-reviews-swiper :deep(.swiper-button-prev) {
    display: none;
  }
}
</style>
