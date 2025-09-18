<template>
  <section id="reviews" class="py-16 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ t('home.reviews.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ t('home.reviews.subtitle') }}</p>
      </div>

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
          v-for="review in featuredReviews"
          :key="review.id"
          class="bg-white rounded-2xl shadow-custom p-8 flex flex-col"
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

          <p class="text-gray-600 leading-relaxed">{{ review.quote }}</p>
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
  refresh
} = await useFetch<FeaturedReviewItem[]>('/api/v1/reviews', {
  query: computed(() => ({ featured: true, limit: 3, lang: locale.value })),
  headers: computed(() => ({ 'Accept-Language': locale.value })),
  transform: (res: ReviewListResponse<FeaturedReviewItem>) => res?.data ?? []
})

const featuredReviews = computed(() => reviews.value ?? [])

watch(
  () => locale.value,
  () => {
    refresh()
  }
)

if (reviewsError.value) {
  console.error('Failed to load featured reviews:', reviewsError.value)
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
