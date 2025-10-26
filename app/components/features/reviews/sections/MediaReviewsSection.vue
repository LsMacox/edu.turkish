<template>
  <section id="media-reviews" class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <!-- Header -->
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-section-title mb-6">
          {{ $t('reviews.mediaReviews.title') }}
          <span class="text-primary">{{ $t('reviews.mediaReviews.titleAccent') }}</span>
        </h2>
        <p class="text-section-subtitle max-w-3xl mx-auto">
          {{ $t('reviews.mediaReviews.description') }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p class="text-gray-500 mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <Icon name="mdi:alert-circle" class="text-5xl text-red-500 mb-4" />
        <p class="text-red-500">{{ $t('reviews.mediaReviews.error') }}</p>
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
            <MediaReviewCard
              :review="review"
              @play-video="() => openLightboxAt(idx)"
              @open-image="() => openLightboxAt(idx)"
            />
          </component>
        </component>
        <div v-else class="text-center py-12">
          <p class="text-gray-500">{{ $t('common.loading') }}</p>
        </div>

        <template #fallback>
          <div class="text-center py-12">
            <p class="text-gray-500">{{ $t('common.loading') }}</p>
          </div>
        </template>
      </ClientOnly>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="mdi:video-off" class="text-5xl text-gray-400 mb-4" />
        <p class="text-gray-500">{{ $t('reviews.mediaReviews.empty') }}</p>
      </div>
    </div>

    <!-- Unified Media Lightbox (images + videos with navigation) -->
    <MediaLightboxModal :items="mediaReviewItems" :index="activeIndex" @close="closeLightbox" />
  </section>
</template>

<script setup lang="ts">
import { useFetch } from '#app'
const { locale } = useI18n()

interface MediaReview {
  id: number
  type: string
  mediaType: 'video' | 'image' | 'text'
  name: string
  quote: string
  university: string
  rating: number | null
  year: number | null
  avatar: string | null
  videoUrl: string | null
  videoThumb: string | null
  videoDuration: string | null
  imageUrl: string | null
}

const activeIndex = ref<number | null>(null)

// Fetch media reviews from API
const {
  data: mediaReviews,
  pending: loading,
  error,
  refresh,
} = await useFetch<{ data?: MediaReview[] }>('/api/v1/reviews/media', {
  query: computed(() => ({
    featured: true,
    limit: 12,
  })),
  headers: computed(() => ({
    'Accept-Language': locale.value,
  })),
})

const mediaReviewItems = computed(() => mediaReviews.value?.data ?? [])

type SwiperVueModule = typeof import('swiper/vue')
type SwiperComponentType = SwiperVueModule['Swiper']
type SwiperSlideComponentType = SwiperVueModule['SwiperSlide']
type SwiperModule = (typeof import('swiper/modules'))[keyof typeof import('swiper/modules')]

const swiperComponent = shallowRef<SwiperComponentType | null>(null)
const swiperSlideComponent = shallowRef<SwiperSlideComponentType | null>(null)
const swiperModules = shallowRef<SwiperModule[]>([])

const isSwiperReady = computed(
  () =>
    swiperComponent.value !== null &&
    swiperSlideComponent.value !== null &&
    swiperModules.value.length > 0,
)

if (import.meta.client) {
  const loadSwiper = async () => {
    if (swiperComponent.value) {
      return
    }

    try {
      await Promise.all([
        import('swiper/css'),
        import('swiper/css/navigation'),
        import('swiper/css/pagination'),
      ])

      const [{ Swiper, SwiperSlide }, modules] = await Promise.all([
        import('swiper/vue'),
        import('swiper/modules'),
      ])

      swiperComponent.value = Swiper
      swiperSlideComponent.value = SwiperSlide
      swiperModules.value = [modules.Autoplay, modules.Navigation, modules.Pagination]
    } catch (error) {
      console.error('Failed to load Swiper', error)
    }
  }

  const scheduleSwiperLoad = () => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      ;(
        window as typeof window & { requestIdleCallback: (cb: () => void) => number }
      ).requestIdleCallback(() => {
        loadSwiper()
      })
      return
    }

    setTimeout(() => {
      loadSwiper()
    }, 0)
  }

  onMounted(() => {
    scheduleSwiperLoad()
  })
}

// Refresh on locale change
watch(
  () => locale.value,
  () => {
    refresh()
  },
)

// Open/Close unified lightbox by index
function openLightboxAt(idx: number) {
  activeIndex.value = idx
}

function closeLightbox() {
  activeIndex.value = null
}
</script>

<style>
.media-reviews-swiper {
  padding-bottom: 3rem !important;
}

.media-reviews-swiper .swiper-button-next,
.media-reviews-swiper .swiper-button-prev {
  color: #c62828;
  background: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-reviews-swiper .swiper-navigation-icon {
  height: 30px;
  padding-left: 3px;
}

.media-reviews-swiper .swiper-button-next:after,
.media-reviews-swiper .swiper-button-prev:after {
  font-size: 20px;
  font-weight: bold;
}

.media-reviews-swiper .swiper-button-next:hover,
.media-reviews-swiper .swiper-button-prev:hover {
  background: #c62828;
  color: white;
}

.media-reviews-swiper .swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: #d1d5db;
  opacity: 1;
}

.media-reviews-swiper .swiper-pagination-bullet-active {
  background: #c62828;
  width: 24px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .media-reviews-swiper .swiper-button-next,
  .media-reviews-swiper .swiper-button-prev {
    display: none;
  }
}
</style>
