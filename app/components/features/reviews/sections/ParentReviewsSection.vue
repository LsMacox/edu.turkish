<template>
  <section id="parent-reviews" class="section-py bg-white">
    <div class="container mx-auto container-padding-narrow">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-section-title mb-6">
          {{ $t('reviews.parentReviews.title') }}
          <span class="text-primary">{{ $t('reviews.parentReviews.titleAccent') }}</span>
        </h2>
        <p class="text-section-subtitle max-w-3xl mx-auto">
          {{ $t('reviews.parentReviews.description') }}
        </p>
      </div>

      <div v-if="reviewsError" class="text-red-500 p-4 text-center">
        Failed to load reviews. Please try again later.
      </div>
      <div v-else-if="pending" class="animate-pulse text-center">Loading reviews...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-section">
        <div
          v-for="(review, index) in parentReviews"
          :key="review.id"
          :class="getGradientClass(index)"
          class="rounded-3xl card-padding shadow-custom hover-lift h-full flex flex-col"
        >
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ review.name }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.labels.parent') }}</p>
            </div>
          </div>

          <div class="flex text-yellow-400 mb-4">
            <Icon
              v-for="i in 5"
              :key="i"
              name="mdi:star"
              :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
            />
          </div>

          <blockquote class="text-gray-700 leading-relaxed">
            {{ review.quote }}
          </blockquote>

          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ review.year }} {{ $t('reviews.labels.yearSuffix') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()

interface ReviewListResponse<T> {
  data?: T[]
}

interface ParentReviewItem {
  id: number | string
  name: string
  rating: number
  quote: string
  year: number
}

// Fetch parent reviews from API and refetch on locale change
const {
  data: parentReviews,
  pending,
  error: reviewsError,
  refresh,
} = await useFetch<ParentReviewItem[]>('/api/v1/reviews', {
  query: computed(() => ({ type: 'parent', mediaType: 'text', limit: 3, lang: locale.value })),
  headers: computed(() => ({ 'Accept-Language': locale.value })),
  transform: (res: ReviewListResponse<ParentReviewItem>) => res?.data ?? [],
})

watch(
  () => locale.value,
  () => {
    refresh()
  },
)

if (reviewsError.value) {
  console.error('Failed to load parent reviews:', reviewsError.value)
}

// Function to get gradient classes for variety
const getGradientClass = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-50 to-purple-50',
    'bg-gradient-to-br from-green-50 to-teal-50',
    'bg-gradient-to-br from-pink-50 to-rose-50',
    'bg-gradient-to-br from-orange-50 to-amber-50',
    'bg-gradient-to-br from-indigo-50 to-blue-50',
    'bg-gradient-to-br from-violet-50 to-purple-50',
  ]
  return gradients[index % gradients.length]
}
</script>
