<template>
  <section id="student-stories" class="section-py bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-section-title mb-6">
          {{ $t('reviews.studentStories.title') }}
          <span class="text-primary">{{ $t('reviews.studentStories.titleAccent') }}</span>
        </h2>
        <p class="text-section-subtitle max-w-3xl mx-auto">
          {{ $t('reviews.studentStories.description') }}
        </p>
      </div>

      <div v-if="reviewsError" class="text-red-500 p-4 text-center">
        Failed to load reviews. Please try again later.
      </div>
      <div v-else-if="pending" class="animate-pulse text-center">Loading reviews...</div>
      <div v-for="review in studentReviews" v-else :key="review.id" class="max-w-4xl mx-auto mb-8">
        <div class="bg-white rounded-3xl shadow-custom hover-lift card-padding">
          <div class="mb-6">
            <h3 class="text-xl font-bold text-secondary mb-2">{{ review.name }}</h3>
            <p class="text-primary font-semibold mb-1">{{ review.university }}</p>
            <p class="text-gray-600">{{ $t('reviews.labels.studentExperience') }}</p>
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
        </div>
      </div>

      <div class="text-center mt-12 md:mt-16">
        <button
          class="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg"
          @click="modal.openModal()"
        >
          {{ $t('reviews.studentStories.ctaButton') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

interface ReviewListResponse<T> {
  data?: T[]
}

interface StudentReviewItem {
  id: number | string
  name: string
  university: string
  rating: number
  quote: string
}

const modal = useApplicationModalStore()

// Fetch student reviews from API and refetch on locale change
const { locale } = useI18n()
const {
  data: studentReviews,
  pending,
  error: reviewsError,
  refresh,
} = await useFetch<StudentReviewItem[]>('/api/v1/reviews', {
  query: computed(() => ({ type: 'student', featured: true, limit: 3, lang: locale.value })),
  headers: computed(() => ({ 'Accept-Language': locale.value })),
  transform: (res: ReviewListResponse<StudentReviewItem>) => res?.data ?? [],
})

watch(
  () => locale.value,
  () => {
    refresh()
  },
)

if (reviewsError.value) {
  console.error('Failed to load student reviews:', reviewsError.value)
}
</script>

