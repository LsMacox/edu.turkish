<template>
  <section id="reviews" v-scroll-reveal class="section-py bg-background">
    <div class="container mx-auto container-padding-narrow">
      <BaseSectionHeader
        :title="t('home.reviews.title')"
        :subtitle="t('home.reviews.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div v-if="reviewsError" class="text-center text-red-500 mb-12">
        {{ t('home.reviews.error') }}
      </div>
      <div v-else-if="pending" class="text-center text-gray-500 mb-12">
        {{ t('home.reviews.loading') }}
      </div>
      <div v-else-if="!featuredReviews.length" class="text-center text-gray-500 mb-12">
        {{ t('home.reviews.empty') }}
      </div>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div
          v-for="(review, index) in featuredReviews"
          :key="review.id"
          v-scroll-reveal="index * 80"
          class="card-surface flex flex-col"
        >
          <div class="mb-6">
            <h3 class="font-semibold text-secondary">{{ review.name }}</h3>
            <p v-if="review.university" class="text-sm text-gray-500">{{ review.university }}</p>
          </div>

          <div class="flex mb-4">
            <Icon
              v-for="i in 5"
              :key="i"
              name="mdi:star"
              :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
            />
          </div>

          <p class="text-body">{{ review.quote }}</p>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink
          :to="localePath('/reviews')"
          class="inline-block bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
        >
          {{ t('home.reviews.read_more') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reviews section with student testimonials loaded from API
const { t, locale } = useI18n()
const localePath = useLocalePath()

interface ReviewListResponse<T> {
  data?: T[]
}

interface FeaturedReviewItem {
  id: number | string
  name: string
  university?: string
  rating: number
  quote: string
}

const {
  data: reviews,
  pending,
  error: reviewsError,
  refresh,
} = await useFetch<ReviewListResponse<FeaturedReviewItem>>('/api/v1/reviews', {
  query: computed(() => ({
    featured: true,
    limit: 3,
    lang: locale.value,
    mediaType: 'text',
  })),
  headers: computed(() => ({ 'Accept-Language': locale.value })),
})

const featuredReviews = computed(() => reviews.value?.data ?? [])

watch(
  () => locale.value,
  () => {
    refresh()
  },
)

if (reviewsError.value) {
  console.error('Failed to load featured reviews:', reviewsError.value)
}
</script>
